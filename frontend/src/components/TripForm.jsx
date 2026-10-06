import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Compass, Clock, Zap, ArrowRight, Loader2, Sparkles, Building2 } from 'lucide-react';

const PRESETS = [
  {
    name: 'Midwest to Texas (1,080 mi)',
    tag: 'Standard Evaluation Run',
    current: 'Chicago, IL',
    pickup: 'Indianapolis, IN',
    dropoff: 'Dallas, TX',
    cycle: 15.0
  },
  {
    name: 'Southeast Express (790 mi)',
    tag: 'Regional Run',
    current: 'Atlanta, GA',
    pickup: 'Birmingham, AL',
    dropoff: 'Miami, FL',
    cycle: 8.5
  },
  {
    name: 'Coast-to-Coast (2,790 mi)',
    tag: 'Multi-Day Long Haul',
    current: 'New York, NY',
    pickup: 'Pittsburgh, PA',
    dropoff: 'Los Angeles, CA',
    cycle: 22.0
  }
];

export default function TripForm({ onSubmit, isLoading }) {
  const [currentLocation, setCurrentLocation] = useState('Chicago, IL');
  const [pickupLocation, setPickupLocation] = useState('Indianapolis, IN');
  const [dropoffLocation, setDropoffLocation] = useState('Dallas, TX');
  const [cycleUsed, setCycleUsed] = useState(15.0);

  // Suggestions state
  const [suggestions, setSuggestions] = useState({ field: null, items: [] });
  const formRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setSuggestions({ field: null, items: [] });
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query, field) => {
    if (!query || query.length < 2) {
      setSuggestions({ field: null, items: [] });
      return;
    }
    try {
      const rawApiBase = import.meta.env.VITE_API_BASE_URL || 'https://backend-apex-route-logistics.vercel.app';
      const apiBase = rawApiBase.replace(/\/+$/, '');
      const res = await fetch(`${apiBase}/api/geocode/?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions({ field, items: data });
      }
    } catch (err) {
      // Ignore network abort
    }
  };

  const handleSelectSuggestion = (val, field) => {
    if (field === 'current') setCurrentLocation(val);
    if (field === 'pickup') setPickupLocation(val);
    if (field === 'dropoff') setDropoffLocation(val);
    setSuggestions({ field: null, items: [] });
  };

  const applyPreset = (preset) => {
    setCurrentLocation(preset.current);
    setPickupLocation(preset.pickup);
    setDropoffLocation(preset.dropoff);
    setCycleUsed(preset.cycle);
    setSuggestions({ field: null, items: [] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuggestions({ field: null, items: [] });
    onSubmit({
      current_location: currentLocation,
      pickup_location: pickupLocation,
      dropoff_location: dropoffLocation,
      current_cycle_used: parseFloat(cycleUsed) || 0.0
    });
  };

  return (
    <div
      ref={formRef}
      className="glass-panel"
      style={{
        padding: '24px 28px',
        marginBottom: '24px',
        position: 'relative',
        zIndex: 100,
        overflow: 'visible'
      }}
    >
      {/* Quick Presets Bar */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <Sparkles size={16} color="#38bdf8" />
          <span style={{ fontWeight: 600 }}>One-Click Test Presets:</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#e2e8f0',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(14, 165, 233, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <span style={{ fontWeight: 600 }}>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ overflow: 'visible' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
          alignItems: 'end',
          overflow: 'visible'
        }}>
          {/* Current Location */}
          <div style={{ position: 'relative', zIndex: suggestions.field === 'current' ? 200 : 30 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
              <Navigation size={15} color="#38bdf8" />
              <span>Current Location (Origin)</span>
            </label>
            <input
              type="text"
              value={currentLocation}
              onChange={(e) => {
                setCurrentLocation(e.target.value);
                fetchSuggestions(e.target.value, 'current');
              }}
              placeholder="e.g. Chicago, IL"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: '#f8fafc',
                fontSize: '0.92rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
            />
            {suggestions.field === 'current' && suggestions.items.length > 0 && (
              <SuggestionDropdown 
                items={suggestions.items} 
                onSelect={(val) => handleSelectSuggestion(val, 'current')} 
              />
            )}
          </div>

          {/* Pickup Location */}
          <div style={{ position: 'relative', zIndex: suggestions.field === 'pickup' ? 200 : 25 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
              <Compass size={15} color="#a855f7" />
              <span>Pickup Location (1 hr Load)</span>
            </label>
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => {
                setPickupLocation(e.target.value);
                fetchSuggestions(e.target.value, 'pickup');
              }}
              placeholder="e.g. Indianapolis, IN"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: '#f8fafc',
                fontSize: '0.92rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#a855f7'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
            />
            {suggestions.field === 'pickup' && suggestions.items.length > 0 && (
              <SuggestionDropdown 
                items={suggestions.items} 
                onSelect={(val) => handleSelectSuggestion(val, 'pickup')} 
              />
            )}
          </div>

          {/* Dropoff Location */}
          <div style={{ position: 'relative', zIndex: suggestions.field === 'dropoff' ? 200 : 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
              <MapPin size={15} color="#f43f5e" />
              <span>Dropoff Location (1 hr Unload)</span>
            </label>
            <input
              type="text"
              value={dropoffLocation}
              onChange={(e) => {
                setDropoffLocation(e.target.value);
                fetchSuggestions(e.target.value, 'dropoff');
              }}
              placeholder="e.g. Dallas, TX"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: '#f8fafc',
                fontSize: '0.92rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#f43f5e'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
            />
            {suggestions.field === 'dropoff' && suggestions.items.length > 0 && (
              <SuggestionDropdown 
                items={suggestions.items} 
                onSelect={(val) => handleSelectSuggestion(val, 'dropoff')} 
              />
            )}
          </div>

          {/* Cycle Used */}
          <div style={{ position: 'relative', zIndex: 10 }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={15} color="#fbbf24" />
                Current Cycle Used
              </span>
              <span className="mono" style={{ color: '#fbbf24', fontWeight: 700 }}>
                {cycleUsed} / 70 hrs
              </span>
            </label>
            <input
              type="number"
              min="0"
              max="70"
              step="0.5"
              value={cycleUsed}
              onChange={(e) => setCycleUsed(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: '#f8fafc',
                fontSize: '0.92rem',
                outline: 'none',
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>

          {/* Submit Button */}
          <div style={{ position: 'relative', zIndex: 10 }}>
            <button
              type="submit"
              disabled={isLoading}
              className="gradient-btn"
              style={{
                width: '100%',
                padding: '13px 20px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="pulse-glow" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Computing HOS Route...</span>
                </>
              ) : (
                <>
                  <Zap size={18} />
                  <span>Calculate Route &amp; ELD Logs</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function SuggestionDropdown({ items, onSelect }) {
  return (
    <ul
      style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        left: 0,
        right: 0,
        zIndex: 99999,
        background: '#0f172a',
        border: '1px solid rgba(14, 165, 233, 0.45)',
        borderRadius: '10px',
        listStyle: 'none',
        maxHeight: '220px',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95), 0 0 20px rgba(14, 165, 233, 0.25)',
        padding: '6px 0'
      }}
    >
      {items.map((item, idx) => (
        <li
          key={idx}
          onMouseDown={(e) => {
            e.preventDefault(); // prevent blur before click
            onSelect(item.label);
          }}
          style={{
            padding: '10px 14px',
            fontSize: '0.85rem',
            cursor: 'pointer',
            borderBottom: idx === items.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.06)',
            color: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'background 0.15s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(14, 165, 233, 0.18)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <Building2 size={15} color="#38bdf8" style={{ flexShrink: 0 }} />
          <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
