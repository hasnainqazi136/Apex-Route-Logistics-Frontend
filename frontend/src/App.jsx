import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TripForm from './components/TripForm';
import MetricsCards from './components/MetricsCards';
import RouteMap from './components/RouteMap';
import ELDLogSheet from './components/ELDLogSheet';
import TripTimeline from './components/TripTimeline';
import LoomGuideModal from './components/LoomGuideModal';
import { AlertTriangle, CheckCircle, Compass, FileText } from 'lucide-react';

export default function App() {
  const [tripPlan, setTripPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLoomGuide, setShowLoomGuide] = useState(false);

  // Auto-calculate default trip on initial mount
  useEffect(() => {
    handlePlanTrip({
      current_location: 'Chicago, IL',
      pickup_location: 'Indianapolis, IN',
      dropoff_location: 'Dallas, TX',
      current_cycle_used: 15.0
    });
  }, []);

  const handlePlanTrip = async (params) => {
    setIsLoading(true);
    setError(null);
    try {
      const rawApiBase = import.meta.env.VITE_API_BASE_URL || 'https://backend-apex-route-logistics.vercel.app';
      const apiBase = rawApiBase.replace(/\/+$/, '');
      const response = await fetch(`${apiBase}/api/plan-trip/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      setTripPlan(data);
    } catch (err) {
      console.error("Trip planning error:", err);
      setError(err.message || "Failed to calculate route. Please verify that the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Top Header */}
      <Header onOpenLoomGuide={() => setShowLoomGuide(true)} />

      {/* Main Container */}
      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px' }}>
        {/* Trip Input Form with Presets */}
        <TripForm onSubmit={handlePlanTrip} isLoading={isLoading} />

        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            padding: '16px 20px',
            borderRadius: '12px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <AlertTriangle size={20} color="#ef4444" />
            <div>
              <strong style={{ display: 'block', fontSize: '0.9rem' }}>Calculation Error</strong>
              <span style={{ fontSize: '0.82rem' }}>{error}</span>
            </div>
          </div>
        )}

        {/* Results Sections */}
        {tripPlan && (
          <>
            {/* 1. Metrics & Key Stats */}
            <MetricsCards summary={tripPlan.summary} />

            {/* 2. Interactive Route Map */}
            <RouteMap 
              routeGeometry={tripPlan.route_geometry} 
              stops={tripPlan.stops} 
            />

            {/* 3. Official FMCSA 24-Hour ELD Daily Log Sheets */}
            <ELDLogSheet dailyLogs={tripPlan.daily_logs} />

            {/* 4. Sequential Stop & Activity Timeline */}
            <TripTimeline stops={tripPlan.stops} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '30px 24px',
        color: '#64748b',
        fontSize: '0.8rem',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: '40px'
      }}>
        <p style={{ margin: '0 0 6px 0' }}>
          LogMaster ELD — Built for FMCSA Property-Carrying CMV Drivers (49 CFR § 395.3)
        </p>
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#475569' }}>
          70hr/8day Rule • 11hr Driving Limit • 14hr Window • 30m Breaks • 10hr Rests • 1,000mi Fueling
        </p>
      </footer>

      {/* Loom Script Guide Modal */}
      <LoomGuideModal 
        isOpen={showLoomGuide} 
        onClose={() => setShowLoomGuide(false)} 
      />
    </div>
  );
}
