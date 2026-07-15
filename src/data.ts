/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lesson, ListeningComprehension, ListeningQuestion } from './types';
import { BEGINNER_LESSONS } from './lessons/beginner';
import { INTERMEDIATE_LESSONS } from './lessons/intermediate';
import { ADVANCED_LESSONS } from './lessons/advanced';

const assignCategories = (lesson: Lesson): string[] => {
  const title = lesson.title.toLowerCase();
  const id = lesson.id;

  const idsGrammar = new Set([
    'beg-6', 'beg-10', 'beg-11', 'beg-12', 'beg-13', 'beg-14', 'beg-15',
    'int-1', 'int-2', 'int-3', 'int-4', 'int-5', 'int-16', 'int-17', 'int-18', 'int-20',
    'adv-3', 'adv-4', 'adv-5'
  ]);

  const idsConversation = new Set([
    'beg-1', 'beg-2', 'beg-3', 'beg-4', 'beg-5', 'beg-15', 'beg-16', 'beg-21', 'beg-25',
    'int-9', 'int-11', 'int-12', 'int-13', 'int-21', 'int-22', 'int-23', 'int-24',
    'adv-1', 'adv-7', 'adv-8', 'adv-12'
  ]);

  const idsVocabulary = new Set([
    'beg-7', 'beg-8', 'beg-9', 'beg-17', 'beg-18', 'beg-19', 'beg-20', 'beg-23', 'beg-24',
    'int-6', 'int-7', 'int-8', 'int-10', 'int-15',
    'adv-2', 'adv-6'
  ]);

  const idsBusiness = new Set([
    'beg-8', 'beg-9', 'beg-24',
    'int-1', 'int-2', 'int-5', 'int-6', 'int-10', 'int-15', 'int-24', 'int-25',
    'adv-1', 'adv-2', 'adv-3', 'adv-4', 'adv-5', 'adv-6', 'adv-11', 'adv-12'
  ]);

  const idsTravel = new Set([
    'beg-3', 'beg-16', 'beg-17', 'beg-18',
    'int-7'
  ]);

  const idsPronunciation = new Set([
    'beg-1', 'beg-6', 'beg-9',
    'int-19',
    'adv-9', 'adv-10'
  ]);

  const priorityOrder = ['Gramática', 'Conversação', 'Vocabulário', 'Negócios', 'Viagem', 'Pronúncia'];

  // Check hardcoded IDs (ground truth)
  const matchedFromId: string[] = [];
  if (idsGrammar.has(id)) matchedFromId.push('Gramática');
  if (idsConversation.has(id)) matchedFromId.push('Conversação');
  if (idsVocabulary.has(id)) matchedFromId.push('Vocabulário');
  if (idsBusiness.has(id)) matchedFromId.push('Negócios');
  if (idsTravel.has(id)) matchedFromId.push('Viagem');
  if (idsPronunciation.has(id)) matchedFromId.push('Pronúncia');

  if (matchedFromId.length > 0) {
    return matchedFromId
      .sort((a, b) => priorityOrder.indexOf(a) - priorityOrder.indexOf(b))
      .slice(0, 2);
  }

  // Fallback to keyword matching
  const categoryKeywords: Record<string, string[]> = {
    'Gramática': ['verb', 'plural', 'preposition', 'conditional', 'word order', 'passive', 'speech'],
    'Conversação': ['greetings', 'dialogue', 'opinion', 'conversation', 'how are you'],
    'Vocabulário': ['number', 'vocab', 'idiom', 'slang', 'days of', 'time', 'family', 'words'],
    'Negócios': ['career', 'job', 'deadline', 'contract', 'negotiat', 'office', 'corporate', 'executive', 'trade'],
    'Viagem': ['airport', 'travel', 'direction', 'market', 'buy', 'destination', 'trip'],
    'Pronúncia': ['alphabet', 'spelling', 'pronunciation', 'accent', 'stress', 'connected speech', 'liaison', 'elision']
  };

  const scores: { category: string; score: number }[] = [];
  for (const cat of priorityOrder) {
    const kws = categoryKeywords[cat] || [];
    let score = 0;
    for (const kw of kws) {
      if (title.includes(kw)) {
        score++;
      }
    }
    if (score > 0) {
      scores.push({ category: cat, score });
    }
  }

  if (scores.length > 0) {
    scores.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return priorityOrder.indexOf(a.category) - priorityOrder.indexOf(b.category);
    });
    return scores.map(item => item.category).slice(0, 2);
  }

  // Fallback if no ID matched and no keyword score > 0
  return ['Vocabulário', 'Conversação'];
};

