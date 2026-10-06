import React from 'react';
import { Route, Clock, Fuel, BedDouble, AlertCircle, Calendar } from 'lucide-react';

export default function MetricsCards({ summary }) {
  if (!summary) return null;

  const cyclePercent = Math.min(100, Math.round((summary.final_cycle_used / 70.0) * 100));

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '24px',
      position: 'relative',
      zIndex: 10
    }}>
      {/* Total Distance */}
      <div className="glass-panel" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Distance</span>
          <Route size={18} color="#38bdf8" />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span className="mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
            {summary.total_miles.toLocaleString()}
          </span>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>miles</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
          Includes deadhead + loaded haul
        </span>
      </div>

      {/* Trip Duration */}
      <div className="glass-panel" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Trip Span</span>
          <Calendar size={18} color="#a855f7" />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span className="mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
            {summary.total_trip_duration_hours}
          </span>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>hrs ({summary.days_count} {summary.days_count === 1 ? 'day' : 'days'})</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 500 }}>
          {summary.days_count} Daily ELD Log {summary.days_count === 1 ? 'Sheet' : 'Sheets'}
        </span>
      </div>

      {/* Driving Hours */}
      <div className="glass-panel" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Driving Time</span>
          <Clock size={18} color="#0ea5e9" />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span className="mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8' }}>
            {summary.total_driving_hours}
          </span>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>hrs</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
          55 mph commercial CMV avg
        </span>
      </div>

      {/* Rest & Off Duty */}
      <div className="glass-panel" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Mandatory Rest</span>
          <BedDouble size={18} color="#10b981" />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span className="mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399' }}>
            {summary.total_rest_hours}
          </span>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>hrs</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#10b981' }}>
          {summary.rest_stops_count} HOS Rest/Break Stops
        </span>
      </div>

      {/* Fueling */}
      <div className="glass-panel" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Fuel Stops</span>
          <Fuel size={18} color="#fbbf24" />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span className="mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24' }}>
            {summary.fuel_stops_count}
          </span>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>stops</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
          Every 1,000 miles (30 min ea)
        </span>
      </div>

      {/* 70hr Cycle Remaining */}
      <div className="glass-panel" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Cycle Remaining</span>
          <AlertCircle size={18} color={cyclePercent > 85 ? '#f43f5e' : '#38bdf8'} />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span className="mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: cyclePercent > 85 ? '#fb7185' : '#f8fafc' }}>
            {summary.cycle_hours_remaining}
          </span>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>/ 70 hrs</span>
        </div>
        {/* Progress bar */}
        <div style={{ width: '100%', height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden', marginTop: '4px' }}>
          <div style={{
            width: `${cyclePercent}%`,
            height: '100%',
            background: cyclePercent > 85 ? 'linear-gradient(90deg, #f59e0b, #f43f5e)' : 'linear-gradient(90deg, #0ea5e9, #10b981)',
            borderRadius: '3px'
          }} />
        </div>
      </div>
    </div>
  );
}
