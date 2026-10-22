import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Role, Language, Report, IssueCategory, IssueStatus, KarachiTown } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export interface KarachiCrew {
  id: string;
  name: string;
  dept: string;
  coverage: string;
}

export const OFFICIAL_KARACHI_CREWS: KarachiCrew[] = [
  { id: 'crew-ke-1', name: 'K-Electric Rapid Emergency Team #101', dept: 'Electricity', coverage: 'Shahrah-e-Faisal & Saddar' },
  { id: 'crew-kwsb-1', name: 'KW&SB Hydro Emergency Tank & Valve Squad', dept: 'Water', coverage: 'Clifton, DHA & South' },
  { id: 'crew-kmc-1', name: 'KMC Asphalt & Road Repair Taskforce #4', dept: 'Roads', coverage: 'MA Jinnah Rd, District Central' },
  { id: 'crew-sswmb-1', name: 'SSWMB Solid Waste Quick Response Unit', dept: 'Garbage', coverage: 'Gulshan-e-Iqbal & East' },
  { id: 'crew-kwsb-2', name: 'KW&SB Sewerage Jetting Crew #7', dept: 'Water', coverage: 'Gulshan & Jamshed Town' },
  { id: 'crew-ke-2', name: 'K-Electric High-Tension Cable Squad', dept: 'Electricity', coverage: 'Korangi & Malir Industrial' },
];

interface AppContextType {
  user: UserProfile | null;
  role: Role;
  language: Language;
  reports: Report[];
  searchQuery: string;
  isReportModalOpen: boolean;
  isFeedbackModalOpen: boolean;
  isProfileModalOpen: boolean;
  lastSubmittedReport: Report | null;
  setSearchQuery: (query: string) => void;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  setIsReportModalOpen: (open: boolean) => void;
  setIsFeedbackModalOpen: (open: boolean) => void;
  setIsProfileModalOpen: (open: boolean) => void;
  setLastSubmittedReport: (report: Report | null) => void;
  loginUser: (email: string, role: Role, name?: string) => Promise<void>;
  signupUser: (email: string, role: Role, name: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  createReport: (data: {
    category: IssueCategory;
    title: string;
    description: string;
    location: string;
    karachiTown: KarachiTown;
    coordinates?: { lat: number; lng: number };
    photoUrl?: string;
    isEmergency?: boolean;
  }) => Report;
  assignCrew: (reportId: string, crewName: string) => void;
  uploadProof: (reportId: string, proofUrl: string, note?: string) => void;
  markResolved: (reportId: string) => void;
  triggerSlaBreach: (reportId: string) => void;
  submitFeedback: (feedbackText: string) => void;
  feedbackSubmittedNotice: boolean;
  setFeedbackSubmittedNotice: (v: boolean) => void;
}

const initialKarachiReports: Report[] = [
  {
    id: 'KHI-EMG-101',
    category: 'Electricity',
    title: 'High-voltage line sparking across main road',
    description: '11KV cable snapped near FTC flyover on Shahrah-e-Faisal. Heavy spark and electrocution hazard for passing motorbikes.',
    location: 'FTC Flyover, Shahrah-e-Faisal, Karachi',
    karachiTown: 'Saddar',
    coordinates: { lat: 24.8568, lng: 67.0494 },
    photoUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80',
    submittedBy: 'Ali Raza (Citizen)',
    createdAt: Date.now() - 1000 * 320, // 5 mins ago
    isEmergency: true,
    slaTotalSeconds: 600, // 10 minutes emergency SLA!
    slaRemainingSeconds: 280, // ticking down!
    status: 'In Progress',
    assignedCrew: 'K-Electric Rapid Emergency Team #101',
  },
  {
    id: 'KHI-REP-204',
    category: 'Water',
    title: '36-inch main water pipeline burst at 2 Talwar',
    description: 'Submerged road at 2 Talwar Clifton Block 7. Clean water gushing into commercial shops and basement parking.',
    location: '2 Talwar Roundabout, Clifton Block 7, Karachi',
    karachiTown: 'Clifton & DHA',
    coordinates: { lat: 24.8211, lng: 67.0322 },
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80',
    submittedBy: 'Murtaza Hashmi',
    createdAt: Date.now() - 3600 * 1000 * 1.5,
    slaTotalSeconds: 7200, // 2h SLA
    slaRemainingSeconds: 1800, // 30m remaining
    status: 'In Progress',
    assignedCrew: 'KW&SB Hydro Emergency Tank & Valve Squad',
  },
  {
    id: 'KHI-REP-205',
    category: 'Roads',
    title: 'Deep sinkhole after rains on MA Jinnah Road',
    description: 'Large sinkhole forming right next to the Green Line bus lane near Light House market causing traffic gridlock.',
    location: 'Near Light House Market, MA Jinnah Road, Karachi',
    karachiTown: 'Saddar',
    coordinates: { lat: 24.8615, lng: 67.0149 },
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    submittedBy: 'Zubair Qureshi',
    createdAt: Date.now() - 3600 * 1000 * 5,
    slaTotalSeconds: 14400, // 4 hours
    slaRemainingSeconds: 0, // Breached! Turns RED in table
    status: 'Submitted',
  },
  {
    id: 'KHI-REP-206',
    category: 'Garbage',
    title: 'Solid waste overflowing into school entrance',
    description: 'Garbage dump unattended for 4 days outside Government Girls Degree College Gulshan.',
    location: 'Block 13-D, University Road near Disco Bakery, Karachi',
    karachiTown: 'Gulshan-e-Iqbal',
    coordinates: { lat: 24.9180, lng: 67.0971 },
    photoUrl: 'https://images.unsplash.com/photo-1611288875785-5ef85516fc21?auto=format&fit=crop&w=600&q=80',
    submittedBy: 'Sara Tariq',
    createdAt: Date.now() - 3600 * 1000 * 4,
    slaTotalSeconds: 21600,
    slaRemainingSeconds: 7200,
    status: 'Submitted',
  },
  {
    id: 'KHI-REP-207',
    category: 'Water',
    title: 'Sewage backup in residential street',
    description: 'Manhole cover displaced with black water flowing outside homes in Block L.',
    location: 'Street 4, Block L, North Nazimabad, Karachi',
    karachiTown: 'North Nazimabad',
    coordinates: { lat: 24.9421, lng: 67.0442 },
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80',
    submittedBy: 'Fahad Mehmood',
    createdAt: Date.now() - 3600 * 1000 * 8,
    slaTotalSeconds: 14400,
    slaRemainingSeconds: 0,
    status: 'Resolved',
    assignedCrew: 'KW&SB Sewerage Jetting Crew #7',
    proofOfWorkUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80',
    proofNote: 'Pipeline declogged and new heavy-duty cement ring placed by Municipal Sub-Engineer.',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('fixmyarea_khi_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return {
      id: 'usr-khi-1',
      name: 'Ali Raza',
      email: 'ali.raza@karachi.pk',
      role: 'Citizen',
      town: 'Clifton & DHA',
    };
  });

