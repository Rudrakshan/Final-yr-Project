import React, { useState, useEffect } from 'react';
import PlatformNavbar from './PlatformNavbar';
import PlatformHome from './PlatformHome';
import RenewableEnergyView from './RenewableEnergyView';
import SiteSuitabilityView from './SiteSuitabilityView';
import RiskPredictionView from './RiskPredictionView';
import ScenarioLabView from './ScenarioLabView';
import AIChatPanel from './AIChatPanel';
import LocationSelector from '../location/LocationSelector';
import { useLocation } from '../../context/LocationContext';

export default function PlatformHub({ onNavigate, initialTab = 'home' }) {
  const [currentTab, setCurrentTab] = useState(initialTab);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const { 
    selectedLocation,
    isLocationSelectorActive, 
    openLocationSelector, 
    closeLocationSelector,
    pendingServiceTarget 
  } = useLocation();

  useEffect(() => {
    if (initialTab) setCurrentTab(initialTab);
  }, [initialTab]);

  const serviceLabels = {
    energy: 'Renewable Energy',
    site: 'Site Suitability',
    risk: 'Risk & Resilience',
    scenario: 'Scenario Lab'
  };

  const handleSelectService = (serviceId) => {
    // If location is already selected, navigate directly into service assessment
    if (selectedLocation) {
      setCurrentTab(serviceId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      openLocationSelector(serviceId);
    }
  };

  const handleConfirmLocation = (newLoc) => {
    const returnTab = closeLocationSelector(newLoc);
    if (returnTab && returnTab !== 'home') {
      setCurrentTab(returnTab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelLocation = () => {
    closeLocationSelector();
  };

  const activeTarget = pendingServiceTarget || (currentTab !== 'home' ? currentTab : null);
  const displayServiceName = activeTarget ? serviceLabels[activeTarget] || activeTarget : null;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F7F6F2',
        color: '#242424',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Modern Map Location Selection Screen / Fullscreen Overlay */}
      {isLocationSelectorActive && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <LocationSelector
            onConfirm={handleConfirmLocation}
            onCancel={handleCancelLocation}
            serviceName={displayServiceName}
          />
        </div>
      )}

      {/* Platform Navigation */}
      <PlatformNavbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onNavigate={onNavigate}
        onToggleAI={() => setIsAIOpen(prev => !prev)}
      />

      {/* Main Service Views */}
      <main style={{ flex: 1, position: 'relative' }}>
        {currentTab === 'home' && (
          <PlatformHome
            onSelectService={handleSelectService}
            onOpenEarthSelector={() => openLocationSelector('home')}
          />
        )}

        {currentTab === 'energy' && (
          <RenewableEnergyView
            onOpenScenarioLab={() => setCurrentTab('scenario')}
            onOpenEarthSelector={() => openLocationSelector('energy')}
            onBackToServices={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'site' && (
          <SiteSuitabilityView
            onOpenEarthSelector={() => openLocationSelector('site')}
            onOpenScenarioLab={() => setCurrentTab('scenario')}
          />
        )}

        {currentTab === 'risk' && (
          <RiskPredictionView
            onOpenEarthSelector={() => openLocationSelector('risk')}
            onOpenScenarioLab={() => setCurrentTab('scenario')}
          />
        )}

        {currentTab === 'scenario' && (
          <ScenarioLabView
            onOpenEarthSelector={() => openLocationSelector('scenario')}
          />
        )}
      </main>

      {/* AI Environmental Assistant Drawer */}
      <AIChatPanel
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        currentTab={currentTab}
      />
    </div>
  );
}
