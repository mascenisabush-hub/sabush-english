/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const GOAL_TO_CATEGORIES_MAP: Record<string, string[]> = {
  work: ['Negócios', 'Conversação'],
  travel: ['Viagem', 'Vocabulário'],
  conversation: ['Conversação', 'Vocabulário'],
  studies: ['Gramática']
};

export function getCategoriesForGoal(goal: string | undefined): string[] {
  if (!goal) return ['Conversação', 'Vocabulário'];
  const g = goal.toLowerCase();
  if (g.includes('work') || g.includes('trabalho') || g.includes('negócio')) {
    return ['Negócios', 'Conversação'];
  }
  if (g.includes('travel') || g.includes('viagem') || g.includes('turismo')) {
    return ['Viagem', 'Vocabulário'];
  }
  if (g.includes('studies') || g.includes('estudo') || g.includes('académic') || g.includes('exame')) {
    return ['Gramática'];
  }
  if (g.includes('conversation') || g.includes('conversação') || g.includes('vida diária') || g.includes('geral')) {
    return ['Conversação', 'Vocabulário'];
  }
  return ['Conversação', 'Vocabulário'];
}

export interface RecommendedGoalContent {
  title: string;
  description: string;
  category: string;
}

export function getRecommendationForGoal(goal: string | undefined): RecommendedGoalContent {
  if (!goal) {
    return {
      title: "Pratique a Conversação Diária",
      description: "Aprenda vocabulário útil, gírias comuns e expressões do quotidiano para falar inglês natural com qualquer pessoa.",
      category: "Conversação"
    };
  }
  
  const g = goal.toLowerCase();
  if (g.includes('work') || g.includes('trabalho') || g.includes('negócio')) {
    return {
      title: "Melhore o seu Inglês de Negócios",
      description: "Aprenda a liderar reuniões, escrever emails formais e conduzir negociações de sucesso em Maputo e no estrangeiro.",
      category: "Negócios"
    };
  }
  if (g.includes('travel') || g.includes('viagem') || g.includes('turismo')) {
    return {
      title: "Prepare-se para Explorar o Mundo",
      description: "Aprenda a comunicar em hotéis, aeroportos, táxis e restaurantes de forma confiante e sem hesitações.",
      category: "Viagem"
    };
  }
  if (g.includes('studies') || g.includes('estudo') || g.includes('académic') || g.includes('exame')) {
    return {
      title: "Domine a Escrita e Gramática Académica",
      description: "Foque na estrutura gramatical perfeita, tempos verbais e redação técnica para exames, ensaios e candidaturas.",
      category: "Gramática"
    };
  }
  
  return {
    title: "Pratique a Conversação Diária",
    description: "Aprenda vocabulário útil, gírias comuns e expressões do quotidiano para falar inglês de forma natural.",
    category: "Conversação"
  };
}
