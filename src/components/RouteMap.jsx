import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Fuel, BedDouble, Coffee, Warehouse, CheckCircle2 } from 'lucide-react';

// Custom SVG HTML Icons for Leaflet markers
const createHtmlIcon = (bgColor, iconSvg, label) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translate(-50%, -100%);
      ">
        <div style="
          background: ${bgColor};
          color: #ffffff;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
          border: 2px solid #ffffff;
        ">
          ${iconSvg}
        </div>
        ${label ? `
          <div style="
            background: rgba(15, 23, 42, 0.85);
            color: #ffffff;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 4px;
            margin-top: 3px;
            white-space: nowrap;
            border: 1px solid rgba(255,255,255,0.2);
          ">
            ${label}
          </div>
        ` : ''}
      </div>
    `,
    iconSize: [34, 46],
    iconAnchor: [17, 46],
    popupAnchor: [0, -42]
  });
};

const iconSVGs = {
  ORIGIN: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`,
  PICKUP: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  FUEL: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="3" y1="22" x2="15" y2="22"/><line x1="4" y1="9" x2="14" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/></svg>`,
  REST_BREAK: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>`,
  DAILY_REST: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>`,
  CYCLE_RESTART: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
  DROPOFF: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`
};

function getMarkerIcon(stopType) {
  switch (stopType) {
    case 'ORIGIN':
      return createHtmlIcon('#10b981', iconSVGs.ORIGIN, 'START');
    case 'PICKUP':
      return createHtmlIcon('#a855f7', iconSVGs.PICKUP, 'PICKUP');
    case 'FUEL':
      return createHtmlIcon('#f59e0b', iconSVGs.FUEL, 'FUEL');
    case 'REST_BREAK':
      return createHtmlIcon('#06b6d4', iconSVGs.REST_BREAK, '30m BREAK');
    case 'DAILY_REST':
      return createHtmlIcon('#10b981', iconSVGs.DAILY_REST, '10h SLEEPER');
    case 'CYCLE_RESTART':
      return createHtmlIcon('#6366f1', iconSVGs.CYCLE_RESTART, '34h RESTART');
    case 'DROPOFF':
      return createHtmlIcon('#ef4444', iconSVGs.DROPOFF, 'DELIVERY');
    default:
      return createHtmlIcon('#3b82f6', iconSVGs.REST_BREAK, 'STOP');
  }
}

// Component to automatically fit bounds to coordinates and stops
function FitBounds({ polylinePoints, stops }) {
  const map = useMap();

  useEffect(() => {
    const points = [];
    if (polylinePoints && polylinePoints.length > 0) {
      polylinePoints.forEach(p => points.push(p));
    }
    if (stops && stops.length > 0) {
      stops.forEach(s => {
        if (s.lat && s.lng) points.push([s.lat, s.lng]);
      });
    }
    if (points.length >= 2) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [polylinePoints, stops, map]);

  return null;
}

export default function RouteMap({ routeGeometry, stops }) {
  // Flip [lng, lat] from GeoJSON to Leaflet [lat, lng]
  const polylineLatLngs = (routeGeometry || []).map(coord => [coord[1], coord[0]]);

  const defaultCenter = polylineLatLngs.length > 0 
    ? polylineLatLngs[0] 
    : [39.8283, -98.5795]; // Center of USA

  // Map style state: 'osm' | 'esri' | 'dark'
  const [mapStyle, setMapStyle] = React.useState('osm');

  const tileLayers = {
    osm: {
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      name: 'OpenStreetMap'
    },
    esri: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      attribution: '&copy; Esri, HERE, Garmin, USGS',
      name: 'Esri Highways'
    },
    dark: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      attribution: '&copy; Esri, HERE, Garmin',
      name: 'Night Mode'
    }
  };

  return (
    <div className="glass-panel" style={{ height: '560px', overflow: 'hidden', position: 'relative', zIndex: 5, marginBottom: '24px' }}>
      {/* Map Header Floating Overlay */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(10px)',
        padding: '8px 16px',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#38bdf8', fontWeight: 600 }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8', display: 'inline-block' }} />
          <span>Active Route Corridor</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
          {(stops || []).length} Stops Plotted
        </div>
      </div>

      {/* Map Style Switcher (Top Right) */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(10px)',
        padding: '4px',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.15)',
        display: 'flex',
        gap: '4px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.4)'
      }}>
        {Object.entries(tileLayers).map(([key, item]) => (
          <button
            key={key}
            type="button"
            onClick={() => setMapStyle(key)}
            style={{
              background: mapStyle === key ? '#0284c7' : 'transparent',
              color: mapStyle === key ? '#ffffff' : '#94a3b8',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Legend Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '16px',
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(10px)',
        padding: '12px 16px',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        fontSize: '0.75rem',
        boxShadow: '0 8px 20px rgba(0,0,0,0.4)'
      }}>
        <div style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: '2px' }}>Route Legend:</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
          <span>Start / 10h Sleeper Reset</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#a855f7' }} />
          <span>Pickup Location (1 hr)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
          <span>Fuel Stop (1,000 mi)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#06b6d4' }} />
          <span>30-Min Rest Break</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
          <span>Dropoff Delivery (1 hr)</span>
        </div>
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={5}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          key={mapStyle}
          attribution={tileLayers[mapStyle].attribution}
          url={tileLayers[mapStyle].url}
          maxZoom={19}
        />

        {/* Outer Glow Polyline */}
        {polylineLatLngs.length > 0 && (
          <>
            <Polyline
              positions={polylineLatLngs}
              pathOptions={{
                color: '#0284c7',
                weight: 8,
                opacity: 0.4,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
            {/* Core Route Line */}
            <Polyline
              positions={polylineLatLngs}
              pathOptions={{
                color: '#0284c7',
                weight: 4,
                opacity: 0.95,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
          </>
        )}

        {/* Stop Markers */}
        {(stops || []).map((stop, idx) => {
          if (!stop.lat || !stop.lng) return null;
          return (
            <Marker
              key={idx}
              position={[stop.lat, stop.lng]}
              icon={getMarkerIcon(stop.type)}
            >
              <Popup>
                <div style={{ padding: '4px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#38bdf8', marginBottom: '4px' }}>
                    {stop.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px' }}>
                    {stop.description}
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '4px',
                    fontSize: '0.75rem',
                    background: '#0f172a',
                    padding: '6px 8px',
                    borderRadius: '6px'
                  }}>
                    <div><strong>Milestone:</strong> {stop.cumulative_miles} mi</div>
                    <div><strong>Duration:</strong> {stop.duration}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <FitBounds polylinePoints={polylineLatLngs} stops={stops} />
      </MapContainer>
    </div>
  );
}
