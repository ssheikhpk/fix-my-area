import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, OFFICIAL_KARACHI_CREWS } from '../context/AppContext';
import { 
  t, 
  getTownName, 
  getCategoryName, 
  getCrewName, 
  getReportTitle, 
  getReportDescription 
} from '../translations';
import { Report, IssueCategory } from '../types';
import { MapView } from '../components/MapView';
import { LiveTrackingView } from './LiveTrackingPage';
import { 
  Building2, 
  LogOut, 
  Globe, 
  Clock, 
  MapPin, 
  CheckCircle, 
  Upload, 
  Users, 
  Car, 
  Droplet, 
  Trash2, 
  Zap, 
  X, 
  Camera, 
  AlertTriangle, 
  Siren, 
  Flame, 
  ExternalLink,
  ShieldCheck,
  Search,
  Radio,
  HardHat,
  ArrowLeft,
  Truck,
  Map as MapIcon
} from 'lucide-react';
import { FeedbackModal } from '../components/FeedbackModal';

export const AuthorityDashboard: React.FC = () => {
  const { 
    user, 
    reports, 
    language, 
    toggleLanguage, 
    logoutUser, 
    assignCrew, 
    uploadProof, 
    markResolved, 
    triggerSlaBreach,
    setIsFeedbackModalOpen 
  } = useApp();

  const navigate = useNavigate();

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterTown, setFilterTown] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Active view tab in Authority Portal: Queue vs Integrated Satellite HeatMap vs Live Crew Tracker
  const [activeTab, setActiveTab] = useState<'queue' | 'heatmap' | 'tracking'>('queue');

  // Crew Assignment state
  const [activeAssignReport, setActiveAssignReport] = useState<Report | null>(null);
  const [selectedCrewName, setSelectedCrewName] = useState<string>(OFFICIAL_KARACHI_CREWS[0].name);

  // Proof upload modal state
  const [activeProofReport, setActiveProofReport] = useState<Report | null>(null);
  const [proofImageUrl, setProofImageUrl] = useState<string>('');
  const [proofNoteText, setProofNoteText] = useState<string>('');

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const formatTimer = (totalSeconds: number) => {
    if (totalSeconds <= 0) return '00h 00m 00s';
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  const getCategoryIcon = (category: IssueCategory) => {
    switch (category) {
      case 'Roads': return <Car className="w-4 h-4 text-amber-400" />;
      case 'Garbage': return <Trash2 className="w-4 h-4 text-emerald-400" />;
      case 'Water': return <Droplet className="w-4 h-4 text-sky-400" />;
      case 'Electricity': return <Zap className="w-4 h-4 text-violet-400" />;
    }
  };

  const filteredQueue = reports.filter((r) => {
    if (filterCategory !== 'All' && r.category !== filterCategory) return false;
    if (filterTown !== 'All' && r.karachiTown !== filterTown) return false;
    if (filterStatus === 'Breached') {
      return r.status !== 'Resolved' && r.slaRemainingSeconds === 0;
    }
    if (filterStatus === 'Emergency') {
      return r.isEmergency === true;
    }
    if (filterStatus !== 'All' && r.status !== filterStatus) return false;
    return true;
  });

  const handleAssignCrewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignReport || !selectedCrewName) return;
    assignCrew(activeAssignReport.id, selectedCrewName);
    setActiveAssignReport(null);
  };

  const handleProofSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProofReport) return;
    uploadProof(
      activeProofReport.id,
      proofImageUrl || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80',
      proofNoteText || (language === 'ur' ? 'مرمت مکمل کر کے سرکاری معیار کے مطابق تصدیق کی گئی۔' : 'Field repairs executed and verified according to KMC/KW&SB standard operating procedures.')
    );
    markResolved(activeProofReport.id);
    setActiveProofReport(null);
    setProofImageUrl('');
    setProofNoteText('');
  };

  // Metrics
  const breachedCount = reports.filter(r => r.status !== 'Resolved' && r.slaRemainingSeconds === 0).length;
  const emergencyCount = reports.filter(r => r.isEmergency && r.status !== 'Resolved').length;
  const pendingCount = reports.filter(r => r.status === 'Submitted').length;
  const inProgressCount = reports.filter(r => r.status === 'In Progress').length;
  const resolvedCount = reports.filter(r => r.status === 'Resolved').length;

  return (
    <div 
      dir={language === 'ur' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#070c18] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white pb-24"
    >
      
      {/* FEATURE 2: AUTHORITY DASHBOARD TOP NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#0a1122]/95 backdrop-blur-md border-b border-indigo-900/60 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Title & Badge */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                  <span>{t('authorityPortalTitle', language)}</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold hidden sm:inline">
                    {language === 'ur' ? 'کراچی انتظامیہ' : 'Internal Official'}
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  {language === 'ur' ? 'کراچی بلدیاتی افسران کے لیے خصوصی کنسول' : 'Municipal SLA & Emergency Dispatch Console for Karachi'}
                </p>
              </div>
            </div>

            {/* Unified Top Navigation Tabs: Dispatch Queue | Satellite Heat Map | Live Crew Tracker */}
            <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700/80 shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab('queue')}
                className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 ${
                  activeTab === 'queue' ? 'bg-indigo-600 text-white shadow-md ring-1 ring-indigo-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{language === 'ur' ? 'ڈسپیچ اور لسٹ' : 'Dispatch Queue'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('heatmap')}
                className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 ${
                  activeTab === 'heatmap' ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold ring-1 ring-amber-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>{language === 'ur' ? 'ہیٹ میپ' : 'Satellite Heat Map'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tracking')}
                className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 ${
                  activeTab === 'tracking' ? 'bg-blue-600 text-white shadow-md ring-1 ring-blue-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Truck className="w-3.5 h-3.5 text-blue-400" />
                <span>{language === 'ur' ? 'لائیو ٹریکنگ' : 'Live Crew Tracker'}</span>
              </button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3">

              <button
                type="button"
                onClick={toggleLanguage}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'en' ? 'اردو' : 'EN'}</span>
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t('logout', language)}</span>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 flex-1 w-full">
        
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
          
          <div className="bg-[#0b1326] p-4 rounded-2xl border border-red-500/50 shadow-md">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-400 flex items-center gap-1">
              <Siren className="w-4 h-4 animate-pulse" />
              <span>{language === 'ur' ? '۱۰ منٹ ایمرجنسی' : '10-Min Emergencies'}</span>
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-black text-red-400">{emergencyCount}</span>
              <span className="text-[10px] bg-red-600 text-white font-mono font-bold px-2 py-0.5 rounded-md animate-pulse">
                {language === 'ur' ? 'فوری حل' : 'PRIORITY'}
              </span>
            </div>
          </div>

          <div className="bg-[#140a18] p-4 rounded-2xl border border-rose-800 shadow-md">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400 flex items-center gap-1">
              <Flame className="w-4 h-4" />
              <span>{t('escalatedBreachesMetric', language)}</span>
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-black text-rose-500">{breachedCount}</span>
              <span className="text-[10px] bg-rose-500/25 text-rose-300 font-mono font-bold px-2 py-0.5 rounded-md border border-rose-500/40">
                {language === 'ur' ? 'وقت ختم' : 'Overdue'}
              </span>
            </div>
          </div>

          <div className="bg-[#0b1326] p-4 rounded-2xl border border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              {language === 'ur' ? 'عملہ درکار ہے' : 'Needs Crew'}
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-black text-amber-400">{pendingCount}</span>
              <span className="text-[10px] bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30 font-semibold">
                {language === 'ur' ? 'زیر التواء' : 'Pending'}
              </span>
            </div>
          </div>

          <div className="bg-[#0b1326] p-4 rounded-2xl border border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              {language === 'ur' ? 'عملہ روانہ ہے' : 'Crew Active'}
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-black text-indigo-400">{inProgressCount}</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-500/30 font-semibold">
                {language === 'ur' ? 'متحرک' : 'En Route'}
              </span>
            </div>
          </div>

          <div className="bg-[#0b1326] p-4 rounded-2xl border border-slate-700 col-span-2 lg:col-span-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              {t('verifiedClosedMetric', language)}
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-black text-emerald-400">{resolvedCount}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/30 font-semibold">
                {language === 'ur' ? 'حل شدہ' : 'Closed'}
              </span>
            </div>
          </div>

        </div>

        {/* TAB TOGGLE BAR FOR MOBILE / TABLET */}
        <div className="flex md:hidden items-center justify-between gap-2 p-1.5 bg-[#0a1122] rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('queue')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'queue' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            {language === 'ur' ? 'ڈسپیچ اور لسٹ' : 'Dispatch & Queue'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('heatmap')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'heatmap' ? 'bg-amber-500 text-black' : 'text-slate-400'
            }`}
          >
            {language === 'ur' ? 'ہیٹ میپ' : 'Heat Map'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tracking')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'tracking' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            {language === 'ur' ? 'ٹریکنگ' : 'Tracker'}
          </button>
        </div>

        {/* EMBEDDED LIVE TRACKER SECTION (WHEN TRACKING TAB IS SELECTED) */}
        {activeTab === 'tracking' && (
          <section className="bg-[#0a1122] rounded-3xl border-2 border-blue-500/80 p-4 sm:p-6 shadow-2xl space-y-4">
            <LiveTrackingView showHeaderTabs={false} />
          </section>
        )}

        {/* EMBEDDED HEAT MAP SECTION (WHEN HEATMAP TAB IS SELECTED OR ACCESSED) */}
        {activeTab === 'heatmap' && (
          <section className="bg-[#0a1122] rounded-3xl border-2 border-amber-500/80 p-4 sm:p-5 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-black text-white">
                  {language === 'ur' ? 'کراچی ریپڈ بلدیاتی ہیٹ میپ اور سیٹلائٹ ویو' : 'Karachi Municipal Heat Map & Satellite GIS View'}
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {language === 'ur' ? 'حقیقی فضائی ڈیٹا بذریعہ Esri Satellite' : 'Live Esri Aerial Imagery Data Feed'}
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-700 h-[580px]">
              <MapView />
            </div>
          </section>
        )}

        {/* QUEUE & CREW DISPATCH SECTION */}
        {activeTab === 'queue' && (
          <>
            {/* PROMINENT CREW DISPATCH CONTROL PANE */}
            <section className="bg-gradient-to-r from-[#0d162d] via-[#0e1933] to-[#0c1429] rounded-3xl border-2 border-indigo-500/60 p-5 sm:p-6 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-900/60">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-600/40 ring-2 ring-indigo-400/50">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <span>{language === 'ur' ? 'کراچی ریپڈ ریسپانس عملہ ڈسپیچ ٹرمینل' : 'Official Karachi Rapid Crew Dispatch Terminal'}</span>
                      <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                        ● {language === 'ur' ? 'ڈسپیچ فعال ہے' : 'Live Dispatch Active'}
                      </span>
                    </h2>
                    <p className="text-xs text-indigo-200">
                      {language === 'ur' 
                        ? 'کے ایم سی، واٹر بورڈ، کے الیکٹرک اور سندھ سالڈ ویسٹ بورڈ کی نامزد ٹیمیں' 
                        : 'Government municipal units deployed across KMC, KW&SB, K-Electric and SSWMB zones'}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-indigo-300 font-bold bg-indigo-950/90 px-3.5 py-1.5 rounded-xl border border-indigo-600/50 self-start sm:self-auto">
                  {language === 'ur' ? 'کل ٹیمیں: ۶ رجسٹرڈ یونٹس' : 'Total Squads: 6 Registered Units'}
                </div>
              </div>

              {/* Grid of Official Karachi Municipal Crews */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {OFFICIAL_KARACHI_CREWS.map((crew) => {
                  const assignedCount = reports.filter(r => r.assignedCrew === crew.name && r.status === 'In Progress').length;
                  const isDeployed = assignedCount > 0;

                  return (
                    <div
                      key={crew.id}
                      className={`p-4 rounded-2xl border-2 transition-all shadow-md ${
                        isDeployed 
                          ? 'bg-[#101b38] border-indigo-500 ring-1 ring-indigo-500/40 shadow-indigo-950/50' 
                          : 'bg-[#0a1224] border-slate-700/80 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                          crew.dept === 'Electricity' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                          crew.dept === 'Water' ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' :
                          crew.dept === 'Roads' ? 'bg-orange-500/20 text-orange-300 border-orange-500/40' :
                          'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {getCategoryName(crew.dept, language)}
                        </span>

                        <span className={`text-[10px] font-mono font-bold flex items-center gap-1.5 px-2 py-0.5 rounded-full ${
                          isDeployed ? 'bg-indigo-500/25 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${isDeployed ? 'bg-indigo-400 animate-pulse' : 'bg-emerald-400'}`} />
                          <span>{isDeployed ? `${assignedCount} ${language === 'ur' ? 'فعال کام' : 'Active Case'}` : (language === 'ur' ? 'حاضر و تیار' : 'On Standby')}</span>
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-white leading-snug mb-1">
                        {getCrewName(crew.name, language)}
                      </h4>

                      <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{language === 'ur' ? 'علاقہ:' : 'Coverage:'} <strong className="text-slate-100">{getTownName(crew.coverage, language)}</strong></span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Smart Queue Table Card */}
            <div className="bg-[#0a1122] rounded-3xl border-2 border-slate-700/90 shadow-2xl overflow-hidden p-5 space-y-4">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                    <span>{t('smartQueueTitle', language)}</span>
                    <span className="text-xs bg-slate-900 text-amber-400 border border-slate-700 px-2.5 py-0.5 rounded-full font-bold">
                      {filteredQueue.length} {language === 'ur' ? 'شکایات' : 'Active Issues'}
                    </span>
                  </h2>
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <select
                    value={filterTown}
                    onChange={(e) => setFilterTown(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="All">{t('allTowns', language)}</option>
                    <option value="Clifton & DHA">{getTownName('Clifton & DHA', language)}</option>
                    <option value="Saddar">{getTownName('Saddar', language)}</option>
                    <option value="Gulshan-e-Iqbal">{getTownName('Gulshan-e-Iqbal', language)}</option>
                    <option value="North Nazimabad">{getTownName('North Nazimabad', language)}</option>
                    <option value="Korangi">{getTownName('Korangi', language)}</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="All">{t('allStatuses', language)}</option>
                    <option value="Emergency">{t('onlyEmergency', language)}</option>
                    <option value="Submitted">{t('submitted', language)}</option>
                    <option value="In Progress">{t('inProgress', language)}</option>
                    <option value="Breached">{t('onlyBreached', language)}</option>
                    <option value="Resolved">{t('resolved', language)}</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-700">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#070d1a] text-slate-300 uppercase text-[11px] font-black tracking-wider border-b border-slate-700">
                    <tr>
                      <th scope="col" className="py-3.5 px-4">{t('issueType', language)}</th>
                      <th scope="col" className="py-3.5 px-4">{t('location', language)}</th>
                      <th scope="col" className="py-3.5 px-4">{t('slaRemaining', language)}</th>
                      <th scope="col" className="py-3.5 px-4">{t('status', language)}</th>
                      <th scope="col" className="py-3.5 px-4 text-right">{t('action', language)}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredQueue.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 font-semibold">
                          {t('noReportsYet', language)}
                        </td>
                      </tr>
                    ) : (
                      filteredQueue.map((report) => {
                        const isBreached = report.status !== 'Resolved' && report.slaRemainingSeconds === 0;

                        return (
                          <tr
                            key={report.id}
                            className={`transition-colors duration-150 ${
                              report.isEmergency && report.status !== 'Resolved'
                                ? 'bg-red-950/50 text-red-100 border-l-4 border-l-red-500 hover:bg-red-950/70'
                                : isBreached
                                ? 'bg-rose-950/60 text-rose-100 font-semibold border-l-4 border-l-rose-600 hover:bg-rose-950/80'
                                : report.status === 'Resolved'
                                ? 'bg-emerald-950/20 text-slate-300 hover:bg-emerald-950/30'
                                : 'bg-[#0a1122] hover:bg-[#0e172e] text-slate-100'
                            }`}
                          >
                            {/* 1. Issue Type */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                                  report.isEmergency
                                    ? 'bg-red-600 text-white shadow-red-600/40'
                                    : 'bg-slate-900 border border-slate-700 text-white'
                                }`}>
                                  {report.isEmergency ? <Siren className="w-5 h-5 text-white animate-pulse" /> : getCategoryIcon(report.category)}
                                </div>
                                <div>
                                  <div className="font-extrabold text-white text-sm">
                                    {getReportTitle(report.title || '', language)}
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                                    <span className="font-mono text-amber-400 font-bold">{report.id}</span>
                                    <span>•</span>
                                    <span className="text-slate-300">{getCategoryName(report.category, language)}</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* 2. Location */}
                            <td className="py-4 px-4">
                              <div className="flex items-start gap-1.5 text-xs">
                                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold text-white text-xs block">{getTownName(report.karachiTown, language)}</span>
                                  <span className="text-xs text-slate-300 line-clamp-1">{report.location}</span>
                                </div>
                              </div>
                            </td>

                            {/* 3. SLA Time Remaining */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Clock className={`w-4 h-4 ${isBreached ? 'text-rose-400 animate-bounce' : 'text-slate-400'}`} />
                                <span className={`font-mono text-xs font-black px-2.5 py-1 rounded-lg ${
                                  report.status === 'Resolved'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                    : isBreached
                                    ? 'bg-rose-600 text-white font-black animate-pulse'
                                    : report.isEmergency
                                    ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                                    : 'bg-slate-900 text-amber-400 border border-slate-700'
                                }`}>
                                  {report.status === 'Resolved'
                                    ? (language === 'ur' ? '✓ تصدیق شدہ حل' : 'Verified Resolved')
                                    : formatTimer(report.slaRemainingSeconds)}
                                </span>
                              </div>
                            </td>

                            {/* 4. Status with PROMINENT VISIBLE CREW BADGE */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="space-y-1.5">
                                {isBreached ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-md animate-pulse">
                                    <span>{t('slaBreached', language)}</span>
                                  </span>
                                ) : report.status === 'Resolved' ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span>{t('resolved', language)}</span>
                                  </span>
                                ) : report.status === 'In Progress' ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                                    <HardHat className="w-3.5 h-3.5 text-indigo-400" />
                                    <span>{t('inProgress', language)}</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                    <span>{t('submitted', language)}</span>
                                  </span>
                                )}

                                {report.assignedCrew && (
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-950 border border-indigo-500 text-white font-extrabold text-[11px] shadow-sm">
                                    <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                    <span className="truncate max-w-[170px]">{getCrewName(report.assignedCrew || '', language)}</span>
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* 5. Actions Flow */}
                            <td className="py-4 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2">
                                {report.status === 'Submitted' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveAssignReport(report);
                                      setSelectedCrewName(OFFICIAL_KARACHI_CREWS[0].name);
                                    }}
                                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-1.5"
                                  >
                                    <Users className="w-3.5 h-3.5" />
                                    <span>{t('assignCrew', language)}</span>
                                  </button>
                                )}

                                {report.status === 'In Progress' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveProofReport(report);
                                      setProofImageUrl('https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80');
                                      setProofNoteText(language === 'ur' ? 'مرمت مکمل کر کے کے ایم سی معیار کے مطابق تصدیق کی گئی۔' : 'Field repairs executed and verified according to KMC/KW&SB standard operating procedures.');
                                    }}
                                    className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/30 transition-all cursor-pointer flex items-center gap-1.5"
                                  >
                                    <Camera className="w-3.5 h-3.5" />
                                    <span>{t('uploadProof', language)}</span>
                                  </button>
                                )}

                                {report.status !== 'Resolved' && (
                                  <button
                                    type="button"
                                    onClick={() => markResolved(report.id)}
                                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all cursor-pointer flex items-center gap-1.5"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span>{t('markResolved', language)}</span>
                                  </button>
                                )}

                                {report.status === 'Resolved' && (
                                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>{language === 'ur' ? 'حل شدہ اور بند' : 'Closed & Verified'}</span>
                                  </span>
                                )}
                              </div>
                            </td>

                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </>
        )}

      </main>

      {/* MODAL: Assign Official Karachi Crew */}
      {activeAssignReport && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1324] border-2 border-indigo-500 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-white animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-base">{t('assignCrew', language)}</h3>
              </div>
              <button 
                onClick={() => setActiveAssignReport(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignCrewSubmit} className="space-y-4 pt-4">
              <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-700 text-xs">
                <span className="text-amber-400 font-mono font-bold">{activeAssignReport.id}</span>
                <p className="text-white font-bold mt-0.5 text-sm">{getReportTitle(activeAssignReport.title || '', language)}</p>
                <p className="text-slate-300 mt-1">📍 {getTownName(activeAssignReport.karachiTown, language)} • {activeAssignReport.location}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-2">
                  {t('selectCrewPrompt', language)}:
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {OFFICIAL_KARACHI_CREWS.map((crew) => (
                    <label
                      key={crew.id}
                      onClick={() => setSelectedCrewName(crew.name)}
                      className={`flex items-start gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                        selectedCrewName === crew.name
                          ? 'bg-indigo-950 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="crewSelect"
                        checked={selectedCrewName === crew.name}
                        onChange={() => setSelectedCrewName(crew.name)}
                        className="mt-1 text-indigo-600 focus:ring-0"
                      />
                      <div className="flex-1 text-xs">
                        <span className="font-extrabold text-white block text-xs sm:text-sm">{getCrewName(crew.name, language)}</span>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                          <span className="text-indigo-300 font-semibold">{getCategoryName(crew.dept, language)}</span>
                          <span>•</span>
                          <span>{language === 'ur' ? 'علاقہ:' : 'Coverage:'} {getTownName(crew.coverage, language)}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveAssignReport(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-300 hover:text-white cursor-pointer"
                >
                  {t('cancel', language)}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-lg shadow-indigo-600/40 cursor-pointer"
                >
                  {language === 'ur' ? 'ڈسپیچ کی تصدیق کریں' : 'Confirm Karachi Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Upload Proof of Work */}
      {activeProofReport && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1324] border-2 border-sky-500 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-white animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-base">{t('uploadProof', language)}</h3>
              </div>
              <button 
                onClick={() => setActiveProofReport(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProofSubmit} className="space-y-4 pt-4">
              <div className="text-xs text-slate-300">
                Ticket <span className="text-white font-mono font-bold">{activeProofReport.id}</span>: {getReportTitle(activeProofReport.title || '', language)}
              </div>

              <div className="border border-dashed border-slate-600 rounded-2xl p-4 text-center bg-slate-900/80">
                {proofImageUrl ? (
                  <div className="relative rounded-xl overflow-hidden h-36 max-w-sm mx-auto border border-slate-600">
                    <img src={proofImageUrl} alt="Proof" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="py-4 text-slate-300 text-xs">
                    {language === 'ur' ? 'مرمت کی تصدیقی تصویر کا انتخاب کریں' : 'Choose verified repair verification photo'}
                  </div>
                )}

                <div className="mt-3 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setProofImageUrl('https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80')}
                    className="text-[11px] bg-slate-800 hover:bg-slate-700 text-sky-300 px-3 py-1 rounded-lg border border-slate-600 cursor-pointer font-bold"
                  >
                    {language === 'ur' ? 'تصویر ۱ (سڑک مرمت)' : 'Use Cleared Street Photo #1'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setProofImageUrl('https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=600&q=80')}
                    className="text-[11px] bg-slate-800 hover:bg-slate-700 text-emerald-300 px-3 py-1 rounded-lg border border-slate-600 cursor-pointer font-bold"
                  >
                    {language === 'ur' ? 'تصویر ۲ (کیبل مرمت)' : 'Use Fixed Cable Photo #2'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  {language === 'ur' ? 'فیلڈ معائنہ اور تصدیقی نوٹس:' : 'Field Inspection Notes:'}
                </label>
                <textarea
                  rows={2}
                  value={proofNoteText}
                  onChange={(e) => setProofNoteText(e.target.value)}
                  placeholder={language === 'ur' ? 'مثال: کے الیکٹرک یا واٹر بورڈ کی ٹیم نے خرابی درست کر کے تصدیق کی ہے۔' : 'e.g. Line isolated and replaced by K-Electric / KW&SB team. Certified.'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveProofReport(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-300 hover:text-white"
                >
                  {t('cancel', language)}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {language === 'ur' ? 'منسلک کریں اور تصدیق کریں' : 'Attach & Verify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <FeedbackModal />
    </div>
  );
};