  const [language, setLanguage] = useState<Language>('en');
  const [reports, setReports] = useState<Report[]>(() => {
    const savedReports = localStorage.getItem('fixmyarea_khi_reports');
    if (savedReports) {
      try {
        return JSON.parse(savedReports);
      } catch {
        return initialKarachiReports;
      }
    }
    return initialKarachiReports;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [lastSubmittedReport, setLastSubmittedReport] = useState<Report | null>(null);
  const [feedbackSubmittedNotice, setFeedbackSubmittedNotice] = useState(false);

  // Sync reports
  useEffect(() => {
    localStorage.setItem('fixmyarea_khi_reports', JSON.stringify(reports));
  }, [reports]);

  // Sync user
  useEffect(() => {
    if (user) {
      localStorage.setItem('fixmyarea_khi_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('fixmyarea_khi_user');
    }
  }, [user]);

  // Live SLA Timer ticking down each second
  useEffect(() => {
    const interval = setInterval(() => {
      setReports((prevReports) =>
        prevReports.map((report) => {
          if (report.status === 'Resolved') return report;
          if (report.slaRemainingSeconds > 0) {
            return {
              ...report,
              slaRemainingSeconds: Math.max(0, report.slaRemainingSeconds - 1),
            };
          }
          return report;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ur' : 'en'));
  };

  const loginUser = async (email: string, role: Role, name?: string) => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signInWithPassword({
          email,
          password: 'Password123!',
        });
      } catch (err) {
        console.warn('Supabase auth notice:', err);
      }
    }

    const displayName = name || (email.split('@')[0] ? email.split('@')[0].replace('.', ' ') : 'Karachi Citizen');
    const newUser: UserProfile = {
      id: 'usr-' + Math.random().toString(36).substring(2, 8),
      name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      email,
      role,
      town: role === 'Citizen' ? 'Clifton & DHA' : 'Karachi Municipal Headquarters (KMC)',
    };
    setUser(newUser);
  };

  const signupUser = async (email: string, role: Role, name: string) => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signUp({
          email,
          password: 'Password123!',
          options: { data: { name, role } },
        });
      } catch (err) {
        console.warn('Supabase signup notice:', err);
      }
    }

    const newUser: UserProfile = {
      id: 'usr-' + Math.random().toString(36).substring(2, 8),
      name,
      email,
      role,
      town: role === 'Citizen' ? 'Gulshan-e-Iqbal' : 'KMC Command Central',
    };
    setUser(newUser);
  };

  const logoutUser = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut error:', err);
      }
    }
    setUser(null);
  };

