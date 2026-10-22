import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  t, 
  getTownName, 
  getCategoryName, 
  getCrewName, 
  getReportTitle, 
  getReportDescription 
} from '../translations';
import { Navbar } from '../components/Navbar';
import { Report, IssueCategory } from '../types';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  Flame, 
  Users, 
  CheckCircle, 
  Siren, 
  Droplet, 
  Car, 
  Trash2, 
  Zap,
  Filter
} from 'lucide-react';

export const SlaClocksPage: React.FC = () => {
  const { reports, language, triggerSlaBreach } = useApp();
  const navigate = useNavigate();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const formatTimer = (totalSeconds: number) => {
    if (totalSeconds <= 0) return '00h 00m 00s';
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  const filteredReports = reports.filter((r) => {
    if (categoryFilter !== 'All' && r.category !== categoryFilter) return false;
    return true;
  });

  const breachedCount = reports.filter(r => r.status !== 'Resolved' && r.slaRemainingSeconds === 0).length;
  const emergencyCount = reports.filter(r => r.isEmergency && r.status !== 'Resolved').length;
  const resolvedCount = reports.filter(r => r.status === 'Resolved').length;
  const activeCount = reports.filter(r => r.status !== 'Resolved').length;

  return (
    <div 
      dir={language === 'ur' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#070c18] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black pb-16"
    >
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 flex-1 w-full">
        
        {/* Top Header without Add Grievance button as requested */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className={`w-4 h-4 ${language === 'ur' ? 'rotate-180' : ''}`} />
              <span>{t('backToHome', language)}</span>
            </button>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>{t('slaClocksTitle', language)}</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-mono uppercase font-bold">
                  {t('immutableTimersBadge', language)}
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('slaClocksSubtitle', language)}
              </p>
            </div>
          </div>
        </div>

        {/* SLA Status Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#0b1324] p-4 rounded-2xl border border-slate-700 shadow-md">
            <span className="text-xs text-slate-400 uppercase font-bold block">{t('activeComplaintsMetric', language)}</span>
            <span className="text-2xl font-black text-white mt-1 block">{activeCount} {language === 'ur' ? 'شکایات' : 'Tickets'}</span>
          </div>

          <div className="bg-[#0b1324] p-4 rounded-2xl border border-red-500/50 shadow-md">
            <span className="text-xs text-red-400 uppercase font-bold block flex items-center gap-1">
              <Siren className="w-3.5 h-3.5 animate-pulse" />
              <span>{t('emergenciesMetric', language)}</span>
            </span>
            <span className="text-2xl font-black text-red-400 mt-1 block">{emergencyCount} {language === 'ur' ? 'فعال' : 'Active'}</span>
          </div>

          <div className="bg-[#140a18] p-4 rounded-2xl border border-rose-800 shadow-md">
            <span className="text-xs text-rose-400 uppercase font-bold block flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              <span>{t('escalatedBreachesMetric', language)}</span>
            </span>
            <span className="text-2xl font-black text-rose-500 mt-1 block">{breachedCount} {language === 'ur' ? 'وقت ختم' : 'Breached'}</span>
          </div>

          <div className="bg-[#0b1324] p-4 rounded-2xl border border-emerald-500/50 shadow-md">
            <span className="text-xs text-emerald-400 uppercase font-bold block">{t('verifiedClosedMetric', language)}</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">{resolvedCount} {language === 'ur' ? 'حل شدہ' : 'Repaired'}</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-slate-400 font-bold whitespace-nowrap pl-1">
            {t('filterByIssue', language)}
          </span>
          {['All', 'Water', 'Roads', 'Garbage', 'Electricity'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {getCategoryName(cat, language)}
            </button>
          ))}
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => {
            const isBreached = report.status !== 'Resolved' && report.slaRemainingSeconds === 0;

            return (
              <div
                key={report.id}
                className={`p-5 rounded-3xl border-2 transition-all shadow-xl ${
                  report.isEmergency
                    ? 'bg-red-950/40 border-red-500 ring-2 ring-red-500/40'
                    : isBreached
                    ? 'bg-rose-950/40 border-rose-600'
                    : 'bg-[#0a1122] border-slate-700/80'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                    report.isEmergency ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-800 text-slate-200'
                  }`}>
                    {report.isEmergency 
                      ? (language === 'ur' ? '🚨 ۱۰ منٹ ہنگامی الرٹ' : '🚨 10-Min Emergency') 
                      : getCategoryName(report.category, language)}
                  </span>

                  <span className="font-mono text-xs text-amber-400 font-bold">{report.id}</span>
                </div>

                <h4 className="text-sm font-extrabold text-white mb-1.5">
                  {getReportTitle(report.title || '', language)}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                  {getReportDescription(report.description, language)}
                </p>
                
                <div className="text-[11px] text-slate-400 mb-3">
                  📍 <strong className="text-slate-200">{getTownName(report.karachiTown, language)}</strong> • {report.location}
                </div>

                {report.assignedCrew && (
                  <div className="mb-3 p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-500/50 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div className="text-xs truncate">
                      <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">
                        {t('assignedCrew', language)}:
                      </span>
                      <span className="text-white font-extrabold truncate">
                        {getCrewName(report.assignedCrew, language)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">{t('timeRemaining', language)}:</span>
                    <span className={`font-mono font-black text-xs px-2 py-0.5 rounded-md inline-block ${
                      report.status === 'Resolved'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : isBreached
                        ? 'bg-rose-600 text-white animate-pulse'
                        : report.isEmergency
                        ? 'bg-red-500/30 text-red-300'
                        : 'bg-slate-800 text-amber-400'
                    }`}>
                      {report.status === 'Resolved' ? (language === 'ur' ? '✓ تصدیق شدہ حل' : 'Verified Resolved') : formatTimer(report.slaRemainingSeconds)}
                    </span>
                  </div>

                  {report.status !== 'Resolved' && !isBreached && (
                    <button
                      type="button"
                      onClick={() => triggerSlaBreach(report.id)}
                      className="text-[10px] text-rose-400 hover:text-rose-300 underline font-semibold cursor-pointer"
                    >
                      {t('fastForwardBreach', language)}
                    </button>
                  )}
                </div>

                {isBreached && (
                  <div className="mt-2 text-[10px] text-rose-300 bg-rose-950/80 p-1.5 rounded-lg border border-rose-800">
                    ⚠️ {t('autoEscalatedNotice', language)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
};
