import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { ArrowLeft, Trophy, Award, ShieldCheck, Star, Users } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();

  const leaders = [
    { rank: '1', name: 'Murtaza Hashmi', area: 'Clifton Block 7', points: '1,450 pts', reports: 18, verified: 16, badge: '🥇 Master Guardian', level: 'Level 5' },
    { rank: '2', name: 'Sara Tariq', area: 'Gulshan Block 13-D', points: '1,120 pts', reports: 14, verified: 12, badge: '🥈 Rapid Inspector', level: 'Level 4' },
    { rank: '3', name: 'Ali Raza', area: 'Saddar Cantonment', points: '890 pts', reports: 11, verified: 9, badge: '🥉 Street Sentinel', level: 'Level 3' },
    { rank: '4', name: 'Zubair Qureshi', area: 'North Nazimabad', points: '640 pts', reports: 8, verified: 7, badge: '🎖️ Active Civic Scout', level: 'Level 2' },
    { rank: '5', name: 'Dr. Bilal Siddiqui', area: 'DHA Phase 5', points: '520 pts', reports: 6, verified: 5, badge: '🛡️ Ward Protector', level: 'Level 2' },
    { rank: '6', name: 'Hina Farooq', area: 'Korangi Crossing', points: '410 pts', reports: 5, verified: 4, badge: '🌱 Green Citizen', level: 'Level 1' },
  ];

  return (
    <div className="min-h-screen bg-[#070c18] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black pb-16">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 flex-1 w-full">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home Page</span>
            </button>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>Karachi Neighborhood Guardians</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono uppercase font-bold">
                  Civic Leaderboard
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Community guardians earning Civic Points for reporting verified hazards (+50) and validating proof-of-work (+100)
              </p>
            </div>
          </div>
        </div>

        {/* Hero Points Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0b1b22] via-[#0b1626] to-[#0d1326] border-2 border-emerald-500/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold shadow-lg">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">How Civic Points Work</h3>
              <p className="text-xs text-slate-300 max-w-md mt-1">
                Citizens inspect municipal before/after proof images to permanently verify repairs, earning points and ward honors.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/60 text-emerald-300">
              +50 pts per Valid Ticket
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-amber-950 border border-amber-500/60 text-amber-300">
              +100 pts per Proof Audit
            </span>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-[#0b1324] rounded-3xl border-2 border-slate-700 shadow-2xl overflow-hidden p-5 space-y-3">
          <div className="space-y-3">
            {leaders.map((u) => (
              <div
                key={u.rank}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#080d19] border border-slate-800 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${
                    u.rank === '1' ? 'bg-amber-500 text-slate-950 shadow-md' :
                    u.rank === '2' ? 'bg-slate-300 text-slate-950' :
                    u.rank === '3' ? 'bg-amber-700 text-white' :
                    'bg-slate-900 text-slate-400'
                  }`}>
                    {u.rank}
                  </span>

                  <div>
                    <span className="font-extrabold text-white text-sm block">{u.name}</span>
                    <span className="text-xs text-slate-400">📍 {u.area} • {u.level}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-black text-emerald-400 text-sm sm:text-base block">{u.points}</span>
                  <span className="text-xs text-amber-400 font-semibold">{u.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};