  const createReport = (data: {
    category: IssueCategory;
    title: string;
    description: string;
    location: string;
    karachiTown: KarachiTown;
    coordinates?: { lat: number; lng: number };
    photoUrl?: string;
    isEmergency?: boolean;
  }): Report => {
    // 10-Minute Emergency requirement:
    // "and also another icon sort of for emregncy one that should resolve within ten minute sit should be insid eteh direct report"
    let slaSec = 14400; // 4h default for Roads
    if (data.isEmergency) {
      slaSec = 600; // EXACT 10 MINUTES (600 seconds)
    } else if (data.category === 'Electricity') {
      slaSec = 3600; // 1h
    } else if (data.category === 'Water') {
      slaSec = 7200; // 2h
    } else if (data.category === 'Garbage') {
      slaSec = 21600; // 6h
    }

    const prefix = data.isEmergency ? 'KHI-EMG-' : 'KHI-REP-';
    const newReport: Report = {
      id: prefix + (100 + reports.length + 1),
      category: data.category,
      title: data.title || `${data.category} Issue in ${data.karachiTown}`,
      description: data.description,
      location: data.location || `Main Road, ${data.karachiTown}, Karachi`,
      karachiTown: data.karachiTown,
      coordinates: data.coordinates || { lat: 24.8607, lng: 67.0011 },
      photoUrl: data.photoUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80',
      submittedBy: user?.name || 'Concerned Citizen',
      createdAt: Date.now(),
      slaTotalSeconds: slaSec,
      slaRemainingSeconds: slaSec,
      status: 'Submitted',
      isEmergency: data.isEmergency,
    };

    setReports((prev) => [newReport, ...prev]);
    setLastSubmittedReport(newReport);
    return newReport;
  };

  const assignCrew = (reportId: string, crewName: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            status: 'In Progress',
            assignedCrew: crewName,
          };
        }
        return r;
      })
    );
  };

  const uploadProof = (reportId: string, proofUrl: string, note?: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            proofOfWorkUrl: proofUrl,
            proofNote: note || 'Verified on-site by Karachi Municipal Inspection Officer.',
          };
        }
        return r;
      })
    );
  };

  const markResolved = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            status: 'Resolved',
            proofOfWorkUrl:
              r.proofOfWorkUrl ||
              'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80',
            proofNote: r.proofNote || 'Issue permanently repaired and verified on ground.',
          };
        }
        return r;
      })
    );
  };

  const triggerSlaBreach = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            slaRemainingSeconds: 0,
          };
        }
        return r;
      })
    );
  };

  const submitFeedback = (text: string) => {
    console.log('Karachi Civic Feedback submitted:', text);
    setFeedbackSubmittedNotice(true);
    setTimeout(() => {
      setFeedbackSubmittedNotice(false);
    }, 4000);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        role: user?.role || 'Citizen',
        language,
        reports,
        searchQuery,
        isReportModalOpen,
        isFeedbackModalOpen,
        isProfileModalOpen,
        lastSubmittedReport,
        setSearchQuery,
        setLanguage,
        toggleLanguage,
        setIsReportModalOpen,
        setIsFeedbackModalOpen,
        setIsProfileModalOpen,
        setLastSubmittedReport,
        loginUser,
        signupUser,
        logoutUser,
        createReport,
        assignCrew,
        uploadProof,
        markResolved,
        triggerSlaBreach,
        submitFeedback,
        feedbackSubmittedNotice,
        setFeedbackSubmittedNotice,
      }}
    >
      <div dir={language === 'ur' ? 'rtl' : 'ltr'} className={`min-h-screen bg-[#070c18] text-slate-100 ${language === 'ur' ? 'urdu-active' : ''}`}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
