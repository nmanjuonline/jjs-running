export interface Env {
  // Bindings
  DB?: D1Database;
  KV_STATE?: KVNamespace;
  ASSETS: Fetcher;

  // Environment variables
  ENVIRONMENT?: 'production' | 'staging' | 'preview' | 'development';
  SITE_URL?: string;
  ADMIN_EMAIL?: string;
  WEBHOOK_URL?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  RESEND_API_KEY?: string;
  JWT_SECRET?: string;
}

export interface LeadSubmission {
  id?: string;
  name: string;
  email: string;
  mobile: string;
  center?: string;
  program?: string;
  experienceLevel?: string;
  notes?: string;
  source?: string;
  createdAt?: string;
}

export interface ProgramRegistrationPayload {
  id?: string;
  programId: string;
  programTitle: string;
  tierId?: string;
  tierName?: string;
  runnerProfile: {
    fullName: string;
    email: string;
    mobile: string;
    gender?: string;
    dob?: string;
    tshirtSize?: string;
    bloodGroup?: string;
    city?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
  };
  runningExperience: {
    level: string;
    currentPace?: string;
    targetRace?: string;
    weeklyMileageKm?: number;
    medicalConditions?: string;
  };
  batchPreferences: {
    centerId: string;
    centerName: string;
    preferredTimeSlot?: string;
    startDate?: string;
  };
  totalAmount?: number;
  paymentMethod?: string;
  paymentStatus?: 'pending' | 'completed' | 'exempt';
  createdAt?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

