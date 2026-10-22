import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../translations';
import { Navbar } from '../components/Navbar';
import { 
  FileText, 
  Bot, 
  Truck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle,
  Siren
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { reports, language } = useApp();
  const navigate = useNavigate();

  // Metrics
  const activeTicketsCount = reports.filter(r => r.status !== 'Resolved').length;
  const verifiedRepairsCount = reports.filter(r => r.status === 'Resolved').length;
  const breachedCount = reports.filter(r => r.status !== 'Resolved' && r.slaRemainingSeconds === 0).length;

  return (
    <div 
      dir={language === 'ur' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#070c18] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black pb-20"
    >
      {/* Top Navigation */}
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 flex-1 w-full">
        
        {/* Status Indicator Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {language === 'ur' ? 'فعال الٹی گنتی ٹائمرز: ' : 'Active SLA Clock: '}
                <strong className="text-white">{activeTicketsCount} {language === 'ur' ? 'شکایات' : 'Tickets'}</strong>
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-200">
              <span>
                {language === 'ur' ? 'تصدیق شدہ مرمت: ' : 'Verified Repairs: '}
                <strong className="text-emerald-400">20 {language === 'ur' ? 'حل شدہ' : 'Closed'}</strong>
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800 text-xs text-rose-300">
              <span>🔥 <strong className="text-white">{breachedCount} {language === 'ur' ? 'وقت ختم (اعلیٰ افسران کو ارسال)' : 'Breached & Auto-Escalated'}</strong></span>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            {language === 'ur' ? 'کراچی بلدیاتی آپریشنز ڈیش بورڈ' : 'Karachi Municipal Operations Hub'}
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-400 block mb-1">
              {language === 'ur' ? 'شہری بلدیاتی خدمات' : 'CIVIC SERVICES DASHBOARD'}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {language === 'ur' ? 'خدمت منتخب کریں:' : 'SELECT A CIVIC FEATURE TO LAUNCH:'}
            </h1>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline font-mono">
            {language === 'ur' ? 'ہر فیچر کا علیحدہ مکمل صفحہ ہے' : 'Each feature opens its own dedicated full page'}
          </span>
        </div>

        {/* Citizen Streamlined Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Direct Report (Written & Photo) */}
          <div
            onClick={() => navigate('/report')}
            className="group bg-[#0a1122] hover:bg-[#0e172e] rounded-3xl p-6 sm:p-7 border-2 border-amber-500 hover:border-amber-400 transition-all cursor-pointer shadow-xl shadow-amber-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-13 h-13 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/30">
                  <FileText className="w-7 h-7 text-slate-950" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500 text-black">
                    {language === 'ur' ? 'براہ راست اندراج' : 'DIRECT SUBMISSION'}
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-extrabold text-white group-hover:text-amber-400 transition-colors flex items-center gap-2">
                <span>{language === 'ur' ? 'مسئلہ درج کریں (تحریری رپورٹ)' : 'Direct Written Report'}</span>
                <ArrowRight className="w-4 h-4 opacity-80 group-hover:translate-x-1 transition-transform" />
              </h2>

              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {language === 'ur'
                  ? 'گڑھوں، پانی کی لیکیج، اور بجلی کے خطرات کی تحریری تفصیلات دے کر فوری شکایت درج کریں۔'
                  : 'File municipal issue details in text form directly into the Karachi response queue in under 30 seconds.'}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-400">
              <span>{language === 'ur' ? 'رپورٹ فارم کھولیں' : 'Open Direct Report Form'}</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 2: AI Civic Chatbot Assistant */}
          <div
            onClick={() => navigate('/chat')}
            className="group bg-[#0a1122] hover:bg-[#0e172e] rounded-3xl p-6 sm:p-7 border-2 border-purple-500/80 hover:border-purple-400 transition-all cursor-pointer shadow-xl shadow-purple-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-13 h-13 rounded-2xl bg-purple-500/25 text-purple-300 border border-purple-500/50 flex items-center justify-center font-bold shadow-lg shadow-purple-500/20">
                  <Bot className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-500 text-white">
                    {language === 'ur' ? 'مصنوعی ذہانت' : 'AI POWERED'}
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-extrabold text-white group-hover:text-purple-300 transition-colors flex items-center gap-2">
                <span>{language === 'ur' ? 'مصنوعی ذہانت بلدیاتی معاون چیٹ' : 'AI Civic Chatbot Assistant'}</span>
                <ArrowRight className="w-4 h-4 opacity-80 group-hover:translate-x-1 transition-transform" />
              </h2>

              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {language === 'ur'
                  ? 'تیار سوالات پر کلک کریں یا براہ راست لکھ کر کراچی کے بلدیاتی حل کے بارے میں فوری معلومات حاصل کریں۔'
                  : 'Converse in natural language with built-in question suggestions to analyze hazards, check SLA hours, and file structured tickets.'}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-purple-400">
              <span>{language === 'ur' ? 'معاون سے بات کریں' : 'Start AI Civic Chat'}</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 3: Live Crew Route & GPS Tracker */}
          <div
            onClick={() => navigate('/tracking')}
            className="group bg-[#0a1122] hover:bg-[#0e172e] rounded-3xl p-6 sm:p-7 border-2 border-blue-500/80 hover:border-blue-400 transition-all cursor-pointer shadow-xl shadow-blue-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-13 h-13 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold shadow-lg shadow-blue-500/20">
                  <Truck className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-800">
                  {language === 'ur' ? 'لائیو جی پی ایس' : 'LIVE GPS TRACKER'}
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-white group-hover:text-blue-300 transition-colors flex items-center gap-2">
                <span>{language === 'ur' ? 'کراچی بلدیاتی ٹیم لائیو ٹریکر' : 'Live Crew Route Tracker'}</span>
                <ArrowRight className="w-4 h-4 opacity-80 group-hover:translate-x-1 transition-transform" />
              </h2>

              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {language === 'ur'
                  ? 'دیکھیں کہ بلدیاتی عملہ (واٹر بورڈ، کے الیکٹرک، کے ایم سی) کی گاڑیاں کہاں پہنچی ہیں اور ان کا موقع پر پہنچنے کا وقت کیا ہے۔'
                  : 'Track dispatched municipal teams (KW&SB, K-Electric, KMC) live on map with GPS coordinates, arrival ETAs, and phone contacts.'}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-blue-400">
              <span>{language === 'ur' ? 'ٹیموں کی لائیو لوکیشن دیکھیں' : 'Track Active Crew Routes'}</span>
              <span>→</span>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 px-4 text-center border-t border-slate-800 text-xs text-slate-400">
        {language === 'ur'
          ? 'فکس مائی ایریا • کراچی کے لیے بلدیاتی جوابدہی کا شفاف پلیٹ فارم'
          : 'FixMyArea • Closed-Loop Civic Accountability Platform for Karachi'}
      </footer>
    </div>
  );
};
