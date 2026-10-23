import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../translations';
import { Navbar } from '../components/Navbar';
import { 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Building2,
  UserCheck,
  LogIn,
  X,
  Zap,
  Droplet,
  Car,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Users,
  AlertTriangle,
  Siren,
  Globe
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { reports, language, user } = useApp();
  const navigate = useNavigate();
  const [showSignInModal, setShowSignInModal] = React.useState(false);

  // Metrics
  const activeTicketsCount = reports.filter(r => r.status !== 'Resolved').length;
  const breachedCount = reports.filter(r => r.status !== 'Resolved' && r.slaRemainingSeconds === 0).length;

  return (
    <div 
      dir={language === 'ur' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#070c18] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black pb-16"
    >
      {/* Top Header Navbar */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center overflow-hidden flex-1 flex flex-col justify-center">
        
        {/* Glowing backdrop aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-amber-500/15 blur-[140px] rounded-full pointer-events-none" />

        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-semibold shadow-lg mb-8 mx-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-200">
            {language === 'ur' ? 'کراچی بلدیاتی خدمات کی شفاف مانیٹرنگ' : 'Karachi Closed-Loop Civic Accountability Platform'}
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-amber-400 font-bold">
            {language === 'ur' ? 'صفر گمشدہ شکایات' : 'Zero Disappearing Reports'}
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.18]">
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

        {/* Hero Action Buttons: Single Sign In / Dashboard CTA */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {user ? (
            <button
              onClick={() => navigate(user.role === 'Authority' ? '/authority' : '/home')}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm sm:text-base px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/30 active:scale-95 transition-all cursor-pointer"
            >
              <span>{language === 'ur' ? 'اپنے پورٹل میں داخل ہوں' : `Enter ${user.role === 'Authority' ? 'Authority' : 'Citizen'} Dashboard`}</span>
              <ArrowRight className="w-5 h-5 text-slate-950 stroke-[3]" />
            </button>
          ) : (
            <button
              onClick={() => setShowSignInModal(true)}
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/25 transition-all cursor-pointer active:scale-95"
            >
              <LogIn className="w-5 h-5 text-slate-950" />
              <span>{language === 'ur' ? 'سائن ان کریں' : 'Sign In'}</span>
              <ArrowRight className="w-5 h-5 text-slate-950 stroke-[3]" />
            </button>
          )}
        </div>

        {/* Sign In Modal */}
        {showSignInModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0b1224] border-2 border-indigo-500/80 rounded-3xl max-w-md w-full p-6 shadow-2xl text-white animate-in fade-in zoom-in-95 space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <LogIn className="w-5 h-5 text-amber-400" />
                  <h3 className="font-black text-lg text-white">
                    {language === 'ur' ? 'لاگ ان کی قسم منتخب کریں' : 'Select Sign In Mode'}
                  </h3>
                </div>
                <button 
                  onClick={() => setShowSignInModal(false)}
                  className="p-1 rounded-xl bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowSignInModal(false);
                    navigate('/login?role=Citizen');
                  }}
                  className="w-full p-4 rounded-2xl bg-[#0e1830] hover:bg-[#132244] border-2 border-emerald-500/60 hover:border-emerald-400 transition-all cursor-pointer flex items-center gap-4 text-left shadow-md group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold shrink-0">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                      {language === 'ur' ? 'شہری لاگ ان (Citizen)' : 'Citizen Sign In'}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {language === 'ur' ? 'شکایات درج کریں، چیٹ باٹ استعمال کریں اور ٹریک کریں' : 'File civic reports, use AI assistant & track repair status'}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setShowSignInModal(false);
                    navigate('/login?role=Authority');
                  }}
                  className="w-full p-4 rounded-2xl bg-[#0e1830] hover:bg-[#132244] border-2 border-indigo-500/60 hover:border-indigo-400 transition-all cursor-pointer flex items-center gap-4 text-left shadow-md group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-bold shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                      {language === 'ur' ? 'بلدیاتی افسران / انتظامیہ (Authority)' : 'City Authority Sign In'}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {language === 'ur' ? 'ڈسپیچ کیو، ہیٹ میپ اور ٹیم کمانڈ کنسول تک رسائی' : 'Access Dispatch Queue, Satellite Heat Map & Crew Console'}
                    </p>
                  </div>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* 4 Metrics Cards Row */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
          <div className="bg-[#0b1224] p-4 sm:p-5 rounded-2xl border border-slate-700/80 shadow-md">
            <span className="text-2xl sm:text-3xl font-extrabold text-white block">{activeTicketsCount}</span>
            <span className="text-xs text-slate-300 font-medium mt-1 block">
              {language === 'ur' ? 'فعال شکایات' : 'Active SLA Tickets'}
            </span>
          </div>

          <div className="bg-[#0b1224] p-4 sm:p-5 rounded-2xl border border-slate-700/80 shadow-md">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 block">20</span>
            <span className="text-xs text-slate-300 font-medium mt-1 block">
              {language === 'ur' ? 'تصدیق شدہ حل' : 'Verified Resolved'}
            </span>
          </div>

          <div className="bg-[#0b1224] p-4 sm:p-5 rounded-2xl border border-slate-700/80 shadow-md">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 block">&lt; 30s</span>
            <span className="text-xs text-slate-300 font-medium mt-1 block">
              {language === 'ur' ? 'اندراج کی رفتار' : 'Average Filing Speed'}
            </span>
          </div>

          <div className="bg-[#140a18] p-4 sm:p-5 rounded-2xl border border-rose-800/80 shadow-lg shadow-rose-950/40">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-500 block flex items-center gap-1.5">
              <span>🔥</span>
              <span>{breachedCount}</span>
            </span>
            <span className="text-xs text-rose-300 font-semibold mt-1 block">
              {language === 'ur' ? 'وقت ختم (اعلیٰ افسران کو ارسال)' : 'Auto-Escalated Breaches'}
            </span>
          </div>
        </div>

      </section>

      {/* SECTION 2: HOW FIXMYAREA HELPS US & PROVIDES SERVICES */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-800/80 w-full space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-amber-400 block mb-1">
            {language === 'ur' ? 'یہ ایپ ہماری کیسے مدد کرتی ہے' : 'HOW FIXMYAREA SERVES KARACHI'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {language === 'ur' ? 'شہری بلدیاتی حل کا جدید شفاف نظام' : 'Guaranteed Solutions for Karachi Municipal Issues'}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {language === 'ur'
              ? 'فکس مائی ایریا کراچی کے شہریوں کو بلدیاتی اداروں (کے الیکٹرک، واٹر بورڈ، کے ایم سی اور سالڈ ویسٹ) سے براہ راست اور شفاف طریقے سے جوڑتا ہے۔ ہر شکایت کا ناقابل تغیر الٹی گنتی ٹائمر ہوتا ہے۔'
              : 'FixMyArea directly connects Karachi residents with municipal utilities (K-Electric, KW&SB, KMC, SSWMB). It eliminates lost paper files through real-time GPS tracking and enforced SLA deadlines.'}
          </p>
        </div>

        {/* 3 Feature Service Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="bg-[#0a1122] p-6 rounded-3xl border border-slate-800 hover:border-amber-500/50 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {language === 'ur' ? '۱۔ فوری تحریری رپورٹ اور خودمختار درجہ بندی' : '1. Fast Written Report & AI Triage'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'ur'
                ? 'شہری صرف ۳۰ سیکنڈ میں خرابی کی تفصیل درج کرتے ہیں۔ آرٹیفیشل انٹیلی جنس (Gemini) شکایت کا معائنہ کر کے فوری متعلقہ محکمے کو روانہ کرتی ہے۔'
                : 'File incident details in text format in under 30 seconds. Gemini AI analyzes the narrative, determines urgency, and routes the ticket directly to the assigned department.'}
            </p>
          </div>

          <div className="bg-[#0a1122] p-6 rounded-3xl border border-slate-800 hover:border-rose-500/50 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center font-bold mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {language === 'ur' ? '۲۔ ناقابلِ رد الٹی گنتی ٹائمر اور خودکار اعلیٰ افسر کو شکایت' : '2. Enforced SLA Clock & Auto-Escalation'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'ur'
                ? 'ہر خطرے کا مخصوص حل وقت (۱۰ منٹ سے ۶ گھنٹے) ہوتا ہے۔ وقت ختم ہونے پر شکایت خود بخود اعلیٰ بلدیاتی کمشنر اور صوبائی سیکرٹری کو منتقل ہو جاتی ہے۔'
                : 'Every hazard carries an official resolution deadline (10m to 6h). If a deadline is breached, the ticket automatically escalates to senior municipal leadership.'}
            </p>
          </div>

          <div className="bg-[#0a1122] p-6 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {language === 'ur' ? '۳۔ لائیو جی پی ایس روٹ اور گاڑیوں کی ٹریکنگ' : '3. Live Vehicle GPS & Squad Route Tracking'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'ur'
                ? 'شہری اور بلدیاتی انتظامیہ لائیو نقشے پر واٹر بورڈ، کے الیکٹرک، کے ایم سی اور سندھ سالڈ ویسٹ کی گاڑیوں کی لوکیشن اور پہنچنے کا وقت دیکھ سکتے ہیں۔'
                : 'Citizens and city officials track dispatched water tankers, mobile cranes, asphalt pavers, and compactor trucks live on map with estimated time of arrival (ETA).'}
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 3: WHICH MUNICIPAL CREWS IT PROVIDES */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-800/80 w-full space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-400 block mb-1">
            {language === 'ur' ? 'شامل بلدیاتی ادارے اور ٹیمیں' : 'SUPPORTED MUNICIPAL CREWS & UTILITIES'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {language === 'ur' ? 'کراچی کے اہم سرکاری و بلدیاتی ڈسپیچ یونٹس' : 'Official Karachi Rapid Response Municipal Fleet'}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            {language === 'ur'
              ? 'کراچی کی تمام اہم بلدیاتی انتظامیہ اور اداروں کے باضابطہ رجسٹرڈ یونٹس'
              : 'Registered rapid response taskforces active across Karachi power, water, roads, and waste sectors'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#0a1122] p-5 rounded-2xl border border-amber-500/40 hover:border-amber-400 transition-all shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-6 h-6 text-amber-400" />
              <span className="text-xs font-black uppercase text-amber-300">K-Electric (KE)</span>
            </div>
            <h4 className="text-sm font-black text-white mb-1">Rapid Line & Emergency Unit #101</h4>
            <p className="text-xs text-slate-300">
              {language === 'ur' ? 'ہائی وولٹیج کیبلز، ٹرانسفارمرز اور بجلی کے فوری خطرات کی درستگی' : 'Mobile boom cranes & linemen for high-voltage cables, transformers & live sparks.'}
            </p>
          </div>

          <div className="bg-[#0a1122] p-5 rounded-2xl border border-sky-500/40 hover:border-sky-400 transition-all shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Droplet className="w-6 h-6 text-sky-400" />
              <span className="text-xs font-black uppercase text-sky-300">KW&SB (Water Board)</span>
            </div>
            <h4 className="text-sm font-black text-white mb-1">Hydro Suction & Valve Squad</h4>
            <p className="text-xs text-slate-300">
              {language === 'ur' ? 'پانی کی اہم پائپ لائنز، نالوں اور سیوریج بلاکیج کا فوری حل' : 'Heavy jetting suction trucks & valve engineers for water bursts and sewage overflows.'}
            </p>
          </div>

          <div className="bg-[#0a1122] p-5 rounded-2xl border border-orange-500/40 hover:border-orange-400 transition-all shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Car className="w-6 h-6 text-orange-400" />
              <span className="text-xs font-black uppercase text-orange-300">KMC (Metropolitan)</span>
            </div>
            <h4 className="text-sm font-black text-white mb-1">Asphalt & Road Taskforce #04</h4>
            <p className="text-xs text-slate-300">
              {language === 'ur' ? 'سڑکوں کے گڑھے، کھڈے اور تارکول کی فوری مرمت' : 'Asphalt paving machinery & civil engineers for road potholes, sinkholes & structural hazards.'}
            </p>
          </div>

          <div className="bg-[#0a1122] p-5 rounded-2xl border border-emerald-500/40 hover:border-emerald-400 transition-all shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Trash2 className="w-6 h-6 text-emerald-400" />
              <span className="text-xs font-black uppercase text-emerald-300">SSWMB (Solid Waste)</span>
            </div>
            <h4 className="text-sm font-black text-white mb-1">Clean Karachi Fleet #12</h4>
            <p className="text-xs text-slate-300">
              {language === 'ur' ? 'کوڑے دانوں، بازاروں اور سڑکوں سے بڑے کچرے کی فوری صفائی' : 'Compactor trucks & sanitation crews for heavy dump clearing outside markets & schools.'}
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 4: SERVICE DEADLINES & RESOLUTION TIMES (SLA TIMELINE) */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-800/80 w-full space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-rose-400 block mb-1">
            {language === 'ur' ? 'خدمات فراہم کرنے کے مقررہ اوقات' : 'OFFICIAL MUNICIPAL SERVICE SLA DEADLINES'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {language === 'ur' ? 'ہر بلدیاتی خرابی کا ناقابل رد وقت اور حتمی تاریخ' : 'Guaranteed Category SLA Countdown Deadlines'}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            {language === 'ur'
              ? 'اگر وقت ختم ہو جائے تو شکایت خود بخود اعلیٰ افسران کے پاس منتقل ہو جاتی ہے'
              : 'Strict deadline clock enforcing fast action. Unresolved tickets trigger automatic escalation.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-3xl bg-[#1a0c14] border-2 border-red-500/60 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-600 text-white animate-pulse">
                {language === 'ur' ? '۱۰ منٹ الٹی گنتی' : '10 MIN SLA'}
              </span>
              <Siren className="w-5 h-5 text-red-400 animate-bounce" />
            </div>
            <h3 className="text-base font-black text-white">{language === 'ur' ? 'ایمرجنسی بجلی / گیس خطرہ' : 'Emergency Electrical Hazard'}</h3>
            <p className="text-xs text-slate-300">
              {language === 'ur' ? 'ٹوٹی ہوئی بجلی کی تار، ٹرانسفارمر میں آگ، یا جانی خطرہ۔' : 'Snapped 11KV power line, transformer sparks, or life-threatening electrical hazard.'}
            </p>
            <div className="pt-2 border-t border-red-900/50 text-[11px] text-red-300 font-bold">
              {language === 'ur' ? 'خودکار منتقلی: چیف الیکٹریکل انسپکٹر' : 'Escalates To: Chief Electrical Inspector'}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#09152a] border-2 border-sky-500/60 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-sky-600 text-white">
                {language === 'ur' ? '۲ گھنٹے الٹی گنتی' : '2 HOUR SLA'}
              </span>
              <Droplet className="w-5 h-5 text-sky-400" />
            </div>
            <h3 className="text-base font-black text-white">{language === 'ur' ? 'پانی پائپ لائن پھٹنا / سیوریج' : 'Water Pipeline Burst & Sewage'}</h3>
            <p className="text-xs text-slate-300">
              {language === 'ur' ? 'مرکزی واٹر لائن سے شدید لیکیج یا سڑکوں پر گندا پانی اکٹھا ہونا۔' : 'Major clean water pipeline burst or flooded residential sewage accumulation.'}
            </p>
            <div className="pt-2 border-t border-sky-900/50 text-[11px] text-sky-300 font-bold">
              {language === 'ur' ? 'خودکار منتقلی: چیف ایگزیکٹو واٹر بورڈ' : 'Escalates To: KW&SB Executive Engineer'}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#1c1209] border-2 border-orange-500/60 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-orange-600 text-white">
                {language === 'ur' ? '۴ گھنٹے الٹی گنتی' : '4 HOUR SLA'}
              </span>
              <Car className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="text-base font-black text-white">{language === 'ur' ? 'سڑک کا گڑھا / کھڈا' : 'Road Potholes & Sinkholes'}</h3>
            <p className="text-xs text-slate-300">
              {language === 'ur' ? 'سڑکوں میں گہرے گڑھے، ٹوٹا ہوا فٹ پاتھ یا ٹریفک میں رکاوٹ۔' : 'Deep road sinkholes, damaged curbs, or hazardous asphalt cave-ins.'}
            </p>
            <div className="pt-2 border-t border-orange-900/50 text-[11px] text-orange-300 font-bold">
              {language === 'ur' ? 'خودکار منتقلی: کے ایم سی چیف انجینیئر' : 'Escalates To: KMC Chief Civil Engineer'}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#091a13] border-2 border-emerald-500/60 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-600 text-white">
                {language === 'ur' ? '۶ گھنٹے الٹی گنتی' : '6 HOUR SLA'}
              </span>
              <Trash2 className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-black text-white">{language === 'ur' ? 'کوڑے کا بڑا ڈھیر / کچرا' : 'Solid Waste Dump Clearance'}</h3>
            <p className="text-xs text-slate-300">
              {language === 'ur' ? 'بازاروں، اسکولوں اور رہائشی علاقوں سے کچرا صاف کرنا۔' : 'Unattended solid waste heaps blocking streets or school gates.'}
            </p>
            <div className="pt-2 border-t border-emerald-900/50 text-[11px] text-emerald-300 font-bold">
              {language === 'ur' ? 'خودکار منتقلی: ڈائریکٹر آپریشنز سالڈ ویسٹ' : 'Escalates To: SSWMB Operations Director'}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: WHERE IT IS - COVERAGE ZONES ACROSS KARACHI */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-800/80 w-full space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400 block mb-1">
            {language === 'ur' ? 'کوریج اور لوکیشنز' : 'SERVICE COVERAGE LOCATIONS'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {language === 'ur' ? 'کراچی کے تمام ۸ مرکزی انتظامی اضلاع میں فعال' : 'Active Across All 8 Municipal Zones of Karachi'}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            {language === 'ur'
              ? 'کراچی کا کوئی بھی علاقہ ہماری جی پی ایس مانیٹرنگ اور بلدیاتی عملے سے باہر نہیں ہے'
              : 'Comprehensive municipal network covering South, Central, East, West, Korangi, Malir, Keamari, and Saddar.'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            { en: 'Clifton & DHA', ur: 'کلفٹن اور ڈی ایچ اے', zone: 'District South' },
            { en: 'Saddar & MA Jinnah Rd', ur: 'صدر اور ایم اے جناح روڈ', zone: 'District South' },
            { en: 'Gulshan-e-Iqbal', ur: 'گلشنِ اقبال', zone: 'District East' },
            { en: 'North Nazimabad', ur: 'نارتھ ناظم آباد', zone: 'District Central' },
            { en: 'Korangi Industrial Area', ur: 'کورنگی انڈسٹریل ایریا', zone: 'District Korangi' },
            { en: 'Malir & Model Colony', ur: 'ملیر اور ماڈل کالونی', zone: 'District Malir' },
            { en: 'Keamari & Lyari', ur: 'کیماڑی اور لیاری', zone: 'District Keamari' },
            { en: 'Jamshed Town & PECHS', ur: 'جمشید ٹاؤن اور پی ای سی ایچ ایس', zone: 'District East' },
          ].map((loc, idx) => (
            <div key={idx} className="bg-[#0a1122] p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-extrabold text-white block text-xs">{language === 'ur' ? loc.ur : loc.en}</span>
                <span className="text-[10px] text-slate-400 font-mono block">{loc.zone}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t border-slate-800 text-xs text-slate-400">
        {language === 'ur'
          ? 'فکس مائی ایریا • کراچی کے لیے بلدیاتی جوابدہی کا شفاف پلیٹ فارم'
          : 'FixMyArea • Closed-Loop Civic Accountability Platform for Karachi'}
      </footer>
    </div>
  );
};
