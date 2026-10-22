import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../translations';
import { 
  Building2, 
  Globe, 
  LogOut 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, language, toggleLanguage, logoutUser } = useApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070c18]/95 backdrop-blur-md border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand matching screenshot */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {/* Orange square logo with letter F */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
              F
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                  FixMyArea
                </span>
                <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                  {language === 'ur' ? 'کراچی عوامی بلدیاتی احتساب' : 'Civic Accountability & SLA Engine'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Controls: Only Language Toggle (Login removed from top bar as requested) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Toggle (EN | UR) */}
            <button
              onClick={toggleLanguage}
              title="Toggle Language: English / اردو"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span className={language === 'ur' ? 'text-amber-400 font-bold' : 'text-slate-200'}>
                {language === 'en' ? 'EN' : 'اردو'}
              </span>
            </button>

            {/* If logged in, show user tag and logout */}
            {user && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(user.role === 'Authority' ? '/authority' : '/home')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-medium hover:bg-slate-700"
                >
                  {user.name.split(' ')[0]} ({user.role === 'Authority' ? (language === 'ur' ? 'انتظامیہ' : 'Authority') : (language === 'ur' ? 'شہری' : 'Citizen')})
                </button>
                <button
                  onClick={handleLogout}
                  title={language === 'ur' ? 'لاگ آؤٹ' : 'Logout'}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
