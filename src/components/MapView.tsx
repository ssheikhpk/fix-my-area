import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../context/AppContext';
import { 
  t, 
  getTownName, 
  getCategoryName, 
  getCrewName, 
  getReportTitle, 
  getReportDescription 
} from '../translations';
import { Report } from '../types';
import { 
  ArrowLeft, 
  Layers, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Siren,
  RotateCcw,
  Search,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Eye,
  AlertTriangle
} from 'lucide-react';

export const MapView: React.FC = () => {
  const { reports, language } = useApp();
  const navigate = useNavigate();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const heatLayerRef = useRef<L.LayerGroup | null>(null);
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map());

  // Interactive controls
  const [activeFilter, setActiveFilter] = useState<'all' | 'breaches' | 'hazard' | 'resolved'>('all');
  const [mapStyle, setMapStyle] = useState<'satellite' | 'streetview' | 'streets' | 'night'>('satellite');
  const [simulationOffsetHours, setSimulationOffsetHours] = useState<number>(0);
  const [selectedTown, setSelectedTown] = useState<string>('All');
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || '');
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);

  const townsList = [
    'All',
    'Clifton & DHA',
    'Saddar',
    'Gulshan-e-Iqbal',
    'North Nazimabad',
    'Korangi',
    'Malir',
    'Keamari & Lyari',
    'Jamshed Town',
  ];

  // Specific coordinates for Karachi centers & towns
  const townCoordinates: Record<string, [number, number]> = {
    'Clifton & DHA': [24.8211, 67.0322],
    'Saddar': [24.8615, 67.0149],
    'Gulshan-e-Iqbal': [24.9180, 67.0971],
    'North Nazimabad': [24.9421, 67.0442],
    'Korangi': [24.8250, 67.1200],
    'Malir': [24.8900, 67.1950],
    'Keamari & Lyari': [24.8150, 66.9750],
    'Jamshed Town': [24.8750, 67.0600],
  };

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (selectedTown !== 'All' && r.karachiTown !== selectedTown) return false;
      
      const simulatedRemaining = Math.max(0, r.slaRemainingSeconds - simulationOffsetHours * 3600);
      const isBreached = r.status !== 'Resolved' && (r.slaRemainingSeconds === 0 || simulatedRemaining === 0);

      if (activeFilter === 'breaches') return isBreached;
      if (activeFilter === 'hazard') return r.isEmergency || isBreached;
      if (activeFilter === 'resolved') return r.status === 'Resolved';
      return true;
    });
  }, [reports, selectedTown, simulationOffsetHours, activeFilter]);

  const activeReport = reports.find(r => r.id === selectedReportId) || filteredReports[0] || reports[0];

  const breachedCount = reports.filter(r => r.status !== 'Resolved' && (r.slaRemainingSeconds === 0 || Math.max(0, r.slaRemainingSeconds - simulationOffsetHours * 3600) === 0)).length;
  const hazardCount = reports.filter(r => (r.isEmergency || (r.status !== 'Resolved' && r.slaRemainingSeconds === 0))).length;
  const resolvedCount = reports.filter(r => r.status === 'Resolved').length;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [24.8607, 67.0011], // Karachi City Center
        zoom: 13,
        minZoom: 10,
        maxZoom: 19,
        zoomControl: false, // Custom position
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      const heatGroup = L.layerGroup().addTo(map);

      markersLayerRef.current = markersGroup;
      heatLayerRef.current = heatGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layers when mapStyle changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    if (mapStyle === 'satellite' || mapStyle === 'streetview') {
      // Real Esri World Imagery Satellite Tiles
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '&copy; Esri, Maxar, Earthstar Geographics',
          maxZoom: 19,
        }
      ).addTo(map);

      // Roads and boundary overlay for satellite
      L.tileLayer(
        'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          opacity: 0.85,
        }
      ).addTo(map);
    } else if (mapStyle === 'streets') {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);
    } else {
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);
    }
  }, [mapStyle]);

  // Fly to town when selectedTown changes
  const handleTownChange = (town: string) => {
    setSelectedTown(town);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (town === 'All') {
      map.flyTo([24.8607, 67.0011], 12, { animate: true, duration: 1 });
    } else if (townCoordinates[town]) {
      map.flyTo(townCoordinates[town], 14, { animate: true, duration: 1.2 });
    }
  };

  // Fly to report and open popup
  const focusOnReport = (rep: Report) => {
    setSelectedReportId(rep.id);
    setIsInspectorOpen(true);
    const map = mapInstanceRef.current;
    if (!map) return;

    const coords = rep.coordinates 
      ? [rep.coordinates.lat, rep.coordinates.lng] 
      : (townCoordinates[rep.karachiTown] || [24.8607, 67.0011]);

    map.flyTo(coords as [number, number], 15, { animate: true, duration: 1 });

    const marker = markersMapRef.current.get(rep.id);
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 700);
    }
  };

  // Fit bounds when activeFilter changes
  const handleFilterChange = (filter: 'all' | 'breaches' | 'hazard' | 'resolved') => {
    setActiveFilter(filter);
    const map = mapInstanceRef.current;
    if (!map) return;

    const targetReports = reports.filter((r) => {
      if (selectedTown !== 'All' && r.karachiTown !== selectedTown) return false;
      const simulatedRemaining = Math.max(0, r.slaRemainingSeconds - simulationOffsetHours * 3600);
      const isBreached = r.status !== 'Resolved' && (r.slaRemainingSeconds === 0 || simulatedRemaining === 0);

      if (filter === 'breaches') return isBreached;
      if (filter === 'hazard') return r.isEmergency || isBreached;
      if (filter === 'resolved') return r.status === 'Resolved';
      return true;
    });

    if (targetReports.length > 0) {
      setSelectedReportId(targetReports[0].id);
      const bounds = L.latLngBounds(
        targetReports.map(r => r.coordinates ? [r.coordinates.lat, r.coordinates.lng] : (townCoordinates[r.karachiTown] || [24.8607, 67.0011]))
      );
      map.flyToBounds(bounds, { padding: [60, 60], maxZoom: 15, animate: true });
    }
  };

  // Update Markers & Badges
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    const heatGroup = heatLayerRef.current;

    if (!map || !markersGroup || !heatGroup) return;

    markersGroup.clearLayers();
    heatGroup.clearLayers();
    markersMapRef.current.clear();

    filteredReports.forEach((rep) => {
      const coords = rep.coordinates 
        ? [rep.coordinates.lat, rep.coordinates.lng] 
        : (townCoordinates[rep.karachiTown] || [24.8607, 67.0011]);

      const isResolved = rep.status === 'Resolved';
      const simulatedSeconds = Math.max(0, rep.slaRemainingSeconds - simulationOffsetHours * 3600);
      const isBreached = !isResolved && simulatedSeconds === 0;
      const isCritical = !isResolved && !isBreached && (rep.isEmergency || simulatedSeconds < 3600);

      // Draw radar circle aura if breached or emergency
      if (isBreached || rep.isEmergency) {
        L.circle(coords as [number, number], {
          radius: 950,
          color: '#e11d48',
          fillColor: '#f43f5e',
          fillOpacity: 0.28,
          weight: 2,
          dashArray: '6, 6',
        }).addTo(heatGroup);
      } else if (isCritical) {
        L.circle(coords as [number, number], {
          radius: 750,
          color: '#f97316',
          fillColor: '#fb923c',
          fillOpacity: 0.22,
          weight: 1.5,
        }).addTo(heatGroup);
      }

      // Format countdown time
      const hours = Math.floor(simulatedSeconds / 3600);
      const minutes = Math.floor((simulatedSeconds % 3600) / 60);
      const seconds = simulatedSeconds % 60;
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      const problemTitle = getReportTitle(rep.title || '', language);
      const townDisplay = getTownName(rep.karachiTown, language);

      // Custom HTML Marker clearly showing WHICH LOCATION has WHICH PROBLEM
      let markerHtml = '';
      if (isResolved) {
        markerHtml = `
          <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -50%);">
            <div style="display: flex; align-items: center; gap: 6px; background: rgba(6, 78, 59, 0.95); border: 2px solid #10b981; color: #fff; padding: 4px 10px; border-radius: 9999px; box-shadow: 0 4px 14px rgba(0,0,0,0.8); font-family: sans-serif; white-space: nowrap;">
              <span style="font-size: 13px;">✓</span>
              <strong style="font-size: 11px;">${problemTitle}</strong>
              <span style="font-size: 9px; opacity: 0.8; font-family: monospace;">● ${language === 'ur' ? 'حل شدہ' : 'RESOLVED'}</span>
            </div>
            <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #10b981; margin-top: -1px;"></div>
          </div>
        `;
      } else if (isBreached) {
        markerHtml = `
          <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -50%);">
            <div style="display: flex; align-items: center; gap: 6px; background: rgba(190, 18, 60, 0.95); border: 2px solid #fda4af; color: #fff; padding: 5px 11px; border-radius: 9999px; box-shadow: 0 4px 18px rgba(225, 29, 72, 0.9); font-family: sans-serif; white-space: nowrap; animation: pulse 1s infinite alternate;">
              <span style="font-size: 14px;">🚨</span>
              <strong style="font-size: 11px; color: #fff;">${problemTitle}</strong>
              <span style="font-size: 9px; background: #e11d48; padding: 1px 5px; border-radius: 4px; font-weight: 900; letter-spacing: 0.5px;">${language === 'ur' ? 'وقت ختم' : 'OVERDUE'}</span>
            </div>
            <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #be123c; margin-top: -1px;"></div>
          </div>
        `;
      } else if (isCritical) {
        markerHtml = `
          <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -50%);">
            <div style="display: flex; align-items: center; gap: 6px; background: rgba(194, 65, 12, 0.95); border: 2px solid #fb923c; color: #fff; padding: 4px 10px; border-radius: 9999px; box-shadow: 0 4px 14px rgba(0,0,0,0.8); font-family: sans-serif; white-space: nowrap;">
              <span style="font-size: 13px;">⚡</span>
              <strong style="font-size: 11px;">${problemTitle}</strong>
              <span style="font-size: 9px; font-family: monospace; background: #ea580c; padding: 1px 5px; border-radius: 4px;">⏱️ ${timeString}</span>
            </div>
            <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #c2410c; margin-top: -1px;"></div>
          </div>
        `;
      } else {
        markerHtml = `
          <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -50%);">
            <div style="display: flex; align-items: center; gap: 6px; background: rgba(3, 105, 161, 0.95); border: 2px solid #38bdf8; color: #fff; padding: 4px 10px; border-radius: 9999px; box-shadow: 0 4px 14px rgba(0,0,0,0.8); font-family: sans-serif; white-space: nowrap;">
              <span style="font-size: 13px;">📍</span>
              <strong style="font-size: 11px;">${problemTitle}</strong>
              <span style="font-size: 9px; font-family: monospace; opacity: 0.9;">${timeString}</span>
            </div>
            <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #0369a1; margin-top: -1px;"></div>
          </div>
        `;
      }

      const customIcon = L.divIcon({
        className: 'custom-gis-banner-marker',
        html: markerHtml,
        iconSize: [200, 36],
        iconAnchor: [100, 36],
        popupAnchor: [0, -36],
      });

      const marker = L.marker(coords as [number, number], { icon: customIcon });

      const statusTitle = isResolved 
        ? (language === 'ur' ? 'کام مکمل اور تصدیق شدہ' : 'Resolved & Closed')
        : isBreached 
        ? (language === 'ur' ? 'وقت ختم (اعلیٰ افسران کو ارسال)' : 'SLA Breached (Paging Leadership)')
        : (language === 'ur' ? 'کام جاری ہے' : 'Work In Progress');

      const popupHtml = `
        <div style="font-family: sans-serif; color: #0f172a; min-width: 240px; padding: 4px;" dir="${language === 'ur' ? 'rtl' : 'ltr'}">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 800; background: ${isResolved ? '#059669' : isBreached ? '#be123c' : '#ea580c'}; color: #fff; padding: 2px 7px; border-radius: 6px;">
              ${statusTitle}
            </span>
            <span style="font-size: 11px; font-weight: bold; color: #64748b; font-family: monospace;">${rep.id}</span>
          </div>
          <strong style="font-size: 13px; display: block; margin-bottom: 4px; color: #020617;">${problemTitle}</strong>
          <p style="font-size: 11px; color: #334155; margin: 0 0 6px 0; line-height: 1.4;">${getReportDescription(rep.description, language)}</p>
          <div style="font-size: 10px; color: #475569; border-top: 1px solid #e2e8f0; padding-top: 4px; display: flex; justify-content: space-between;">
            <span>📍 ${townDisplay} (${rep.location})</span>
            <strong style="color: ${isBreached ? '#be123c' : '#0369a1'};">${isResolved ? '✓ CLOSED' : timeString}</strong>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        setSelectedReportId(rep.id);
        setIsInspectorOpen(true);
      });

      marker.addTo(markersGroup);
      markersMapRef.current.set(rep.id, marker);
    });
  }, [filteredReports, simulationOffsetHours, language]);

  // Navigate next/prev report
  const handleNextReport = (dir: 1 | -1) => {
    if (filteredReports.length === 0) return;
    const currentIndex = filteredReports.findIndex(r => r.id === selectedReportId);
    let nextIndex = currentIndex + dir;
    if (nextIndex < 0) nextIndex = filteredReports.length - 1;
    if (nextIndex >= filteredReports.length) nextIndex = 0;
    focusOnReport(filteredReports[nextIndex]);
  };

  return (
    <div 
      dir={language === 'ur' ? 'rtl' : 'ltr'} 
      className="relative w-full h-[calc(100vh-65px)] bg-[#070c18] overflow-hidden flex flex-col font-sans"
    >
      
      {/* FLOATING TOP CONTROL BAR (Completely interactive filter buttons) */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        
        {/* Left: Back button & Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0a1224]/95 p-1.5 rounded-2xl border border-slate-700/80 shadow-2xl backdrop-blur-md">
          
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title={t('backToHome', language)}
          >
            <ArrowLeft className={`w-3.5 h-3.5 ${language === 'ur' ? 'rotate-180' : ''}`} />
            <span className="hidden sm:inline">{t('backToHome', language)}</span>
          </button>

          <div className="h-5 w-px bg-slate-700 mx-1 hidden sm:block" />

          {/* Filter Pills */}
          <button
            type="button"
            onClick={() => handleFilterChange('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400 font-black'
                : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {t('allIncidents', language)} ({reports.length})
          </button>

          <button
            type="button"
            onClick={() => handleFilterChange('breaches')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'breaches'
                ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-400 font-black'
                : 'bg-slate-900 border border-slate-700 text-rose-300 hover:text-white'
            }`}
          >
            <span>⚠️</span>
            <span>{t('slaBreachesFilter', language)} ({breachedCount})</span>
          </button>

          <button
            type="button"
            onClick={() => handleFilterChange('hazard')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'hazard'
                ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400 font-black'
                : 'bg-slate-900 border border-slate-700 text-amber-300 hover:text-white'
            }`}
          >
            <span>🔥</span>
            <span>{t('highHazardFilter', language)} ({hazardCount})</span>
          </button>

          <button
            type="button"
            onClick={() => handleFilterChange('resolved')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'resolved'
                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400 font-black'
                : 'bg-slate-900 border border-slate-700 text-emerald-300 hover:text-white'
            }`}
          >
            <span>✓</span>
            <span>{t('resolvedFilter', language)} ({resolvedCount})</span>
          </button>
        </div>

        {/* Right: Town Select, Map Style & Simulator */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0a1224]/95 p-1.5 rounded-2xl border border-slate-700/80 shadow-2xl backdrop-blur-md">
          
          {/* Town Selector Dropdown */}
          <select
            value={selectedTown}
            onChange={(e) => handleTownChange(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {townsList.map((town) => (
              <option key={town} value={town}>
                {getTownName(town, language)}
              </option>
            ))}
          </select>

          {/* View Modes */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setMapStyle('satellite')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mapStyle === 'satellite' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              🛰️ {t('satelliteHdMode', language)}
            </button>
            <button
              type="button"
              onClick={() => setMapStyle('streets')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mapStyle === 'streets' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('streetsMode', language)}
            </button>
          </div>

        </div>

      </div>

      {/* FULL VIEWPORT LEAFLET MAP */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full z-0 cursor-grab active:cursor-grabbing" 
      />

      {/* FLOATING PROBLEM & LOCATION INSPECTOR CARD (Tells on which location which prob is) */}
      {activeReport && isInspectorOpen && (
        <div className={`absolute bottom-4 ${language === 'ur' ? 'right-4' : 'left-4'} z-[1000] w-[92%] sm:w-[420px] bg-[#0a1224]/95 border-2 border-slate-700 rounded-3xl p-5 shadow-2xl backdrop-blur-md pointer-events-auto transition-all animate-in fade-in slide-in-from-bottom-3`}>
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${
                activeReport.status === 'Resolved' ? 'bg-emerald-500' : (activeReport.slaRemainingSeconds === 0 ? 'bg-rose-500 animate-ping' : 'bg-amber-500')
              }`} />
              <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                {t('problemInspectorTitle', language)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleNextReport(-1)}
                className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
                title="Previous Problem"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleNextReport(1)}
                className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
                title="Next Problem"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsInspectorOpen(false)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer ml-1"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Problem Details */}
          <div className="pt-3 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono text-amber-400 font-bold">{activeReport.id}</span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  activeReport.status === 'Resolved'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : activeReport.slaRemainingSeconds === 0
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-800 text-amber-300'
                }`}>
                  {activeReport.status === 'Resolved' 
                    ? (language === 'ur' ? '✓ حل شدہ' : 'Resolved') 
                    : activeReport.slaRemainingSeconds === 0 
                    ? (language === 'ur' ? '🚨 وقت ختم (وارننگ)' : '🚨 SLA Breached') 
                    : (language === 'ur' ? 'کام جاری ہے' : 'In Progress')}
                </span>
              </div>

              {/* WHICH PROBLEM */}
              <h3 className="text-base font-black text-white leading-snug">
                {getReportTitle(activeReport.title || '', language)}
              </h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                {getReportDescription(activeReport.description, language)}
              </p>
            </div>

            {/* WHICH LOCATION */}
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black text-white block">
                  {getTownName(activeReport.karachiTown, language)}
                </span>
                <span className="text-[11px] text-slate-400">
                  {activeReport.location}
                </span>
              </div>
            </div>

            {/* Crew & Time */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">{t('assignedCrew', language)}:</span>
                <span className="font-extrabold text-white text-[11px] truncate block mt-0.5">
                  {getCrewName(activeReport.assignedCrew || 'KMC Rapid Response', language)}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">{t('timeRemaining', language)}:</span>
                <span className={`font-mono font-black text-xs block mt-0.5 ${
                  activeReport.status === 'Resolved' ? 'text-emerald-400' : (activeReport.slaRemainingSeconds === 0 ? 'text-rose-400' : 'text-amber-400')
                }`}>
                  {activeReport.status === 'Resolved' 
                    ? (language === 'ur' ? '✓ تصدیق شدہ' : 'Verified Closed') 
                    : `${Math.floor(activeReport.slaRemainingSeconds / 3600)}h ${Math.floor((activeReport.slaRemainingSeconds % 3600) / 60)}m`}
                </span>
              </div>
            </div>

            {/* Fly to this Location button */}
            <button
              type="button"
              onClick={() => focusOnReport(activeReport)}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{language === 'ur' ? 'نقشے پر اس مقام کو زوم کریں' : 'Zoom into This Karachi Location'}</span>
            </button>

          </div>

        </div>
      )}

      {/* Button to reopen inspector if closed */}
      {!isInspectorOpen && activeReport && (
        <button
          type="button"
          onClick={() => setIsInspectorOpen(true)}
          className={`absolute bottom-4 ${language === 'ur' ? 'right-4' : 'left-4'} z-[1000] px-4 py-2.5 rounded-2xl bg-[#0a1224] border border-amber-500 text-amber-300 font-bold text-xs shadow-xl cursor-pointer flex items-center gap-2`}
        >
          <MapPin className="w-4 h-4 text-amber-400" />
          <span>{t('problemInspectorTitle', language)}</span>
        </button>
      )}

      {/* BOTTOM SLA SPECTRUM (Matching screenshot image_85d89131.png) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[990] hidden md:flex items-center gap-2 px-4 py-2 bg-[#080d19]/95 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-2xl text-[11px] font-bold pointer-events-auto">
        <span className="text-slate-400 uppercase text-[10px] font-black mr-1">
          {language === 'ur' ? 'ایس ایل اے صورتحال:' : 'REAL-TIME SLA SPECTRUM:'}
        </span>
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-800">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span>{language === 'ur' ? 'وقت ختم (کمشنر کو نوٹس)' : 'Breached (Paging Leadership)'}</span>
        </span>
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-950/80 text-orange-300 border border-orange-800">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          <span>{language === 'ur' ? '&lt; ۱ گھنٹہ ہنگامی' : '&lt; 1h Critical'}</span>
        </span>
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-950/80 text-sky-300 border border-sky-800">
          <span className="w-2 h-2 rounded-full bg-sky-500" />
          <span>{language === 'ur' ? 'عملہ روانہ' : 'Crew Dispatched'}</span>
        </span>
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{language === 'ur' ? 'مکمل اور تصدیق شدہ' : 'Healthy & Verified'}</span>
        </span>
      </div>

    </div>
  );
};
