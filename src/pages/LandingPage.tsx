import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../translations';
import { Navbar } from '../components/Navbar';
import { 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Camera,
  Building2,
  UserCheck,
  LogIn,
  X
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { reports, language } = useApp();
  const navigate = useNavigate();
  const [showSignInModal, setShowSignInModal] = React.useState(false);

  // Metrics
  const activeTicketsCount = reports.filter(r => r.status !== 'Resolved').length;
  const breachedCount = reports.filter(r => r.status !== 'Resolved' && r.slaRemainingSeconds === 0).length;

  return (
    <div 
      dir={language === 'ur' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#070c18] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black"
    >
      {/* Top Bar matching screenshot */}
      <Navbar />

      {/* SECTION 1: HERO HEADER */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center overflow-hidden flex-1 flex flex-col justify-center">
        
        {/* Glowing aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-amber-500/15 blur-[140px] rounded-full pointer-events-none" />

        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-semibold shadow-lg mb-8 mx-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-200">
            {language === 'ur' ? 'کراچی بلدیاتی خدمات کی لائیو مانیٹرنگ' : 'Guaranteed Closed-Loop Municipal Tracking'}
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

        {/* Action Buttons: Enter Home Page AND Login Buttons directly on Front Page */}
        {/* Action Buttons: Enter Home Page AND Single Sign In Button */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm sm:text-base px-7 py-4 rounded-2xl shadow-xl shadow-amber-500/30 active:scale-95 transition-all cursor-pointer"
          >
            <span>{language === 'ur' ? 'فکس مائی ایریا ہوم پیج میں داخل ہوں' : 'Enter FixMyArea Home Page'}</span>
            <ArrowRight className="w-5 h-5 text-slate-950 stroke-[3]" />
          </button>

          {/* SINGLE SIGN IN BUTTON */}
          <button
            onClick={() => setShowSignInModal(true)}
            className="flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-[#0f172a] hover:bg-slate-800 border-2 border-indigo-500/70 text-sm sm:text-base font-extrabold text-white transition-all cursor-pointer shadow-lg shadow-indigo-500/10 active:scale-95"
          >
            <LogIn className="w-5 h-5 text-indigo-400" />
            <span>{language === 'ur' ? 'لاگ ان کریں' : 'Sign In'}</span>
          </button>
        </div>

        {/* SIGN IN SELECTION MODAL WITH 2 DISTINCT CHOICES (CITIZEN & AUTHORITY) */}
        {showSignInModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0b1324] border-2 border-indigo-500/80 rounded-3xl max-w-md w-full p-6 shadow-2xl text-white animate-in fade-in zoom-in-95 space-y-5">
              
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
                {/* Choice 1: Citizen Sign In */}
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

                {/* Choice 2: City Authority Sign In */}
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
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
          
          <div className="bg-[#0b1224] p-4 sm:p-5 rounded-2xl border border-slate-700/80 shadow-md">
            <span className="text-2xl sm:text-3xl font-extrabold text-white block">
              {activeTicketsCount}
            </span>
            <span className="text-xs text-slate-300 font-medium mt-1 block">
              {language === 'ur' ? 'فعال شکایات' : 'Active Tickets on Clock'}
            </span>
          </div>

          <div className="bg-[#0b1224] p-4 sm:p-5 rounded-2xl border border-slate-700/80 shadow-md">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 block">
              20
            </span>
            <span className="text-xs text-slate-300 font-medium mt-1 block">
              {language === 'ur' ? 'تصدیق شدہ حل' : 'Closed-Loop Verified'}
            </span>
          </div>

          <div className="bg-[#0b1224] p-4 sm:p-5 rounded-2xl border border-slate-700/80 shadow-md">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 block">
              &lt; 30s
            </span>
            <span className="text-xs text-slate-300 font-medium mt-1 block">
              {language === 'ur' ? 'شکایت درج کرنے کی رفتار' : 'Average Report Speed'}
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

      {/* SECTION 2: HOW CIVIC ACCOUNTABILITY WORKS */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-800/80 w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {language === 'ur' ? 'شہری نظام کس طرح جوابدہ کام کرتا ہے' : 'How Civic Accountability Works'}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300">
            {language === 'ur'
              ? 'تین خودکار اقدامات جو مکمل شفافیت کو یقینی بناتے ہیں۔'
              : 'Three automated steps ensuring total transparency from incident to verified repair.'}
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
                {language === 'ur' ? '۱۔ فوری اور مصنوئی ذہانت سے اندراج' : '1. Direct & AI-Assisted Reporting'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'ur'
                  ? 'تفصیل لکھ کر یا کیمرے سے تصویر کھینچ کر مسئلہ درج کریں۔ مصنوئی ذہانت فوری طور پر متعلقہ محکمے (کے الیکٹرک، واٹر بورڈ، کے ایم سی) کو رپورٹ بھیجتی ہے۔'
                  : 'Report issues via text details or camera snapshots. Gemini AI auto-fills urgency and determines the municipal department, while GPS clustering prevents duplicate spam.'}
              </p>
            </div>
          </div>

          <div className="bg-[#0a1122] p-6 rounded-3xl border border-slate-700/80 flex flex-col justify-between shadow-lg">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-sm">
                <Clock className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                {language === 'ur' ? '۲۔ ناقابل تغیر الٹی گنتی کا وقت' : '2. Immutable SLA Countdown'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'ur'
                  ? 'ہر مسئلے کا مخصوص وقت (۱۰ منٹ سے ۶ گھنٹے) ہوتا ہے۔ اگر وقت ختم ہو جائے تو شکایت خود بخود اعلیٰ بلدیاتی کمشنر کو ارسال ہو جاتی ہے۔'
                  : 'Every hazard has a category deadline (10m to 6h). Countdown timers cannot be cleared or hidden. If breached, the system auto-escalates directly to senior city leadership.'}
              </p>
            </div>
          </div>

          <div className="bg-[#0a1122] p-6 rounded-3xl border border-slate-700/80 flex flex-col justify-between shadow-lg">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-sm">
                <Camera className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                {language === 'ur' ? '۳۔ کام کی تصویری تصدیق' : '3. Proof-of-Work Verification'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'ur'
                  ? 'کام مکمل ہونے پر سرکاری ٹیم مرمت شدہ جگہ کی تصویر لگاتی ہے، جس کی تصدیق شہری خود دیکھ کر کرتے ہیں۔'
                  : 'City workers upload after-repair photos. Citizens inspect before/after imagery and sign off to permanently close the loop and verify resolution.'}
              </p>
            </div>
          </div>

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
