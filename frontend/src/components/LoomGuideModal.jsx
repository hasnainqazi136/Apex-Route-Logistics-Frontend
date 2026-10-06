import React from 'react';
import { X, Video, CheckCircle2, Copy, ExternalLink, Sparkles } from 'lucide-react';

export default function LoomGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const scriptText = `
--- 3-5 MINUTE LOOM VIDEO SCRIPT OUTLINE ---

Minute 0:00 - 0:45 | INTRO & OBJECTIVE
"Hi everyone, today I'm demonstrating our full-stack ELD Route Planning & FMCSA Log Sheet Generator, built with Django REST Framework and React.
The goal of this application is to take a commercial property-carrying driver's trip inputs—Current Location, Pickup, Dropoff, and Cycle Hours Used—and automatically compute an FMCSA-compliant dispatch plan, an interactive map with plotted stops, and official 24-hour daily ELD log sheets."

Minute 0:45 - 1:45 | INPUTS & HOS ENGINE DEMO
"Let's enter our trip or click one of our one-click test presets, such as Chicago to Dallas via Indianapolis, with 15 hours already used on the 70-hour cycle.
When we hit 'Calculate Route & ELD Logs', the Django backend:
1. Geocodes the locations via OpenStreetMap Nominatim.
2. Fetches highway routing geometries using OSRM.
3. Applies FMCSA 49 CFR Part 395 rules:
   - 11-Hour Maximum Driving limit
   - 14-Hour On-Duty window
   - Mandatory 30-minute rest break after 8 driving hours
   - Mandatory 10-hour consecutive rest reset
   - Fuel stop every 1,000 miles (30 mins on-duty)
   - 1 hour on-duty at pickup and 1 hour at drop-off."

Minute 1:45 - 2:45 | MAP & TIMELINE
"Here on the dashboard:
- The interactive Leaflet map displays the exact highway route polyline.
- Key waypoints are highlighted: Origin, Pickup location, Fuel stops at the 1,000-mile mark, 30-minute rest areas, and final Delivery.
- The summary metrics show total mileage, total driving vs rest hours, and cycle hours remaining."

Minute 2:45 - 4:00 | ELD 24-HOUR LOG SHEETS
"Now let's examine the Daily ELD Log Sheets:
- FMCSA regulations require daily sheets from midnight to midnight (00:00 to 24:00).
- Our system cleanly splits multi-day trips across individual calendar day sheets.
- Notice the standard 4-duty status grid: Off Duty, Sleeper Berth, Driving, and On Duty Not Driving.
- The continuous step-line graph shows transitions precisely to the minute.
- Most importantly: every single sheet's total hours sum to exactly 24.00 hours.
- Below the grid, we have the complete 70-Hour Duty Cycle Recap table, certified driver signature, and itemized duty remarks log.
- Drivers can also click 'Print Sheet' for an official inspection-ready printout."

Minute 4:00 - 4:45 | CODE ARCHITECTURE & DEPLOYMENT
"Under the hood:
- The Django backend is structured into modular domain services: geocoding, routing, hos_engine, and eld_generator.
- The React frontend uses modern component architecture with SVG rendering for crisp log grid graphics.
- The project is deployed live and the code is open on GitHub.
Thank you!"
  `;

  const copyScript = () => {
    navigator.clipboard.writeText(scriptText);
    alert("Script copied to clipboard!");
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '750px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#0f172a',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        padding: '28px',
        borderRadius: '16px',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer'
          }}
        >
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            background: 'rgba(139, 92, 246, 0.2)',
            padding: '10px',
            borderRadius: '10px',
            color: '#c084fc'
          }}>
            <Video size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
              3-5 Minute Loom Presentation Guide
            </h2>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
              Step-by-step checklist &amp; talking points to record your assessment video
            </p>
          </div>
        </div>

        {/* Deliverables Checklist */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '10px',
          padding: '14px 18px',
          marginBottom: '20px',
          fontSize: '0.82rem'
        }}>
          <span style={{ fontWeight: 700, color: '#34d399', display: 'block', marginBottom: '8px' }}>
            Assessment Requirements Addressed:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '6px', color: '#cbd5e1' }}>
            <div>✓ Full-Stack Django + React</div>
            <div>✓ Free Map API (OSRM + OSM Leaflet)</div>
            <div>✓ 70hrs / 8days HOS calculation</div>
            <div>✓ Fueling every 1,000 miles</div>
            <div>✓ 1 hr pickup + 1 hr dropoff</div>
            <div>✓ 24-hr ELD log sheet with line drawing</div>
            <div>✓ Multi-day log sheets for longer trips</div>
            <div>✓ Beautiful UI/UX design</div>
          </div>
        </div>

        {/* Script Content */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>
              Recommended Video Walkthrough Script:
            </span>
            <button
              onClick={copyScript}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#e2e8f0',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              <Copy size={13} />
              <span>Copy Script</span>
            </button>
          </div>

          <pre style={{
            background: '#090d16',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: '#cbd5e1',
            whiteSpace: 'pre-wrap',
            fontFamily: 'var(--font-mono)',
            lineHeight: 1.6,
            maxHeight: '280px',
            overflowY: 'auto'
          }}>
            {scriptText.trim()}
          </pre>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            className="gradient-btn"
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              fontSize: '0.85rem'
            }}
          >
            Got It! Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
