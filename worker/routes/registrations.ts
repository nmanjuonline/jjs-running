import { Router } from './router';
import { getStorage } from '../storage';
import { broadcaster } from '../notifications/broadcaster';
import { CONFIG } from '../config';
import type { LeadSubmission, ProgramRegistrationPayload } from '../types';

export const registrationsRouter = new Router();

// Handle general runner lead registration (from RegisterModal.jsx)
registrationsRouter.post('/leads', async (request, ctx) => {
  try {
    const body = (await request.json()) as LeadSubmission;

    if (!body.name || !body.email || !body.mobile) {
      return Response.json(
        {
          success: false,
          error: 'Name, email, and mobile are required',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    const storage = getStorage(ctx.env);
    const lead = await storage.leads.save({
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      mobile: body.mobile.trim(),
      center: body.center,
      program: body.program,
      experienceLevel: body.experienceLevel,
      notes: body.notes,
      source: body.source || 'web_modal'
    });

    // Fire & forget edge notification
    broadcaster.broadcast(
      {
        title: 'New Runner Inquiry',
        message: `${lead.name} (${lead.mobile}) expressed interest in ${lead.program || 'training'} at ${lead.center || 'unspecified center'}.`,
        clientIp: ctx.clientIp,
        country: ctx.country,
        details: { leadId: lead.id, email: lead.email, level: lead.experienceLevel }
      },
      ctx.env
    ).catch(() => {});

    return Response.json(
      {
        success: true,
        data: {
          leadId: lead.id,
          message: 'Inquiry registered successfully'
        },
        timestamp: new Date().toISOString()
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Invalid request payload';
    return Response.json({ success: false, error, timestamp: new Date().toISOString() }, { status: 400 });
  }
});

// Handle full program registration (from ProgramRegistrationModal.jsx)
registrationsRouter.post('/', async (request, ctx) => {
  try {
    const payload = (await request.json()) as ProgramRegistrationPayload;

    if (!payload.programId || !payload.runnerProfile?.fullName || !payload.runnerProfile?.email) {
      return Response.json(
        {
          success: false,
          error: 'Program, runner name, and email are required',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    const registrationId = `JJs-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const storage = getStorage(ctx.env);

    const saved = await storage.registrations.save({
      id: registrationId,
      programId: payload.programId,
      programTitle: payload.programTitle || payload.programId,
      runnerName: payload.runnerProfile.fullName.trim(),
      email: payload.runnerProfile.email.trim().toLowerCase(),
      mobile: payload.runnerProfile.mobile.trim(),
      centerName: payload.batchPreferences?.centerName || 'Online/Default',
      level: payload.runningExperience?.level || 'Beginner',
      totalAmount: payload.totalAmount,
      paymentStatus: payload.paymentStatus || 'pending',
      rawPayload: JSON.stringify(payload)
    });

    // Alert dispatch
    broadcaster.broadcast(
      {
        title: 'New Program Registration',
        message: `${saved.runnerName} registered for ${saved.programTitle} [ID: ${saved.id}].`,
        clientIp: ctx.clientIp,
        country: ctx.country,
        details: {
          registrationId: saved.id,
          amount: saved.totalAmount,
          center: saved.centerName
        }
      },
      ctx.env
    ).catch(() => {});

    return Response.json(
      {
        success: true,
        data: {
          registrationId: saved.id,
          status: saved.paymentStatus,
          message: `Registration confirmed with ${CONFIG.APP.NAME}`
        },
        timestamp: new Date().toISOString()
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Invalid registration payload';
    return Response.json({ success: false, error, timestamp: new Date().toISOString() }, { status: 400 });
  }
});

// Fetch registration status
registrationsRouter.get('/:id', async (_req, ctx) => {
  const storage = getStorage(ctx.env);
  const reg = await storage.registrations.getById(ctx.params.id);

  if (!reg) {
    return Response.json(
      {
        success: false,
        error: 'Registration not found',
        timestamp: new Date().toISOString()
      },
      { status: 404 }
    );
  }

  return Response.json(
    {
      success: true,
      data: reg,
      timestamp: new Date().toISOString()
    }
  );
});

