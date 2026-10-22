import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../context/AppContext';
import { t, getTownName, getCategoryName, getCrewName } from '../translations';
import { Navbar } from '../components/Navbar';
import { 
  Truck, 
  Navigation, 
  Phone, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Radio, 
  ShieldCheck, 
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Droplet,
  Car,
  Trash2,
  Users,
  Map as MapIcon
} from 'lucide-react';

interface TrackingSquad {
  id: string;
  reportId: string;
  squadName: string;
  category: 'Water' | 'Electricity' | 'Roads' | 'Garbage';
  vehicleNumber: string;
  driverName: string;
  phone: string;
  targetLocation: string;
  town: string;
  status: 'Dispatched' | 'En Route' | 'Arrived at Site' | 'Repair Underway';
  etaMinutes: number;
  currentCoords: [number, number];
  targetCoords: [number, number];
  dispatchTime: string;
  steps: {
    titleEn: string;
    titleUr: string;
    time: string;
    completed: boolean;
  }[];
}

interface LiveTrackingViewProps {
  showHeaderTabs?: boolean;
}

export const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({ showHeaderTabs = false }) => {
  const { language, reports, user } = useApp();
  const navigate = useNavigate();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Default Karachi tracking squads paired with reports or municipal units
  const initialSquads: TrackingSquad[] = [
    {
      id: 'SQUAD-KW-09',
      reportId: reports[0]?.id || 'KHI-8921',
      squadName: 'KW&SB Hydro Suction Squad #09',
      category: 'Water',
      vehicleNumber: 'KHI-KW-802 (Jetter Truck)',
      driverName: 'Supervisor Qasim Ali Shah',
      phone: '+92 300 2847110',
      targetLocation: 'Shahrah-e-Faisal near Nursery Flyover',
      town: 'Saddar',
      status: 'En Route',
      etaMinutes: 8,
      currentCoords: [24.8680, 67.0580],
      targetCoords: [24.8615, 67.0149],
      dispatchTime: '10:15 AM',
      steps: [
        { titleEn: 'Dispatch Order Issued', titleUr: 'ڈسپیچ آرڈر جاری ہوا', time: '10:15 AM', completed: true },
        { titleEn: 'Team En Route to Site', titleUr: 'ٹیم جائے وقوعہ کے لیے روانہ', time: '10:20 AM', completed: true },
        { titleEn: 'Arrival at Spot', titleUr: 'موقع پر پہنچ گئی', time: 'Pending', completed: false },
        { titleEn: 'Repair SOP Complete', titleUr: 'مرمت کا کام مکمل', time: 'Pending', completed: false },
      ],
    },
    {
      id: 'SQUAD-KE-101',
      reportId: 'KHI-4402',
      squadName: 'K-Electric Rapid Line Unit #101',
      category: 'Electricity',
      vehicleNumber: 'KE-PWR-101 (Mobile Boom Crane)',
      driverName: 'Engineer Tariq Mehmood',
      phone: '+92 321 9876543',
      targetLocation: 'Regal Chowk Transformer Station',
      town: 'Saddar',
      status: 'Repair Underway',
      etaMinutes: 0,
      currentCoords: [24.8615, 67.0149],
      targetCoords: [24.8615, 67.0149],
      dispatchTime: '09:40 AM',
      steps: [
        { titleEn: 'Dispatch Order Issued', titleUr: 'ڈسپیچ آرڈر جاری ہوا', time: '09:40 AM', completed: true },
        { titleEn: 'Team En Route to Site', titleUr: 'ٹیم جائے وقوعہ کے لیے روانہ', time: '09:50 AM', completed: true },
        { titleEn: 'Arrival at Spot', titleUr: 'موقع پر پہنچ گئی', time: '10:05 AM', completed: true },
        { titleEn: 'Repair SOP Complete', titleUr: 'مرمت کا کام جاری ہے', time: 'In Progress', completed: false },
      ],
    },
    {
      id: 'SQUAD-KMC-04',
      reportId: 'KHI-1049',
      squadName: 'KMC Asphalt Road Repair Unit #04',
      category: 'Roads',
      vehicleNumber: 'KMC-RD-404 (Asphalt Paver)',
      driverName: 'Squad Lead Bilal Hassan',
      phone: '+92 333 4567890',
      targetLocation: 'Clifton Block 4 Boat Basin Drive',
      town: 'Clifton & DHA',
      status: 'Dispatched',
      etaMinutes: 18,
      currentCoords: [24.8350, 67.0450],
      targetCoords: [24.8211, 67.0322],
      dispatchTime: '10:30 AM',
      steps: [
        { titleEn: 'Dispatch Order Issued', titleUr: 'ڈسپیچ آرڈر جاری ہوا', time: '10:30 AM', completed: true },
        { titleEn: 'Team En Route to Site', titleUr: 'ٹیم جائے وقوعہ کے لیے روانہ', time: '10:32 AM', completed: false },
        { titleEn: 'Arrival at Spot', titleUr: 'موقع پر پہنچ گئی', time: 'Pending', completed: false },
        { titleEn: 'Repair SOP Complete', titleUr: 'مرمت کا کام مکمل', time: 'Pending', completed: false },
      ],
    },
    {
      id: 'SQUAD-SSWMB-12',
      reportId: 'KHI-7712',
      squadName: 'SSWMB Clean Karachi Fleet #12',
      category: 'Garbage',
      vehicleNumber: 'SS-KAR-120 (Compactor Truck)',
      driverName: 'Squad Chief Rahim Shah',
      phone: '+92 301 5551234',
      targetLocation: 'North Nazimabad Block H Market Dump',
      town: 'North Nazimabad',
      status: 'En Route',
      etaMinutes: 12,
      currentCoords: [24.9250, 67.0550],
      targetCoords: [24.9421, 67.0442],
      dispatchTime: '10:10 AM',
      steps: [
        { titleEn: 'Dispatch Order Issued', titleUr: 'ڈسپیچ آرڈر جاری ہوا', time: '10:10 AM', completed: true },
        { titleEn: 'Team En Route to Site', titleUr: 'ٹیم جائے وقوعہ کے لیے روانہ', time: '10:15 AM', completed: true },
        { titleEn: 'Arrival at Spot', titleUr: 'موقع پر پہنچ گئی', time: 'Pending', completed: false },
        { titleEn: 'Repair SOP Complete', titleUr: 'صفائی کا کام مکمل', time: 'Pending', completed: false },
      ],
    },
  ];

  const [squads, setSquads] = useState<TrackingSquad[]>(initialSquads);
  const [selectedSquadId, setSelectedSquadId] = useState<string>(initialSquads[0].id);

  const selectedSquad = squads.find(s => s.id === selectedSquadId) || squads[0];

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [24.8607, 67.0011],
        zoom: 13,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { attribution: '&copy; Esri, Maxar', maxZoom: 19 }
      ).addTo(map);

      L.tileLayer(
        'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, opacity: 0.8 }
      ).addTo(map);

      const layersGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Render vehicle markers, target markers, and route lines
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layers = layerGroupRef.current;
    if (!map || !layers) return;

    layers.clearLayers();

    squads.forEach((sq) => {
      const isSelected = sq.id === selectedSquadId;

      // Incident Target Marker
      const targetIconHtml = `
        <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
          <div style="background: #e11d48; border: 2px solid #ffffff; color: white; padding: 4px 8px; border-radius: 9999px; font-weight: 800; font-size: 11px; font-family: sans-serif; box-shadow: 0 4px 10px rgba(0,0,0,0.5); white-space: nowrap;">
            📍 ${sq.targetLocation.split(' ')[0]}
          </div>
        </div>
      `;
      const targetIcon = L.divIcon({
        className: 'target-marker',
        html: targetIconHtml,
        iconSize: [120, 30],
      });
      L.marker(sq.targetCoords, { icon: targetIcon }).addTo(layers);

      // Vehicle Moving Marker
      const vehicleHtml = `
        <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%); cursor: pointer;">
          <div style="background: ${isSelected ? '#3b82f6' : '#0f172a'}; border: 3px solid ${isSelected ? '#60a5fa' : '#334155'}; color: white; padding: 6px 12px; border-radius: 9999px; font-weight: 900; font-size: 12px; font-family: sans-serif; box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6); display: flex; align-items: center; gap: 6px; white-space: nowrap;">
            <span style="font-size: 15px;">🚒</span>
            <span>${sq.squadName}</span>
            <span style="background: #22c55e; color: black; padding: 1px 6px; border-radius: 4px; font-size: 10px;">${sq.etaMinutes > 0 ? `${sq.etaMinutes}m ETA` : 'ON SITE'}</span>
          </div>
          <div style="width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-top: 7px solid ${isSelected ? '#3b82f6' : '#0f172a'}; margin-top: -1px;"></div>
        </div>
      `;
      const vehicleIcon = L.divIcon({
        className: 'vehicle-marker',
        html: vehicleHtml,
        iconSize: [220, 40],
      });

      const vMarker = L.marker(sq.currentCoords, { icon: vehicleIcon }).addTo(layers);
      vMarker.on('click', () => setSelectedSquadId(sq.id));

      // Draw Route Polyline
      if (sq.currentCoords[0] !== sq.targetCoords[0] || sq.currentCoords[1] !== sq.targetCoords[1]) {
        L.polyline([sq.currentCoords, sq.targetCoords], {
          color: isSelected ? '#3b82f6' : '#64748b',
          weight: isSelected ? 5 : 2,
          opacity: isSelected ? 0.9 : 0.4,
          dashArray: isSelected ? '10, 10' : undefined,
        }).addTo(layers);
      }
    });

    // Zoom map to selected squad
    if (selectedSquad) {
      const bounds = L.latLngBounds([selectedSquad.currentCoords, selectedSquad.targetCoords]);
      map.flyToBounds(bounds, { padding: [80, 80], maxZoom: 15, animate: true });
    }
  }, [squads, selectedSquadId]);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Water': return <Droplet className="w-5 h-5 text-sky-400" />;
      case 'Electricity': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Roads': return <Car className="w-5 h-5 text-orange-400" />;
      default: return <Trash2 className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-blue-400">
              {language === 'ur' ? 'لائیو ٹیم جی پی ایس ٹریکنگ' : 'LIVE CREW ROUTE & GPS TRACKER'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            {language === 'ur' ? 'کراچی بلدیاتی ریپڈ اسکواڈز لائیو ٹریکر' : 'Karachi Municipal Squad Live Route Tracker'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'ur' 
              ? 'کراچی واٹر بورڈ، کے الیکٹرک، کے ایم سی اور سندھ سالڈ ویسٹ کی متحرک گاڑیوں اور ٹیموں کی لائیو لوکیشن اور ای ٹی اے' 
              : 'Real-time GPS tracking for dispatched municipal squads across Karachi with arrival countdowns'}
          </p>
        </div>

        {user?.role === 'Authority' ? (
          showHeaderTabs && (
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => navigate('/authority')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-black text-indigo-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 hover:bg-slate-800"
              >
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>{language === 'ur' ? 'ڈسپیچ اور لسٹ' : 'Dispatch Queue'}</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/map')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-black text-amber-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 hover:bg-slate-800"
              >
                <MapIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'ur' ? 'کراچی سیٹلائٹ ہیٹ میپ' : 'Live Heat Map'}</span>
              </button>

              <button
                type="button"
                className="px-3.5 py-1.5 rounded-xl text-xs font-black text-white bg-blue-600 shadow-md transition-all flex items-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>{language === 'ur' ? 'ٹیموں کی ٹریکنگ' : 'Live Crew Tracker'}</span>
              </button>
            </div>
          )
        ) : (
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto shadow-md"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>{language === 'ur' ? 'ہوم پیج پر واپس جائیں' : 'Back to Home Page'}</span>
          </button>
        )}
      </div>

      {/* Main Grid: Interactive Map + Squad Live Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Map View */}
        <div className="lg:col-span-7 bg-[#0a1122] rounded-3xl border-2 border-slate-700 overflow-hidden shadow-2xl flex flex-col h-[520px] relative">
          <div className="p-3.5 bg-[#080e1c] border-b border-slate-800 flex items-center justify-between z-10">
            <div className="flex items-center gap-2 text-xs font-extrabold text-white">
              <Truck className="w-4 h-4 text-blue-400 animate-bounce" />
              <span>{language === 'ur' ? 'سیٹلائٹ نقشہ جی پی ایس فیڈ' : 'Satellite GPS Live Map Feed'}</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              ● {language === 'ur' ? 'جی پی ایس متحرک ہے' : 'GPS Signal 100% Active'}
            </span>
          </div>

          <div ref={mapContainerRef} className="w-full h-full z-0 cursor-grab active:cursor-grabbing" />

          {/* Map Overlay Badge for Active Squad */}
          <div className="absolute bottom-4 left-4 right-4 z-[990] bg-[#070d1a]/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700 text-xs flex items-center justify-between gap-3 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/50 flex items-center justify-center font-bold">
                {getCategoryIcon(selectedSquad.category)}
              </div>
              <div>
                <h4 className="font-extrabold text-white text-xs sm:text-sm">{selectedSquad.squadName}</h4>
                <p className="text-[11px] text-slate-300">📍 {getTownName(selectedSquad.town, language)} • {selectedSquad.targetLocation}</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">{language === 'ur' ? 'تخمینہ وقت:' : 'Estimated ETA:'}</span>
              <span className="text-base font-black text-amber-400 font-mono">
                {selectedSquad.etaMinutes > 0 ? `${selectedSquad.etaMinutes} mins` : (language === 'ur' ? 'موقع پر موجود' : 'ARRIVED')}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Squad List & Detailed Inspector */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Squad Selector Tabs */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">
              {language === 'ur' ? 'فعال بلدیاتی ٹیمیں منتخب کریں:' : 'SELECT ACTIVE DISPATCHED CREW:'}
            </h3>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {squads.map((sq) => {
                const isSelected = sq.id === selectedSquadId;

                return (
                  <div
                    key={sq.id}
                    onClick={() => setSelectedSquadId(sq.id)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected 
                        ? 'bg-[#101c38] border-blue-500 shadow-lg shadow-blue-950/50 ring-1 ring-blue-500/50' 
                        : 'bg-[#0a1122] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-900 border border-slate-700 text-slate-300'
                      }`}>
                        {getCategoryIcon(sq.category)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-white">{sq.squadName}</span>
                          <span className="text-[10px] font-mono text-amber-400 font-bold">{sq.reportId}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          📍 {getTownName(sq.town, language)} • {sq.targetLocation.substring(0, 24)}...
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full block text-center ${
                        sq.status === 'Repair Underway' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {sq.status}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-300 block mt-1">
                        {sq.etaMinutes > 0 ? `ETA: ${sq.etaMinutes}m` : 'On Site'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Squad Detailed Card */}
          <div className="bg-[#0a1122] rounded-3xl border-2 border-blue-500/70 p-5 space-y-4 shadow-xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-blue-400 block">{selectedSquad.id}</span>
                <h3 className="text-base font-black text-white">{selectedSquad.squadName}</h3>
              </div>

              {/* Call Head of Crew is ONLY enabled for Authority Portal */}
              {user?.role === 'Authority' ? (
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedSquad.phone}`}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{language === 'ur' ? 'سربراہ کو کال کریں' : 'Call Head of Crew'}</span>
                  </a>
                </div>
              ) : (
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg bg-[#070d1a] text-blue-300 border border-slate-800">
                  {language === 'ur' ? 'جی پی ایس ٹریکنگ فعال' : 'GPS Tracking Active'}
                </span>
              )}
            </div>

            {/* Driver & Vehicle Details */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{language === 'ur' ? 'ڈرائیور / ٹیم سربراہ:' : 'Squad Lead:'}</span>
                <span className="font-extrabold text-white text-xs block mt-0.5">{selectedSquad.driverName}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{language === 'ur' ? 'سرکاری گاڑی نمبر:' : 'Vehicle Reg #:'}</span>
                <span className="font-mono font-extrabold text-amber-400 text-xs block mt-0.5">{selectedSquad.vehicleNumber}</span>
              </div>
            </div>

            {/* Step Timeline */}
            <div>
              <h4 className="text-xs font-black uppercase text-slate-300 mb-2 flex items-center justify-between">
                <span>{language === 'ur' ? 'پیش رفت کے مراحل' : 'DISPATCH STEP TIMELINE'}</span>
                <span className="text-[10px] font-mono text-slate-400">{selectedSquad.dispatchTime}</span>
              </h4>

              <div className="space-y-2 relative pl-3 border-l-2 border-slate-800">
                {selectedSquad.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start justify-between text-xs gap-2">
                    <div className="flex items-start gap-2">
                      <span className={`w-3 h-3 rounded-full shrink-0 mt-0.5 ${
                        step.completed ? 'bg-emerald-400 shadow-md shadow-emerald-400/50' : 'bg-slate-700'
                      }`} />
                      <span className={`font-semibold ${step.completed ? 'text-white' : 'text-slate-400'}`}>
                        {language === 'ur' ? step.titleUr : step.titleEn}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">{step.time}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export const LiveTrackingPage: React.FC = () => {
  const { language } = useApp();

  return (
    <div 
      dir={language === 'ur' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#070c18] text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white pb-16"
    >
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex-1 w-full">
        <LiveTrackingView showHeaderTabs={false} />
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 px-4 text-center border-t border-slate-800 text-xs text-slate-400">
        {language === 'ur'
          ? 'فکس مائی ایریا • کراچی کے لیے لائیو ٹیم اور روٹ ٹریکنگ سسٹم'
          : 'FixMyArea • Real-time Municipal Dispatch & Vehicle GPS Tracking System'}
      </footer>
    </div>
  );
};
