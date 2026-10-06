import React from 'react';
import { Navigation, Warehouse, Fuel, BedDouble, Coffee, CheckCircle2, ChevronRight, Milestone } from 'lucide-react';

const STOP_ICONS = {
  ORIGIN: { icon: Navigation, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  PICKUP: { icon: Warehouse, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' },
  FUEL: { icon: Fuel, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  REST_BREAK: { icon: Coffee, color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' },
  DAILY_REST: { icon: BedDouble, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  CYCLE_RESTART: { icon: BedDouble, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)' },
  DROPOFF: { icon: CheckCircle2, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' }
};

export default function TripTimeline({ stops }) {
  if (!stops || stops.length === 0) return null;

  return (
    <div className="glass-panel" style={{ padding: '24px 28px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Milestone size={20} color="#38bdf8" />
            Route Itinerary &amp; Planned Stops
          </h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Sequential breakdown of all mandatory rests, fueling, and freight activities
          </p>
        </div>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px' }}>
          {stops.length} Total Milestones
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
        {stops.map((stop, idx) => {
          const cfg = STOP_ICONS[stop.type] || STOP_ICONS.ORIGIN;
          const IconComp = cfg.icon;
          const isLast = idx === stops.length - 1;

          return (
            <div key={idx} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
              {/* Connecting line between stops */}
              {!isLast && (
                <div style={{
                  position: 'absolute',
                  top: '38px',
                  bottom: '-14px',
                  left: '19px',
                  width: '2px',
                  background: 'rgba(255, 255, 255, 0.1)'
                }} />
              )}

              {/* Stop Icon Circle */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: cfg.bg,
                border: `2px solid ${cfg.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                zIndex: 2
              }}>
                <IconComp size={18} color={cfg.color} />
              </div>

              {/* Stop Content Card */}
              <div style={{
                flex: 1,
                background: 'rgba(15, 23, 42, 0.55)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '12px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                      {stop.name}
                    </h3>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: cfg.bg,
                      color: cfg.color
                    }}>
                      {stop.type.replace('_', ' ')}
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                    {stop.description}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b' }}>Milestone</span>
                    <strong className="mono" style={{ color: '#38bdf8' }}>{stop.cumulative_miles} mi</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b' }}>Duration</span>
                    <strong className="mono" style={{ color: '#fbbf24' }}>{stop.duration}</strong>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
