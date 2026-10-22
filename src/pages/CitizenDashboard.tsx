import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t, getCrewName, getReportDescription, getReportTitle } from '../translations';
import { Navbar } from '../components/Navbar';
import { ReportModal } from '../components/ReportModal';
import { FeedbackModal } from '../components/FeedbackModal';
import { Chatbot } from '../components/Chatbot';
import { MapView } from '../components/MapView';
import { IssueCategory, IssueStatus } from '../types';
import { 
  PlusCircle, 
  Clock, 
  MapPin, 
  CheckCircle, 
  AlertTriangle, 
  Car, 
  Trash2, 
  Droplet, 
  Zap, 
  ExternalLink,
  ShieldAlert,
  Search,
  Sparkles,
  ArrowUpRight,
  UserCheck
} from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const { 
    user, 
    reports, 
    language, 
    searchQuery, 
    setIsReportModalOpen, 
    feedbackSubmittedNotice 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | IssueCategory | 'myOnly'>('all');

  // Filter reports
  const displayReports = reports.filter((report) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = (
        report.description.toLowerCase().includes(q) ||
        report.location.toLowerCase().includes(q) ||
        report.category.toLowerCase().includes(q) ||
        report.id.toLowerCase().includes(q)
      );
      if (!matchText) return false;
    }

    if (activeTab === 'myOnly') {
      return report.submittedBy === (user?.name || 'Ahmad Khan');
    }
    if (activeTab !== 'all') {
      return report.category === activeTab;
    }
    return true;
  });

  const formatTimer = (totalSeconds: number) => {
    if (totalSeconds <= 0) {
      return '00h 00m 00s';
    }
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  const getStatusBadge = (status: IssueStatus, slaSeconds: number) => {
    if (status === 'Resolved') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle className="w-3 h-3 text-emerald-600" />
          <span>{t('resolved', language)}</span>
        </span>
      );
    }

    if (slaSeconds <= 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-800 border border-red-300 animate-pulse">
          <AlertTriangle className="w-3 h-3 text-red-600" />
          <span>{t('slaBreached', language)}</span>
        </span>
      );
    }

    if (status === 'In Progress') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
          <Clock className="w-3 h-3 text-indigo-600" />
          <span>{t('inProgress', language)}</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
        <Clock className="w-3 h-3 text-amber-600" />
        <span>{t('submitted', language)}</span>
      </span>
    );
  };

  const getCategoryIcon = (category: IssueCategory) => {
    switch (category) {
      case 'Roads':
        return <Car className="w-4 h-4 text-amber-600" />;
      case 'Garbage':
        return <Trash2 className="w-4 h-4 text-emerald-600" />;
      case 'Water':
        return <Droplet className="w-4 h-4 text-sky-600" />;
      case 'Electricity':
        return <Zap className="w-4 h-4 text-violet-600" />;
    }
  };

  return (
    <div 
      dir={language === 'ur' ? 'rtl' : 'ltr'} 
      className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans"
    >
      {/* Top Navigation */}
      <Navbar />

      {/* Global Toast for Feedback Notice if triggered */}
      {feedbackSubmittedNotice && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-top-2">
            <span>{t('feedbackSuccess', language)}</span>
          </div>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="bg-gradient-to-r from-sky-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-md mb-3 text-sky-100">
              <UserCheck className="w-3.5 h-3.5 text-sky-300" />
              <span>{user?.name || 'Citizen'} • {user?.ward || 'Central Municipal Ward'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {language === 'ur' ? 'اپنے علاقے کو صاف اور محفوظ بنائیں' : 'Empowering Citizens, Fixing Neighborhoods'}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-sky-100/90 leading-relaxed">
              {language === 'ur'
                ? 'کسی بھی روڈ کے گڑھے، پانی کے رساؤ، کوڑے یا بجلی کے مسائل کی فوری اطلاع دیں اور لائیو ٹریک کریں۔'
                : 'Notice a municipal problem? Snap a photo, geotag your location, and trigger rapid-response municipal crew action with guaranteed SLA deadlines.'}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="inline-flex items-center gap-2 bg-white text-sky-900 hover:bg-sky-50 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-sky-600" />
                <span>{t('reportIssue', language)}</span>
              </button>

              <span className="text-xs text-sky-200/80 font-medium">
                ⚡ {reports.filter(r => r.status === 'Resolved').length} {language === 'ur' ? 'مسائل حل ہو چکے ہیں' : 'issues resolved this month'}
              </span>
            </div>
          </div>

          {/* Decorative water/sparkle motif */}
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 pointer-events-none">
            <Sparkles className="w-96 h-96 text-white" />
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        
        {/* FEATURE: Map Area (Placeholder div for map requirement) */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                {t('activeIncidentsMap', language)}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'ur' ? 'شہر میں فعال اور حل شدہ واقعات کا انٹرایکٹو جائزہ' : 'Live geospatial distribution of ongoing complaints and field teams'}
              </p>
            </div>
          </div>
          <MapView />
        </section>

        {/* FEATURE: My Reports List */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>{t('myReports', language)}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {displayReports.length}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'ur' ? 'رپورٹ کی صورتحال اور ایس ایل اے کا الٹی گنتی ٹائمر' : 'Track your submitted civic issues with active real-time SLA countdown timers'}
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-200/70 p-1 rounded-2xl">
              {[
                { id: 'all', label: language === 'ur' ? 'تمام' : 'All Issues' },
                { id: 'Roads', label: t('roads', language) },
                { id: 'Water', label: t('water', language) },
                { id: 'Garbage', label: t('garbage', language) },
                { id: 'Electricity', label: t('electricity', language) },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reports Cards Grid / List */}
          {displayReports.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-700">
                {language === 'ur' ? 'کوئی مسئلہ نہیں ملا' : 'No Reports Found'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                {t('noReportsYet', language)}
              </p>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs hover:bg-sky-700 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t('reportIssue', language)}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayReports.map((report) => {
                const isBreached = report.status !== 'Resolved' && report.slaRemainingSeconds === 0;

                return (
                  <div
                    key={report.id}
                    className={`bg-white rounded-3xl border transition-all duration-200 shadow-xs hover:shadow-md overflow-hidden flex flex-col ${
                      isBreached ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200'
                    }`}
                  >
                    {/* Card Image Header */}
                    {report.photoUrl && (
                      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                        <img
                          src={report.photoUrl}
                          alt={report.category}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                        
                        {/* Category Badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-bold text-slate-800 shadow-xs">
                          {getCategoryIcon(report.category)}
                          <span>{t(report.category.toLowerCase() as any, language)}</span>
                        </div>

                        {/* ID */}
                        <div className="absolute top-3 right-3 text-[11px] font-mono font-bold text-white/90 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md">
                          {report.id}
                        </div>

                        {/* Location Tag */}
                        <div className="absolute bottom-3 left-3 right-3 text-white text-xs flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <span className="truncate drop-shadow-sm font-medium">{report.location}</span>
                        </div>
                      </div>
                    )}

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Status + SLA Header if no photo */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          {getStatusBadge(report.status, report.slaRemainingSeconds)}
                          
                          <span className="text-[11px] text-slate-400 font-medium">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 mb-1">
                          {getReportTitle(report.title || '', language)}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed mb-4">
                          {getReportDescription(report.description, language)}
                        </p>
                      </div>

                      {/* Assigned Crew or Proof Details */}
                      {report.assignedCrew && (
                        <div className="mb-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px]">
                          <span className="font-semibold text-slate-500 block mb-0.5">
                            {t('assignedCrewLabel', language)}:
                          </span>
                          <span className="text-slate-800 font-bold flex items-center gap-1">
                            👷 {getCrewName(report.assignedCrew, language)}
                          </span>
                        </div>
                      )}

                      {report.proofOfWorkUrl && (
                        <div className="mb-3 p-2 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 flex items-center justify-between">
                          <span className="font-semibold">{language === 'ur' ? '✓ تصدیقی تصویر منسلک ہے' : '✓ Verification photo attached'}</span>
                          <a
                            href={report.proofOfWorkUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-700 underline font-bold flex items-center gap-0.5"
                          >
                            {language === 'ur' ? 'دیکھیں' : 'View'}
                          </a>
                        </div>
                      )}

                      {/* SLA Timer Display */}
                      <div className={`mt-auto pt-3 border-t flex items-center justify-between text-xs ${
                        isBreached ? 'border-red-200 text-red-700 font-bold' : 'border-slate-100 text-slate-600'
                      }`}>
                        <div className="flex items-center gap-1.5">
                          <Clock className={`w-4 h-4 ${isBreached ? 'text-red-600 animate-spin' : 'text-slate-400'}`} />
                          <span className="text-[11px] uppercase tracking-wider font-semibold">
                            {report.status === 'Resolved' ? t('resolved', language) : t('slaRemaining', language)}:
                          </span>
                        </div>

                        <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-lg ${
                          report.status === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : isBreached
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {report.status === 'Resolved'
                            ? (language === 'ur' ? 'مکمل شدہ' : 'Completed')
                            : formatTimer(report.slaRemainingSeconds)}
                        </span>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>

      {/* Floating AI Chatbot (FEATURE 1: Floating AI Chatbot with tone dropdown) */}
      <Chatbot />

      {/* Report Modal */}
      <ReportModal />

      {/* Feedback Modal (FEATURE 4) */}
      <FeedbackModal />
    </div>
  );
};
