import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { t } from '../translations';
import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  AlertCircle,
  Globe,
  ArrowLeft
} from 'lucide-react';

export const Auth: React.FC = () => {
  const { loginUser, signupUser, language, toggleLanguage } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role>('Citizen');
  const [email, setEmail] = useState('citizen.ali@karachi.pk');
  const [password, setPassword] = useState('Password123!');
  const [fullName, setFullName] = useState('Ali Raza');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'Authority') {
      setSelectedRole('Authority');
      setEmail('director.kmc@karachi.gov.pk');
      setFullName('Engr. Tariq Mahmood');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLoginMode) {
        await loginUser(email, selectedRole, fullName);
      } else {
        await signupUser(email, selectedRole, fullName);
      }

      if (selectedRole === 'Citizen') {
        navigate('/');
      } else {
        navigate('/authority');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || (language === 'ur' ? 'تصدیق میں مسئلہ پیش آیا ہے۔' : 'Authentication error.'));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: Role) => {
    if (role === 'Citizen') {
      loginUser('ali.raza@karachi.pk', 'Citizen', 'Ali Raza');
      navigate('/');
    } else {
      loginUser('director.kmc@karachi.gov.pk', 'Authority', 'Engr. Tariq Mahmood (KMC Director)');
      navigate('/authority');
    }
  };

  return (
    <div 
      dir={language === 'ur' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#070c18] flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100 font-sans"
    >
      
      {/* Top Controls */}
      <div className={`absolute top-6 ${language === 'ur' ? 'left-6' : 'right-6'} flex items-center gap-2`}>
        <button
          onClick={toggleLanguage}
          className="px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Globe className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'en' ? 'اردو' : 'EN'}</span>
        </button>
      </div>

      <div className="w-full max-w-md">
        
        {/* App Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 font-black text-2xl shadow-xl shadow-amber-500/20 mb-3">
            F
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            {t('appName', language)}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('appTagline', language)}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#0b1222] border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8">
          
          {/* Mode Switcher */}
          <div className="flex bg-slate-900 p-1 rounded-2xl mb-6 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(true);
                setEmail(selectedRole === 'Citizen' ? 'citizen.ali@karachi.pk' : 'director.kmc@karachi.gov.pk');
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                isLoginMode ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'ur' ? 'لاگ ان' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(false);
                setFullName('');
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                !isLoginMode ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'ur' ? 'نیا اکاؤنٹ' : 'Create Account'}
            </button>
          </div>

          {/* Role Selector Buttons (Citizen vs Authority) */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {language === 'ur' ? 'اکاؤنٹ کی قسم منتخب کریں' : 'Choose Account Type'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('Citizen');
                  if (isLoginMode) setEmail('citizen.ali@karachi.pk');
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedRole === 'Citizen'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-300 font-bold'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                }`}
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span className="text-xs sm:text-sm">{t('citizen', language)}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('Authority');
                  if (isLoginMode) setEmail('director.kmc@karachi.gov.pk');
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedRole === 'Authority'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 font-bold'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span className="text-xs sm:text-sm">{t('authority', language)}</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-950/60 text-red-200 text-xs rounded-xl border border-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {!isLoginMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  {language === 'ur' ? 'پورا نام' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className={`w-4 h-4 text-slate-500 absolute ${language === 'ur' ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2`} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={language === 'ur' ? 'مثال: علی رضا' : 'e.g. Ali Raza'}
                    className={`w-full ${language === 'ur' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500`}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {language === 'ur' ? 'ای میل ایڈریس' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className={`w-4 h-4 text-slate-500 absolute ${language === 'ur' ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2`} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@karachi.pk"
                  className={`w-full ${language === 'ur' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {language === 'ur' ? 'پاس ورڈ' : 'Password'}
              </label>
              <div className="relative">
                <Lock className={`w-4 h-4 text-slate-500 absolute ${language === 'ur' ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2`} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full ${language === 'ur' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                selectedRole === 'Citizen'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:from-indigo-400 hover:to-blue-400 shadow-indigo-500/20'
              }`}
            >
              <span>
                {loading
                  ? (language === 'ur' ? 'تصدیق کی جا رہی ہے...' : 'Verifying...')
                  : isLoginMode
                  ? selectedRole === 'Citizen'
                    ? (language === 'ur' ? 'کراچی شہری پورٹل میں داخل ہوں' : 'Enter Karachi Citizen Portal')
                    : (language === 'ur' ? 'بلدیاتی کمانڈ کنسول کھولیں' : 'Access KMC Authority Console')
                  : (language === 'ur' ? 'کراچی اکاؤنٹ بنائیں' : 'Create Karachi Account')}
              </span>
              <ArrowRight className={`w-4 h-4 ${language === 'ur' ? 'rotate-180' : ''}`} />
            </button>
          </form>

          {/* Quick 1-Click Demo Logins */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest mb-2.5">
              {language === 'ur' ? '⚡ فوری ۱ کلک ڈیمو رسائی' : '⚡ 1-Click Instant Demo Access'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('Citizen')}
                className="py-2 px-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold text-center transition-colors cursor-pointer"
              >
                👤 {language === 'ur' ? 'بطور شہری لاگ ان' : 'Sign in as Citizen'}
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('Authority')}
                className="py-2 px-2.5 rounded-xl border border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-bold text-center transition-colors cursor-pointer"
              >
                🏛️ {language === 'ur' ? 'بطور بلدیاتی افسر' : 'City Authority Sign In'}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
