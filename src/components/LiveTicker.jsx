import React from 'react';
import { Flame, Award, Clock, Smartphone, MapPin, Zap } from 'lucide-react';

export default function LiveTicker() {
  const items = [
    { icon: Flame, text: '450+ RUNNERS COMPLETED MORNING WORKOUT ACROSS BENGALURU, PUNE & KOLKATA' },
    { icon: Award, text: 'TCS WORLD 10K & TATA MUMBAI MARATHON (TMM) TRAINING BLOCKS NOW ACTIVE' },
    { icon: Clock, text: 'WEEKEND LONG SLOW DISTANCE (LSD) GATHERING: 5:30 AM ACROSS ALL 30 CENTERS' },
    { icon: Award, text: '100+ WORLD MARATHONS FINISHED: BOSTON, BERLIN, LONDON, TOKYO & COMRADES' },
    { icon: Smartphone, text: 'ONCA RUN APP: TRACK LIVE CADENCE, STRIDE EFFICIENCY & COACH TELEMETRY' },
    { icon: MapPin, text: 'NEW SQUAD LOCATION LAUNCHED: BANER BALEWADI (PUNE) & BELLANDUR (BLR)' },
  ];

  return (
    <div className="w-full overflow-hidden border-y py-3 transition-colors"
      style={{
        backgroundColor: 'var(--badge-bg)',
        borderColor: 'var(--border-color)'
      }}
    >
      <div className="flex items-center gap-8 whitespace-nowrap animate-ticker">
        {[...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-gray-300">
              <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
              <span>{item.text}</span>
              <span className="opacity-30 ml-6">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
