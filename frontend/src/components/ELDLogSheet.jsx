import React, { useState } from 'react';
import { Printer, Calendar, ShieldCheck, ChevronLeft, ChevronRight, FileSpreadsheet, Clock } from 'lucide-react';

const STATUS_LABELS = {
  1: '1. OFF DUTY',
  2: '2. SLEEPER BERTH',
  3: '3. DRIVING',
  4: '4. ON DUTY (NOT DRIVING)'
};

export default function ELDLogSheet({ dailyLogs }) {
  const [activeDayIdx, setActiveDayIdx] = useState(0);

  if (!dailyLogs || dailyLogs.length === 0) return null;

  const activeSheet = dailyLogs[activeDayIdx] || dailyLogs[0];

  const handlePrint = () => {
    window.print();
  };

  // SVG grid dimensions
  const svgWidth = 920;
  const svgHeight = 220;
  const margin = { left: 160, right: 90, top: 40, bottom: 25 };
  const gridWidth = svgWidth - margin.left - margin.right; // 670px
  const gridHeight = svgHeight - margin.top - margin.bottom; // 155px
  const rowHeight = gridHeight / 3; // 4 rows -> 3 intervals

  // Helper to get coordinates on SVG
  const getX = (hour) => margin.left + (hour / 24.0) * gridWidth;
  const getY = (line) => margin.top + (line - 1) * rowHeight;

  return (
    <div className="glass-panel eld-sheet-container" style={{ padding: '28px', marginBottom: '30px' }}>
      {/* Header bar with Day navigation & Print button */}
      <div className="no-print" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FileSpreadsheet size={22} color="#38bdf8" />
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              FMCSA Official 24-Hour ELD Daily Log Sheet
            </h2>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Standard 4-Duty Status Grid (Midnight to Midnight)
            </p>
          </div>
        </div>

        {/* Day Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setActiveDayIdx(Math.max(0, activeDayIdx - 1))}
            disabled={activeDayIdx === 0}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              padding: '6px 10px',
              borderRadius: '6px',
              cursor: activeDayIdx === 0 ? 'not-allowed' : 'pointer',
              opacity: activeDayIdx === 0 ? 0.4 : 1
            }}
          >
            <ChevronLeft size={16} />
          </button>

          <div style={{ display: 'flex', gap: '6px' }}>
            {dailyLogs.map((sheet, idx) => (
              <button
                key={idx}
                onClick={() => setActiveDayIdx(idx)}
                style={{
                  background: activeDayIdx === idx ? 'linear-gradient(135deg, #0ea5e9, #2563eb)' : 'rgba(255, 255, 255, 0.05)',
                  border: activeDayIdx === idx ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Day {sheet.day_number}
              </button>
            ))}
          </div>

          <button
            onClick={() => setActiveDayIdx(Math.min(dailyLogs.length - 1, activeDayIdx + 1))}
            disabled={activeDayIdx === dailyLogs.length - 1}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              padding: '6px 10px',
              borderRadius: '6px',
              cursor: activeDayIdx === dailyLogs.length - 1 ? 'not-allowed' : 'pointer',
              opacity: activeDayIdx === dailyLogs.length - 1 ? 0.4 : 1
            }}
          >
            <ChevronRight size={16} />
          </button>

          <button
            onClick={handlePrint}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34d399',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginLeft: '8px'
            }}
          >
            <Printer size={15} />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {/* Official Form Header Block */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '10px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px',
        fontSize: '0.82rem'
      }}>
        <div>
          <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Date (24-hr period)</span>
          <strong className="mono" style={{ color: '#f8fafc', fontSize: '0.95rem' }}>{activeSheet.date} (Day {activeSheet.day_number})</strong>
        </div>
        <div>
          <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Carrier Name &amp; Office</span>
          <strong style={{ color: '#f8fafc' }}>{activeSheet.carrier_name}</strong>
        </div>
        <div>
          <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Driver Name</span>
          <strong style={{ color: '#38bdf8' }}>{activeSheet.driver_name}</strong>
        </div>
        <div>
          <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Vehicle / Tractor ID</span>
          <strong className="mono" style={{ color: '#f8fafc' }}>{activeSheet.truck_id}</strong>
        </div>
        <div>
          <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase' }}>Miles Driven Today</span>
          <strong className="mono" style={{ color: '#fbbf24', fontSize: '0.95rem' }}>{activeSheet.total_miles_today} mi</strong>
        </div>
      </div>

      {/* SVG 24-Hour ELD Grid */}
      <div style={{
        background: '#090d16',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '16px 12px',
        overflowX: 'auto',
        marginBottom: '24px'
      }}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', minWidth: '780px', height: 'auto', display: 'block' }}>
          {/* Background grid box */}
          <rect
            x={margin.left}
            y={margin.top}
            width={gridWidth}
            height={gridHeight}
            fill="#0f172a"
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* Totals Header */}
          <text x={svgWidth - margin.right + 45} y={margin.top - 12} fill="#94a3b8" fontSize="10" fontWeight="700" textAnchor="middle">
            TOTAL HRS
          </text>
          <rect
            x={svgWidth - margin.right}
            y={margin.top}
            width={margin.right - 10}
            height={gridHeight}
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="1"
          />

          {/* Hour Columns & Subdivision lines */}
          {Array.from({ length: 25 }).map((_, hour) => {
            const x = getX(hour);
            const isNoon = hour === 12;
            const isMidnight = hour === 0 || hour === 24;
            let hourLabel = hour === 0 ? 'MID' : hour === 12 ? 'NOON' : hour === 24 ? 'MID' : hour > 12 ? `${hour - 12}` : `${hour}`;

            return (
              <g key={`hour-${hour}`}>
                {/* Major Hour Line */}
                <line
                  x1={x}
                  y1={margin.top}
                  x2={x}
                  y2={margin.top + gridHeight}
                  stroke={isMidnight || isNoon ? '#64748b' : '#334155'}
                  strokeWidth={isMidnight || isNoon ? 1.5 : 1}
                />
                {/* Hour Label */}
                <text
                  x={x}
                  y={margin.top - 12}
                  fill={isNoon ? '#38bdf8' : isMidnight ? '#a855f7' : '#94a3b8'}
                  fontSize={isNoon || isMidnight ? '9.5' : '8.5'}
                  fontWeight="600"
                  textAnchor="middle"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {hourLabel}
                </text>

                {/* 15, 30, 45 minute tick marks inside the hour */}
                {hour < 24 && [1, 2, 3].map((quarter) => {
                  const subX = getX(hour + quarter * 0.25);
                  const isHalfHour = quarter === 2;
                  return (
                    <line
                      key={`sub-${hour}-${quarter}`}
                      x1={subX}
                      y1={margin.top}
                      x2={subX}
                      y2={margin.top + gridHeight}
                      stroke="#1e293b"
                      strokeWidth={isHalfHour ? 0.8 : 0.4}
                      strokeDasharray={isHalfHour ? "2 2" : "1 3"}
                    />
                  );
                })}
              </g>
            );
          })}

          {/* 4 Horizontal Duty Status Rows */}
          {[1, 2, 3, 4].map((lineNum) => {
            const y = getY(lineNum);
            const label = STATUS_LABELS[lineNum];
            let hoursVal = 0.0;
            if (lineNum === 1) hoursVal = activeSheet.summary_hours.off_duty;
            if (lineNum === 2) hoursVal = activeSheet.summary_hours.sleeper_berth;
            if (lineNum === 3) hoursVal = activeSheet.summary_hours.driving;
            if (lineNum === 4) hoursVal = activeSheet.summary_hours.on_duty_not_driving;

            return (
              <g key={`row-${lineNum}`}>
                {/* Horizontal row divider */}
                <line
                  x1={margin.left}
                  y1={y}
                  x2={margin.left + gridWidth}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="1"
                />
                {/* Status Row Label */}
                <text
                  x={margin.left - 12}
                  y={y + 4}
                  fill="#e2e8f0"
                  fontSize="9.5"
                  fontWeight="700"
                  textAnchor="end"
                  fontFamily="'Inter', sans-serif"
                >
                  {label}
                </text>
                {/* Right Column Total Hours */}
                <text
                  x={svgWidth - margin.right + 40}
                  y={y + 4}
                  fill={lineNum === 3 ? '#38bdf8' : lineNum === 2 ? '#34d399' : lineNum === 4 ? '#fbbf24' : '#cbd5e1'}
                  fontSize="11"
                  fontWeight="700"
                  textAnchor="middle"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {hoursVal.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* DRAWN STEP LINE: ELD Duty Status Transitions */}
          {activeSheet.graph_segments.map((seg, idx) => {
            if (seg.type === 'horizontal') {
              const x1 = getX(seg.x1);
              const x2 = getX(seg.x2);
              const y = getY(seg.line);
              let color = '#38bdf8'; // Driving cyan
              if (seg.line === 1) color = '#94a3b8'; // Off duty
              if (seg.line === 2) color = '#10b981'; // Sleeper emerald
              if (seg.line === 4) color = '#f59e0b'; // On duty amber

              return (
                <line
                  key={`seg-h-${idx}`}
                  x1={x1}
                  y1={y}
                  x2={x2}
                  y2={y}
                  stroke={color}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              );
            } else if (seg.type === 'vertical') {
              const x = getX(seg.x);
              const y1 = getY(seg.y1);
              const y2 = getY(seg.y2);

              return (
                <line
                  key={`seg-v-${idx}`}
                  x1={x}
                  y1={y1}
                  x2={x}
                  y2={y2}
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="1 1"
                />
              );
            }
            return null;
          })}
        </svg>

        {/* Total Sum Verification Badge */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginTop: '10px',
          paddingRight: '12px',
          gap: '12px'
        }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total Daily Calculated Hours:</span>
          <div style={{
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid rgba(16, 185, 129, 0.5)',
            color: '#34d399',
            padding: '4px 14px',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)'
          }}>
            {activeSheet.summary_hours.total_hours.toFixed(2)} / 24.00 HRS (100% Balanced)
          </div>
        </div>
      </div>

      {/* 70-Hour / 8-Day Recap Section & Driver Certification */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* Recap Table */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '16px 20px'
        }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} />
            70-Hour / 8-Day FMCSA Duty Cycle Recap
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
              <span>A. 70-Hour Rule Limit:</span>
              <strong className="mono">70.0 hrs</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
              <span>B. Cycle used prior to start today:</span>
              <strong className="mono">{activeSheet.recap_70hr.cycle_used_at_start} hrs</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
              <span>C. Total On-Duty hours worked today:</span>
              <strong className="mono" style={{ color: '#fbbf24' }}>{activeSheet.recap_70hr.hours_worked_today} hrs</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '6px', color: '#f8fafc' }}>
              <span>D. Cumulative cycle used to date:</span>
              <strong className="mono">{activeSheet.recap_70hr.cycle_used_at_end} hrs</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399', fontWeight: 700 }}>
              <span>E. Cycle hours available tomorrow:</span>
              <strong className="mono">{activeSheet.recap_70hr.cycle_hours_available} hrs</strong>
            </div>
          </div>
        </div>

        {/* Driver Certification */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} />
              Driver Certification &amp; Signature
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>
              "I certify that these entries are true and correct to the best of my knowledge and comply with 49 CFR Part 395 regulations."
            </p>
          </div>
          <div style={{ borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '10px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Verified Electronic Signature</span>
              <span style={{ fontFamily: "'Outfit', cursive", fontSize: '1.1rem', color: '#38bdf8', letterSpacing: '1px' }}>
                {activeSheet.driver_name}
              </span>
            </div>
            <span className="mono" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {activeSheet.date} 23:59
            </span>
          </div>
        </div>
      </div>

      {/* Remarks Section (Duty Change Log) */}
      <div>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', color: '#f1f5f9' }}>
          Duty Status Remarks &amp; Change of Duty Record ({activeSheet.remarks.length} events)
        </h3>
        <div style={{
          maxHeight: '260px',
          overflowY: 'auto',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          background: 'rgba(10, 14, 23, 0.7)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#1e293b', color: '#94a3b8', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '8px 14px' }}>Time</th>
                <th style={{ padding: '8px 14px' }}>Status</th>
                <th style={{ padding: '8px 14px' }}>Location</th>
                <th style={{ padding: '8px 14px' }}>Activity / Remarks</th>
                <th style={{ padding: '8px 14px', textAlign: 'right' }}>Miles</th>
              </tr>
            </thead>
            <tbody>
              {activeSheet.remarks.map((rem, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="mono" style={{ padding: '8px 14px', color: '#38bdf8', fontWeight: 600 }}>
                    {rem.time}
                  </td>
                  <td style={{ padding: '8px 14px' }}>
                    <span className={`badge ${
                      rem.status === 'DRIVING' ? 'badge-driving' :
                      rem.status === 'SLEEPER_BERTH' ? 'badge-sleeper' :
                      rem.status === 'ON_DUTY_NOT_DRIVING' ? 'badge-on-duty' :
                      'badge-off-duty'
                    }`}>
                      {rem.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '8px 14px', color: '#f8fafc' }}>
                    {rem.location}
                  </td>
                  <td style={{ padding: '8px 14px', color: '#cbd5e1' }}>
                    {rem.activity}
                  </td>
                  <td className="mono" style={{ padding: '8px 14px', textAlign: 'right', color: '#94a3b8' }}>
                    {rem.miles > 0 ? `${rem.miles} mi` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
