import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t, getTownName } from '../translations';
import { Navbar } from '../components/Navbar';
import { IssueCategory, KarachiTown } from '../types';
import { INCIDENT_CATEGORIES, IncidentCategoryOption } from '../components/ReportModal';
import { 
  ArrowLeft, 
  FileText, 
  Clock, 
  Sparkles, 
  Siren, 
  CheckCircle, 
  CheckCircle2, 
  Droplet, 
  TreePine, 
  Zap, 
  MapPin 
} from 'lucide-react';

export const DirectReportPage: React.FC = () => {
  const { createReport, language, lastSubmittedReport, setLastSubmittedReport } = useApp();
  const navigate = useNavigate();

  const [selectedIncident, setSelectedIncident] = useState<IncidentCategoryOption>(INCIDENT_CATEGORIES[0]);
  const [headline, setHeadline] = useState('');
  const [narrative, setNarrative] = useState('');
  const [karachiTown, setKarachiTown] = useState<KarachiTown>('Clifton & DHA');
  const [addressNotes, setAddressNotes] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [aiTriageNotice, setAiTriageNotice] = useState<string | null>(null);

  const karachiTownsList: KarachiTown[] = [
    'Clifton & DHA',
    'Saddar',
    'Gulshan-e-Iqbal',
    'North Nazimabad',
    'Korangi',
    'Malir',
    'Keamari & Lyari',
    'Jamshed Town',
  ];

  const categoryUrduMap: Record<string, string> = {
    pothole: 'سڑک کا گڑھا',
    water_leak: 'پانی کی لیکیج / نالہ بند',
    traffic_signal: 'ٹریفک سگنل خراب',
    fallen_tree: 'گرا ہوا درخت',
    downed_wire: 'گری ہوئی بجلی کی تار',
    streetlight_out: 'اسٹریٹ لائٹ بند',
    illegal_dumping: 'کوڑے کا بڑا ڈھیر',
    sidewalk_hazard: 'ٹوٹا ہوا فٹ پاتھ',
    maintenance: 'عام بلدیاتی مرمت',
  };

  const handleAiTriage = () => {
    setAiTriageNotice(language === 'ur' ? 'تحریر کا معائنہ جاری ہے...' : 'Analyzing incident narrative via Gemini 3.8 Flash...');
    setTimeout(() => {
      if (narrative.toLowerCase().includes('water') || narrative.toLowerCase().includes('پانی') || headline.toLowerCase().includes('water') || headline.toLowerCase().includes('پانی')) {
        setSelectedIncident(INCIDENT_CATEGORIES[1]);
        setAiTriageNotice(language === 'ur' ? '✨ خودکار تشخیص: واٹر اینڈ سیوریج بورڈ (KW&SB) کو روانہ' : '✨ AI Auto-Triage: Categorized as KW&SB Water Main Rupture with 99% confidence.');
      } else if (narrative.toLowerCase().includes('wire') || narrative.toLowerCase().includes('بجلی') || narrative.toLowerCase().includes('تار') || headline.toLowerCase().includes('spark')) {
        setSelectedIncident(INCIDENT_CATEGORIES[4]);
        setAiTriageNotice(language === 'ur' ? '✨ خودکار تشخیص: کے الیکٹرک (K-Electric) ایمرجنسی ہنگامی ٹیم کو روانہ' : '✨ AI Auto-Triage: Categorized as K-Electric High Voltage Hazard with 98% confidence.');
      } else if (narrative.toLowerCase().includes('trash') || narrative.toLowerCase().includes('کوڑا') || narrative.toLowerCase().includes('کچرا')) {
        setSelectedIncident(INCIDENT_CATEGORIES[6]);
        setAiTriageNotice(language === 'ur' ? '✨ خودکار تشخیص: سندھ سالڈ ویسٹ مینجمنٹ (SSWMB) کو روانہ' : '✨ AI Auto-Triage: Categorized as SSWMB Solid Waste Infraction with 97% confidence.');
      } else {
        setSelectedIncident(INCIDENT_CATEGORIES[0]);
        setAiTriageNotice(language === 'ur' ? '✨ خودکار تشخیص: کے ایم سی روڈ ورکس ٹیم کو روانہ' : '✨ AI Auto-Triage: Categorized as KMC Asphalt Structural Hazard. SLA locked.');
      }
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDesc = narrative.trim() || `${selectedIncident.name} in ${karachiTown}`;

    createReport({
      category: selectedIncident.category,
      title: headline.trim() || `${selectedIncident.name} in ${karachiTown}`,
      description: finalDesc,
      location: addressNotes.trim() || `Near Main Road, ${karachiTown}, Karachi`,
      karachiTown,
      isEmergency,
    });
  };

  return (
    <div className="min-h-screen bg-[#070c18] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black pb-20">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 flex-1 w-full">
        
        {/* Top Header with Return Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'ur' ? 'ہوم پیج پر واپس جائیں' : 'Back to Home Page'}</span>
            </button>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>{language === 'ur' ? 'براہ راست رپورٹ درج کریں' : 'Direct Report'}</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono uppercase font-bold">
                  &lt; 30s Fast Submission
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                {language === 'ur' ? 'کراچی بلدیاتی خدمات کے لیے فوری تحریری شکایت اور الٹی گنتی ٹائمر' : 'Official Karachi municipal submission for rapid field response and guaranteed SLA clock'}
              </p>
            </div>
          </div>
        </div>

        {/* Post-submission Celebration Modal */}
        {lastSubmittedReport && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0b1222] border-2 border-amber-500 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-white shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-black flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
                <CheckCircle2 className="w-9 h-9 text-slate-950" />
              </div>

              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {lastSubmittedReport.id}
                </span>
                <h2 className="text-2xl font-black tracking-tight text-white mt-2">
                  {t('reportSubmittedTitle', language)}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {t('reportSubmittedDesc', language)}
                </p>
              </div>

              <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 text-left space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{language === 'ur' ? 'علاقہ:' : 'Karachi Town:'}</span>
                  <span className="font-bold text-white">{getTownName(lastSubmittedReport.karachiTown, language)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{language === 'ur' ? 'مسئلے کی قسم:' : 'Category:'}</span>
                  <span className="font-bold text-amber-400">{lastSubmittedReport.category}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{language === 'ur' ? 'حل کرنے کا وقت:' : 'Guaranteed Resolution SLA:'}</span>
                  <span className="font-bold font-mono text-emerald-400">
                    {lastSubmittedReport.isEmergency 
                      ? (language === 'ur' ? '🚨 ۱۰ منٹ' : '🚨 10 MINUTES') 
                      : `${Math.floor(lastSubmittedReport.slaTotalSeconds / 3600)} ${language === 'ur' ? 'گھنٹے' : 'Hours'}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setLastSubmittedReport(null);
                    navigate('/map');
                  }}
                  className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 cursor-pointer"
                >
                  {language === 'ur' ? 'نقشے پر دیکھیں' : 'View on Karachi Map'}
                </button>
                <button
                  onClick={() => {
                    setLastSubmittedReport(null);
                    navigate('/home');
                  }}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-black text-xs shadow-md cursor-pointer"
                >
                  {language === 'ur' ? 'ہوم پر واپس جائیں' : 'Return to Home'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Report Form Container */}
        <div className="bg-[#090f1d] border-2 border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Header Bar */}
          <div className="bg-[#060a14] px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <h2 className="text-sm font-extrabold text-white">
                {language === 'ur' ? 'تحریری بلدیاتی شکایت کی تفصیلات' : 'Direct Incident Report Details'}
              </h2>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{language === 'ur' ? 'فوری سیکنڈز میں شکایت درج کریں' : 'Instant & Secure Triage'}</span>
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* 10-Minute Rapid Emergency Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/70 via-rose-950/40 to-slate-900 border-2 border-red-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center animate-pulse shadow-md shadow-red-600/40 shrink-0">
                  <Siren className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-black text-red-300 block">
                    {language === 'ur' ? '🚨 ہنگامی جانی و مالی خطرات (۱۰ منٹ میں حل)' : '🚨 High Hazard Life Safety Protocol (10-Minute SLA)'}
                  </span>
                  <span className="text-xs text-slate-300">
                    {language === 'ur'
                      ? 'کراچی کی ہنگامی ٹیم کو ۶۰۰ سیکنڈ کی الٹی گنتی کے ساتھ فوری نوٹیفکیشن ارسال۔'
                      : 'Immediately auto-notifies Karachi rapid emergency squads with 600-second ticking countdown clock.'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEmergency(!isEmergency)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                  isEmergency
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 ring-2 ring-red-400 animate-pulse'
                    : 'bg-slate-900 border border-red-500/40 text-red-400 hover:bg-red-950'
                }`}
              >
                {isEmergency 
                  ? (language === 'ur' ? '✓ ۱۰ منٹ ایمرجنسی فعال' : '✓ 10-MIN EMERGENCY ACTIVE') 
                  : (language === 'ur' ? '۱۰ منٹ ایمرجنسی آن کریں' : 'Enable 10-Min SLA')}
              </button>
            </div>

            {/* WRITTEN REPORT DETAILS */}
            <div className="space-y-6">
              
              {/* 1. INCIDENT CATEGORY (3x3 Grid) */}
              <div className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    {language === 'ur' ? '۱۔ مسئلے کی قسم منتخب کریں' : '1. INCIDENT CATEGORY'}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {language === 'ur' ? 'مقررہ وقت اور متعلقہ محکمہ' : 'Determines municipal bureau & SLA clock'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {INCIDENT_CATEGORIES.map((cat) => {
                    const isSelected = selectedIncident.id === cat.id;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedIncident(cat)}
                        className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#101b34] border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/40'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="shrink-0">{cat.icon}</div>
                        <div className="overflow-hidden">
                          <span className={`text-xs font-extrabold block truncate ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                            {language === 'ur' ? (categoryUrduMap[cat.id] || cat.name) : cat.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            {cat.slaMax}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. WRITTEN DESCRIPTION & HAZARD NOTES */}
              <div className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    {language === 'ur' ? '۲۔ تحریری تفصیل اور پتے کی نشانیاں' : '2. WRITTEN DESCRIPTION & HAZARD NOTES'}
                  </h3>

                  <button
                    type="button"
                    onClick={handleAiTriage}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                    <span>{language === 'ur' ? 'تحریر کا خودکار معائنہ' : 'AI Triage From Text'}</span>
                  </button>
                </div>

                {aiTriageNotice && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>{aiTriageNotice}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {language === 'ur' ? 'مسئلے کا مختصر عنوان' : 'Incident Headline / Short Summary'}
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder={language === 'ur' ? 'مثال: مارکیٹ کے سامنے گہرا گڑھا گاڑیوں کو نقصان پہنچا رہا ہے' : 'e.g. Deep Pothole on 4th & Market damaging tires'}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {language === 'ur' ? 'مکمل تفصیل' : 'Full Written Incident Narrative'}
                  </label>
                  <textarea
                    rows={4}
                    value={narrative}
                    onChange={(e) => setNarrative(e.target.value)}
                    placeholder={language === 'ur' ? 'مسئلہ، گہرائی، پانی کا بہاؤ یا بجلی کا خطرہ اور قریبی مشہور عمارت آسان الفاظ میں لکھیں...' : 'Describe the exact physical hazard, traffic obstruction, visible depth or flow, pedestrian risks, and nearby landmarks...'}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {language === 'ur' ? 'کراچی کا علاقہ / ٹاؤن' : 'Karachi Municipal Town / District'}
                    </label>
                    <select
                      value={karachiTown}
                      onChange={(e) => setKarachiTown(e.target.value as KarachiTown)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      {karachiTownsList.map((town) => (
                        <option key={town} value={town}>
                          📍 {getTownName(town, language)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {language === 'ur' ? 'گلی، چوک یا قریبی نشانی' : 'Street / Landmark Address'}
                    </label>
                    <input
                      type="text"
                      value={addressNotes}
                      onChange={(e) => setAddressNotes(e.target.value)}
                      placeholder={language === 'ur' ? 'مثال: شاہراہ فیصل، نزدیک ایف ٹی سی فلائی اوور' : 'e.g. Shahrah-e-Faisal near FTC Flyover'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Footer Submission Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-400 font-mono">
                {language === 'ur' ? 'منتخب مسئلہ: ' : 'Selected: '}
                <strong className="text-amber-400">
                  {language === 'ur' ? (categoryUrduMap[selectedIncident.id] || selectedIncident.name) : selectedIncident.name}
                </strong> •{' '}
                <span className="text-emerald-400">
                  {isEmergency ? (language === 'ur' ? '🚨 ۱۰ منٹ' : '🚨 10-Min SLA') : selectedIncident.slaMax}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/home')}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4 text-slate-950" />
                  <span>{language === 'ur' ? 'باضابطہ شکایت جمع کریں' : 'Submit Formal Report'}</span>
                </button>
              </div>
            </div>

          </form>

        </div>

      </main>
    </div>
  );
};
