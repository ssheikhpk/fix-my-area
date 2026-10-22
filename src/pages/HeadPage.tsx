import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../translations';
import { Navbar } from '../components/Navbar';
import { ReportModal } from '../components/ReportModal';
import { Chatbot } from '../components/Chatbot';
import { MapView } from '../components/MapView';
import { FeedbackModal } from '../components/FeedbackModal';
import { 
  FileText, 
  Bot, 
  MapPin, 
  Clock, 
  Trophy, 
  Building2, 
  ArrowRight, 
  Sparkles, 
  CheckCircle, 
  Camera, 
  AlertTriangle,
  Flame,
  ShieldCheck,
  Siren,
  X,
  Users
} from 'lucide-react';

export const HeadPage: React.FC = () => {
  const { reports, language, setIsReportModalOpen, triggerSlaBreach } = useApp();
  const navigate = useNavigate();

  // Modal states for features inside the cards
  const [activeFeatureModal, setActiveFeatureModal] = useState<'none' | 'heatmap' | 'slaClocks' | 'leaderboard'>('none');

  const formatTimer = (totalSeconds: number) => {
    if (totalSeconds <= 0) return '00h 00m 00s';
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  // Metrics
  const activeTicketsCount = reports.filter(r => r.status !== 'Resolved').length;
  const verifiedRepairsCount = reports.filter(r => r.status === 'Resolved').length;
  const breachedCount = reports.filter(r => r.status !== 'Resolved' && r.slaRemainingSeconds === 0).length;

  return (
    <div className="min-h-screen bg-[#070c18] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Bar matching screenshot */}
      <Navbar />

      {/* SECTION 1: HERO HEADER (Matching image_8079dafb.png) */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center overflow-hidden">
        
        {/* Glowing aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/15 blur-[140px] rounded-full pointer-events-none" />

        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-semibold shadow-lg mb-8">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-200">
            {language === 'ur' ? 'کراچی بلدیاتی خدمات کی لائیو مانیٹرنگ' : 'Guaranteed Closed-Loop Municipal Tracking'}
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-amber-400 font-bold">
            {language === 'ur' ? 'صفر گمشدہ شکایات' : 'Zero Disappearing Reports'}
          </span>
        </div>

        {/* Hero Title with bright vivid contrast */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          {language === 'ur' ? (
            <>
              جہاں شہری شکایات سرکاری <span className="text-amber-400 drop-shadow">فائلوں میں گم</span> <span className="text-orange-500">نہیں ہوتیں۔</span>
            </>
          ) : (
            <>
              Where civic reports don’t disappear into a{' '}
              <span className="text-amber-400 drop-shadow-md">bureaucratic</span>{' '}
              <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-rose-500 bg-clip-text text-transparent">
                void.
              </span>
            </>
          )}
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-5 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {language === 'ur'
            ? 'فکس مائی ایریا کراچی کی انتظامیہ کو جوابدہ بناتا ہے۔ ہر گڑھا، پانی کا رساؤ، اور بجلی کا خطرہ لائیو الٹی گنتی کے وقت کے تحت فوری حل کیا جاتا ہے۔'
            : 'FixMyArea holds municipal authorities accountable. Every reported pothole, water leak, and hazard is governed by a live countdown clock that auto-escalates to senior officials if breached.'}
        </p>

        {/* Action Buttons matching image_8079dafb.png */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => {
              const el = document.getElementById('civic-features-hub');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-amber-500/30 active:scale-95 transition-all cursor-pointer"
          >
            <span>{language === 'ur' ? 'فکس مائی ایریا ہوم پیج پر جائیں' : 'Enter FixMyArea Home Page'}</span>
            <ArrowRight className="w-4 h-4 text-slate-950 stroke-[3]" />
          </button>

          <button
            onClick={() => navigate('/login?role=Citizen')}
            className="px-6 py-3.5 rounded-2xl bg-[#0f172a] hover:bg-slate-800 border border-slate-600 text-sm font-bold text-white transition-all cursor-pointer shadow-md"
          >
            {t('citizenSignIn', language)}
          </button>
        </div>

        {/* 4 Metrics Cards Row (Matching image_8079dafb.png) */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
          
          <div className="bg-[#0b1224] p-4 sm:p-5 rounded-2xl border border-slate-700/80 shadow-md">
            <span className="text-2xl sm:text-3xl font-extrabold text-white block">
              {activeTicketsCount}
            </span>
            <span className="text-xs text-slate-300 font-medium mt-1 block">
              Active Tickets on Clock
            </span>
          </div>

          <div className="bg-[#0b1224] p-4 sm:p-5 rounded-2xl border border-slate-700/80 shadow-md">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 block">
              20
            </span>
            <span className="text-xs text-slate-300 font-medium mt-1 block">
              Closed-Loop Verified
            </span>
          </div>

          <div className="bg-[#0b1224] p-4 sm:p-5 rounded-2xl border border-slate-700/80 shadow-md">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 block">
              &lt; 30s
            </span>
            <span className="text-xs text-slate-300 font-medium mt-1 block">
              Average Report Speed
            </span>
          </div>

          <div className="bg-[#140a18] p-4 sm:p-5 rounded-2xl border border-rose-800/80 shadow-lg shadow-rose-950/40">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-500 block flex items-center gap-1.5">
              <span>🔥</span>
              <span>{breachedCount}</span>
            </span>
            <span className="text-xs text-rose-300 font-semibold mt-1 block">
              Auto-Escalated Breaches
            </span>
          </div>

        </div>
      </section>

      {/* SECTION 2: HOW CIVIC ACCOUNTABILITY WORKS (Matching image_8ebc1f59.png) */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-800/80">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {language === 'ur' ? 'شہری نظام کس طرح جوابدہ کام کرتا ہے' : 'How Civic Accountability Works'}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            {language === 'ur'
              ? 'چار خودکار اقدامات جو مکمل شفافیت کو یقینی بناتے ہیں۔'
              : 'Four automated steps ensuring total transparency from incident to verified repair.'}
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="bg-[#0a1122] p-6 rounded-3xl border border-slate-700/80 flex flex-col justify-between shadow-lg">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-sm">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                1. Direct & AI-Assisted Reporting
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Report issues via text details or camera snapshots. Gemini AI auto-fills urgency and determines the municipal department, while GPS clustering prevents duplicate spam.
              </p>
            </div>
          </div>

          <div className="bg-[#0a1122] p-6 rounded-3xl border border-slate-700/80 flex flex-col justify-between shadow-lg">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-sm">
                <Clock className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                2. Immutable SLA Countdown
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every hazard has a category deadline (10m to 6h). Countdown timers cannot be cleared or hidden. If breached, the system auto-escalates directly to senior city leadership.
              </p>
            </div>
          </div>

          <div className="bg-[#0a1122] p-6 rounded-3xl border border-slate-700/80 flex flex-col justify-between shadow-lg">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-sm">
                <Camera className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                3. Proof-of-Work Verification
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                City workers upload after-repair photos. Citizens inspect before/after imagery and sign off to permanently close the loop and claim +100 Civic Points.
              </p>
            </div>
          </div>

        </div>

        {/* Full Transparency Banner */}
        <div className="mt-6 p-6 rounded-3xl bg-[#0b1324] border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div>
            <h4 className="text-base font-bold text-white">Full Transparency & Real-Time Tracking</h4>
            <p className="text-xs text-slate-300 mt-1">
              All features—Live Map, Direct Report, AI Chatbot, and SLA Board—are accessible directly on the Home Page.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-600 text-xs font-bold text-emerald-400 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>SLA Engine Active</span>
          </div>
        </div>
      </section>

      {/* SECTION 3: 6 CIVIC FEATURE LAUNCH CARDS (Matching image_ed701a82.png) */}
      <section id="civic-features-hub" className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-800/80">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Active SLA Clock: <strong className="text-white">{activeTicketsCount} Tickets</strong></span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-200">
            <span>Verified Repairs: <strong className="text-emerald-400">20 Closed</strong></span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800 text-xs text-rose-300">
            <span>🔥 <strong className="text-white">{breachedCount} Breached & Auto-Escalated</strong></span>
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-300">
              SELECT A CIVIC FEATURE TO LAUNCH:
            </h2>
          </div>
          <span className="text-xs text-amber-400/90 font-medium hidden sm:inline">
            Each feature opens its own dedicated screen
          </span>
        </div>

        {/* 6 Feature Launch Cards Grid with High-Contrast Vivid Borders & Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Card 1: Direct Report (Written & Photo) */}
          <div
            onClick={() => setIsReportModalOpen(true)}
            className="group bg-[#0a1122] hover:bg-[#0e172e] rounded-3xl p-6 border-2 border-amber-500/90 hover:border-amber-400 transition-all cursor-pointer shadow-xl shadow-amber-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/30">
                  <FileText className="w-6 h-6 text-slate-950" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500 text-black">
                    DIRECT SUBMISSION
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700">
                    &lt; 30S REPORT
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-extrabold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span>Direct Report (Written & Photo)</span>
                <ArrowRight className="w-4 h-4 opacity-80 group-hover:translate-x-1 transition-transform" />
              </h3>

              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Write description details, upload device camera photos, and use AI auto-triage to file directly into the municipal queue.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-400">
              <span>Open Direct Report Form</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 2: AI Civic Chatbot Assistant */}
          <div
            onClick={() => {
              const btn = document.querySelector('button[title="Chat Assistant"]') as HTMLButtonElement;
              btn?.click();
            }}
            className="group bg-[#0a1122] hover:bg-[#0e172e] rounded-3xl p-6 border-2 border-purple-500/80 hover:border-purple-400 transition-all cursor-pointer shadow-xl shadow-purple-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/25 text-purple-300 border border-purple-500/50 flex items-center justify-center font-bold shadow-md shadow-purple-500/20">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-500 text-white">
                    AI POWERED
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700">
                    GEMINI 3.8 FLASH
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-extrabold text-white group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                <span>AI Civic Chatbot Assistant</span>
                <ArrowRight className="w-4 h-4 opacity-80 group-hover:translate-x-1 transition-transform" />
              </h3>

              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Converse in natural language to analyze hazard risks, check SLA response hours, and file structured tickets straight from chat.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-purple-400">
              <span>Start AI Civic Chat</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 3: Live Public Heatmap (NOW OPENS DEDICATED SCREEN INSIDE CARD) */}
          <div
            onClick={() => setActiveFeatureModal('heatmap')}
            className="group bg-[#0a1122] hover:bg-[#0e172e] rounded-3xl p-6 border-2 border-sky-500/70 hover:border-sky-400 transition-all cursor-pointer shadow-xl shadow-sky-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center font-bold shadow-md shadow-sky-500/20">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-sky-950 text-sky-300 border border-sky-800">
                  LIVE GIS PINS
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-white group-hover:text-sky-300 transition-colors flex items-center gap-1.5">
                <span>Live Public Heatmap</span>
                <ArrowRight className="w-4 h-4 opacity-80 group-hover:translate-x-1 transition-transform" />
              </h3>

              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Full-screen interactive map with color-coded SLA markers (Red = Breached, Amber = &lt;4h), and hotspot density rings.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-sky-400">
              <span>Launch Interactive Map</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 4: SLA Clocks & Breaches (NOW OPENS DEDICATED SCREEN INSIDE CARD) */}
          <div
            onClick={() => setActiveFeatureModal('slaClocks')}
            className="group bg-[#0a1122] hover:bg-[#0e172e] rounded-3xl p-6 border-2 border-rose-500/70 hover:border-rose-400 transition-all cursor-pointer shadow-xl shadow-rose-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center font-bold shadow-md shadow-rose-500/20">
                  <Clock className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-950 text-rose-300 border border-rose-800">
                  AUTO-ESCALATION
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-white group-hover:text-rose-400 transition-colors flex items-center gap-1.5">
                <span>SLA Clocks & Breaches</span>
                <ArrowRight className="w-4 h-4 opacity-80 group-hover:translate-x-1 transition-transform" />
              </h3>

              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Active countdown timers for potholes, water leaks, and signals. Missed deadlines auto-escalate to Senior Officials.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-rose-400">
              <span>Inspect SLA Clocks</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 5: Leaderboard & Badges (NOW OPENS DEDICATED SCREEN INSIDE CARD) */}
          <div
            onClick={() => setActiveFeatureModal('leaderboard')}
            className="group bg-[#0a1122] hover:bg-[#0e172e] rounded-3xl p-6 border-2 border-emerald-500/70 hover:border-emerald-400 transition-all cursor-pointer shadow-xl shadow-emerald-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
                  <Trophy className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
                  COMMUNITY POINTS
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <span>Leaderboard & Badges</span>
                <ArrowRight className="w-4 h-4 opacity-80 group-hover:translate-x-1 transition-transform" />
              </h3>

              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Track neighborhood guardians earning Civic Points for filing verified reports (+50) and validating proof-of-work (+100).
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>View Leaderboard</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 6: City Authority Command */}
          <div
            onClick={() => navigate('/authority')}
            className="group bg-[#0a1122] hover:bg-[#0e172e] rounded-3xl p-6 border-2 border-indigo-500/70 hover:border-indigo-400 transition-all cursor-pointer shadow-xl shadow-indigo-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/25 text-indigo-300 border border-indigo-500/50 flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800">
                  MUNICIPAL ACCESS
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                <span>City Authority Command</span>
                <ArrowRight className="w-4 h-4 opacity-80 group-hover:translate-x-1 transition-transform" />
              </h3>

              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Municipal dashboard with Smart Priority Queue, real-time crew dispatch, and Before/After proof-of-work uploads.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-400">
              <span>Authority Terminal</span>
              <span>→</span>
            </div>
          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-4 text-center border-t border-slate-800 text-xs text-slate-400">
        FixMyArea • Closed-Loop Civic Accountability Platform for Karachi
      </footer>

      {/* DEDICATED MODAL SCREEN 1: LIVE PUBLIC HEATMAP (Inside Card 3) */}
      {activeFeatureModal === 'heatmap' && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0b1222] border-2 border-sky-500/60 rounded-3xl max-w-5xl w-full p-5 sm:p-7 shadow-2xl space-y-4 my-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white">Karachi Live Incident GIS Heatmap</h3>
                  <p className="text-xs text-slate-400">Geographic hotspot clusters and live municipal incident markers</p>
                </div>
              </div>

              <button
                onClick={() => setActiveFeatureModal('none')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <MapView />
          </div>
        </div>
      )}

      {/* DEDICATED MODAL SCREEN 2: SLA CLOCKS & BREACHES (Inside Card 4) */}
      {activeFeatureModal === 'slaClocks' && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0b1222] border-2 border-rose-500/60 rounded-3xl max-w-5xl w-full p-5 sm:p-7 shadow-2xl space-y-5 my-auto animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white">Active Karachi SLA Countdown Clocks</h3>
                  <p className="text-xs text-slate-400">Auditable countdown timers for all active complaints across Karachi</p>
                </div>
              </div>

              <button
                onClick={() => setActiveFeatureModal('none')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 pr-1">
              {reports.map((report) => {
                const isBreached = report.status !== 'Resolved' && report.slaRemainingSeconds === 0;

                return (
                  <div
                    key={report.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      report.isEmergency
                        ? 'bg-red-950/40 border-red-500 ring-1 ring-red-500'
                        : isBreached
                        ? 'bg-rose-950/40 border-rose-600'
                        : 'bg-[#080d19] border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        report.isEmergency ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-800 text-slate-200'
                      }`}>
                        {report.isEmergency ? '🚨 10-Min Emergency' : report.category}
                      </span>
                      <span className="font-mono text-xs text-amber-400 font-bold">{report.id}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1">{report.title}</h4>
                    <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">{report.description}</p>
                    <div className="text-[11px] text-slate-400 mb-3">📍 {report.karachiTown} • {report.location}</div>

                    {/* VIVID PROMINENT CREW BADGE */}
                    {report.assignedCrew && (
                      <div className="mb-3 p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-500/50 flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                        <div className="text-xs">
                          <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">Assigned Crew:</span>
                          <span className="text-white font-extrabold">{report.assignedCrew}</span>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Countdown:</span>
                      <span className={`font-mono font-bold px-2.5 py-1 rounded-lg ${
                        report.status === 'Resolved'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : isBreached
                          ? 'bg-rose-600 text-white font-black animate-pulse'
                          : report.isEmergency
                          ? 'bg-red-500/30 text-red-300 font-black'
                          : 'bg-slate-800 text-amber-400'
                      }`}>
                        {report.status === 'Resolved' ? 'Verified Resolved' : formatTimer(report.slaRemainingSeconds)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED MODAL SCREEN 3: LEADERBOARD & BADGES (Inside Card 5) */}
      {activeFeatureModal === 'leaderboard' && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0b1222] border-2 border-emerald-500/60 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white">Karachi Neighborhood Guardians</h3>
                  <p className="text-xs text-slate-400">Community Points & Civic Badges</p>
                </div>
              </div>

              <button
                onClick={() => setActiveFeatureModal('none')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { rank: '1', name: 'Murtaza Hashmi', area: 'Clifton Block 7', points: '1,450 pts', badge: '🥇 Master Guardian' },
                { rank: '2', name: 'Sara Tariq', area: 'Gulshan Block 13-D', points: '1,120 pts', badge: '🥈 Rapid Inspector' },
                { rank: '3', name: 'Ali Raza', area: 'Saddar Cantonment', points: '890 pts', badge: '🥉 Street Sentinel' },
                { rank: '4', name: 'Zubair Qureshi', area: 'North Nazimabad', points: '640 pts', badge: '🎖️ Active Civic Scout' },
              ].map((usr) => (
                <div key={usr.rank} className="flex items-center justify-between p-4 rounded-2xl bg-[#080d19] border border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-bold text-amber-400 text-sm">{usr.rank}</span>
                    <div>
                      <span className="font-bold text-white block text-sm">{usr.name}</span>
                      <span className="text-slate-400 text-xs">📍 {usr.area}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-400 text-sm block">{usr.points}</span>
                    <span className="text-[11px] text-slate-400">{usr.badge}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals & AI Chat */}
      <ReportModal />
      <FeedbackModal />
      <Chatbot />
    </div>
  );
};
