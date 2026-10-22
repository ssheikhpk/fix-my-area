import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../translations';
import { IssueCategory, KarachiTown } from '../types';
import { 
  X, 
  MapPin, 
  Camera, 
  CheckCircle, 
  AlertTriangle, 
  Droplet, 
  Trash2, 
  Zap, 
  Car,
  Clock,
  Sparkles,
  Siren,
  FileText,
  Upload,
  TreePine,
  TrafficCone,
  Lightbulb,
  Wrench,
  Footprints,
  Scan,
  ShieldCheck,
  CheckCircle2,
  Flame
} from 'lucide-react';

export interface IncidentCategoryOption {
  id: string;
  name: string;
  nameUrdu: string;
  slaMax: string;
  category: IssueCategory;
  icon: React.ReactNode;
}

export const INCIDENT_CATEGORIES: IncidentCategoryOption[] = [
  {
    id: 'pothole',
    name: 'Pothole / Road Damage',
    nameUrdu: 'سڑک کا گڑھا / خرابی',
    slaMax: '48h SLA Max',
    category: 'Roads',
    icon: (
      <div className="w-5 h-5 rounded-full bg-slate-950 border-2 border-purple-400 flex items-center justify-center">
        <span className="w-2 h-2 rounded-full bg-purple-500" />
      </div>
    ),
  },
  {
    id: 'water_leak',
    name: 'Water Leak / Burst Main',
    nameUrdu: 'پانی کی لائن کا رساؤ / سیوریج',
    slaMax: '24h SLA Max',
    category: 'Water',
    icon: <Droplet className="w-5 h-5 text-sky-400 fill-sky-400" />,
  },
  {
    id: 'traffic_signal',
    name: 'Traffic Signal Malfunction',
    nameUrdu: 'ٹریفک سگنل کی خرابی',
    slaMax: '12h SLA Max',
    category: 'Roads',
    icon: (
      <div className="w-3.5 h-6 rounded bg-slate-950 border border-slate-700 flex flex-col items-center justify-around py-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      </div>
    ),
  },
  {
    id: 'fallen_tree',
    name: 'Fallen Tree / Large Limb',
    nameUrdu: 'گرا ہوا درخت / شاخ',
    slaMax: '6h SLA Max',
    category: 'Roads',
    icon: <TreePine className="w-5 h-5 text-emerald-400" />,
  },
  {
    id: 'downed_wire',
    name: 'Downed Wire / Electrical Hazard',
    nameUrdu: 'بجلی کی تار / شارٹ سرکٹ',
    slaMax: '6h SLA Max',
    category: 'Electricity',
    icon: <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />,
  },
  {
    id: 'streetlight_out',
    name: 'Streetlight Luminaire Out',
    nameUrdu: 'اسٹریٹ لائٹ بند ہے',
    slaMax: '48h SLA Max',
    category: 'Electricity',
    icon: <Lightbulb className="w-5 h-5 text-amber-300 fill-amber-300" />,
  },
  {
    id: 'illegal_dumping',
    name: 'Illegal Dumping / Refuse Pile',
    nameUrdu: 'کوڑے کا غیر قانونی ڈھیر',
    slaMax: '72h SLA Max',
    category: 'Garbage',
    icon: <Trash2 className="w-5 h-5 text-rose-400" />,
  },
  {
    id: 'sidewalk_hazard',
    name: 'Sidewalk Trip Hazard',
    nameUrdu: 'فٹ پاتھ پر رکاوٹ / ٹوٹ پھوٹ',
    slaMax: '96h SLA Max',
    category: 'Roads',
    icon: <Footprints className="w-5 h-5 text-amber-500" />,
  },
  {
    id: 'general_maintenance',
    name: 'General Civic Maintenance',
    nameUrdu: 'عام بلدیاتی مرمت',
    slaMax: '48h SLA Max',
    category: 'Roads',
    icon: <Wrench className="w-5 h-5 text-purple-400" />,
  },
];