const generateSpeakingScenario = (lesson: Omit<Lesson, 'categories'>): { prompt: string; promptPt: string } => {
  if (lesson.speakingScenario && lesson.speakingScenario.prompt && lesson.speakingScenario.promptPt) {
    return lesson.speakingScenario;
  }

  const level = lesson.level;
  const title = lesson.title || 'Practice';
  const titlePt = lesson.titlePt || 'Prática';
  
  const maxVocabs = lesson.vocabulary && lesson.vocabulary.length > 0 
    ? lesson.vocabulary.slice(0, 3).map(v => v.en).join(', ')
    : '';
  const maxVocabsPt = lesson.vocabulary && lesson.vocabulary.length > 0 
    ? lesson.vocabulary.slice(0, 3).map(v => `${v.en} (${v.pt})`).join(', ')
    : '';

  const titleLower = title.toLowerCase();
  let defaultEng = '';
  let defaultPt = '';

  if (titleLower.includes('food') || titleLower.includes('restaurant') || titleLower.includes('order') || titleLower.includes('cafe') || titleLower.includes('breakfast') || titleLower.includes('dinner') || titleLower.includes('lunch')) {
    defaultEng = `Imagine you are ordering food or drinks. Record yourself making a polite request or order about "${title}" using vocabulary terms like: "${maxVocabs}". Pretend you are in a café or restaurant!`;
    defaultPt = `Imagine que está a pedir comida ou bebidas. Grave-se a fazer um pedido educado sobre "${titlePt}" usando termos como: "${maxVocabsPt}". Finja que está num café ou restaurante!`;
  } else if (titleLower.includes('job') || titleLower.includes('interview') || titleLower.includes('career') || titleLower.includes('resume') || titleLower.includes('boss') || titleLower.includes('work') || titleLower.includes('office') || titleLower.includes('meeting')) {
    defaultEng = `Imagine you are in a professional workplace or a job interview. Record yourself answering a question or addressing a colleague about "${title}" using key expressions like: "${maxVocabs}". Focus on sounding confident!`;
    defaultPt = `Imagine que está num ambiente de trabalho profissional ou numa entrevista de emprego. Grave-se a responder a uma pergunta ou a dirigir-se a um colega sobre "${titlePt}" usando expressões chave como: "${maxVocabsPt}". Foco em soar confiante!`;
  } else if (titleLower.includes('travel') || titleLower.includes('airport') || titleLower.includes('flight') || titleLower.includes('direction') || titleLower.includes('trip') || titleLower.includes('hotel') || titleLower.includes('destination')) {
    defaultEng = `Imagine you are travelling or seeking directions at the airport/hotel. Record yourself asking for assistance or detailing your trip about "${title}" using helper words like: "${maxVocabs}".`;
    defaultPt = `Imagine que está a viajar ou a pedir direções no aeroporto/hotel. Grave-se a solicitar assistência ou a detalhar a sua viagem sobre "${titlePt}" usando palavras de ajuda como: "${maxVocabsPt}".`;
  } else if (titleLower.includes('shopping') || titleLower.includes('price') || titleLower.includes('buy') || titleLower.includes('sell') || titleLower.includes('market') || titleLower.includes('store') || titleLower.includes('money')) {
    defaultEng = `Imagine you are making a purchase or querying prices at a store. Record yourself negotiating, buying or asking about "${title}" using terms like: "${maxVocabs}".`;
    defaultPt = `Imagine que está a fazer uma compra ou a consultar preços numa loja. Grave-se a negociar, comprar ou perguntar sobre "${titlePt}" usando termos como: "${maxVocabsPt}".`;
  } else {
    if (level === 'beginner') {
      defaultEng = `Practice your English speaking and pronunciation by recording yourself introducing a simple sentence or answer about "${title}" using words such as: "${maxVocabs}". Speak clearly and take your time!`;
      defaultPt = `Pratique a sua fala e pronúncia em inglês gravando-se a apresentar uma frase simples ou resposta sobre "${titlePt}" usando palavras como: "${maxVocabsPt}". Fale com calma e clareza!`;
    } else if (level === 'intermediate') {
      defaultEng = `Create a short situational response for a conversation themed around "${title}". Record yourself explaining, responding to a query, or sharing an experience using words like: "${maxVocabs}". Make it sound natural!`;
      defaultPt = `Crie uma resposta situacional curta para uma conversa com o tema "${titlePt}". Grave-se a explicar, a responder a uma dúvida ou a partilhar uma experiência usando palavras como: "${maxVocabsPt}". Faça soar natural!`;
    } else {
      if (lesson.discussionPrompt) {
        defaultEng = `Review the discussion topic: "${lesson.discussionPrompt}". Record yourself sharing a structured professional opinion or presenting your view out loud. Strive for natural connected speech!`;
        defaultPt = `Reveja o tema de discussão: "${lesson.discussionPromptPt || lesson.discussionPrompt}". Grave-se a partilhar uma opinião profissional bem estruturada ou a apresentar a sua visão em voz alta. Esforce-se para ter um discurso conectado e natural!`;
      } else {
        defaultEng = `Review the advanced lesson "${title}". Record yourself presenting a comprehensive summary, debate point, or strategic outline using advanced vocabulary: "${maxVocabs}". Keep a professional and formal delivery!`;
        defaultPt = `Reveja a lição avançada "${titlePt}". Grave-se a apresentar um resumo detalhado, ponto de debate político/económico, ou plano estratégico usando vocabulário avançado: "${maxVocabsPt}". Mantenha um tom formal e corporativo!`;
      }
    }
  }

  return {
    prompt: defaultEng,
    promptPt: defaultPt
  };
};

