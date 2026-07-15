/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Flame, 
  Star, 
  RefreshCw, 
  Award, 
  Sparkles, 
  ChevronRight, 
  TrendingUp, 
  Search,
  UserCheck
} from 'lucide-react';
import { getTopUsersByXp, FirebaseUserProfile } from '../firebase';
import { EnglishLevel } from '../types';

interface LeaderboardProps {
  currentUserId?: string;
  onNavigateHome?: () => void;
}

export function Leaderboard({ currentUserId, onNavigateHome }: LeaderboardProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<FirebaseUserProfile[]>([]);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch top 15 users to have a slightly larger set for competitive feel
  useEffect(() => {
    let active = true;
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const topUsers = await getTopUsersByXp(20);
        if (active) {
          setUsers(topUsers);
        }
      } catch (error) {
        console.error("Error loading leaderboard:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchLeaderboard();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  // Translate levels to Portuguese elegantly
  const formatLevel = (level: EnglishLevel): string => {
    switch (level) {
      case 'beginner':
        return 'Iniciante';
      case 'intermediate':
        return 'Intermédio';
      case 'advanced':
        return 'Avançado';
      default:
        return 'Club Member';
    }
  };

  const getLevelBadgeClass = (level: EnglishLevel): string => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'intermediate':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'advanced':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Identify current user's profile in the list (or if they are in there)
  const currentUserRankIndex = users.findIndex(u => u.userId === currentUserId);
  const currentUserInTopList = currentUserRankIndex !== -1;
  const currentUserProfile = currentUserInTopList ? users[currentUserRankIndex] : null;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-5 animate-fade-in" id="dashboard_leaderboard_panel">
      
      {/* Header section with Trophy logo */}
      <div className="flex items-start justify-between border-b pb-4 border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-brand-navy-905 bg-brand-navy-900 rounded-2xl border border-brand-red-500 shadow-md flex items-center justify-center">
            <Trophy className="w-6 h-6 text-brand-gold-400 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-extrabold text-brand-navy-850 text-sm sm:text-base uppercase tracking-wider flex items-center gap-1.5">
              <span>Líderes do Sabush Club</span>
              <Sparkles className="w-4 h-4 text-brand-gold-400 animate-pulse" />
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-tight font-medium">
              Fomente a amizade e competição saudável subindo no ranking com XP!
            </p>
          </div>
        </div>

        <button 
          onClick={() => setRefreshKey(prev => prev + 1)}
          className="p-2 hover:bg-slate-100 active:scale-95 text-slate-500 rounded-xl transition-all border border-slate-100 cursor-pointer"
          title="Recarregar"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-red-500' : ''}`} />
        </button>
      </div>

      {/* Info Stats micro row */}
      <div className="bg-slate-50 border border-slate-250/30 rounded-2xl p-3.5 flex items-center justify-between text-xs font-semibold text-slate-600">
        <div className="flex items-center space-x-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>Líder de XP atual:</span>
        </div>
        {!loading && users.length > 0 ? (
          <div className="flex items-center space-x-2">
            <span className="font-bold text-brand-navy-900 truncate max-w-[120px]">{users[0].name}</span>
            <span className="bg-brand-red-600 text-white font-black px-2 py-0.5 rounded-lg text-[10px]">
              {users[0].xp} XP
            </span>
          </div>
        ) : (
          <span className="text-slate-400 italic">Carregando...</span>
        )}
      </div>

      {/* Search Bar for scanning members */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Pesquisar colega de clube..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red-500/20 focus:bg-white transition-all text-slate-800"
        />
      </div>

      {/* Leaderboard content or loading loader */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-4 border-brand-red-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-400 font-bold tracking-wider animate-pulse uppercase">Carregando membros...</span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-2xl">
          <Award className="w-10 h-10 text-slate-300 mx-auto stroke-[1.5] mb-2" />
          <p className="text-xs text-slate-500 font-bold">Nenhum concorrente encontrado.</p>
          <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">Comece a completar lições rápidas na página principal do Club para liderar o pelotão!</p>
        </div>
      ) : (
        <div className="space-y-2">
          
          {/* Scrollable list container */}
          <div className="max-h-[360px] overflow-y-auto pr-1 space-y-2 divide-y divide-slate-100/30">
            {filteredUsers.map((user, index) => {
              const rank = index + 1;
              const isMe = user.userId === currentUserId;
              
              // Top 3 medals, decorations
              let rankBadgeStyle = "text-slate-500 bg-slate-100";
              let cardHighlightStyle = "bg-white border-slate-150 hover:bg-slate-50/50";
              let medalIcon = null;

              if (rank === 1) {
                rankBadgeStyle = "bg-brand-gold-400 text-white font-black shadow-sm ring-2 ring-brand-gold-100";
                cardHighlightStyle = "bg-brand-red-50/15 border-brand-gold-300 hover:bg-brand-gold-50/10";
                medalIcon = "🥇";
              } else if (rank === 2) {
                rankBadgeStyle = "bg-slate-300 text-slate-800 font-black shadow-sm ring-2 ring-slate-100";
                cardHighlightStyle = "bg-slate-50/45 border-slate-300 hover:bg-slate-50/80";
                medalIcon = "🥈";
              } else if (rank === 3) {
                rankBadgeStyle = "bg-[#d97706] text-white font-black shadow-sm ring-2 ring-amber-100";
                cardHighlightStyle = "bg-amber-50/10 border-amber-300 hover:bg-amber-50/25";
                medalIcon = "🥉";
              }

              if (isMe) {
                cardHighlightStyle = "bg-brand-navy-900 border-brand-red-500 text-white shadow-md ring-2 ring-brand-red-100 relative z-10 hover:bg-brand-navy-850";
              }

              return (
                <div 
                  key={user.userId}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${cardHighlightStyle}`}
                >
                  
                  {/* Left part: rank icon/badge, user avatar/name/level */}
                  <div className="flex items-center space-x-3.5 min-w-0">
                    
                    {/* Rank container */}
                    <div className="flex flex-col items-center justify-center w-8 h-8">
                      {medalIcon ? (
                        <span className="text-xl leading-none">{medalIcon}</span>
                      ) : (
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                          isMe ? 'bg-brand-red-600 text-white' : rankBadgeStyle
                        }`}>
                          {rank}
                        </span>
                      )}
                    </div>

                    {/* Name & level */}
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <h4 className={`text-xs sm:text-sm font-black truncate max-w-[130px] ${
                          isMe ? 'text-[#ffffff]' : 'text-slate-800'
                        }`}>
                          {user.name}
                        </h4>
                        {isMe && (
                          <span className="bg-brand-red-650 text-[#ffffff] px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider whitespace-nowrap">
                            Você
                          </span>
                        )}
                        {user.subscriptionStatus === 'Activo' && (
                          <span className="text-emerald-500" title="Membro Premium Sabush Club">
                            <UserCheck className="w-3.5 h-3.5 fill-emerald-50 text-emerald-600" />
                          </span>
                        )}
                      </div>

                      {/* User metadata row */}
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className={`text-[9.5px] px-1.5 py-0.5 rounded-md border font-extrabold ${
                          isMe ? 'bg-brand-navy-800 border-brand-navy-700 text-brand-gold-400' : getLevelBadgeClass(user.level)
                        }`}>
                          {formatLevel(user.level)}
                        </span>
                        
                        {user.streak > 0 && (
                          <span className={`flex items-center text-[10px] font-extrabold ${isMe ? 'text-brand-gold-300' : 'text-slate-500'}`}>
                            <Flame className={`w-3 h-3 mr-0.5 fill-brand-gold-400 stroke-brand-gold-650`} />
                            <span>{user.streak} d</span>
                          </span>
                        )}
                      </div>

                    </div>

                  </div>

                  {/* Right part: XP display */}
                  <div className="text-right pl-2 flex-shrink-0">
                    <span className={`text-sm sm:text-base font-black tracking-tight block ${
                      isMe ? 'text-brand-gold-400' : 'text-brand-navy-900'
                    }`}>
                      {user.xp}
                    </span>
                    <span className={`text-[8.5px] font-extrabold block ${
                      isMe ? 'text-slate-300' : 'text-slate-400'
                    }`}>
                      XP Total
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Friendly encouragement footer message */}
          <div className="text-center pt-2.5">
            <p className="text-[10px] text-slate-400 font-bold italic">
              * Rankings atualizados em tempo-real. Estude diariamente para bater o recorde do Club!
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