export const ReportModal: React.FC = () => {
  const { isReportModalOpen, setIsReportModalOpen, createReport, language, lastSubmittedReport, setLastSubmittedReport } = useApp();

  // Mode Tab: 'written' vs 'photo' matching user screenshot 3 tabs!
  const [reportTab, setReportTab] = useState<'written' | 'photo'>('written');

  const [selectedIncident, setSelectedIncident] = useState<IncidentCategoryOption>(INCIDENT_CATEGORIES[0]);
  const [headline, setHeadline] = useState('');
  const [narrative, setNarrative] = useState('');
  const [karachiTown, setKarachiTown] = useState<KarachiTown>('Clifton & DHA');
  const [addressNotes, setAddressNotes] = useState('');
  
  // Emergency 10-Minute SLA state
  const [isEmergency, setIsEmergency] = useState(false);

  // Photo mode states
  const [photoUrl, setPhotoUrl] = useState('');
  const [evidenceTag, setEvidenceTag] = useState('#IMG-0477');
  const [gpsTag, setGpsTag] = useState('GPS_VERIFIED: 24.8607°, 67.0011°');
  const [aiScanStatus, setAiScanStatus] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
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

  // AI Triage from text simulation
  const handleAiTriage = () => {
    setAiTriageNotice('Analyzing incident narrative via Gemini 3.8 Flash...');
    setTimeout(() => {
      if (narrative.toLowerCase().includes('water') || headline.toLowerCase().includes('water')) {
        setSelectedIncident(INCIDENT_CATEGORIES[1]);
        setAiTriageNotice('✨ AI Auto-Triage: Categorized as KW&SB Water Main Rupture with 99% confidence.');
      } else if (narrative.toLowerCase().includes('wire') || narrative.toLowerCase().includes('electric') || headline.toLowerCase().includes('spark')) {
        setSelectedIncident(INCIDENT_CATEGORIES[4]);
        setAiTriageNotice('✨ AI Auto-Triage: Categorized as K-Electric High Voltage Hazard with 98% confidence.');
      } else if (narrative.toLowerCase().includes('trash') || narrative.toLowerCase().includes('garbage')) {
        setSelectedIncident(INCIDENT_CATEGORIES[6]);
        setAiTriageNotice('✨ AI Auto-Triage: Categorized as SSWMB Solid Waste Infraction with 97% confidence.');
      } else {
        setSelectedIncident(INCIDENT_CATEGORIES[0]);
        setAiTriageNotice('✨ AI Auto-Triage: Categorized as KMC Asphalt Structural Hazard. SLA locked.');
      }
    }, 500);
  };

  // AI Visual Damage Scan simulation
  const handleAiVisualScan = () => {
    setIsScanning(true);
    setAiScanStatus('Executing neural hazard inspection on photo...');
    setTimeout(() => {
      setIsScanning(false);
      setAiScanStatus('✓ AI Visual Inspection: High-impact crater detected (Depth ~18cm). Severity Grade: Urgent Dispatch.');
    }, 700);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        setEvidenceTag(`#IMG-${Math.floor(1000 + Math.random() * 9000)}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDesc = narrative.trim() || `Reported ${selectedIncident.name} in ${karachiTown}`;

    createReport({
      category: selectedIncident.category,
      title: headline.trim() || `${selectedIncident.name} in ${karachiTown}`,
      description: finalDesc,
      location: addressNotes.trim() || `Near Main Road, ${karachiTown}, Karachi`,
      karachiTown,
      photoUrl: reportTab === 'photo' ? photoUrl : (photoUrl || undefined),
      isEmergency,
    });

    setIsReportModalOpen(false);
    setHeadline('');
    setNarrative('');
    setAddressNotes('');
    setAiScanStatus(null);
    setAiTriageNotice(null);
    setIsEmergency(false);
  };

  // If showing the post-submission popup modal
  if (lastSubmittedReport) {
    return (
      <div 
        dir={language === 'ur' ? 'rtl' : 'ltr'}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans"
      >
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
              <span className="font-bold text-white">{lastSubmittedReport.karachiTown}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">{language === 'ur' ? 'شعبہ:' : 'Category:'}</span>
              <span className="font-bold text-amber-400">{lastSubmittedReport.category}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">{language === 'ur' ? 'حل کا وقت:' : 'Guaranteed Resolution SLA:'}</span>
              <span className="font-bold font-mono text-emerald-400">
                {lastSubmittedReport.isEmergency 
                  ? (language === 'ur' ? '🚨 ۱۰ منٹ' : '🚨 10 MINUTES') 
                  : (language === 'ur' ? `${Math.floor(lastSubmittedReport.slaTotalSeconds / 3600)} گھنٹے` : `${Math.floor(lastSubmittedReport.slaTotalSeconds / 3600)} Hours`)}
              </span>
            </div>
          </div>

          <button
            onClick={() => setLastSubmittedReport(null)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-sm tracking-wide shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
          >
            {language === 'ur' ? 'شکریہ، بند کریں' : 'View Tracking & Close'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      dir={language === 'ur' ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-sans"
    >
      <div className="relative w-full max-w-4xl bg-[#090f1d] border-2 border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#060a14] px-4 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-black text-white">
              {language === 'ur' ? 'تحریری بلدیاتی شکایت کی تفصیلات' : 'Direct Incident Report Details'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant & Guaranteed SLA Clock</span>
            </span>

            <button
              onClick={() => setIsReportModalOpen(false)}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Emergency 10-Minute Alert Banner / Button inside report */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/70 via-rose-950/40 to-slate-900 border-2 border-red-500/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center animate-pulse shadow-md shadow-red-600/40">
                <Siren className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-red-300 block">
                  🚨 High Hazard Life Safety Protocol
                </span>
                <span className="text-[11px] text-slate-300">
                  Enable 10-Minute Rapid Response (snapped wires, major road sinkholes, gushing main rupture)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEmergency(!isEmergency)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                isEmergency
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 ring-2 ring-red-400 animate-pulse'
                  : 'bg-slate-900 border border-red-500/40 text-red-400 hover:bg-red-950'
              }`}
            >
              {isEmergency ? '✓ 10-MIN EMERGENCY ACTIVE' : 'Enable 10-Min SLA'}
            </button>
          </div>

          {/* WRITTEN REPORT DETAILS */}
          <div className="space-y-6">
            
            {/* Section 1: INCIDENT CATEGORY (3x3 Grid) */}
            <div className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  1. INCIDENT CATEGORY
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  Determines municipal bureau & SLA clock
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
                          {language === 'ur' ? cat.nameUrdu : cat.name}
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

            {/* Section 2: WRITTEN DESCRIPTION & HAZARD NOTES */}
            <div className="p-5 rounded-2xl bg-[#0b1324] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  2. WRITTEN DESCRIPTION & HAZARD NOTES
                </h3>

                <button
                  type="button"
                  onClick={handleAiTriage}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                  <span>AI Triage From Text</span>
                </button>
              </div>

              {aiTriageNotice && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>{aiTriageNotice}</span>
                </div>
              )}

              {/* Field 1: Incident Headline / Short Summary */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Incident Headline / Short Summary
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Deep Pothole on 4th & Market damaging tires"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Field 2: Full Written Incident Narrative */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Written Incident Narrative
                </label>
                <textarea
                  rows={4}
                  value={narrative}
                  onChange={(e) => setNarrative(e.target.value)}
                  placeholder="Describe the exact physical hazard, traffic obstruction, visible depth or flow, pedestrian risks, and nearby landmarks..."
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Karachi Town & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Karachi Municipal Town / District
                  </label>
                  <select
                    value={karachiTown}
                    onChange={(e) => setKarachiTown(e.target.value as KarachiTown)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {karachiTownsList.map((town) => (
                      <option key={town} value={town}>
                        📍 {town}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Street / Landmark Address
                  </label>
                  <input
                    type="text"
                    value={addressNotes}
                    onChange={(e) => setAddressNotes(e.target.value)}
                    placeholder="e.g. Shahrah-e-Faisal near FTC Flyover"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Form Submit Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400 font-mono">
              Selected: <strong className="text-amber-400">{selectedIncident.name}</strong> •{' '}
              <span className="text-emerald-400">{isEmergency ? '🚨 10-Min SLA' : selectedIncident.slaMax}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t('cancel', language)}
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4 text-slate-950" />
                <span>{language === 'ur' ? 'رپورٹ جمع کریں' : 'Submit Formal Report'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
