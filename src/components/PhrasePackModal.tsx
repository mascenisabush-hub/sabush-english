import { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  MessageSquare, 
  Layers, 
  BookOpen, 
  Award, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { PhrasePack } from '../types';
import { LESSONS } from '../data';

interface PhrasePackModalProps {
  pack: PhrasePack;
  onClose: () => void;
  completedLessons: string[];
  completedPacks: string[];
  onCompletePack: (packId: string) => void;
  onNavigateToLesson: (lessonId: string) => void;
  onNavigateToRoleplay: (scenarioId: string) => void;
  onNavigateToFlashcards: (vocabWords: any[]) => void;
}

export function PhrasePackModal({
  pack,
  onClose,
  completedLessons,
  completedPacks,
  onCompletePack,
  onNavigateToLesson,
  onNavigateToRoleplay,
  onNavigateToFlashcards
}: PhrasePackModalProps) {
  // Get all lessons associated with this pack
  const packLessons = LESSONS.filter(l => pack.lessonIds.includes(l.id));
  
  // Extract all vocabulary words from these lessons
  const packVocab = packLessons.flatMap(l => 
    l.vocabulary.map(v => ({
      ...v,
      lessonId: l.id,
      lessonTitle: l.titlePt
    }))
  ).filter((value, index, self) =>
    self.findIndex(v => v.en.toLowerCase() === value.en.toLowerCase()) === index
  );

  // Pack completion state is either already stored in profile or determined locally
  const isPackCompletedInProfile = completedPacks.includes(pack.id);

  // Step 1: Lessons completion
  const step1Completed = pack.lessonIds.every(id => completedLessons.includes(id));
  const completedLessonsCount = packLessons.filter(l => completedLessons.includes(l.id)).length;

  // Step 2: Roleplay completion (manual persist/local storage + auto)
  const [step2Completed, setStep2CompletedState] = useState(() => {
    if (!pack.scenarioId) return true; // auto-completed if no scenario
    try {
      return localStorage.getItem(`sabush_pack_rp_${pack.id}`) === 'true';
    } catch {
      return false;
    }
  });

  // Step 3: Flashcards completion (manual persist/local storage + auto)
  const [step3Completed, setStep3CompletedState] = useState(() => {
    try {
      return localStorage.getItem(`sabush_pack_fc_${pack.id}`) === 'true';
    } catch {
      return false;
    }
  });

  const setStep2Completed = (val: boolean) => {
    setStep2CompletedState(val);
    try {
      localStorage.setItem(`sabush_pack_rp_${pack.id}`, val ? 'true' : 'false');
    } catch (e) {}
  };

  const setStep3Completed = (val: boolean) => {
    setStep3CompletedState(val);
    try {
      localStorage.setItem(`sabush_pack_fc_${pack.id}`, val ? 'true' : 'false');
    } catch (e) {}
  };

  // If already completed in userProfile, force check all steps
  const finalStep1 = isPackCompletedInProfile || step1Completed;
  const finalStep2 = isPackCompletedInProfile || step2Completed;
  const finalStep3 = isPackCompletedInProfile || step3Completed;

  const allCompleted = finalStep1 && finalStep2 && finalStep3;

  const handleFinalizePack = () => {
    if (allCompleted && !isPackCompletedInProfile) {
      onCompletePack(pack.id);
    }
  };

  // Prevent scroll propagation
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[9990] flex items-center justify-center p-4 animate-fade-in no-print">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="relative p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-brand-navy-50/50 to-white">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-navy-50 text-brand-navy-600 flex items-center justify-center text-2xl border border-brand-navy-100 shrink-0">
              {pack.icon}
            </div>
            <div className="space-y-1 pr-6 text-left">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-brand-navy-100 text-brand-navy-800 leading-none">
                Pacote Prático 🇲🇿
              </span>
              <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
                {pack.title}
              </h3>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer border border-transparent hover:border-slate-200"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 text-left">
          
          {/* Pack Description */}
          <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl">
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              {pack.description}
            </p>
          </div>

          {/* Stepper Progress Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
              Passos de Aprendizado ({[finalStep1, finalStep2, finalStep3].filter(Boolean).length}/3)
            </h4>

            {/* Step 1: Lessons */}
            <div className={`p-4 rounded-2xl border transition-all ${finalStep1 ? 'bg-emerald-50/40 border-emerald-150' : 'bg-slate-50/50 border-slate-150'}`}>
              <div className="flex items-start space-x-3.5">
                <div className="mt-0.5 shrink-0">
                  {finalStep1 ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 stroke-[2.5]" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-350 stroke-[2]" />
                  )}
                </div>
                
                <div className="space-y-2 flex-1">
                  <div>
                    <h5 className="text-xs font-black text-slate-800 uppercase tracking-wide leading-none">
                      Passo 1: Concluir as Aulas ({completedLessonsCount}/{packLessons.length})
                    </h5>
                    <p className="text-[11px] text-slate-450 leading-relaxed font-semibold mt-1">
                      Conclua os exercícios e a leitura das lições recomendadas para este objetivo.
                    </p>
                  </div>

                  {/* List of lessons to click/visit */}
                  <div className="space-y-1.5 pt-1.5">
                    {packLessons.map((lesson) => {
                      const isLessonCompleted = completedLessons.includes(lesson.id);
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => onNavigateToLesson(lesson.id)}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between group cursor-pointer ${
                            isLessonCompleted 
                              ? 'bg-emerald-50/20 border-emerald-100 hover:border-emerald-200 text-emerald-850' 
                              : 'bg-white border-slate-200 hover:border-blue-300 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                              {lesson.id.toUpperCase()}
                            </span>
                            <span className="truncate">{lesson.titlePt}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                            {isLessonCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" />}
                            <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Roleplay (AI Tutor Scenario) - Render ONLY if pack has scenarioId */}
            {pack.scenarioId && (
              <div className={`p-4 rounded-2xl border transition-all ${finalStep2 ? 'bg-emerald-50/40 border-emerald-150' : 'bg-slate-50/50 border-slate-150'}`}>
                <div className="flex items-start space-x-3.5">
                  <button 
                    onClick={() => !isPackCompletedInProfile && setStep2Completed(!step2Completed)}
                    disabled={isPackCompletedInProfile}
                    className="mt-0.5 shrink-0 cursor-pointer disabled:cursor-not-allowed"
                    aria-label="Marcar Conversação como Concluída"
                  >
                    {finalStep2 ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 stroke-[2.5]" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-350 stroke-[2] hover:text-slate-450" />
                    )}
                  </button>

                  <div className="space-y-3 flex-1">
                    <div>
                      <h5 className="text-xs font-black text-slate-800 uppercase tracking-wide leading-none">
                        Passo 2: Praticar com o AI Tutor
                      </h5>
                      <p className="text-[11px] text-slate-450 leading-relaxed font-semibold mt-1">
                        Inicie uma simulação de voz ou chat real no cenário correspondente do AI Tutor.
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigateToRoleplay(pack.scenarioId!)}
                      className="inline-flex items-center space-x-2 bg-brand-navy-600 hover:bg-brand-navy-700 text-white font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-xl cursor-pointer shadow-sm active:scale-95 transition-all min-h-[38px]"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Iniciar Simulação Inteligente</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Vocabulary Flashcards */}
            <div className={`p-4 rounded-2xl border transition-all ${finalStep3 ? 'bg-emerald-50/40 border-emerald-150' : 'bg-slate-50/50 border-slate-150'}`}>
              <div className="flex items-start space-x-3.5">
                <button 
                  onClick={() => !isPackCompletedInProfile && setStep3Completed(!step3Completed)}
                  disabled={isPackCompletedInProfile}
                  className="mt-0.5 shrink-0 cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Marcar Vocabulário como Concluído"
                >
                  {finalStep3 ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 stroke-[2.5]" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-350 stroke-[2] hover:text-slate-450" />
                  )}
                </button>

                <div className="space-y-3 flex-1">
                  <div>
                    <h5 className="text-xs font-black text-slate-800 uppercase tracking-wide leading-none">
                      Passo 3: Flashcards de Vocabulário ({packVocab.length} Termos)
                    </h5>
                    <p className="text-[11px] text-slate-450 leading-relaxed font-semibold mt-1">
                      Treine a memorização e a pronúncia bilingue apenas dos termos cruciais deste pacote.
                    </p>
                  </div>

                  <button
                    onClick={() => onNavigateToFlashcards(packVocab)}
                    className="inline-flex items-center space-x-2 bg-brand-navy-600 hover:bg-brand-navy-700 text-white font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-xl cursor-pointer shadow-sm active:scale-95 transition-all min-h-[38px]"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Rever Vocabulário ({packVocab.length})</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex flex-col items-center justify-center space-y-3">
          {isPackCompletedInProfile ? (
            <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-3.5 flex items-center justify-center space-x-2 font-black text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
              <span>Excelente! Pacote Completado 🥳</span>
            </div>
          ) : allCompleted ? (
            <button
              onClick={handleFinalizePack}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black text-xs uppercase tracking-widest py-3.5 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 min-h-[44px]"
            >
              <Award className="w-5 h-5 text-slate-950" />
              <span>Concluir Pacote Prático (+100 XP)</span>
              <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
            </button>
          ) : (
            <div className="w-full text-center text-[11px] text-slate-400 font-bold leading-relaxed">
              Complete todos os 3 passos acima para desbloquear o prémio de conclusão deste pacote! ⭐
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
