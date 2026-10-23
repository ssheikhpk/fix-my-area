import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Role } from '../types';
import { t } from '../translations';
import appIcon from '../assets/images/fixmyarea_app_icon_1792744699484.jpg';
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
        navigate('/home');
      } else {
        navigate('/authority');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || (language === 'ur' ? 'تصدیق میں مسئلہ پیش آیا ہے۔' : 'Authentication error.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      dir={language === 'ur' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#070c18] flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100 font-sans"
    >
      
      {/* Top Controls */}
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-300 transition-all cursor-pointer hover:border-amber-500/50 shadow-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'ur' ? 'اصلی صفحہ پر واپس جائیں' : 'Back to Main Page'}</span>
        </button>

        <button
          onClick={toggleLanguage}
          className="px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Globe className="w-3.5 h-3.5 text-amber-400" />
          <span className={language === 'en' ? 'text-amber-400 font-black' : 'text-slate-400 font-semibold'}>EN</span>
          <span className="text-slate-600">|</span>
          <span className={language === 'ur' ? 'text-amber-400 font-black' : 'text-slate-400 font-semibold'}>اردو</span>
        </button>
      </div>

      <div className="w-full max-w-md">
        
        {/* App Title */}
        <div className="text-center mb-8">
          <img 
            src={appIcon} 
            alt="FixMyArea" 
            className="w-16 h-16 rounded-2xl shadow-xl shadow-blue-900/40 border border-blue-500/30 object-cover mx-auto mb-3" 
          />
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

          {/* Single Role Banner for Selected Account Type */}
          <div className="mb-5">
            {selectedRole === 'Citizen' ? (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-amber-300">
                      {language === 'ur' ? 'شہری سائن ان (Citizen)' : 'Citizen Sign In'}
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      {language === 'ur' ? 'شہری پورٹل میں داخل ہوں' : 'Access Citizen Portal & track reports'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('Authority');
                    if (isLoginMode) setEmail('director.kmc@karachi.gov.pk');
                  }}
                  className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer shrink-0 pl-2"
                >
                  {language === 'ur' ? 'انتظامیہ سائن ان' : 'Switch to Authority'}
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-bold shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-indigo-300">
                      {language === 'ur' ? 'بلدیاتی انتظامیہ سائن ان (Authority)' : 'City Authority Sign In'}
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      {language === 'ur' ? 'بلدیاتی کمانڈ کنسول' : 'Access KMC Command Console'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('Citizen');
                    if (isLoginMode) setEmail('citizen.ali@karachi.pk');
                  }}
                  className="text-[11px] font-bold text-amber-400 hover:text-amber-300 hover:underline cursor-pointer shrink-0 pl-2"
                >
                  {language === 'ur' ? 'شہری سائن ان' : 'Switch to Citizen'}
                </button>
              </div>
            )}
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

        </div>

      </div>
    </div>
  );
};