const generateListeningComprehension = (lesson: Omit<Lesson, 'categories'>): ListeningComprehension | undefined => {
  if (lesson.listeningComprehension) {
    return lesson.listeningComprehension;
  }

  if (lesson.level === 'beginner') {
    return undefined;
  }

  const title = lesson.title || 'Practice';
  const dialogueLines = lesson.dialogue && lesson.dialogue.length > 0
    ? lesson.dialogue.map(d => `${d.speaker} says: "${d.textEn}"`).join(' ')
    : '';

  const vocabWords = lesson.vocabulary && lesson.vocabulary.length > 0
    ? lesson.vocabulary.slice(0, 2).map(v => v.en)
    : ['English'];

  const rawPassage = `Let's listen to a brief scenario regarding ${title}. Here is what's discussed: ${dialogueLines}`;
  const passage = rawPassage
    .replace(/\bdo not\b/gi, "don't")
    .replace(/\bcannot\b/gi, "can't")
    .replace(/\bI am\b/gi, "I'm")
    .replace(/\bthat is\b/gi, "that's")
    .replace(/\bwe are\b/gi, "we're")
    .replace(/\bthere is\b/gi, "there's");

  const passagePt = `Rascunho de audição para a lição "${lesson.titlePt || title}".`;

  const questions: ListeningQuestion[] = [
    {
      question: `What is the primary topic discussed in this listening passage?`,
      options: [
        `Topics revolving around "${title}"`,
        `Analyzing grammar rules regarding other levels`,
        `Discussing unrelated administrative feedback`,
        `Revising high-stakes speaking assignments`
      ],
      correctAnswerIndex: 0,
      explanation: `Excellent! The full conversation explores topics revolving around ${title}.`
    },
    {
      question: `Which of the following key vocabulary terms from the lesson is highlighted?`,
      options: [
        vocabWords[0],
        'An unrelated industry term',
        'A corporate marketing policy',
        'None of the above'
      ],
      correctAnswerIndex: 0,
      explanation: `Correct! "${vocabWords[0]}" is one of the foundational terms introduced in this lesson.`
    }
  ];

  return {
    passage,
    passagePt,
    questions
  };
};

export const LESSONS: Lesson[] = [
  ...BEGINNER_LESSONS,
  ...INTERMEDIATE_LESSONS,
  ...ADVANCED_LESSONS
].map(lesson => {
  const categories = assignCategories(lesson);
  const speakingScenario = generateSpeakingScenario(lesson);
  const listeningComprehension = generateListeningComprehension(lesson);
  return {
    ...lesson,
    categories,
    speakingScenario,
    listeningComprehension
  };
});

// 6. After the change, log the per-category lesson counts for each level (Beginner/Intermediate/Advanced)
try {
  const priorityOrder = ['Gramática', 'Conversação', 'Vocabulário', 'Negócios', 'Viagem', 'Pronúncia'];
  const levels = ['beginner', 'intermediate', 'advanced'];
  console.log("=== SUCESSO: VERIFICAÇÃO DE CATEGORIAS POR NÍVEL ===");
  levels.forEach(lvl => {
    const lvlLessons = LESSONS.filter(l => l.level === lvl);
    console.log(`Nível: ${lvl.toUpperCase()} (Total: ${lvlLessons.length} aulas)`);
    priorityOrder.forEach(cat => {
      const count = lvlLessons.filter(l => l.categories?.includes(cat)).length;
      console.log(`  - ${cat}: ${count} aulas`);
    });
  });
  console.log("====================================================");
} catch (e) {
  console.warn("Falha ao imprimir estatísticas de categorias:", e);
}

