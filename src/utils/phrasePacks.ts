import { PhrasePack } from '../types';

export const PHRASE_PACKS: PhrasePack[] = [
  {
    id: 'first_week_job',
    title: 'Primeira Semana no Trabalho',
    description: 'Aprenda termos essenciais de escritório, apresentações e como falar da sua rotina profissional com confiança.',
    icon: '💼',
    lessonIds: ['beg-24', 'int-1', 'int-11'],
    scenarioId: 'business_meeting',
    learningGoal: 'work'
  },
  {
    id: 'job_interview_prep',
    title: 'Entrevista de Emprego',
    description: 'Prepare-se para se destacar: aprenda a falar de conquistas anteriores, prazos de tarefas e a negociar condições.',
    icon: '🎯',
    lessonIds: ['beg-24', 'int-3', 'int-5'],
    scenarioId: 'job_interview',
    learningGoal: 'work'
  },
  {
    id: 'market_shopping',
    title: 'Compras no Mercado',
    description: 'Domine o inglês prático para fazer compras em mercados, negociar preços e pedir comidas e bebidas.',
    icon: '🛍️',
    lessonIds: ['beg-17', 'beg-18', 'int-12'],
    learningGoal: 'conversation'
  },
  {
    id: 'airport_travel',
    title: 'Viagens e Direções',
    description: 'Viaje com segurança! Saiba pedir ajuda ou direções na rua a estrangeiros e comunicar em hotéis e aeroportos.',
    icon: '✈️',
    lessonIds: ['beg-16', 'int-7'],
    scenarioId: 'street_directions',
    learningGoal: 'travel'
  },
  {
    id: 'work_collaboration',
    title: 'Reuniões e Colaboração',
    description: 'Foque em falar fluentemente sobre prazos de projetos, agendar compromissos e expressar discordância educada.',
    icon: '📊',
    lessonIds: ['int-2', 'int-13', 'int-24'],
    scenarioId: 'business_meeting',
    learningGoal: 'work'
  }
];
