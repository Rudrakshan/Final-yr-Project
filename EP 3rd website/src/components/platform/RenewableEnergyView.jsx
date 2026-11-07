import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Wind, 
  Droplets, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  MapPin, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  Zap,
  Clock,
  Home,
  Building2,
  Factory,
  Tractor,
  GraduationCap,
  PlusCircle,
  HelpCircle,
  Shield,
  Layers,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Info,
  DollarSign,
  BatteryCharging
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { analyzeRenewableEnergy } from '../../services/renewableEnergyService';

export default function RenewableEnergyView({ onOpenScenarioLab, onOpenEarthSelector, onBackToServices }) {
  const { selectedLocation } = useLocation();

  // View state: 'intro' | 'assessment' | 'review' | 'loading' | 'results'
  const [viewMode, setViewMode] = useState('intro');
  const [currentStep, setCurrentStep] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Centralized Assessment State Object
  const [assessmentData, setAssessmentData] = useState({
    location: {
      name: selectedLocation?.name || '',
      region: selectedLocation?.region || '',
      country: selectedLocation?.country || '',
      latitude: selectedLocation?.latitude || null,
      longitude: selectedLocation?.longitude || null,
    },
    useCase: '',
    electricity: {
      inputType: 'consumption', // 'consumption' | 'bill'
      monthlyConsumptionKWh: '',
      monthlyBill: '',
    },
    usagePattern: '',
    futureEnergyDemand: '',
    installation: {
      spaceType: '',
      areaKnown: null, // null | true | false
      availableAreaM2: '',
    },
    grid: {
      reliability: '',
      backupRequired: '',
      backupDuration: '',
    },
    priorities: [],
    budgetRange: '',
    advanced: {
      peakDemandKW: '',
      electricityPricePerKWh: '',
      operatingHoursPerDay: '',
      notes: '',
    },
  });

  // Sync selectedLocation into centralized state
  useEffect(() => {
    if (selectedLocation) {
      setAssessmentData((prev) => ({
        ...prev,
        location: {
          name: selectedLocation.name || '',
          region: selectedLocation.region || '',
          country: selectedLocation.country || '',
          latitude: selectedLocation.latitude || null,
          longitude: selectedLocation.longitude || null,
        }
      }));
    }
  }, [selectedLocation]);

  // Prompt location selector if no location is selected
  useEffect(() => {
    if (!selectedLocation && onOpenEarthSelector) {
      onOpenEarthSelector();
    }
  }, [selectedLocation, onOpenEarthSelector]);

  // Helper to update top-level field
  const updateField = (key, value) => {
    setAssessmentData((prev) => ({ ...prev, [key]: value }));
  };

  // Helper to update nested object
  const updateNestedField = (parentKey, childKey, value) => {
    setAssessmentData((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: value,
      },
    }));
  };

  // Toggle multi-select priority
  const togglePriority = (priorityItem) => {
    setAssessmentData((prev) => {
      const exists = prev.priorities.includes(priorityItem);
      const updated = exists
        ? prev.priorities.filter((p) => p !== priorityItem)
        : [...prev.priorities, priorityItem];
      return { ...prev, priorities: updated };
    });
  };

  // Navigation handlers
  const handleStartAssessment = () => {
    setViewMode('assessment');
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setViewMode('review');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setViewMode('intro');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
    setViewMode('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalyze = async () => {
    setViewMode('loading');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const result = await analyzeRenewableEnergy(assessmentData);
      setAnalysisResult(result);
      setViewMode('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error during mock analysis:', err);
      setViewMode('review');
    }
  };

  const handleRetake = () => {
    setAssessmentData((prev) => ({
      ...prev,
      useCase: '',
      electricity: { inputType: 'consumption', monthlyConsumptionKWh: '', monthlyBill: '' },
      usagePattern: '',
      futureEnergyDemand: '',
      installation: { spaceType: '', areaKnown: null, availableAreaM2: '' },
      grid: { reliability: '', backupRequired: '', backupDuration: '' },
      priorities: [],
      budgetRange: '',
      advanced: { peakDemandKW: '', electricityPricePerKWh: '', operatingHoursPerDay: '', notes: '' }
    }));
    setViewMode('intro');
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if current step can advance
  const canContinueStep = () => {
    switch (currentStep) {
      case 1:
        return Boolean(assessmentData.useCase);
      case 2:
        return Boolean(assessmentData.usagePattern) && Boolean(assessmentData.futureEnergyDemand);
      case 3:
        return Boolean(assessmentData.installation.spaceType);
      case 4:
        return Boolean(assessmentData.grid.reliability) && Boolean(assessmentData.grid.backupRequired);
      case 5:
        return assessmentData.priorities.length > 0;
      default:
        return true;
    }
  };

  // Persistent Location Top Header
  const renderLocationBar = () => {
    const locDisplay = selectedLocation 
      ? `${selectedLocation.name}${selectedLocation.region ? `, ${selectedLocation.region}` : ''}`
      : 'Select Location';

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '12px 20px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #D9D7D0',
          borderRadius: '10px',
          marginBottom: '32px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: '#F4EEDC',
              color: '#B08D3C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MapPin style={{ width: '15px', height: '15px' }} />
          </div>
          <span style={{ fontSize: '0.92rem', color: '#66645F' }}>Target Assessment Location:</span>
          <strong style={{ fontSize: '0.95rem', color: '#242424' }}>📍 {locDisplay}</strong>
        </div>

        <button
          onClick={onOpenEarthSelector}
          style={{
            background: 'none',
            border: 'none',
            color: '#B08D3C',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: '4px 8px',
          }}
        >
          Change
        </button>
      </div>
    );
  };

  // =========================================================================
  // VIEW: INTRODUCTION
  // =========================================================================
  if (viewMode === 'intro') {
    return (
      <div style={{ maxWidth: '840px', margin: '0 auto', padding: '48px 24px 80px' }}>
        {renderLocationBar()}

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: '20px',
              backgroundColor: '#F4EEDC',
              color: '#8E712C',
              fontSize: '0.78rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '18px',
            }}
          >
            <Sparkles style={{ width: '13px', height: '13px' }} />
            Guided Assessment
          </div>

          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#242424',
              lineHeight: 1.25,
              marginBottom: '16px',
              letterSpacing: '-0.02em',
            }}
          >
            Let's understand your energy needs.
          </h1>

          <p
            style={{
              fontSize: '1.18rem',
              color: '#66645F',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto 20px',
            }}
          >
            A few simple questions will help EcoPredict understand what kind of renewable energy solution could fit your situation.
          </p>

          <p
            style={{
              fontSize: '0.94rem',
              color: '#8A8882',
              lineHeight: 1.6,
              maxWidth: '620px',
              margin: '0 auto',
            }}
          >
            You don't need to know technical energy terms. Just provide what you know, and EcoPredict will handle the technical analysis later.
          </p>
        </div>

        {/* Feature Highlights & Estimated Time */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '44px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9D7D0',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#F4EEDC',
                color: '#B08D3C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
              }}
            >
              <Clock style={{ width: '18px', height: '18px' }} />
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#8A8882', textTransform: 'uppercase' }}>
              Estimated Time
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#242424', marginTop: '4px' }}>
              2–3 minutes
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9D7D0',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#EBF4F0',
                color: '#2E7D5B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
              }}
            >
              <Shield style={{ width: '18px', height: '18px' }} />
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#8A8882', textTransform: 'uppercase' }}>
              Technical Knowledge
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#242424', marginTop: '4px' }}>
              Zero jargon required
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9D7D0',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#EEF4FA',
                color: '#2B6CB0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
              }}
            >
              <Zap style={{ width: '18px', height: '18px' }} />
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#8A8882', textTransform: 'uppercase' }}>
              Outcome
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#242424', marginTop: '4px' }}>
              Customized strategy
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={handleStartAssessment}
            className="btn-gold"
            style={{
              padding: '14px 44px',
              fontSize: '1.05rem',
              borderRadius: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(176, 141, 60, 0.25)',
            }}
          >
            <span>Start Assessment</span>
            <ArrowRight style={{ width: '18px', height: '18px' }} />
          </button>

          {onBackToServices && (
            <button
              onClick={onBackToServices}
              style={{
                background: 'none',
                border: 'none',
                color: '#66645F',
                fontSize: '0.92rem',
                cursor: 'pointer',
                padding: '6px 12px',
                fontWeight: '500',
              }}
            >
              ← Back to Services
            </button>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: LOADING SCREEN
  // =========================================================================
  if (viewMode === 'loading') {
    return (
      <div style={{ maxWidth: '640px', margin: '80px auto', padding: '40px 24px', textAlign: 'center' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#F4EEDC',
            color: '#B08D3C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            animation: 'spin 2s linear infinite',
          }}
        >
          <RefreshCw style={{ width: '30px', height: '30px' }} />
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#242424', marginBottom: '10px' }}>
          Preparing your renewable energy assessment...
        </h2>

        <p style={{ color: '#66645F', fontSize: '1rem', lineHeight: 1.6 }}>
          EcoPredict is organizing your project information.
        </p>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // =========================================================================
  // VIEW: PROTOTYPE RESULTS
  // =========================================================================
  if (viewMode === 'results') {
    const rec = analysisResult?.primaryRecommendation;
    const alternatives = analysisResult?.alternativeOptions || [];

    return (
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Top Disclaimer Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: '20px',
              backgroundColor: '#F4EEDC',
              color: '#8E712C',
              fontSize: '0.78rem',
              fontWeight: '700',
              letterSpacing: '0.06em',
            }}
          >
            PROTOTYPE RESULT
          </div>
        </div>

        {/* Results Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#242424', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Your Renewable Energy Assessment
          </h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#66645F', fontSize: '0.95rem' }}>
            <MapPin style={{ width: '16px', height: '16px', color: '#B08D3C' }} />
            <span>📍 {analysisResult?.locationName || selectedLocation?.name || 'Selected Location'}</span>
          </div>
        </div>

        {/* Primary Recommendation Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #B08D3C',
            borderRadius: '14px',
            padding: '36px',
            marginBottom: '36px',
            boxShadow: '0 4px 20px rgba(176, 141, 60, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#8A8882', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                PRIMARY RECOMMENDATION
              </span>
              <h2 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#242424', marginTop: '4px' }}>
                {rec?.technology || 'Solar PV'}
              </h2>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                borderRadius: '20px',
                backgroundColor: '#EBF4F0',
                color: '#2E7D5B',
                fontSize: '0.85rem',
                fontWeight: '700',
              }}
            >
              <CheckCircle2 style={{ width: '16px', height: '16px' }} />
              {rec?.suitabilityRating || 'High suitability'}
            </div>
          </div>

          <p style={{ color: '#4A4843', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '20px' }}>
            {rec?.description}
          </p>

          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: '#F7F6F2',
              border: '1px solid #D9D7D0',
              color: '#66645F',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Info style={{ width: '16px', height: '16px', color: '#B08D3C', flexShrink: 0 }} />
            <span>{rec?.disclaimer}</span>
          </div>
        </div>

        {/* WHY THIS OPTION Section */}
        <div style={{ marginBottom: '36px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#242424', marginBottom: '16px', letterSpacing: '-0.01em' }}>
            WHY THIS OPTION?
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {rec?.keyFactors?.map((factor, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D9D7D0',
                  borderRadius: '10px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: '#EBF4F0',
                    color: '#2E7D5B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#242424', marginBottom: '4px' }}>
                    {factor.title}
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: '#66645F', lineHeight: 1.5, margin: 0 }}>
                    {factor.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* OTHER OPTIONS CONSIDERED Section */}
        <div style={{ marginBottom: '44px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#242424', marginBottom: '8px', letterSpacing: '-0.01em' }}>
            OTHER OPTIONS CONSIDERED
          </h3>
          <p style={{ color: '#8A8882', fontSize: '0.88rem', marginBottom: '16px' }}>
            Example results — environmental and ML models will be connected later.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {alternatives.map((alt, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D9D7D0',
                  borderRadius: '10px',
                  padding: '18px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ maxWidth: '640px' }}>
                  <div style={{ fontSize: '1.02rem', fontWeight: '700', color: '#242424', marginBottom: '4px' }}>
                    {alt.technology}
                  </div>
                  <div style={{ fontSize: '0.86rem', color: '#66645F' }}>
                    {alt.description}
                  </div>
                </div>

                <div
                  style={{
                    padding: '4px 12px',
                    borderRadius: '16px',
                    backgroundColor: alt.suitability.includes('High') ? '#EBF4F0' : '#F7F6F2',
                    color: alt.suitability.includes('High') ? '#2E7D5B' : '#66645F',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    border: '1px solid #D9D7D0',
                  }}
                >
                  {alt.suitability}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            paddingTop: '20px',
            borderTop: '1px solid #D9D7D0',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setViewMode('review');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #D9D7D0',
                color: '#242424',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Modify Answers
            </button>

            <button
              onClick={handleRetake}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#66645F',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Retake Assessment
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {onOpenScenarioLab && (
              <button
                onClick={onOpenScenarioLab}
                className="btn-gold"
                style={{
                  padding: '10px 22px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Explore in Scenario Lab</span>
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>
            )}

            {onBackToServices && (
              <button
                onClick={onBackToServices}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D9D7D0',
                  color: '#66645F',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Back to Services
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: REVIEW SCREEN
  // =========================================================================
  if (viewMode === 'review') {
    const formatUsage = () => {
      if (assessmentData.electricity.inputType === 'consumption' && assessmentData.electricity.monthlyConsumptionKWh) {
        return `${assessmentData.electricity.monthlyConsumptionKWh} kWh / month`;
      }
      if (assessmentData.electricity.inputType === 'bill' && assessmentData.electricity.monthlyBill) {
        return `₹${assessmentData.electricity.monthlyBill} / month`;
      }
      return 'Not specified (estimated)';
    };

    const formatArea = () => {
      if (assessmentData.installation.areaKnown && assessmentData.installation.availableAreaM2) {
        return `${assessmentData.installation.availableAreaM2} m²`;
      }
      return 'Not specified';
    };

    return (
      <div style={{ maxWidth: '840px', margin: '0 auto', padding: '40px 24px 80px' }}>
        {renderLocationBar()}

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#242424', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Here's what we know about your project.
          </h1>
          <p style={{ color: '#66645F', fontSize: '1.05rem' }}>
            Check your answers before we begin the analysis.
          </p>
        </div>

        {/* Structured Summary Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
          
          {/* SECTION 1: PROJECT */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9D7D0',
              borderRadius: '12px',
              padding: '24px 28px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#8A8882', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                1. PROJECT
              </div>
              <button
                onClick={() => handleJumpToStep(1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#B08D3C',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Edit
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.82rem', color: '#8A8882', display: 'block', marginBottom: '2px' }}>📍 Location</span>
                <strong style={{ fontSize: '0.95rem', color: '#242424' }}>
                  {selectedLocation ? `${selectedLocation.name}, ${selectedLocation.country}` : 'Not set'}
                </strong>
              </div>
              <div>
                <span style={{ fontSize: '0.82rem', color: '#8A8882', display: 'block', marginBottom: '2px' }}>🏢 Project Type</span>
                <strong style={{ fontSize: '0.95rem', color: '#242424' }}>
                  {assessmentData.useCase || 'Not specified'}
                </strong>
              </div>
            </div>
          </div>

          {/* SECTION 2: ENERGY */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9D7D0',
              borderRadius: '12px',
              padding: '24px 28px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#8A8882', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                2. ENERGY
              </div>
              <button
                onClick={() => handleJumpToStep(2)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#B08D3C',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Edit
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.82rem', color: '#8A8882', display: 'block', marginBottom: '2px' }}>⚡ Electricity usage</span>
                <strong style={{ fontSize: '0.95rem', color: '#242424' }}>{formatUsage()}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.82rem', color: '#8A8882', display: 'block', marginBottom: '2px' }}>☀️ Main usage period</span>
                <strong style={{ fontSize: '0.95rem', color: '#242424' }}>{assessmentData.usagePattern || 'Not specified'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.82rem', color: '#8A8882', display: 'block', marginBottom: '2px' }}>📈 Future energy needs</span>
                <strong style={{ fontSize: '0.95rem', color: '#242424' }}>{assessmentData.futureEnergyDemand || 'Not specified'}</strong>
              </div>
            </div>
          </div>

          {/* SECTION 3: SPACE */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9D7D0',
              borderRadius: '12px',
              padding: '24px 28px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#8A8882', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                3. SPACE
              </div>
              <button
                onClick={() => handleJumpToStep(3)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#B08D3C',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Edit
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.82rem', color: '#8A8882', display: 'block', marginBottom: '2px' }}>🏠 Installation space</span>
                <strong style={{ fontSize: '0.95rem', color: '#242424' }}>{assessmentData.installation.spaceType || 'Not specified'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.82rem', color: '#8A8882', display: 'block', marginBottom: '2px' }}>📐 Available area</span>
                <strong style={{ fontSize: '0.95rem', color: '#242424' }}>{formatArea()}</strong>
              </div>
            </div>
          </div>

          {/* SECTION 4: POWER NEEDS */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9D7D0',
              borderRadius: '12px',
              padding: '24px 28px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#8A8882', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                4. POWER NEEDS
              </div>
              <button
                onClick={() => handleJumpToStep(4)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#B08D3C',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Edit
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.82rem', color: '#8A8882', display: 'block', marginBottom: '2px' }}>🔌 Grid reliability</span>
                <strong style={{ fontSize: '0.95rem', color: '#242424' }}>{assessmentData.grid.reliability || 'Not specified'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.82rem', color: '#8A8882', display: 'block', marginBottom: '2px' }}>🛡 Backup requirement</span>
                <strong style={{ fontSize: '0.95rem', color: '#242424' }}>
                  {assessmentData.grid.backupRequired || 'No'}
                  {assessmentData.grid.backupDuration ? ` (${assessmentData.grid.backupDuration})` : ''}
                </strong>
              </div>
            </div>
          </div>

          {/* SECTION 5: PRIORITIES & BUDGET */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9D7D0',
              borderRadius: '12px',
              padding: '24px 28px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#8A8882', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                5. PRIORITIES & BUDGET
              </div>
              <button
                onClick={() => handleJumpToStep(5)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#B08D3C',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Edit
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '0.82rem', color: '#8A8882', display: 'block', marginBottom: '8px' }}>Key Priorities</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {assessmentData.priorities.map((p, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '16px',
                      backgroundColor: '#F4EEDC',
                      color: '#8E712C',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.82rem', color: '#8A8882', display: 'block', marginBottom: '2px' }}>Budget Range</span>
              <strong style={{ fontSize: '0.95rem', color: '#242424' }}>{assessmentData.budgetRange || 'Not specified'}</strong>
            </div>
          </div>
        </div>

        {/* Final CTA Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D9D7D0',
            borderRadius: '14px',
            padding: '36px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#242424', marginBottom: '8px' }}>
            Ready to explore your renewable options?
          </h2>
          <p style={{ color: '#66645F', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            EcoPredict will combine your information with environmental and geographic data to evaluate suitable renewable energy options.
          </p>

          <button
            onClick={handleAnalyze}
            className="btn-gold"
            style={{
              padding: '14px 40px',
              fontSize: '1.05rem',
              fontWeight: '700',
              borderRadius: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(176, 141, 60, 0.25)',
            }}
          >
            <span>Analyze Renewable Potential</span>
            <ArrowRight style={{ width: '18px', height: '18px' }} />
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: GUIDED ASSESSMENT (STEPS 1 TO 5)
  // =========================================================================
  const stageTitles = [
    'YOUR PROJECT',
    'YOUR ENERGY',
    'YOUR SPACE',
    'YOUR NEEDS',
    'YOUR PRIORITIES',
  ];

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '36px 24px 80px' }}>
      {renderLocationBar()}

      {/* Progress Header */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#8E712C', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {stageTitles[currentStep - 1]}
          </span>
          <span style={{ fontSize: '0.84rem', fontWeight: '600', color: '#8A8882' }}>
            Step {currentStep} of 5
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '6px', backgroundColor: '#E5E3DD', borderRadius: '3px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${(currentStep / 5) * 100}%`,
              height: '100%',
              backgroundColor: '#B08D3C',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* =================================================================== */}
      {/* STEP 1: YOUR PROJECT */}
      {/* =================================================================== */}
      {currentStep === 1 && (
        <div>
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#242424', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              What are you planning to power?
            </h2>
            <p style={{ color: '#66645F', fontSize: '1.02rem' }}>
              Choose the option that best describes your project.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              marginBottom: '28px',
            }}
          >
            {[
              { id: 'Home', icon: Home, title: 'Home', desc: 'House or residential property' },
              { id: 'Business', icon: Building2, title: 'Business', desc: 'Office, shop or commercial building' },
              { id: 'Industry', icon: Factory, title: 'Industry', desc: 'Factory or industrial facility' },
              { id: 'Agriculture', icon: Tractor, title: 'Agriculture', desc: 'Farm, irrigation or agricultural operation' },
              { id: 'Institution', icon: GraduationCap, title: 'Institution', desc: 'School, college, hospital or other institution' },
              { id: 'Other', icon: PlusCircle, title: 'Other', desc: 'Something else' },
            ].map((card) => {
              const isSelected = assessmentData.useCase === card.id;
              const IconComp = card.icon;

              return (
                <button
                  key={card.id}
                  onClick={() => updateField('useCase', card.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '24px 20px',
                    borderRadius: '12px',
                    backgroundColor: isSelected ? '#F4EEDC' : '#FFFFFF',
                    border: isSelected ? '2px solid #B08D3C' : '1px solid #D9D7D0',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(176, 141, 60, 0.12)' : 'none',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        backgroundColor: isSelected ? '#EADFBD' : '#F7F6F2',
                        color: isSelected ? '#8E712C' : '#66645F',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComp style={{ width: '20px', height: '20px' }} />
                    </div>

                    {isSelected && (
                      <CheckCircle2 style={{ width: '18px', height: '18px', color: '#B08D3C' }} />
                    )}
                  </div>

                  <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#242424', marginBottom: '4px' }}>
                    {card.title}
                  </div>
                  <div style={{ fontSize: '0.86rem', color: '#66645F', lineHeight: 1.4 }}>
                    {card.desc}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Smart Guidance Contextual Note */}
          {assessmentData.useCase === 'Industry' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '14px 18px',
                backgroundColor: '#F7F6F2',
                border: '1px solid #D9D7D0',
                borderRadius: '8px',
                color: '#66645F',
                fontSize: '0.88rem',
                lineHeight: 1.5,
                marginBottom: '28px',
              }}
            >
              <Info style={{ width: '16px', height: '16px', color: '#B08D3C', flexShrink: 0, marginTop: '2px' }} />
              <span>
                Industrial facilities can have very different energy needs. We'll use your electricity usage to understand the scale of the solution.
              </span>
            </div>
          )}

          {assessmentData.useCase === 'Agriculture' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '14px 18px',
                backgroundColor: '#F7F6F2',
                border: '1px solid #D9D7D0',
                borderRadius: '8px',
                color: '#66645F',
                fontSize: '0.88rem',
                lineHeight: 1.5,
                marginBottom: '28px',
              }}
            >
              <Info style={{ width: '16px', height: '16px', color: '#B08D3C', flexShrink: 0, marginTop: '2px' }} />
              <span>
                For agricultural projects, electricity use and available land can be particularly important.
              </span>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* STEP 2: YOUR ENERGY */}
      {/* =================================================================== */}
      {currentStep === 2 && (
        <div>
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#242424', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              How much electricity do you use?
            </h2>
            <p style={{ color: '#66645F', fontSize: '1.02rem' }}>
              An estimate is completely fine. You don't need to know the exact number.
            </p>
          </div>

          {/* First question: Do you know your electricity usage? */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9D7D0',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '28px',
            }}
          >
            <label style={{ display: 'block', fontSize: '0.98rem', fontWeight: '700', color: '#242424', marginBottom: '12px' }}>
              Do you know your electricity usage?
            </label>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <button
                onClick={() => updateNestedField('electricity', 'inputType', 'consumption')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  backgroundColor: assessmentData.electricity.inputType === 'consumption' ? '#F4EEDC' : '#FFFFFF',
                  border: assessmentData.electricity.inputType === 'consumption' ? '2px solid #B08D3C' : '1px solid #D9D7D0',
                  color: assessmentData.electricity.inputType === 'consumption' ? '#8E712C' : '#66645F',
                  fontWeight: assessmentData.electricity.inputType === 'consumption' ? '700' : '500',
                  cursor: 'pointer',
                }}
              >
                I know my usage
              </button>

              <button
                onClick={() => updateNestedField('electricity', 'inputType', 'bill')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  backgroundColor: assessmentData.electricity.inputType === 'bill' ? '#F4EEDC' : '#FFFFFF',
                  border: assessmentData.electricity.inputType === 'bill' ? '2px solid #B08D3C' : '1px solid #D9D7D0',
                  color: assessmentData.electricity.inputType === 'bill' ? '#8E712C' : '#66645F',
                  fontWeight: assessmentData.electricity.inputType === 'bill' ? '700' : '500',
                  cursor: 'pointer',
                }}
              >
                I'm not sure
              </button>
            </div>

            {/* Input field based on choice */}
            {assessmentData.electricity.inputType === 'consumption' ? (
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#4A4843', marginBottom: '8px' }}>
                  About how much electricity do you use each month?
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '340px' }}>
                  <input
                    type="number"
                    placeholder="e.g. 450"
                    value={assessmentData.electricity.monthlyConsumptionKWh}
                    onChange={(e) => updateNestedField('electricity', 'monthlyConsumptionKWh', e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #D9D7D0',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                  <span style={{ fontSize: '0.9rem', color: '#66645F', fontWeight: '600', whiteSpace: 'nowrap' }}>
                    kWh / month
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#8A8882', marginTop: '6px' }}>
                  You can usually find this on your electricity bill.
                </div>
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#4A4843', marginBottom: '8px' }}>
                  No problem. About how much is your usual electricity bill?
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '340px' }}>
                  <input
                    type="number"
                    placeholder="e.g. 3500"
                    value={assessmentData.electricity.monthlyBill}
                    onChange={(e) => updateNestedField('electricity', 'monthlyBill', e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #D9D7D0',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                  <span style={{ fontSize: '0.9rem', color: '#66645F', fontWeight: '600', whiteSpace: 'nowrap' }}>
                    ₹ per month
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#8A8882', marginTop: '6px' }}>
                  We can use this as an estimate for now.
                </div>
              </div>
            )}
          </div>

          {/* Question: When do you use the most electricity? */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9D7D0',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '28px',
            }}
          >
            <label style={{ display: 'block', fontSize: '0.98rem', fontWeight: '700', color: '#242424', marginBottom: '14px' }}>
              When do you use the most electricity?
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { id: 'Mostly during the day', label: '☀️ Mostly during the day' },
                { id: 'Mostly at night', label: '🌙 Mostly at night' },
                { id: 'Throughout the day', label: '🔄 Throughout the day' },
                { id: 'Changes with season', label: '📅 It changes with the season' },
                { id: 'Not sure', label: "❓ I'm not sure" },
              ].map((opt) => {
                const isSelected = assessmentData.usagePattern === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => updateField('usagePattern', opt.id)}
                    style={{
                      padding: '12px 18px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#F4EEDC' : '#FFFFFF',
                      border: isSelected ? '2px solid #B08D3C' : '1px solid #D9D7D0',
                      color: isSelected ? '#8E712C' : '#242424',
                      fontWeight: isSelected ? '700' : '500',
                      fontSize: '0.92rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <CheckCircle2 style={{ width: '16px', height: '16px', color: '#B08D3C' }} />}
                  </button>
                );
              })}
            </div>

            {assessmentData.usagePattern === 'Not sure' && (
              <div style={{ fontSize: '0.85rem', color: '#8A8882', marginTop: '12px' }}>
                That's completely fine. We'll work with the information you have.
              </div>
            )}
          </div>

          {/* Question: Do you expect your electricity use to change in the future? */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9D7D0',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '28px',
            }}
          >
            <label style={{ display: 'block', fontSize: '0.98rem', fontWeight: '700', color: '#242424', marginBottom: '14px' }}>
              Do you expect your electricity use to change in the future?
            </label>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {[
                'Stay about the same',
                'Increase a little',
                'Increase significantly',
                'Decrease',
                'Not sure',
              ].map((opt) => {
                const isSelected = assessmentData.futureEnergyDemand === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => updateField('futureEnergyDemand', opt)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#F4EEDC' : '#FFFFFF',
                      border: isSelected ? '2px solid #B08D3C' : '1px solid #D9D7D0',
                      color: isSelected ? '#8E712C' : '#66645F',
                      fontWeight: isSelected ? '700' : '500',
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STEP 3: YOUR SPACE */}
      {/* =================================================================== */}
      {currentStep === 3 && (
        <div>
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#242424', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              Where could renewable equipment go?
            </h2>
            <p style={{ color: '#66645F', fontSize: '1.02rem' }}>
              This helps us understand what physical space may be available.
            </p>
          </div>

          {/* Cards for space type */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '0.98rem', fontWeight: '700', color: '#242424', marginBottom: '14px' }}>
              Where could you install renewable energy equipment?
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              {[
                { id: 'Rooftop', title: '🏠 Rooftop', desc: 'Space on a building roof' },
                { id: 'Open land', title: '🌳 Open land', desc: 'Ground or unused land' },
                { id: 'Both', title: '🏠🌳 Both', desc: 'Rooftop and open land' },
                { id: 'Not sure', title: '❓ Not sure', desc: "I'm not sure yet" },
              ].map((card) => {
                const isSelected = assessmentData.installation.spaceType === card.id;
                return (
                  <button
                    key={card.id}
                    onClick={() => updateNestedField('installation', 'spaceType', card.id)}
                    style={{
                      padding: '20px',
                      borderRadius: '10px',
                      backgroundColor: isSelected ? '#F4EEDC' : '#FFFFFF',
                      border: isSelected ? '2px solid #B08D3C' : '1px solid #D9D7D0',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: '700', color: '#242424' }}>
                        {card.title}
                      </span>
                      {isSelected && <CheckCircle2 style={{ width: '16px', height: '16px', color: '#B08D3C' }} />}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#66645F' }}>{card.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Space availability question */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9D7D0',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '28px',
            }}
          >
            <label style={{ display: 'block', fontSize: '0.98rem', fontWeight: '700', color: '#242424', marginBottom: '12px' }}>
              Do you know approximately how much space is available?
            </label>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
              <button
                onClick={() => updateNestedField('installation', 'areaKnown', true)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  backgroundColor: assessmentData.installation.areaKnown === true ? '#F4EEDC' : '#FFFFFF',
                  border: assessmentData.installation.areaKnown === true ? '2px solid #B08D3C' : '1px solid #D9D7D0',
                  color: assessmentData.installation.areaKnown === true ? '#8E712C' : '#66645F',
                  fontWeight: assessmentData.installation.areaKnown === true ? '700' : '500',
                  cursor: 'pointer',
                }}
              >
                Yes, I know
              </button>

              <button
                onClick={() => updateNestedField('installation', 'areaKnown', false)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  backgroundColor: assessmentData.installation.areaKnown === false ? '#F4EEDC' : '#FFFFFF',
                  border: assessmentData.installation.areaKnown === false ? '2px solid #B08D3C' : '1px solid #D9D7D0',
                  color: assessmentData.installation.areaKnown === false ? '#8E712C' : '#66645F',
                  fontWeight: assessmentData.installation.areaKnown === false ? '700' : '500',
                  cursor: 'pointer',
                }}
              >
                I'm not sure
              </button>
            </div>

            {assessmentData.installation.areaKnown === true && (
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#4A4843', marginBottom: '8px' }}>
                  Approximately how much space?
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '300px' }}>
                  <input
                    type="number"
                    placeholder="e.g. 120"
                    value={assessmentData.installation.availableAreaM2}
                    onChange={(e) => updateNestedField('installation', 'availableAreaM2', e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #D9D7D0',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                  <span style={{ fontSize: '0.9rem', color: '#66645F', fontWeight: '600' }}>m²</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#8A8882', marginTop: '6px' }}>
                  An approximate value is enough.
                </div>
              </div>
            )}

            {assessmentData.installation.areaKnown === false && (
              <div style={{ fontSize: '0.88rem', color: '#66645F', lineHeight: 1.5 }}>
                That's okay. EcoPredict can work with the information available.
              </div>
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STEP 4: YOUR NEEDS */}
      {/* =================================================================== */}
      {currentStep === 4 && (
        <div>
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#242424', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              How important is reliable power to you?
            </h2>
            <p style={{ color: '#66645F', fontSize: '1.02rem' }}>
              Tell us what you need from your energy system.
            </p>
          </div>

          {/* Grid Reliability Question */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9D7D0',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '28px',
            }}
          >
            <label style={{ display: 'block', fontSize: '0.98rem', fontWeight: '700', color: '#242424', marginBottom: '14px' }}>
              How reliable is your current electricity supply?
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              {[
                { id: 'Very reliable', label: '🟢 Very reliable' },
                { id: 'Occasional outages', label: '🟡 Occasional outages' },
                { id: 'Frequent outages', label: '🔴 Frequent outages' },
                { id: 'Not sure', label: '❓ Not sure' },
              ].map((opt) => {
                const isSelected = assessmentData.grid.reliability === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => updateNestedField('grid', 'reliability', opt.id)}
                    style={{
                      padding: '14px 18px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#F4EEDC' : '#FFFFFF',
                      border: isSelected ? '2px solid #B08D3C' : '1px solid #D9D7D0',
                      color: isSelected ? '#8E712C' : '#242424',
                      fontWeight: isSelected ? '700' : '500',
                      fontSize: '0.92rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <CheckCircle2 style={{ width: '16px', height: '16px', color: '#B08D3C' }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Backup Requirement Question */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9D7D0',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '28px',
            }}
          >
            <label style={{ display: 'block', fontSize: '0.98rem', fontWeight: '700', color: '#242424', marginBottom: '14px' }}>
              If the power goes out, do you need important equipment to keep running?
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {[
                'No',
                'Yes, for a short time',
                'Yes, for several hours',
                "I'm not sure",
              ].map((opt) => {
                const isSelected = assessmentData.grid.backupRequired === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => updateNestedField('grid', 'backupRequired', opt)}
                    style={{
                      padding: '12px 18px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#F4EEDC' : '#FFFFFF',
                      border: isSelected ? '2px solid #B08D3C' : '1px solid #D9D7D0',
                      color: isSelected ? '#8E712C' : '#242424',
                      fontWeight: isSelected ? '700' : '500',
                      fontSize: '0.92rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{opt}</span>
                    {isSelected && <CheckCircle2 style={{ width: '16px', height: '16px', color: '#B08D3C' }} />}
                  </button>
                );
              })}
            </div>

            {/* Conditional Duration question */}
            {(assessmentData.grid.backupRequired === 'Yes, for a short time' ||
              assessmentData.grid.backupRequired === 'Yes, for several hours') && (
              <div style={{ paddingTop: '16px', borderTop: '1px solid #E5E3DD' }}>
                <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: '700', color: '#242424', marginBottom: '10px' }}>
                  How long would you ideally need backup power?
                </label>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['1–2 hours', '2–6 hours', '6–12 hours', 'More than 12 hours', 'Not sure'].map((dur) => {
                    const isSelected = assessmentData.grid.backupDuration === dur;
                    return (
                      <button
                        key={dur}
                        onClick={() => updateNestedField('grid', 'backupDuration', dur)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          backgroundColor: isSelected ? '#F4EEDC' : '#FFFFFF',
                          border: isSelected ? '2px solid #B08D3C' : '1px solid #D9D7D0',
                          color: isSelected ? '#8E712C' : '#66645F',
                          fontWeight: isSelected ? '700' : '500',
                          fontSize: '0.86rem',
                          cursor: 'pointer',
                        }}
                      >
                        {dur}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STEP 5: YOUR PRIORITIES */}
      {/* =================================================================== */}
      {currentStep === 5 && (
        <div>
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#242424', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              What matters most to you?
            </h2>
            <p style={{ color: '#66645F', fontSize: '1.02rem' }}>
              There can be more than one good option. Tell us what you care about most.
            </p>
          </div>

          {/* Multiple choice priorities */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '0.98rem', fontWeight: '700', color: '#242424', marginBottom: '14px' }}>
              Select one or more priorities:
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {[
                { id: 'Lower electricity bills', label: '💰 Lower electricity bills' },
                { id: 'Reduce carbon emissions', label: '🌱 Reduce carbon emissions' },
                { id: 'Reduce dependence on the grid', label: '🔌 Reduce dependence on the grid' },
                { id: 'Keep power available during outages', label: '🛡 Keep power available during outages' },
                { id: 'Use more renewable energy', label: '☀️ Use more renewable energy' },
                { id: 'Long-term investment', label: '📈 Long-term investment' },
              ].map((item) => {
                const isSelected = assessmentData.priorities.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => togglePriority(item.id)}
                    style={{
                      padding: '16px 20px',
                      borderRadius: '10px',
                      backgroundColor: isSelected ? '#F4EEDC' : '#FFFFFF',
                      border: isSelected ? '2px solid #B08D3C' : '1px solid #D9D7D0',
                      color: isSelected ? '#8E712C' : '#242424',
                      fontWeight: isSelected ? '700' : '500',
                      fontSize: '0.92rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 2px 8px rgba(176, 141, 60, 0.1)' : 'none',
                    }}
                  >
                    <span>{item.label}</span>
                    {isSelected && <CheckCircle2 style={{ width: '16px', height: '16px', color: '#B08D3C' }} />}
                  </button>
                );
              })}
            </div>
            {assessmentData.priorities.length === 0 && (
              <div style={{ fontSize: '0.82rem', color: '#8A8882', marginTop: '8px' }}>
                Please select at least one priority to continue.
              </div>
            )}
          </div>

          {/* Optional Budget Question */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9D7D0',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <label style={{ fontSize: '0.98rem', fontWeight: '700', color: '#242424' }}>
                Do you have a budget in mind?
              </label>
              <span style={{ fontSize: '0.78rem', color: '#8A8882', textTransform: 'uppercase', fontWeight: '600' }}>
                Optional
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                'Under ₹2 lakh',
                '₹2–5 lakh',
                '₹5–10 lakh',
                '₹10–25 lakh',
                'More than ₹25 lakh',
                "I'm not sure",
                'Prefer not to say',
              ].map((bOpt) => {
                const isSelected = assessmentData.budgetRange === bOpt;
                return (
                  <button
                    key={bOpt}
                    onClick={() => updateField('budgetRange', bOpt)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#F4EEDC' : '#FFFFFF',
                      border: isSelected ? '2px solid #B08D3C' : '1px solid #D9D7D0',
                      color: isSelected ? '#8E712C' : '#66645F',
                      fontWeight: isSelected ? '700' : '500',
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                    }}
                  >
                    {bOpt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Advanced Information Accordion */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9D7D0',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '32px',
            }}
          >
            <button
              onClick={() => setShowAdvanced((prev) => !prev)}
              style={{
                width: '100%',
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div>
                <div style={{ fontSize: '0.94rem', fontWeight: '700', color: '#242424' }}>
                  Have detailed energy information?
                </div>
                <div style={{ fontSize: '0.82rem', color: '#8A8882' }}>
                  Optional engineering parameters (peak demand, exact tariffs, notes)
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#B08D3C', fontSize: '0.88rem', fontWeight: '600' }}>
                <span>{showAdvanced ? 'Hide' : 'Advanced information +'}</span>
                {showAdvanced ? <ChevronUp style={{ width: '16px', height: '16px' }} /> : <ChevronDown style={{ width: '16px', height: '16px' }} />}
              </div>
            </button>

            {showAdvanced && (
              <div style={{ padding: '0 24px 24px', borderTop: '1px solid #E5E3DD', paddingTop: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#66645F', marginBottom: '6px' }}>
                      Peak electricity demand (kW)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 15"
                      value={assessmentData.advanced.peakDemandKW}
                      onChange={(e) => updateNestedField('advanced', 'peakDemandKW', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #D9D7D0',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#66645F', marginBottom: '6px' }}>
                      Exact electricity price (₹/kWh)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 7.50"
                      value={assessmentData.advanced.electricityPricePerKWh}
                      onChange={(e) => updateNestedField('advanced', 'electricityPricePerKWh', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #D9D7D0',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#66645F', marginBottom: '6px' }}>
                      Operating hours per day
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 10"
                      value={assessmentData.advanced.operatingHoursPerDay}
                      onChange={(e) => updateNestedField('advanced', 'operatingHoursPerDay', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #D9D7D0',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#66645F', marginBottom: '6px' }}>
                    Detailed notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Any specific project details or constraints..."
                    value={assessmentData.advanced.notes}
                    onChange={(e) => updateNestedField('advanced', 'notes', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #D9D7D0',
                      fontSize: '0.9rem',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Footer (Back & Continue) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '20px',
          borderTop: '1px solid #D9D7D0',
        }}
      >
        <button
          onClick={handlePreviousStep}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #D9D7D0',
            color: '#66645F',
            fontSize: '0.92rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          <span>Back</span>
        </button>

        <button
          onClick={handleNextStep}
          disabled={!canContinueStep()}
          className="btn-gold"
          style={{
            padding: '12px 28px',
            borderRadius: '8px',
            fontSize: '0.95rem',
            fontWeight: '700',
            cursor: canContinueStep() ? 'pointer' : 'not-allowed',
            opacity: canContinueStep() ? 1 : 0.5,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>{currentStep === 5 ? 'Review Answers' : 'Continue'}</span>
          <ArrowRight style={{ width: '16px', height: '16px' }} />
        </button>
      </div>
    </div>
  );
}
