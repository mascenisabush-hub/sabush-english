/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lesson } from '../types';

export const INTERMEDIATE_LESSONS: Lesson[] = [
  // ==========================================
  // UNIT 1: PAST, PRESENT, AND FUTURE TENSES IN CONVERSATION
  // ==========================================
  {
    id: 'int-1',
    level: 'intermediate',
    title: 'U1-L1: My Career Journey (Past & Present)',
    titlePt: 'U1-L1: O Meu Percurso (Passado e Presente)',
    introductionPt: 'To build fluency, you must learn to compare your past career experiences with your current job. This lesson helps you move smoothly between Past Simple and Present Simple.',
    vocabulary: [
      { en: 'Career path', pt: 'Caminho / Trajetória de carreira', pronunciation: '/ka-ríir páth/' },
      { en: 'To resume', pt: 'Retomar', pronunciation: '/tú ri-zúum/' },
      { en: 'Currently', pt: 'Atualmente (Falso Amigo! Não significa "correntemente")', pronunciation: '/kâ-rent-li/' },
      { en: 'Previous', pt: 'Anterior', pronunciation: '/príi-vios/' },
      { en: 'To join', pt: 'Juntar-se / Entrar para (uma empresa/clube)', pronunciation: '/tú djóin/' }
    ],
    dialoguePt: 'Diálogo entre Elsa (recrutadora sénior em Maputo) e Samuel (candidato de Sofala):',
    dialogue: [
      { speaker: 'Elsa', textEn: 'Samuel, tell me about your career path. Where did you start?', textPt: 'Samuel, fale-me sobre a sua trajetória de carreira. Onde começou?' },
      { speaker: 'Samuel', textEn: 'I started as an intern in Beira. I worked there for three years. Currently, I live in Maputo and project manage logistics.', textPt: 'Comecei como estagiário na Beira. Trabalhei lá por três anos. Atualmente, vivo em Maputo e faço gestão de projetos de logística.' },
      { speaker: 'Elsa', textEn: 'That is wonderful. Why did you join your current company?', textPt: 'Isso é excelente. Por que se juntou à sua empresa atual?' },
      { speaker: 'Samuel', textEn: 'I joined because they offered more room to grow as an international leader.', textPt: 'Juntei-me porque eles ofereceram mais espaço para crescer como líder internacional.' }
    ],
    explanationPt: 'Grammar Note: "Currently" significa "atualmente". Não use "actually" para isso! Use o "Past Simple" (-ed ou verbos irregulares como "worked", "started") para ações acabadas no passado, e o "Present Simple" ("live", "manage") para situações gerais de hoje.',
    exercise: {
      id: 'ex-int-1',
      question: 'Qual frase compara corretamente o Passado e o Presente?',
      options: [
        'I work in Beira 3 years ago, currently I lived in Maputo.',
        'I worked in Beira 3 years ago, currently I live in Maputo.',
        'I currently working in Beira, and I lived Maputo.',
        'I work in Beira currently, I managing Maputo.'
      ],
      correctAnswerIndex: 1,
      translation: 'Escolha a opção gramaticalmente correta.',
      explanation: 'Correto! "I worked" indica ação passada completa; "currently I live" indica situação no presente.',
      questions: [
        {
          question: 'Como se diz "Atualmente" em inglês formal para trabalho?',
          options: ['Actually', 'Currently', 'Presently too', 'Nowdays'],
          correctAnswerIndex: 1,
          translation: 'Escolha o sinônimo correto para "atualmente".',
          explanation: '"Currently" é o termo preferencial. "Actually" significa "na verdade".'
        },
        {
          question: 'Encontre o erro na frase: "I join the company in 2022 and currently I like it."',
          options: [
            '"join" deve ser "joined" porque aconteceu em 2022.',
            '"like" deve ser "liked" porque é passada.',
            '"currently" está incorreto.',
            'Não há erro.'
          ],
          correctAnswerIndex: 0,
          translation: 'Faça a correção da frase.',
          explanation: 'Exato! Como 2022 é passado completo, deve-se usar "joined" (Regular past Simple).'
        },
        {
          question: 'Complete: "Before Maputo, I ___ in Nampula for a year."',
          options: ['live', 'lived', 'currently live', 'am live'],
          correctAnswerIndex: 1,
          translation: 'Preencha a lacuna com a forma verbal adequada.',
          explanation: '"Before" estabelece o tempo passado, exigindo o verbo no passado simples ("lived").'
        }
      ]
    },
    listeningComprehension: {
      passage: "Samuel tells Elsa that he started out as an intern in Beira and worked there for about three years. Currently, he's living in Maputo and project managing logistics. Samuel joined his current company because they offered way more room to grow as an international leader.",
      passagePt: "O Samuel diz à Elsa que começou como estagiário na Beira e trabalhou lá por cerca de três anos. Atualmente, ele vive em Maputo e faz gestão de projetos de logística. O Samuel juntou-se à sua empresa atual porque eles ofereceram muito mais espaço para crescer como um líder internacional.",
      questions: [
        {
          question: "Where did Samuel start his career as an intern?",
          options: ["Maputo", "Beira", "Sofala", "Nampula"],
          correctAnswerIndex: 1,
          explanation: "Excelente! Samuel mentioned: 'I started as an intern in Beira. I worked there for three years.'"
        },
        {
          question: "Why did Samuel change companies to join his current employer?",
          options: ["To receive a higher salary", "They offered more room to grow as a leader", "To move back to Beira", "To work with Elsa"],
          correctAnswerIndex: 1,
          explanation: "Correct! He joined because they offered more opportunity to grow as an international leader."
        }
      ]
    }
  },
  {
    id: 'int-2',
    level: 'intermediate',
    title: 'U1-L2: Deadlines & Next Steps (Present & Future)',
    titlePt: 'U1-L2: Prazos e Próximos Passos (Presente e Futuro)',
    introductionPt: 'Negotiating timelines in English is critical for professional confidence. Here we practice Present Continuous for scheduled future actions and "will" for spontaneous decisions.',
    vocabulary: [
      { en: 'Deadline', pt: 'Prazo limite / Data de entrega', pronunciation: '/déd-láin/' },
      { en: 'Deliverables', pt: 'Entregáveis / Resultados', pronunciation: '/di-lív-era-bels/' },
      { en: 'To catch up', pt: 'Colocar o assunto em dia', pronunciation: '/tú kétch áp/' },
      { en: 'Urgent', pt: 'Urgente', pronunciation: '/êr-djent/' },
      { en: 'Next steps', pt: 'Próximos passos', pronunciation: '/nékst stéps/' }
    ],
    dialoguePt: 'Conversa de escritório internacional sobre a entrega de relatórios para investidores:',
    dialogue: [
      { speaker: 'Chloe', textEn: 'Hi Jose, we need to finalize the quarterly report. Do you have a deadline?', textPt: 'Olá José, precisamos de finalizar o relatório trimestral. Tens um prazo?' },
      { speaker: 'Jose', textEn: 'Yes! The deadline is tomorrow at noon. We are launching the system next week.', textPt: 'Sim! O prazo limite é amanhã ao meio-dia. Nós vamos lançar o sistema na próxima semana.' },
      { speaker: 'Chloe', textEn: 'Okay, I will review the final draft right now to help you.', textPt: 'Certo, eu vou rever a versão final agora mesmo para te ajudar.' },
      { speaker: 'Jose', textEn: 'Thanks, Chloe. Let us catch up later to define the next steps.', textPt: 'Obrigado, Chloe. Vamos colocar o assunto em dia mais tarde para definir os próximos passos.' }
    ],
    explanationPt: 'Grammar Note: We use "Present Continuous" (we are launching next week) for structured, already fixed future plans. We use "will" (I will review) for decisions made exactly at the moment of speaking.',
    exercise: {
      id: 'ex-int-2',
      question: 'Qual frase expressa uma decisão espontânea de ajuda feita na hora?',
      options: [
        'I am helping you tomorrow fixed.',
        'I will help you with that report right now!',
        'I help you with that currently.',
        'I going to help you at all times.'
      ],
      correctAnswerIndex: 1,
      translation: 'Escolha a decisão voluntária imediata.',
      explanation: 'Correto! Usar "will" (I will help) indica uma reação imediata e voluntária no diálogo.',
      questions: [
        {
          question: 'Para prazos firmes agendados na próxima segunda-feira, a melhor estrutura é:',
          options: [
            'We will meet on Monday (decidido agora).',
            'We are meeting on Monday (já agendado e confirmado).',
            'We meet on Monday.',
            'We met on Monday.'
          ],
          correctAnswerIndex: 1,
          translation: 'Identifique o futuro acordado / planejado.',
          explanation: 'Excelente! "We are meeting" (Present Continuous com sentido de futuro) é muito nativo para compromissos agendados.'
        },
        {
          question: 'O que significa o termo "Deliverables" na rotina corporativa?',
          options: [
            'Entregadores de pizza',
            'Resultados e relatórios concretos a entregar',
            'Prazos perdidos',
            'Colegas de escritório'
          ],
          correctAnswerIndex: 1,
          translation: 'Assinale o conceito real de Deliverables.',
          explanation: '"Deliverables" refere-se a relatórios, arquivos ou produtos pendentes de conclusão e entrega.'
        }
      ]
    },
    listeningComprehension: {
      passage: "Chloe asks Jose about the deadline for the final report. Jose says the deadline's tomorrow at noon. They're launching the system next week, so Chloe decides to help him by reviewing the draft right now. Then they plan to catch up later to define the next steps.",
      passagePt: "A Chloe pergunta ao José sobre o prazo do relatório final. O José diz que o prazo é amanhã ao meio-dia. Eles vão lançar o sistema na próxima semana, por isso a Chloe decide ajudá-lo revendo o rascunho agora mesmo. Depois, planeiam encontrar-se mais tarde para definir os próximos passos.",
      questions: [
        {
          question: "When is the deadline for the quarterly report?",
          options: ["Next week", "Tonight at midnight", "Tomorrow at noon", "In three days"],
          correctAnswerIndex: 2,
          explanation: "Spot on! Jose explicitly stated that the deadline is tomorrow at noon."
        },
        {
          question: "Why is the system being launched next week?",
          options: ["Because they missed the past deadline", "To catch up with regional managers", "It matches their planned scheduled next steps", "To present the completed deliverables"],
          correctAnswerIndex: 2,
          explanation: "That's correct! Launching the system next week is their scheduled next step."
        }
      ]
    }
  },
  {
    id: 'int-3',
    level: 'intermediate',
    title: 'U1-L3: Major Achievements (The Present Perfect)',
    titlePt: 'U1-L3: Grandes Conquistas (O Present Perfect)',
    introductionPt: 'To talk about your life and career history without stating the exact date, English uses the Present Perfect (Have/Has + Past Participle). This is vital for professional CVs!',
    vocabulary: [
      { en: 'To achieve', pt: 'Alcançar / Conquistar', pronunciation: '/tú atchíiv/' },
      { en: 'So far', pt: 'Até agora / Até o momento', pronunciation: '/sóu fár/' },
      { en: 'Major milestone', pt: 'Marco importante', pronunciation: '/méidjor máilstoun/' },
      { en: 'Overseas', pt: 'No estrangeiro / Mar além', pronunciation: '/óuver-síiz/' },
      { en: 'To coordinate', pt: 'Coordenar', pronunciation: '/tú co-órdineit/' }
    ],
    dialoguePt: 'Sofia e Amanda revisam o seu portfólio no escritório de Maputo:',
    dialogue: [
      { speaker: 'Sofia', textEn: 'I have coordinated three projects in Maputo Port so far.', textPt: 'Eu coordenei três projetos no Porto de Maputo até agora.' },
      { speaker: 'Amanda', textEn: 'Wow, that is a major milestone. Have you ever worked overseas?', textPt: 'Uau, esse é um marco importante. Já trabalhaste no estrangeiro?' },
      { speaker: 'Sofia', textEn: 'No, I have not worked overseas yet, but I have managed teams from South Africa.', textPt: 'Não, ainda não trabalhei no estrangeiro, mas administrei equipas da África do Sul.' }
    ],
    explanationPt: 'Grammar Note: Use "Present Perfect" for actions in an indefinite time in the past up to the present. Use: Subjeito + have/has + Particípio do Verbo. "I worked" (específico no passado) vs "I have worked" (experiência de vida geral, sem data específica!).',
    exercise: {
      id: 'ex-int-3',
      question: 'Qual frase expressa uma conquista profissional na vida sem data definida?',
      options: [
        'I managed three international teams in 2020.',
        'I have managed three international projects in my career.',
        'I manage three projects yesterday.',
        'I was managing projects on Monday morning.'
      ],
      correctAnswerIndex: 1,
      translation: 'Escolha a frase típica de conquistas profissionais indefinidas.',
      explanation: 'Exato! "I have managed" foca no fato/conquista, não no ano. O Past Simple exige tempo definido (in 2020).',
      questions: [
        {
          question: 'Como fica a negação de: "He has coordinated the event"?',
          options: [
            'He has not coordinated the event yet.',
            'He did not coordinated the event.',
            'He no has coordinate the event.',
            'He not has coordinated.'
          ],
          correctAnswerIndex: 0,
          translation: 'Identifique a negação no Present Perfect.',
          explanation: 'Correto! Adicionamos "not" após o auxiliar: "He has not (or hasn\'t) coordinated... ".'
        },
        {
          question: 'O que significa a expressão "So far" no trabalho?',
          options: ['Tão distante', 'Até o momento / Até agora', 'Dificilmente', 'Com certeza'],
          correctAnswerIndex: 1,
          translation: 'Significado de so far.',
          explanation: '"So far" é muito comum para quantificar progresso temporário até o dia de hoje.'
        }
      ]
    },
    listeningComprehension: {
      passage: "Sofia tells Amanda she's coordinated three projects at the Maputo Port so far. Amanda thinks that's a major milestone and asks if Sofia's ever worked overseas. Sofia hasn't worked overseas yet, but she's managed various teams from South Africa.",
      passagePt: "A Sofia diz à Amanda que coordenou três projetos no Porto de Maputo até agora. A Amanda acha que esse é um marco importante e pergunta se a Sofia já trabalhou no estrangeiro. A Sofia ainda não trabalhou no estrangeiro, mas administrou várias equipas da África do Sul.",
      questions: [
        {
          question: "How many projects has Sofia coordinated at the Maputo Port so far?",
          options: ["Five projects", "Three projects", "None yet", "Ten projects"],
          correctAnswerIndex: 1,
          explanation: "Perfect! Sofia says: 'I have coordinated three projects in Maputo Port so far.'"
        },
        {
          question: "Has Sofia ever worked overseas directly?",
          options: ["Yes, multiple times", "Only in South Africa", "No, not yet", "Yes, in Beira"],
          correctAnswerIndex: 2,
          explanation: "Correct! Sofia says: 'No, I have not worked overseas yet, but I have managed teams from South Africa.'"
        }
      ]
    }
  },
  {
    id: 'int-4',
    level: 'intermediate',
    title: 'U1-L4: Habits vs Sudden Events (Past Simple vs Past Continuous)',
    titlePt: 'U1-L4: Hábitos vs Eventos Súbitos (Passado Contínuo)',
    introductionPt: 'Learn how to describe and explain incidents or situations where a continuous action in the past was interrupted by a sudden event.',
    vocabulary: [
      { en: 'While', pt: 'Enquanto', pronunciation: '/uáil/' },
      { en: 'Suddenly', pt: 'De repente / Súbitamente', pronunciation: '/sád-en-li/' },
      { en: 'Power outage', pt: 'Corte de energia / Apagão', pronunciation: '/páuer áutedj/' },
      { en: 'To save', pt: 'Salvar / Guardar (documentos)', pronunciation: '/tú séiv/' },
      { en: 'To crash', pt: 'Travar / Parar de funcionar (computador/software)', pronunciation: '/tú crésh/' }
    ],
    dialoguePt: 'Explicação de atraso de relatório técnico entre Manuel e o seu supervisor técnico:',
    dialogue: [
      { speaker: 'Supervisor', textEn: 'Manuel, why is the logistic sheet incomplete?', textPt: 'Manuel, por que a folha de logística está incompleta?' },
      { speaker: 'Manuel', textEn: 'I was editing the sheet yesterday when suddenly a power outage occurred, and my computer crashed!', textPt: 'Eu estava a editar a folha ontem quando de repente ocorreu um corte de energia e o meu computador parou!' },
      { speaker: 'Supervisor', textEn: 'Oh no! Did you save your progress before it shut down?', textPt: 'Oh não! Salvaste o teu progresso antes de desligar?' },
      { speaker: 'Manuel', textEn: 'Fortunately, yes. The spreadsheet auto-saved.', textPt: 'Felizmente, sim. A folha de cálculo guardou automaticamente.' }
    ],
    explanationPt: 'Grammar Note: Use "Past Continuous" (was/were +verb-ing) for the longer, background action (I was editing), and "Past Simple" for the shorter action that interrupted it (a power outage occurred).',
    exercise: {
      id: 'ex-int-4',
      question: 'Qual é a estrutura correta para combinar as duas ações passadas no trabalho?',
      options: [
        'I was working on the computer when it suddenly crashed.',
        'I worked on the computer when it was suddenly crashing.',
        'I was worked when the computer crash.',
        'I am working when the computer crash yesterday.'
      ],
      correctAnswerIndex: 0,
      translation: 'Escolha a frase correspondente à interrupção de ação passada.',
      explanation: 'Perfeito! "I was working" ( background action) e "crashed" (interrupted action) é a estrutura padrão.',
      questions: [
        {
          question: 'Como traduzimos "Corte / Falha de energia"?',
          options: ['Power off', 'Power outage', 'Light finish', 'Energy breakdown'],
          correctAnswerIndex: 1,
          translation: 'Escolha o termo nativo inglês correto.',
          explanation: '"Power outage" ou "power cut" é o termo padrão para interrupção de eletricidade.'
        },
        {
          question: 'Preencha a lacuna: "While she ___ the proposal, her colleague called her."',
          options: ['was writing', 'wrote', 'writes', 'is writing'],
          correctAnswerIndex: 0,
          translation: 'Complete para expressar ação contínua no passado.',
          explanation: 'A palavra "while" (enquanto) geralmente exige o Past Continuous ("was writing").'
        }
      ]
    }
  },
  {
    id: 'int-5',
    level: 'intermediate',
    title: 'U1-L5: Negotiating Contracts (Will vs Going To)',
    titlePt: 'U1-L5: Negociar Próximos Passos (Will vs Going To)',
    introductionPt: 'Master the subtle difference between structured intentions (going to) and promises or immediate resolutions (will) during business negotiation chats.',
    vocabulary: [
      { en: 'Proposal', pt: 'Proposta / Oferecimento', pronunciation: '/pro-póuzal/' },
      { en: 'Agreement', pt: 'Acordo / Contrato assinado', pronunciation: '/a-gríiment/' },
      { en: 'To sign', pt: 'Assinar', pronunciation: '/tú sáin/' },
      { en: 'To provide', pt: 'Fornecer / Prover', pronunciation: '/tú pro-váid/' },
      { en: 'As soon as possible', pt: 'O mais rápido possível (ASAP)', pronunciation: '/éz súun éz póssibel/' }
    ],
    dialoguePt: 'Negociação de serviços de portaria entre Alfredo e Sônia no escritório central:',
    dialogue: [
      { speaker: 'Alfredo', textEn: 'We are going to sign the transport agreement next Monday.', textPt: 'Nós vamos assinar o acordo de transporte na próxima segunda-feira.' },
      { speaker: 'Sônia', textEn: 'That is perfect. Will you provide the vehicles by then?', textPt: 'Isso é perfeito. Vão fornecer os veículos até lá?' },
      { speaker: 'Alfredo', textEn: 'Yes, we will. I will email you the official documentation as soon as possible.', textPt: 'Sim, nós forneceremos. Vou enviar-te a documentação oficial por e-mail o mais rápido possível.' }
    ],
    explanationPt: 'Grammar Note: "Going to" handles plans already decided (We are going to sign), whereas "will" is for promises, immediate offers, or requests (I will email you).',
    exercise: {
      id: 'ex-int-5',
      question: 'Complete a promessa do fornecedor: "Don\'t worry, we ___ deliver the contract today."',
      options: ['going to', 'will', 'is going to', 'are will'],
      correctAnswerIndex: 1,
      translation: 'Assinale a alternativa que expressa uma promessa profissional firme.',
      explanation: 'Correto! Usamos "will" para promessas e garantias contratuais imediatas.',
      questions: [
        {
          question: 'Se você já tomou a decisão de comprar o material de escritório no próximo mês, diga:',
          options: [
            'I am going to buy the material next month.',
            'I will buy the material tomorrow maybe.',
            'I buy the material next month.',
            'I buys the material next month.'
          ],
          correctAnswerIndex: 0,
          translation: 'Insira a estrutura para decisões planejadas.',
          explanation: '"I am going to buy" representa uma decisão premeditada, ideal para planejamento empresarial.'
        },
        {
          question: 'O que significa a abreviação "ASAP" amplamente usada em comunicações corporativas?',
          options: [
            'Sempre que for necessário',
            'O mais rápido possível (As soon as possible)',
            'Garantia de qualidade máxima',
            'Apenas com aviso prévio'
          ],
          correctAnswerIndex: 1,
          translation: 'Identifique o termo corporativo comum.',
          explanation: '"As soon as possible" é reduzido formalmente no ambiente de negócios para "ASAP".'
        }
      ]
    }
  },

  // ==========================================
  // UNIT 2: COMMON IDIOMS & EXPRESSIONS MOZAMBICANS ENCOUNTER
  // ==========================================
  {
    id: 'int-6',
    level: 'intermediate',
    title: 'U2-L1: Hit the Ground Running (Work Idioms)',
    titlePt: 'U2-L1: Entrar com Tudo (Expressões de Trabalho)',
    introductionPt: 'To understand colleagues from across the globe, you need idioms. These phrases sound strange if translated word-by-word, but carry powerful career meanings.',
    vocabulary: [
      { en: 'To hit the ground running', pt: 'Começar com energia e sem hesitar / Entrar com tudo', pronunciation: '/tú hít dã gráund rân-ing/' },
      { en: 'To wrap up', pt: 'Concluir / Finalizar (tarefa, reunião)', pronunciation: '/tú répuáp/' },
      { en: 'On the same page', pt: 'Em total sintonia / sintonizados', pronunciation: '/ón dã séim péidj/' },
      { en: 'To think outside the box', pt: 'Pensar de forma inovadora/fora da caixa', pronunciation: '/tú fínk áut-sáid dã bóks/' }
    ],
    dialoguePt: 'Alinhamento corporativo rápido entre Diana e Liam:',
    dialogue: [
      { speaker: 'Liam', textEn: 'Welcome to the team, Diana! We have a lot of work. Can you hit the ground running?', textPt: 'Bem-vinda à equipa, Diana! Temos muito trabalho. Podes começar com tudo?' },
      { speaker: 'Diana', textEn: 'Absolutely. I want to make sure we are on the same page first.', textPt: 'Absolutamente. Quero garantir que estamos na mesma página primeiro.' },
      { speaker: 'Liam', textEn: 'Great. Let us think outside the box to wrap up this proposal today.', textPt: 'Ótimo. Vamos pensar fora da caixa para concluir esta proposta hoje.' }
    ],
    explanationPt: 'Idioms Note: "Hit the ground running" significa começar uma atividade imediatamente com muito sucesso e determinação. "Wrap up" é concluir uma fase ou reunião.',
    exercise: {
      id: 'ex-int-6',
      question: 'O que significa "We are on the same page"?',
      options: [
        'Nós estamos a ler o mesmo livro físico.',
        'Nós temos o mesmo ponto de vista / estamos em sintonia.',
        'Temos de assinar a mesma página do contrato.',
        'Estamos atrasados com as nossas leituras.'
      ],
      correctAnswerIndex: 1,
      translation: 'Traduza o sentido figurado da expressão.',
      explanation: 'Genial! "To be on the same page" significa estar alinhado com os mesmos objetivos ou ideias.',
      questions: [
        {
          question: 'Como você sugere a conclusão de uma reunião profissional?',
          options: [
            'Let us wrap up this meeting.',
            'Let us hit the ground of the meeting.',
            'Let us box outside the meeting.',
            'Let us finish up under pages.'
          ],
          correctAnswerIndex: 0,
          translation: 'Identifique o idioma correto.',
          explanation: '"Wrap up" é a expressão corporativa padrão para encerrar reuniões.'
        },
        {
          question: 'O que significa contratar alguém que sabe "think outside the box"?',
          options: [
            'Alguém que empacota caixas industriais.',
            'Alguém com ideias criativas e inovadoras.',
            'Alguém que obedece a regras rígidas.',
            'Alguém que trabalha fora de Moçambique.'
          ],
          correctAnswerIndex: 1,
          translation: 'Defina a expressão.',
          explanation: '"Think outside the box" é incentivar criatividade disruptiva e resolver problemas de forma inovadora.'
        }
      ]
    }
  },
  {
    id: 'int-7',
    level: 'intermediate',
    title: 'U2-L2: On the Fly (Travel & Airport Expressions)',
    titlePt: 'U2-L2: No Improviso (Expressões de Viagens)',
    introductionPt: 'International business involves travel. Discover practical travel idioms that go beyond standard phrasebooks.',
    vocabulary: [
      { en: 'On the fly', pt: 'De improviso / Feito rapidamente sem planejamento', pronunciation: '/ón dã flái/' },
      { en: 'To catch a flight', pt: 'Apanhar um voo', pronunciation: '/tú kétch á fláit/' },
      { en: 'Touch and go', pt: 'Situação incerta / arriscada', pronunciation: '/tátch end góu/' },
      { en: 'Safe travels!', pt: 'Boa viagem! / Viagem segura!', pronunciation: '/séif tré-vels/' }
    ],
    dialoguePt: 'Conversa no terminal do Aeroporto de Mavalane entre Amelia e David:',
    dialogue: [
      { speaker: 'David', textEn: 'Are you ready to catch your flight to Johannesburg?', textPt: 'Estás pronta para apanhar o teu voo para Joanesburgo?' },
      { speaker: 'Amelia', textEn: 'Yes, but the weather is bad. The departure is touch and go.', textPt: 'Sim, mas o tempo está mau. A partida está muito incerta.' },
      { speaker: 'David', textEn: 'Don\'t worry. If things change, you will resolve it on the fly. Safe travels!', textPt: 'Não te preocupes. Se as coisas mudarem, vais resolver no improviso. Boa viagem!' }
    ],
    explanationPt: 'Idioms Note: "Touch and go" refere-se a algo incerto ou precário. "On the fly" indica fazer algo imediatamente, de improviso, sem tempo de planeamento formal.',
    exercise: {
      id: 'ex-int-7',
      question: 'Se a aprovação de uma viagem está muito difícil e incerta, você diz que está:',
      options: [
        'On the fly',
        'Touch and go',
        'Catching a flight',
        'Safe travels'
      ],
      correctAnswerIndex: 1,
      translation: 'Escolha a expressão para descrever uma situação incerta.',
      explanation: 'Correto! "Touch and go" descreve uma situação em que não há certeza se o resultado será favorável ou seguro.',
      questions: [
        {
          question: 'O que significa resolver um problema técnico "on the fly"?',
          options: [
            'Resolver voando alto.',
            'Resolver de improviso, muito rapidamente enquanto a ação acontece.',
            'Demorar semanas com relatórios complexos.',
            'Ignorar o problema.'
          ],
          correctAnswerIndex: 1,
          translation: 'Identifique o significado de "on the fly".',
          explanation: '"On the fly" significa agir de improviso e de forma ágil.'
        },
        {
          question: 'Para desejar boa viagem a um colega estrangeiro de partida, dizemos:',
          options: [
            'Good exit!',
            'Safe travels!',
            'Fly high!',
            'Airport happiness!'
          ],
          correctAnswerIndex: 1,
          translation: 'Assinale a saudação de partida correta.',
          explanation: '"Safe travels!" é a forma calorosa e profissional de desejar uma jornada segura.'
        }
      ]
    }
  },
  {
    id: 'int-8',
    level: 'intermediate',
    title: 'U2-L3: Going Viral (Social Media & Tech Idioms)',
    titlePt: 'U2-L3: Viralizar (Internet e Redes Sociais)',
    introductionPt: 'Everyone is sharing files online! Learn modern digital and social media expressions that are native to corporate and conversational English today.',
    vocabulary: [
      { en: 'To go viral', pt: 'Viralizar nas redes', pronunciation: '/tú góu vái-ral/' },
      { en: 'To stream', pt: 'Transmitir / Assistir em fluxo contínuo', pronunciation: '/tú stríim/' },
      { en: 'Clickbait', pt: 'Título iscador / Caça-clique', pronunciation: '/klík-béit/' },
      { en: 'Trending topic', pt: 'Assunto do momento', pronunciation: '/trénd-ing tó-pik/' }
    ],
    dialoguePt: 'Discussão de marketing digital entre Raul e Emma na sua start-up em Maputo:',
    dialogue: [
      { speaker: 'Emma', textEn: 'Raul, did you see our last post? It is going viral on LinkedIn!', textPt: 'Raul, viste a nossa última publicação? Está a viralizar no LinkedIn!' },
      { speaker: 'Raul', textEn: 'Yes! It is a trending topic in Mozambique today. But did we write clickbait?', textPt: 'Sim! É o assunto do momento em Moçambique hoje. Mas nós escrevemos um título enganoso?' },
      { speaker: 'Emma', textEn: 'No, it is actual real data. Tomorrow we are going to stream a live Q&A session.', textPt: 'Não, são dados reais. Amanhã nós vamos transmitir uma sessão de perguntas e respostas ao vivo.' }
    ],
    explanationPt: 'Culture Note: "Clickbait" refere-se a títulos de notícias ou posts exagerados criados apenas para fazer o utilizador clicar, frequentemente dececionando o visitante. Evite fazer clickbait no trabalho!',
    exercise: {
      id: 'ex-int-8',
      question: 'O que caracteriza um título como "Clickbait"?',
      options: [
        'É uma notícia cientificamente comprovada e oficial.',
        'Um título exagerado ou enganoso feito para forçar cliques.',
        'Um stream de vídeo de alta resolução de Moçambique.',
        'Um post sem imagem ou texto correspondente.'
      ],
      correctAnswerIndex: 1,
      translation: 'Identifique a definição do termo Clickbait.',
      explanation: 'Perfeito! "Clickbait" é literal "isca de clique".',
      questions: [
        {
          question: 'Como dizemos que um tema de desenvolvimento económico é o mais comentado na internet hoje?',
          options: [
            'It is a trending topic.',
            'It is a virus.',
            'It is a clicked bait.',
            'It is streaming hot.'
          ],
          correctAnswerIndex: 0,
          translation: 'Assinale a opção ideal para assunto do momento.',
          explanation: '"Trending topic" é e continua a ser o termo correto para o tema mais comentado nos canais digitais.'
        },
        {
          question: 'O que significa "to stream" um evento?',
          options: [
            'Pesquisá-lo no Google.',
            'Transmiti-lo ao vivo pela internet.',
            'Apagar o ficheiro.',
            'Tratar de documentos físicos.'
          ],
          correctAnswerIndex: 1,
          translation: 'Traduza o verbo tecnológico.',
          explanation: '"To stream" é transmitir dados multimédia em tempo real.'
        }
      ]
    }
  },
  {
    id: 'int-9',
    level: 'intermediate',
    title: 'U2-L4: Speak of the Devil (Social Dialogue)',
    titlePt: 'U2-L4: Falar no Diabo (Expressões Sociais)',
    introductionPt: 'To chat informally over coffee or during corporate lunch breaks, native speakers use lively conversational templates.',
    vocabulary: [
      { en: 'Speak of the devil', pt: 'Falar no diabo (e ele aparecer)', pronunciation: '/spíik óv dã dé-vel/' },
      { en: 'To pull someone\'s leg', pt: 'Brincar ou fazer piada com alguém / Troçar', pronunciation: '/tú púl sám-uáns lég/' },
      { en: 'A piece of cake', pt: 'Estar papado / Ser uma papa / Muito fácil', pronunciation: '/á píis óv kéik/' },
      { en: 'To cost an arm and a leg', pt: 'Custar os olhos da cara / Muito caro', pronunciation: '/tú cóst én árm end á lég/' }
    ],
    dialoguePt: 'Pausa para café descontraída entre Alfredo e Sônia:',
    dialogue: [
      { speaker: 'Sônia', textEn: 'Did you buy the new office pro software? Is it cheap?', textPt: 'Compraste o novo software profissional? É barato?' },
      { speaker: 'Alfredo', textEn: 'No! It costs an arm and a leg, Sonia.', textPt: 'Não! Custa os olhos da cara, Sonia.' },
      { speaker: 'Sônia', textEn: 'Really? The installation is a piece of cake though.', textPt: 'A sério? Mas a instalação é muito fácil (uma papa).' },
      { speaker: 'Alfredo', textEn: 'Look, there is our software support engineer, John! Speak of the devil...', textPt: 'Olha, ali vem o nosso engenheiro de suporte de software, John! Falando no diabo...' }
    ],
    explanationPt: 'Cultural Idiom: "Speak of the devil" é o nosso famoso "falar no diabo (aparece o rabo)" quando de repente a pessoa de quem falávamos aparece de surpresa. "Pulling your leg" significa apenas estar a brincar consigo ou contar uma mentirinha inocente.',
    exercise: {
      id: 'ex-int-9',
      question: 'Se um teste de colocação de inglês foi "a piece of cake", isso significa:',
      options: [
        'Que o teste tinha muitas fatias de bolo reais.',
        'Que o teste foi extremamente fácil de resolver.',
        'Que o teste foi muito difícil e amargo.',
        'Que o teste correu mal e precisa de ser cancelado.'
      ],
      correctAnswerIndex: 1,
      translation: 'Traduza o sentido figurado de a piece of cake.',
      explanation: 'Genial! "A piece of cake" é literalmente a nossa expressão moçambicana para "ser uma papa" ou "estar papado" de tão fácil.',
      questions: [
        {
          question: 'Qual é a melhor resposta quando alguém diz que cobrou caro e diz: "It cost an arm and a leg"?',
          options: [
            'That was incredibly expensive indeed.',
            'Excellent! It was very cheap and free.',
            'That sounds like a piece of cake.',
            'Let us speak of the devil then.'
          ],
          correctAnswerIndex: 0,
          translation: 'Identifique a reação correta.',
          explanation: '"Cost an arm and a leg" representa custos elevados de aquisição, logo "incredibly expensive" é correto.'
        },
        {
          question: 'O que significa se alguém diz "I am just pulling your leg"?',
          options: [
            'Estou a tentar dar rasteira.',
            'Estou a puxar-te as orelhas.',
            'Estou só a brincar contigo.',
            'Estou com pressa.'
          ],
          correctAnswerIndex: 2,
          translation: 'Explique a expressão de piada.',
          explanation: '"Pull someone\'s leg" significa contar algo fictício só por diversão ou piada.'
        }
      ]
    }
  },
  {
    id: 'int-10',
    level: 'intermediate',
    title: 'U2-L5: In the Loop (Business Idioms)',
    titlePt: 'U2-L5: Por Dentro de Tudo (Idiomas de Negócios)',
    introductionPt: 'Stay updated and communicate professionally. We will study expressions that describe keeping people updated or working together.',
    vocabulary: [
      { en: 'To keep in the loop', pt: 'Manter alguém informado / Por dentro de tudo', pronunciation: '/tú kíip ín dã lúup/' },
      { en: 'To touch base', pt: 'Fazer um contacto breve para combinar coisas', pronunciation: '/tú tátch béis/' },
      { en: 'Call it a day', pt: 'Dar o dia por terminado / Parar de trabalhar por hoje', pronunciation: '/kól ít á déi/' },
      { en: 'Under the weather', pt: 'Indisposto / Ligeiramente doente ou murcho', pronunciation: '/ánder dã uéd-er/' }
    ],
    dialoguePt: 'Gerente da Beira e oficial de Maputo acertando o encerramento do expediente:',
    dialogue: [
      { speaker: 'Manager', textEn: 'Hello Armando. Our partner is under the weather today, so the meeting is canceled.', textPt: 'Olá Armando. O nosso cliente está indisposto hoje, por isso a reunião foi cancelada.' },
      { speaker: 'Armando', textEn: 'Okay, thanks. Let us touch base tomorrow morning then.', textPt: 'Certo, obrigado. Vamos conversar brevemente amanhã de manhã então.' },
      { speaker: 'Manager', textEn: 'Perfect. Keep me in the loop with any email updates. Let us call it a day!', textPt: 'Perfeito. Mantém-me informado de qualquer novidade por e-mail. Vamos dar o dia por terminado!' }
    ],
    explanationPt: 'Phrasing Guide: "Call it a day" é a expressão mais simpática e usada nos escritórios internacionais para sugerir o encerramento das atividades de trabalho daquele dia.',
    exercise: {
      id: 'ex-int-10',
      question: 'O que significa sugerir "Let us call it a day"?',
      options: [
        'Vamos ligar para o telefone do cliente agora.',
        'Vamos dar por terminado o trabalho de hoje.',
        'Precisamos de trabalhar horas extraordinárias à noite.',
        'Vamos comemorar um aniversário no escritório.'
      ],
      correctAnswerIndex: 1,
      translation: 'Qual é o sentido profissional de call it a day?',
      explanation: 'Exato! Desejar "call it a day" diz à equipa que o trabalho acabou com sucesso por hoje.',
      questions: [
        {
          question: 'Como dizemos que pretendemos contactar alguém brevemente para saber novidades?',
          options: [
            'I will touch base with you.',
            'I will call it a day with you.',
            'I will keep you under the weather.',
            'I will hit the loop of base.'
          ],
          correctAnswerIndex: 0,
          translation: 'Identifique a locução profissional.',
          explanation: '"To touch base" é usado para o famoso "fazer um ponto de status rápido" com conexões.'
        },
        {
          question: 'Se um colega não veio ao serviço porque está "under the weather", ele está:',
          options: [
            'Debaixo de chuva pesada.',
            'Indisposto ou doente.',
            'A viajar de barco.',
            'Preocupado com o tempo climático.'
          ],
          correctAnswerIndex: 1,
          translation: 'Traduza o sentido de indisposição.',
          explanation: '"Under the weather" é o eufemismo polido e comum para alguém doente.'
        }
      ]
    }
  },

  // ==========================================
  // UNIT 3: WRITING EMAILS AND MESSAGES (FORMAL & INFORMAL)
  // ==========================================
  {
    id: 'int-11',
    level: 'intermediate',
    title: 'U3-L1: Professional Openings & Closings',
    titlePt: 'U3-L1: Aberturas e Fechos de E-mail Formais',
    introductionPt: 'To write to international organizations or companies, you must avoid bad literal translations from Portuguese. Master professional openers and closures.',
    vocabulary: [
      { en: 'Dear <Name>', pt: 'Prezado / Caro <Nome> (Abertura formal)', pronunciation: '/díir/' },
      { en: 'I hope this email finds you well', pt: 'Espero que este e-mail o/a encontre bem (Abertura nativa comum)', pronunciation: '/ái hóup díz í-meil fáindz iú uél/' },
      { en: 'Best regards', pt: 'Atenciosamente / Com os melhores cumprimentos (Fecho formal)', pronunciation: '/bést ri-gárdz/' },
      { en: 'Sincerely', pt: 'Sinceramente / Respeitosamente', pronunciation: '/sin-síir-li/' }
    ],
    dialoguePt: 'Modelo prático de e-mail enviado por Samuel de Maputo para um diretor na África do Sul:',
    dialogue: [
      { speaker: 'Email Heading', textEn: 'Subject: Collaboration Proposal - Port Logistics', textPt: 'Assunto: Proposta de Colaboração - Logística Portuária' },
      { speaker: 'Email Body', textEn: 'Dear Mr. Peterson, I hope this email finds you well. We are finalizing our transportation strategy.', textPt: 'Caro Sr. Peterson, espero que este e-mail o encontre bem. Nós estamos a finalizar a nossa estratégia de transportes.' },
      { speaker: 'Email Footer', textEn: 'Sincerely, Samuel Ndlovu. Best regards.', textPt: 'Atenciosamente, Samuel Ndlovu. Com os melhores cumprimentos.' }
    ],
    explanationPt: 'Email Mastery: Em inglês formal, nunca feche e-mails de trabalho importantes com "kisses" (beijos) ou "hugs" (abraços), mesmo que diga isso em português. Use sempre "Best regards" ou "Sincerely". "Dear" é usado no início, mesmo para homens.',
    exercise: {
      id: 'ex-int-11',
      question: 'Qual é o fecho formal de negócios mais recomendado para e-mails?',
      options: [
        'Kisses and hugs',
        'Best regards',
        'Hello my dear',
        'Good night forever'
      ],
      correctAnswerIndex: 1,
      translation: 'Escolha o encerramento correto para correspondência profissional.',
      explanation: 'Correto! "Best regards" ou "Kind regards" é o padrão internacional número um da escrita empresarial.',
      questions: [
        {
          question: 'Como se inicia um e-mail formal dirigido a uma pessoa desconhecida ou cargo diretivo?',
          options: [
            'Hey there!',
            'Dear Sir/Madam,',
            'Actually Director,',
            'Hello my colleague!'
          ],
          correctAnswerIndex: 1,
          translation: 'Identifique o início de e-mail formal genérico.',
          explanation: '"Dear Sir/Madam," é a fórmula de ouro para destinatários cujos nomes ainda desconhece.'
        },
        {
          question: 'O que significa a expressão introdutória "I hope this email finds you well"?',
          options: [
            'Espero que consiga encontrar este e-mail perdido.',
            'Espero que este e-mail o encontre bem de saúde e vida.',
            'Espero que esteja a ler com boa iluminação.',
            'Não tenho pressa no retorno.'
          ],
          correctAnswerIndex: 1,
          translation: 'Compreenda a saudação padrão inicial.',
          explanation: 'Esta frase demonstra profissionalismo, carinho e excelentes maneiras na etiqueta de escrita digital de língua inglesa.'
        }
      ]
    }
  },
  {
    id: 'int-12',
    level: 'intermediate',
    title: 'U3-L2: Polite Requests & Follow-ups',
    titlePt: 'U3-L2: Pedidos Educados e Seguimento',
    introductionPt: 'Asking for updates in English requires politeness. If you say "I want you to send...", it sounds aggressive and demanding. Learn elegant, soft requests.',
    vocabulary: [
      { en: 'Could you please...?', pt: 'Poderia, por favor...?', pronunciation: '/kúd iú plíiz/' },
      { en: 'I would appreciate it if...', pt: 'Eu apreciaria / ficaria grato se...', pronunciation: '/ái wúd e-príi-shieit ít íf/' },
      { en: 'To follow up on', pt: 'Dar seguimento a / Acompanhar o status de', pronunciation: '/tú fó-lou áp ón/' },
      { en: 'Status update', pt: 'Atualização de situação / status', pronunciation: '/sté-tus áp-deit/' }
    ],
    dialoguePt: 'Escrita de WhatsApp corporativo de cobrança de documento comercial de Sofia para Liam:',
    dialogue: [
      { speaker: 'Sofia (Form)', textEn: 'Dear Liam, I am writing to follow up on the transport rates.', textPt: 'Caro Liam, escrevo para fazer o seguimento das tarifas de transporte.' },
      { speaker: 'Sofia (Polite Req)', textEn: 'Could you please send the status update today? I would appreciate it.', textPt: 'Poderias, por favor, enviar o status hoje? Ficaria muito agradecida.' },
      { speaker: 'Liam', textEn: 'Hi Sofia, of course! I will provide the file after lunch.', textPt: 'Olá Sofia, claro! Vou disponibilizar o ficheiro logo depois do almoço.' }
    ],
    explanationPt: 'Grammar Note: "Could you please..." + Verbo básico é a forma mais eficaz e polida em reuniões e e-mails de pedir ações. Evite traduzir o imperativo direto ("mandar relatórios").',
    exercise: {
      id: 'ex-int-12',
      question: 'Como reescrever a exigência agressiva "Send me the document now!" de forma elegante?',
      options: [
        'I want document now please.',
        'Could you please send me the document at your earliest convenience?',
        'You have to send document now otherwise.',
        'We require the document instantly fast.'
      ],
      correctAnswerIndex: 1,
      translation: 'Assinale a alternativa que suaviza o pedido imperativo.',
      explanation: '"Could you please send me the document..." é a substituição ideal. Polidez gera colaboração rápida nos negócios.',
      questions: [
        {
          question: 'O que fazemos quando enviamos um e-mail para acompanhar um assunto pendente anterior?',
          options: [
            'We follow down.',
            'We follow up.',
            'We wrap down.',
            'We check out.'
          ],
          correctAnswerIndex: 1,
          translation: 'Identifique o phrasal verb correcto.',
          explanation: '"To follow up" significa verificar o progresso e recordar polidamente sobre um assunto em aberto.'
        },
        {
          question: 'Como traduzimos a expressão "Ficaria muito grato se..."?',
          options: [
            'I will thank you if',
            'I would appreciate it if...',
            'I have appreciation if...',
            'I would like thanks for...'
          ],
          correctAnswerIndex: 1,
          translation: 'Escolha a correspondente polida.',
          explanation: '"I would appreciate it if..." é uma das fórmulas de escrita corporativa mais refinadas de pedir auxílio.'
        }
      ]
    }
  },
  {
    id: 'int-13',
    level: 'intermediate',
    title: 'U3-L3: Scheduling & Rescheduling Meetings',
    titlePt: 'U3-L3: Agendar e Adiar Reuniões por E-mail',
    introductionPt: 'Learn how to propose meeting dates, check availability, or politely ask to reschedule when an emergency occurs.',
    vocabulary: [
      { en: 'To schedule', pt: 'Agendar / Programar uma reunião', pronunciation: '/tú ské-djul/' },
      { en: 'To reschedule', pt: 'Remarcar / Reagendar', pronunciation: '/tú ri-ské-djul/' },
      { en: 'Are you available?', pt: 'Estás disponível?', pronunciation: '/ár iú a-véi-label/' },
      { en: 'To postpone', pt: 'Adiar', pronunciation: '/tú post-póun/' },
      { en: 'Conflict', pt: 'Conflito de horários / compromissos', pronunciation: '/kón-flikt/' }
    ],
    dialoguePt: 'E-mail para remarcação de reunião técnica entre Raul e Chloe:',
    dialogue: [
      { speaker: 'Raul', textEn: 'Hello Chloe, are you available for a quick call on Wednesday at 10 AM?', textPt: 'Olá Chloe, estás disponível para uma chamada rápida na quarta-feira às 10:00 h?' },
      { speaker: 'Chloe', textEn: 'Unfortunately, I have a schedule conflict. Could we reschedule for Thursday?', textPt: 'Infelizmente, tenho um conflito de horário. Poderíamos remarcar para quinta-feira?' },
      { speaker: 'Raul', textEn: 'Yes, absolutely. I will update the calendar invitation.', textPt: 'Sim, claro. Vou atualizar o convite do calendário.' }
    ],
    explanationPt: 'Grammar Note: "To postpone" é o termo formal para adiar acontecimentos. Evite usar "throw to future". Diga "Could we postpone our call until next week?" de maneira profissional.',
    exercise: {
      id: 'ex-int-13',
      question: 'Como se pergunta se a pessoa tem disponibilidade de horário?',
      options: [
        'Have you free space?',
        'Are you available?',
        'Do you exist tomorrow?',
        'Is your schedule empty now?'
      ],
      correctAnswerIndex: 1,
      translation: 'Escolha a pergunta de disponibilidade preferencial dos nativos.',
      explanation: '"Are you available?" (/ár iú a-véi-label/) é a frase profissional e direta de excelência.',
      questions: [
        {
          question: 'O que fazemos quando remarcamos uma reunião?',
          options: [
            'We plan.',
            'We schedule.',
            'We reschedule.',
            'We postpone.'
          ],
          correctAnswerIndex: 2,
          translation: 'Identifique o termo de remarcação.',
          explanation: '"Reschedule" (Re + schedule) significa literalmente reagendar o evento para novo horário.'
        },
        {
          question: 'Se você tem outro compromisso no mesmo horário da chamada, você tem um:',
          options: ['Problem date', 'Schedule conflict', 'Time error', 'Missed call'],
          correctAnswerIndex: 1,
          translation: 'Selecione o termo técnico empresarial.',
          explanation: '"Schedule conflict" descreve a incompatibilidade de duas agendas simultâneas com sobriedade.'
        }
      ]
    }
  },
  {
    id: 'int-14',
    level: 'intermediate',
    title: 'U3-L4: Apologizing for Delays & Issues',
    titlePt: 'U3-L4: Desculpar-se por Atrasos e Falhas',
    introductionPt: 'Apologizing for delays is a common scenario. Doing it with elegance in business English maintains clients trust and retains respect.',
    vocabulary: [
      { en: 'I apologize for the delay', pt: 'Peço imensas desculpas pelo atraso', pronunciation: '/ái a-pó-lodjaiz for dã di-léi/' },
      { en: 'Slight delay', pt: 'Ligeiro atraso', pronunciation: '/sláit di-léi/' },
      { en: 'Thank you for your patience', pt: 'Obrigado pela sua paciência', pronunciation: '/ténk iú for iór péi-shens/' },
      { en: 'Oversight', pt: 'Descuido / Lapso involuntário', pronunciation: '/óu-ver-sáit/' },
      { en: 'Resolution', pt: 'Resolução / Solução definitiva', pronunciation: '/re-zo-liú-shen/' }
    ],
    dialoguePt: 'E-mail polido tratando da retificação de um pagamento corporativo atrasado:',
    dialogue: [
      { speaker: 'Alfredo', textEn: 'Dear Sonia, I apologize for the delay in sending the receipt. It was an oversight.', textPt: 'Cara Sonia, peço desculpa pelo atraso no envio do recibo. Foi um descuido/lapso.' },
      { speaker: 'Sonia', textEn: 'Thank you for the update. Is the financial resolution ready?', textPt: 'Obrigada pela atualização. A resolução financeira está pronta?' },
      { speaker: 'Alfredo', textEn: 'Yes! Thank you for your patience. The transfer is completed.', textPt: 'Sim! Obrigado pela paciência. A transferência está concluída.' }
    ],
    explanationPt: 'Etiquette Tip: Em vez de justificar um e-mail com desculpas informais como "I slept badly", use sempre "Please accept my apologies for..." ou a frase clássica "Thank you for your patience" que valoriza o cliente.',
    exercise: {
      id: 'ex-int-14',
      question: 'Qual é a forma ideal de agradecer polidamente a espera do cliente pelo envio do projeto?',
      options: [
        'Sorry, I have many works.',
        'Thank you for your patience.',
        'Excuse me, we are slow.',
        'Sorry you had to wait forever.'
      ],
      correctAnswerIndex: 1,
      translation: 'Escolha a resposta elegante com foco em customer attention.',
      explanation: '"Thank you for your patience" é o agradecimento profissional mais bem-visto no mercado mundial.',
      questions: [
        {
          question: 'Como dizemos de forma corporativa "Pedir desculpas por um lapso de atenção"?',
          options: [
            'I apologize for the oversight.',
            'Sorry my structural error.',
            'That was my stupid mistake.',
            'I have apologies of light.'
          ],
          correctAnswerIndex: 0,
          translation: 'Selecione a versão polida.',
          explanation: '"Oversight" refere-se a um descuido sem intenção maldosa, sendo uma palavra excelente.'
        },
        {
          question: 'O que significa a palavra "Slight"?',
          options: ['Pesado', 'Ligeiro / Leve / Pequeno', 'Completo', 'Estranho'],
          correctAnswerIndex: 1,
          translation: 'Traduza o adjetivo.',
          explanation: '"Slight" significa ligeiro ou em pequena dimensão (Ex: "a slight delay" = um ligeiro atraso).'
        }
      ]
    }
  },
  {
    id: 'int-15',
    level: 'intermediate',
    title: 'U3-L5: Fast Messaging Slang & Abbreviations (WhatsApp/Slack)',
    titlePt: 'U3-L5: Mensagens Rápidas e Abreviaturas Informais',
    introductionPt: 'Modern work communication is fast. Discover core business abbreviations encountered daily in digital chats, emails, and channels.',
    vocabulary: [
      { en: 'FYI', pt: 'Para sua informação / Para vosso conhecimento', pronunciation: '/éf-uái-ái/' },
      { en: 'BTW', pt: 'Por sinal / A propósito / Já agora', pronunciation: '/bí-tábel-iú/' },
      { en: 'ETA', pt: 'Tempo Estimado de Chegada (Carga ou Pessoa)', pronunciation: '/í-tí-êi/' },
      { en: 'EOD', pt: 'Até ao final do dia (End of Day)', pronunciation: '/í-óu-dí/' },
      { en: 'TBD', pt: 'A ser determinado / A definir', pronunciation: '/tí-bí-dí/' }
    ],
    dialoguePt: 'Conversa no canal Slack da equipa técnica sobre o projeto em curso:',
    dialogue: [
      { speaker: 'Liam', textEn: 'Hi team, FYI, the meeting with the South African representatives is tomorrow. What is the ETA for the design slides?', textPt: 'Olá equipa, para vossa informação, a reunião com os representantes sul-africanos é amanhã. Qual é o tempo estimado de entrega dos slides do design?' },
      { speaker: 'Gerson', textEn: 'I will submit them by EOD. The venue is TBD, BTW.', textPt: 'Vou submetê-los até ao fim do dia. O local da reunião ainda está por definir, já agora.' },
      { speaker: 'Liam', textEn: 'Awesome. Thanks!', textPt: 'Excelente. Obrigado!' }
    ],
    explanationPt: 'Abbreviations decoding: "FYI" = For Your Information. "ETA" = Estimated Time of Arrival. "EOD" = End of Day (normalmente até às 17:00h do expediente). "TBD" = To Be Determined (ainda não decidido).',
    exercise: {
      id: 'ex-int-15',
      question: 'Se o diretor técnico lhe pede um relatório "by EOD", qual é o prazo limite para a entrega?',
      options: [
        'Na próxima quarta-feira de manhã.',
        'Até ao final do dia profissional de hoje.',
        'O mais rápido possível, em 10 minutos.',
        'A definir no próximo calendário.'
      ],
      correctAnswerIndex: 1,
      translation: 'Assinale o real prazo limite de EOD.',
      explanation: 'Exato! "EOD" significa "End of Day", ou seja, antes do encerramento do escritório no dia corrente.',
      questions: [
        {
          question: 'O que significa a abreviatura "TBD" numa minuta de projeto?',
          options: [
            'Totalmente Bem Desenvolvido.',
            'A ser determinado / ainda em decisão.',
            'Atrasado por dificuldades locais.',
            'Confirmado e fechado.'
          ],
          correctAnswerIndex: 1,
          translation: 'Identifique o conceito de TBD.',
          explanation: '"To Be Determined" indica algo que vai acontecer mas cujos dados precisos dependem de decisões futuras.'
        },
        {
          question: 'Qual abreviatura usamos para dizer "A propósito / Já agora" no início de uma ideia nova?',
          options: ['ETA', 'FYI', 'BTW', 'EOD'],
          correctAnswerIndex: 2,
          translation: 'Identifique a forma idiomática.',
          explanation: '"BTW" significa "By The Way", equivalente ao nosso "a propósito" ou "já agora".'
        }
      ]
    }
  },

  // ==========================================
  // UNIT 4: COMMON MISTAKES PORTUGUESE SPEAKERS MAKE
  // ==========================================
  {
    id: 'int-16',
    level: 'intermediate',
    title: 'U4-L1: False Cognates (Actually vs Currently)',
    titlePt: 'U4-L1: Falsos Amigos (Pretend, Actually e Outros)',
    introductionPt: 'Portuguese and English share Latin origins, but several words are false friends! Master the ones that cause issues in interviews and professional meetings.',
    vocabulary: [
      { en: 'Actually', pt: 'Na verdade / O facto é que (Falso Cognato de Atualmente)', pronunciation: '/ék-tchuali/' },
      { en: 'To pretend', pt: 'Fingir (Falso Cognato de Pretender)', pronunciation: '/tú pri-ténd/' },
      { en: 'To intend', pt: 'Pretender / Ter intenção de', pronunciation: '/tú ín-ténd/' },
      { en: 'Prejudice', pt: 'Preconceito (Falso Cognato de Prejuízo)', pronunciation: '/pré-djú-dis/' },
      { en: 'Damage / Loss', pt: 'Prejuízo financeiro / Danos', pronunciation: '/démedj / lós/' }
    ],
    dialoguePt: 'Esclarecimento de mal-entendidos linguísticos numa entrevista por José com Américo:',
    dialogue: [
      { speaker: 'Americo', textEn: 'Do you pretend to sign the international contract today?', textPt: 'Finges assinar o contrato internacional hoje? (Uso errado de Pretend!)' },
      { speaker: 'Jose (Corrects)', textEn: 'Actually, I think you mean "intend to sign". I do not pretend, I want it!', textPt: 'Na verdade, acho que quis dizer "pretender assinar". Eu não finjo, eu quero!' },
      { speaker: 'Americo', textEn: 'My apologies. Yes! I meant: what is your real intention today?', textPt: 'As minhas desculpas. Sim! Eu quis dizer: qual é a sua real intenção hoje?' }
    ],
    explanationPt: 'False Friend Warning: "Pretend" significa FINGIR (como brincar às escondidas). Para expressar intenção ("eu pretendo"), use "I intend to". "Actually" significa "Na verdade/Na realidade" (geralmente usado para corrigir uma informação de forma educada).',
    exercise: {
      id: 'ex-int-16',
      question: 'Se um cliente fala de forma educada "Actually, we are happy with Mozambique Port...", o que ele quis dizer?',
      options: [
        'Atualmente estamos felizes com o porto.',
        'Na verdade / Realmente estamos felizes com o porto.',
        'Fingimos estar felizes com o porto.',
        'Pretendemos estar felizes com o porto.'
      ],
      correctAnswerIndex: 1,
      translation: 'Interprete correctamente o uso de Actually.',
      explanation: 'Sensacional! "Actually" serve para contrapor ideias com o sentido de "na verdade" ou "realmente".',
      questions: [
        {
          question: 'Como se escreve corretamente "Eu pretendo estudar inglês avançado amanhã"?',
          options: [
            'I pretend to study advanced English tomorrow.',
            'I intend to study advanced English tomorrow.',
            'I have prejudice of studying tomorrow.',
            'I actually to study tomorrow.'
          ],
          correctAnswerIndex: 1,
          translation: 'Traduza correctamente "pretender".',
          explanation: '"Intend" significa querer, planejar ou pretender realizar. "Pretend" significa simular, fingir.'
        },
        {
          question: 'O termo "Prejudice" significa o quê?',
          options: [
            'Perda financeira de uma empresa.',
            'Preconceito ou discriminação contra alguém.',
            'Julgamento jurídico rápido.',
            'Decisão justa.'
          ],
          correctAnswerIndex: 1,
          translation: 'Significado de prejudice.',
          explanation: '"Prejudice" é um falso amigo perigoso. Significa preconceito. Para prejuízos comerciais, usamos "loss" ou "damage".'
        }
      ]
    }
  },
  {
    id: 'int-17',
    level: 'intermediate',
    title: 'U4-L2: Prepositions: IN, ON, AT',
    titlePt: 'U4-L2: Domínio das Preposições: IN, ON, AT',
    introductionPt: 'In Portuguese, "em" covers almost everything. In English, you must divide them correctly by size and precision: IN (general/huge), ON (surface/day), AT (precise spot/hour).',
    vocabulary: [
      { en: 'In Maputo / In 2026', pt: 'Em Maputo / Em 2026 (Grandes dimensões / tempos amplos)', pronunciation: '/ín/' },
      { en: 'On Monday / On the table', pt: 'Na segunda-feira / Sobre a mesa (Dias específicos / superfícies)', pronunciation: '/ón/' },
      { en: 'At 10 AM / At the office', pt: 'Às 10:00 h / No escritório (Ponto exato / Horários)', pronunciation: '/ét/' }
    ],
    dialoguePt: 'Coordenação de agenda de viagens e reuniões corporativas:',
    dialogue: [
      { speaker: 'Elsa', textEn: 'Will the meeting take place at the agency?', textPt: 'A reunião vai realizar-se na agência? (Ponto exato)' },
      { speaker: 'Raul', textEn: 'Yes! It is on Friday at 9 o\'clock. Many partners are arriving in Mozambique next month.', textPt: 'Sim! É na sexta-feira às 9 horas. Muitos parceiros estão a chegar a Moçambique no próximo mês.' }
    ],
    explanationPt: 'Preposition Trick: Use IN para países, cidades, meses, anos e séculos (In Mozambique, In July). Use ON para dias da semana ou datas completas (On Friday, On June 5th). Use AT para horas e pontos de localização precisos (At 3 PM, At the door).',
    exercise: {
      id: 'ex-int-17',
      question: 'Complete a frase de viagem: "We met our partner ___ the airport ___ Friday ___ 10:30."',
      options: [
        'in / in / on',
        'at / on / at',
        'on / at / in',
        'at / in / at'
      ],
      correctAnswerIndex: 1,
      translation: 'Aplique as preposições na frase fornecida.',
      explanation: 'Incrível! "At the airport" (ponto), "on Friday" (dia) e "at 10:30" (hora) é a combinação perfeita.',
      questions: [
        {
          question: 'Para o ano "in 2026" ou "at 2026"?',
          options: ['at 2026', 'on 2026', 'in 2026', 'into 2026'],
          correctAnswerIndex: 2,
          translation: 'Identifique a preposição temporal correta.',
          explanation: 'Para anos específicos inteiros, "in" é a preposição exigida (Ex: in 2026).'
        },
        {
          question: 'Complete: "The important file is ___ the floor. Please pick it up."',
          options: ['in', 'on', 'at', 'under table'],
          correctAnswerIndex: 1,
          translation: 'Preecha a lacuna.',
          explanation: 'Com superfícies horizontais como chão (floor) ou mesa (desk), usamos "on".'
        }
      ]
    }
  },
  {
    id: 'int-18',
    level: 'intermediate',
    title: 'U4-L3: Word Order (Adjectives First)',
    titlePt: 'U4-L3: Ordem de Palavras (Adjetivo Primeiro)',
    introductionPt: 'In Portuguese, we write "relatório anual". In English, the descriptive word (adjective) must always stand BEFORE the noun (the item).',
    vocabulary: [
      { en: 'Financial report', pt: 'Relatório financeiro (Foco na ordem)', pronunciation: '/fai-nén-shal ri-pórt/' },
      { en: 'Experienced manager', pt: 'Gestor experiente', pronunciation: '/eks-píirien-st mé-nedjer/' },
      { en: 'Excellent proposal', pt: 'Proposta excelente', pronunciation: '/éks-el-ent pro-póuzal/' },
      { en: 'Noun', pt: 'Substantivo / Nome do objeto', pronunciation: '/náun/' }
    ],
    dialoguePt: 'Conversa técnica de revisão de portfólio de engenharia de Diana com Liam:',
    dialogue: [
      { speaker: 'Liam', textEn: 'Did you hire the new structural engineer?', textPt: 'Contrataste o novo engenheiro estrutural? (Ordem invertida em PT)' },
      { speaker: 'Diana', textEn: 'Yes! He has professional experience and presented a beautiful design last week.', textPt: 'Sim! Ele tem experiência profissional e apresentou um belo projeto na semana passada.' }
    ],
    explanationPt: 'Word Order Secret: Adjetivos nunca mudam para o plural e sempre precedem as coisas que qualificam. Diga "international projects" (nunca "projects internationals") e "green energy" (nunca "energy green").',
    exercise: {
      id: 'ex-int-18',
      question: 'Como traduzimos "reunião financeira muito importante"?',
      options: [
        'A very important financial meeting',
        'A meeting financial very important',
        'A very meeting financial important',
        'A financial meeting very important'
      ],
      correctAnswerIndex: 0,
      translation: 'Construa na ordem padrão correta.',
      explanation: 'Brilhante! O inglês empilha os descritores: "very important" (muito importante) + "financial" (financeira) anterior ao substantivo "meeting".',
      questions: [
        {
          question: 'Como escrevemos o plural de "gestores excelentes"?',
          options: [
            'excellents managers',
            'excellent managers',
            'managers excellents',
            'excellent manager'
          ],
          correctAnswerIndex: 1,
          translation: 'Identifique o adjetivo no plural.',
          explanation: 'Adjetivos em inglês nunca ganham "s" de plural! Sendo assim, "excellent managers" é o correto.'
        },
        {
          question: 'Corrija se necessário: "I have a contract new and international."',
          options: [
            'I have a new and international contract.',
            'I have a contract new international.',
            'I has contract international new.',
            'Sem erro.'
          ],
          correctAnswerIndex: 0,
          translation: 'Corrija a ordem de atributos.',
          explanation: 'Os qualificadores "new" e "international" vêm antes de "contract".'
        }
      ]
    }
  },
  {
    id: 'int-19',
    level: 'intermediate',
    title: 'U4-L4: Doubt vs Question & Replying "De Nada"',
    titlePt: 'U4-L4: Question vs Doubt e Responder de Nada',
    introductionPt: 'Saying "I have a doubt" to an English speaker makes them think you do not trust them (since doubt = desconfiança em inglês). Learn correct usage of "Question" and how to reply "De nada" professionally.',
    vocabulary: [
      { en: 'I have a question', pt: 'Tenho uma dúvida / pergunta (Melhor uso)', pronunciation: '/ái hév á kués-tchen/' },
      { en: 'Doubt', pt: 'Dúvida (sentido de incerteza / falta de fé)', pronunciation: '/dáut/' },
      { en: 'No worries / My pleasure', pt: 'De nada / prazer meu (Alternativas modernas a You are Welcome)', pronunciation: '/nóu uâ-riz / mái plé-jer/' },
      { en: 'To solve', pt: 'Resolver', pronunciation: '/tú sólv/' }
    ],
    dialoguePt: 'Esclarecimento técnico no fim de aula de formação empresarial:',
    dialogue: [
      { speaker: 'Evelyn', textEn: 'Do you have any questions before we close the session today?', textPt: 'Têm alguma dúvida / pergunta antes de fecharmos a sessão hoje?' },
      { speaker: 'Anselmo', textEn: 'Yes, Gerson and I have a question about the budget. Could you brief us?', textPt: 'Sim, o Gerson e eu temos uma dúvida sobre o orçamento. Poderia explicar resumidamente?' },
      { speaker: 'Evelyn', textEn: 'Clear! Here is the slide. Thanks for registering.', textPt: 'Claro! Aqui está o slide. Obrigado por se inscreverem.' },
      { speaker: 'Anselmo', textEn: 'Thank you very much!', textPt: 'Muito obrigado!' },
      { speaker: 'Evelyn', textEn: 'My pleasure. Have a great evening.', textPt: 'De nada (prazer meu). Tenham um ótimo final de dia.' }
    ],
    explanationPt: 'Language Tip: A letra "B" em "Doubt" é muda! Pronuncia-se `/dáut/`. Nunca diga "I have a doubt" para tirar dúvidas de trabalho. Diga sempre "I have a question" (Tenho uma pergunta/dúvida). No worries / My pleasure representam ótimas variações casuais a You are welcome.',
    exercise: {
      id: 'ex-int-19',
      question: 'Se quiser interromper educadamente uma reunião para tirar uma dúvida sobre planos, você diz:',
      options: [
        'Excuse me, I have a big doubt about the budget.',
        'Excuse me, I have a question about the budget.',
        'Sorry, I has many doubles of the balance.',
        'Excuse me, I don\'t believe you (doubt).'
      ],
      correctAnswerIndex: 1,
      translation: 'Escolha a frase idiomática para tirar dúvidas.',
      explanation: 'Genial! "I have a question" é a fórmula de negócios educada para pedir clarificação de conceitos.',
      questions: [
        {
          question: 'Qual alternativa serve como resposta simpática a "Thank you"?',
          options: [
            'Never mind!',
            'My pleasure!',
            'Excuse me too!',
            'Actually good!'
          ],
          correctAnswerIndex: 1,
          translation: 'Identifique a resposta cortês para "Obrigado".',
          explanation: '"My pleasure!" (o prazer é meu) ou "No worries!" (sem problemas) são alternativas muito simpáticas.'
        },
        {
          question: 'Por que "I have many doubts about your business" soa negativo para um nativo?',
          options: [
            'Porque significa que está a acusá-los de mentira ou falível.',
            'Porque sugere que não percebe nada.',
            'Porque é gramaticalmente impossível no plural.',
            'Não soa negativo.'
          ],
          correctAnswerIndex: 0,
          translation: 'Explique a diferença de sentido de Doubt.',
          explanation: '"Doubt" expressa incerteza profunda ou desconfiança. "Question" é neutro e técnico.'
        }
      ]
    }
  },
  {
    id: 'int-20',
    level: 'intermediate',
    title: 'U4-L5: Prepositions for Actions: TO vs FOR',
    titlePt: 'U4-L5: Preposições para Ações: TO vs FOR',
    introductionPt: 'One of the most continuous challenges! In general, TO represents destination, motion, or transfer, and FOR represents purpose, benefit, or service.',
    vocabulary: [
      { en: 'To send TO someone', pt: 'Enviar PARA alguém (Transferência)', pronunciation: '/tú sénd tú/' },
      { en: 'To make FOR someone', pt: 'Fazer PARA alguém (Benefício / Ajuda)', pronunciation: '/tú méik for/' },
      { en: 'To study for the exam', pt: 'Estudar para o exame (Propósito)', pronunciation: '/stá-di for/' },
      { en: 'Destination', pt: 'Destino', pronunciation: '/des-ti-néi-shen/' }
    ],
    dialoguePt: 'Conversa no escritório sobre a elaboração de slides de propostas de parceria:',
    dialogue: [
      { speaker: 'Raul', textEn: 'I made these creative presentation slides for you, Helen.', textPt: 'Fiz estes slides de apresentação criativos para ti, Helen. (Para teu benefício)' },
      { speaker: 'Helen', textEn: 'Thank you! Can you send the email to the regional director now?', textPt: 'Obrigada! Podes mandar o e-mail para o diretor regional agora? (Destinatário fixo)' },
      { speaker: 'Raul', textEn: 'Yes, I will send the files to him immediately.', textPt: 'Sim, vou enviar os ficheiros para ele imediatamente.' }
    ],
    explanationPt: 'Grammar Rule: Use "TO" para focar no movimento ou destino (I talk TO him, I go TO Beira, send files TO clients). Use "FOR" para benefício, trocas de favor, ou motivos (I did this FOR you, I work FOR safety).',
    exercise: {
      id: 'ex-int-20',
      question: 'Complete: "I bought this new laptop ___ my work, and I will travel ___ Nampula soon."',
      options: [
        'for / to',
        'to / for',
        'for / for',
        'to / to'
      ],
      correctAnswerIndex: 0,
      translation: 'Escolha a combinação de benefício e direção.',
      explanation: 'Exito total! "for my work" (propósito/benefício) e "to Nampula" (relação de movimento/destino) é a estrutura padrão.',
      questions: [
        {
          question: 'Complete com o destinatário de e-mail correcto: "We forwarded the document ___ the human resource department."',
          options: ['for', 'to', 'into', 'by'],
          correctAnswerIndex: 1,
          translation: 'Escolha a preposição de encaminhamento.',
          explanation: '"Forward TO" indica o destino de transferência do arquivo ou texto.'
        },
        {
          question: 'Diga a frase equivalente a "Eu trabalho para esta agência":',
          options: [
            'I work for this agency.',
            'I work to this agency.',
            'I work with to this agency.',
            'I am work to agency.'
          ],
          correctAnswerIndex: 0,
          translation: 'Traduza o emprego.',
          explanation: 'Para indicar a quem presta serviço ou benefício, usamos "I work for...".'
        }
      ]
    }
  },

  // ==========================================
  // UNIT 5: CONVERSATIONAL TOPICS: OPINIONS, MEMORIES, ADVICE
  // ==========================================
  {
    id: 'int-21',
    level: 'intermediate',
    title: 'U5-L1: Sharing Your Opinions Fluently',
    titlePt: 'U5-L1: Partilhar a sua Opinião com Fluência',
    introductionPt: 'To talk in discussion panels or express ideas in corporate alignment rooms, you must vary your speech instead of only saying "I think".',
    vocabulary: [
      { en: 'In my opinion...', pt: 'Na minha opinião...', pronunciation: '/ín mái o-pín-ien/' },
      { en: 'From my perspective...', pt: 'Da minha perspectiva / ponto de vista...', pronunciation: '/fróm mái per-spék-tiv/' },
      { en: 'To agree completely', pt: 'Concordar inteiramente', pronunciation: '/tú a-gríi com-plíit-li/' },
      { en: 'As far as I am concerned...', pt: 'No que me diz respeito / Do meu ponto de vista...', pronunciation: '/éz fár éz ái em con-sérnd/' }
    ],
    dialoguePt: 'Painel de debate sobre marketing focado em pequenas empresas locais moçambicanas:',
    dialogue: [
      { speaker: 'Moderator', textEn: 'Raul, what is your view on social media marketing for local shops?', textPt: 'Raul, qual é a sua visão sobre marketing digital para lojas locais?' },
      { speaker: 'Raul', textEn: 'From my perspective, small shops in Mozambique need mobile payments first. Social media comes later.', textPt: 'Do meu ponto de vista, as lojas pequenas em Moçambique precisam de pagamentos móveis primeiro. As redes vêm depois.' },
      { speaker: 'Elsa', textEn: 'I agree completely. In my opinion, M-Pesa integration is the priority.', textPt: 'Concordo inteiramente. Na minha opinião, a integração com M-Pesa é a prioridade.' }
    ],
    explanationPt: 'Advanced Templates: "From my perspective" ou "As far as I\'m concerned" demonstram que domina construções refinadas e evitam a repetição do simples "I think" no debate corporativo.',
    exercise: {
      id: 'ex-int-21',
      question: 'Qual expressão inicia uma visão baseada em perspectiva própria com elegância?',
      options: [
        'Actually I speaking is',
        'From my perspective,...',
        'I think bad is',
        'My brain says...'
      ],
      correctAnswerIndex: 1,
      translation: 'Escolha a introdução de opinião polida.',
      explanation: 'Perfeito! "From my perspective..." permite-lhe começar discursos profissionais com alta reputação de clareza.',
      questions: [
        {
          question: 'Como diz "Concordo inteiramente" com a proposta de valor do colega?',
          options: [
            'I agree completely.',
            'I am agree fully.',
            'I have agreement total.',
            'I completely agree and of course.'
          ],
          correctAnswerIndex: 0,
          translation: 'Expresse concordância completa de forma polida.',
          explanation: '"I agree completely" ou "I completely agree" é o verbo direto na afirmativa.'
        },
        {
          question: 'Para expressar "No que me diz respeito / Do meu ponto de vista", qual é a frase correspondente avançada?',
          options: [
            'As far as I am concerned...',
            'My opinion is my opinion...',
            'I don\'t mind if...',
            'Dear concerned...'
          ],
          correctAnswerIndex: 0,
          translation: 'Identifique a estrutura avançada.',
          explanation: '"As far as I am concerned" é uma transição espetacular utilizada em discursos burocráticos e argumentações de alto nível.'
        }
      ]
    }
  },
  {
    id: 'int-22',
    level: 'intermediate',
    title: 'U5-L2: Telling or Describing Memories',
    titlePt: 'U5-L2: Descrever Experiências e Memórias',
    introductionPt: 'Learn how to describe past travels, memories, or tell unforgettable stories using narrative markers like "First of all", "After that", and "At the end".',
    vocabulary: [
      { en: 'First of all...', pt: 'Antes de mais nada / Primeiro de tudo...', pronunciation: '/férst óv ól/' },
      { en: 'After that...', pt: 'Depois disso / Logo a seguir...', pronunciation: '/áfter dét/' },
      { en: 'Unforgettable experience', pt: 'Experiência inesquecível', pronunciation: '/an-for-gét-abel eks-píiriens/' },
      { en: 'Eventually', pt: 'No final / Com o tempo (Falso Cognato! Não significa "eventualmente")', pronunciation: '/i-vén-tchuali/' }
    ],
    dialoguePt: 'Gerson descreve a sua primeira viagem profissional internacional para Joanesburgo:',
    dialogue: [
      { speaker: 'Gerson', textEn: 'First of all, I arrived at Mavalane airport very early. After that, I verified my boarding card.', textPt: 'Primeiro de tudo, cheguei ao aeroporto de Mavalane muito cedo. Depois disso, verifiquei o cartão de embarque.' },
      { speaker: 'Evelyn', textEn: 'That sounds busy. How was the seminar?', textPt: 'Isso soa atarefado. Como correu o seminário?' },
      { speaker: 'Gerson', textEn: 'Eventually, the key presentation was outstanding. It was an unforgettable experience.', textPt: 'No final, a apresentação principal foi fantástica. Foi uma experiência inesquecível.' }
    ],
    explanationPt: 'Grammar Note: "Eventually" é outro falso amigo importante! Significa "no final/por fim/consequentemente" após uma cadeia de ações. Se quiser dizer "eventualmente" no sentido de "talvez aconteça", use "perhaps" ou "maybe".',
    exercise: {
      id: 'ex-int-22',
      question: 'Se Sofia diz: "Eventually, the client signed the contract after months of calls", o que aconteceu?',
      options: [
        'O cliente talvez/eventualmente assine o contrato.',
        'Por fim / No final das contas, o cliente assinou o contrato.',
        'O cliente se recusou a assinar o contrato.',
        'O cliente assinou de forma temporária.'
      ],
      correctAnswerIndex: 1,
      translation: 'Interprete o uso do falso amigo "Eventually".',
      explanation: 'Incrível! "Eventually" é o "por fim" de uma jornada contínua. Excelente interpretação literal!',
      questions: [
        {
          question: 'Como estruturamos sequencialmente a introdução de uma narrativa pessoal?',
          options: [
            'First of all, ...',
            'Slightly delay, ...',
            'Eventually, ...',
            'Indeed, ...'
          ],
          correctAnswerIndex: 0,
          translation: 'Fórmula de abertura de história.',
          explanation: '"First of all..." introduz os acontecimentos iniciais organizadamente.'
        },
        {
          question: 'A melhor forma de expressar que uma viagem à Ilha de Moçambique foi inacreditável é dizer que foi:',
          options: [
            'An unforgettable experience.',
            'A touch and go airport.',
            'An oversight.',
            'Clickbait trending.'
          ],
          correctAnswerIndex: 0,
          translation: 'Traduza o sentimento de inesquecível.',
          explanation: '"An unforgettable experience" é a expressão ideal para relatar momentos gloriosos de vida.'
        }
      ]
    }
  },
  {
    id: 'int-23',
    level: 'intermediate',
    title: 'U5-L3: Giving Advice Politely',
    titlePt: 'U5-L3: Dar Conselhos de Forma Elegante',
    introductionPt: 'When giving advice in conversations, avoid being direct. Instead of stating "You must...", use polite helpers: "should", "ought to", or "If I were you, I would...".',
    vocabulary: [
      { en: 'Should', pt: 'Deveria (Conselho amigável geral)', pronunciation: '/shúd/' },
      { en: 'Ought to', pt: 'Deveria (Variante formal e polida)', pronunciation: '/ót tú/' },
      { en: 'If I were you, I would...', pt: 'Se eu fosse a ti / Se eu estivesse no teu lugar, eu faria...', pronunciation: '/íf ái uér iú / ái wúd/' },
      { en: 'To consider', pt: 'Considerar / Pensar sobre a opção', pronunciation: '/tú con-sí-der/' }
    ],
    dialoguePt: 'Evelyn dá conselhos sobre carreiras profissionais e estudo na Beira:',
    dialogue: [
      { speaker: 'Manuel', textEn: 'I want to apply for the managerial role, but I feel some anxiety about my logistics vocabulary.', textPt: 'Quero candidatar-se ao cargo de gerente, mas sinto alguma ansiedade quanto ao meu vocabulário de logística.' },
      { speaker: 'Evelyn', textEn: 'You should practice with Sabush first. If I were you, I would update my resume before applying.', textPt: 'Deverias praticar com o Sabush primeiro. Se eu fosse a ti, atualizaria o meu currículo antes de submeter a vaga.' },
      { speaker: 'Manuel', textEn: 'Excellent guidance. I ought to prepare a cover letter too.', textPt: 'Excelente orientação. Eu devia preparar uma carta de apresentação também.' }
    ],
    explanationPt: 'Grammar Note: "If I were you, I would..." usa a forma passada especial "were" para todas as pessoas gramaticais neste tipo de condicional imaginária. É uma das estruturas mais polidas de conselhos.',
    exercise: {
      id: 'ex-int-23',
      question: 'Escolha a frase gramaticalmente correta para aconselhar seu colega a dormir mais cedo antes do teste.',
      options: [
        'If I was you, I will sleep early.',
        'If I were you, I would sleep early.',
        'You must to sleep early quickly!',
        'Should sleep early yesterday.'
      ],
      correctAnswerIndex: 1,
      translation: 'Assinale a alternativa que aplica a condicional de conselho corretamente.',
      explanation: 'Perfeito! "If I were you, I would..." é a estrutura de ouro para conselhos subjetivos na segunda pessoa.',
      questions: [
        {
          question: 'Qual é um sinônimo formal excelente para "You should write"?',
          options: [
            'You ought to write.',
            'You will write surely.',
            'You pretend to write.',
            'You are wrote.'
          ],
          correctAnswerIndex: 0,
          translation: 'Identifique o sinônimo formal.',
          explanation: '"Ought to" desempenha a mesma função de conselho ou dever moral que "should", com um tom ligeiramente mais literário e formal.'
        },
        {
          question: 'O que significa o conselho "You should consider"?',
          options: [
            'Deves obrigatoriamente aceitar.',
            'Deverias considerar / refletir sobre.',
            'Estás proibido.',
            'Não há importância.'
          ],
          correctAnswerIndex: 1,
          translation: 'Significado de should consider.',
          explanation: '"Should consider" oferece uma opção sem impor autoridade, demonstrando respeito mútuo.'
        }
      ]
    }
  },
  {
    id: 'int-24',
    level: 'intermediate',
    title: 'U5-L4: Constructive Disagreement in Meetings',
    titlePt: 'U5-L4: Discordar com Educação em Reuniões',
    introductionPt: 'Saying "You are wrong" in a business meeting can make co-workers defensive. Discover how to politely offer alternative pathways using gentle constructive sentence frames.',
    vocabulary: [
      { en: 'I see your point, but...', pt: 'Entendo o seu ponto de vista, mas... (Abertura diplomática)', pronunciation: '/ái síi iór póint bát/' },
      { en: 'With all due respect...', pt: 'Com todo o respeito...', pronunciation: '/uíz ól diú ri-spékt/' },
      { en: 'That is a fair point, however...', pt: 'Esse é um argumento justo, porém...', pronunciation: '/dét íz á féer póint / háu-éver/' },
      { en: 'To disagree respectfully', pt: 'Discordar respeitosamente', pronunciation: '/tú dís-a-gríi/' }
    ],
    dialoguePt: 'Conversa de mediação de orçamento operacional de campanha comercial:',
    dialogue: [
      { speaker: 'Liam', textEn: 'We should invest all of our advertising resources into TV advertisements.', textPt: 'Deveríamos investir todos os nossos recursos de publicidade em anúncios de TV.' },
      { speaker: 'Diana', textEn: 'I see your point, but mobile audience is growing. With all due respect, digital integration is better.', textPt: 'Entendo o teu ponto de vista, mas o público mobile está a crescer. Com o devido respeito, a integração digital é melhor.' },
      { speaker: 'Liam', textEn: 'That is a fair point, however TV offers broad local reach. We can balance both.', textPt: 'Esse é um argumento justo, no entanto a TV oferece um alcance local amplo. Podemos equilibrar ambos.' }
    ],
    explanationPt: 'Diplomacy Tip: "I see your point, but..." é a frase ideal em multinacionais para negociar. Ela valida a ideia anterior do colega antes de introduzir a sua contraproposta de forma respeitosa.',
    exercise: {
      id: 'ex-int-24',
      question: 'Se quiser contrapor a ideia do seu supervisor em Maputo educadamente, qual é a melhor abertura?',
      options: [
        'You are completely wrong about the plan!',
        'No, I reject this bad proposal.',
        'I see your point, however, I believe we have other opportunities to consider.',
        'Actually, you don\'t understand this market.'
      ],
      correctAnswerIndex: 2,
      translation: 'Escolha a contraproposta mais polida e profissional.',
      explanation: 'Espetacular! Esta estrutura diplomática valida para de seguida guiar o grupo a soluções ótimas de forma cooperativa.',
      questions: [
        {
          question: 'O que significa a expressão formal "With all due respect"?',
          options: [
            'Sem qualquer respeito.',
            'Com todo o devido respeito.',
            'Apenas respeito os gestores.',
            'Por favor, concorde comigo.'
          ],
          correctAnswerIndex: 1,
          translation: 'Traduza o padrão diplomático.',
          explanation: '"With all due respect" é usado mundialmente para iniciar discordâncias educadas em debates corporativos.'
        },
        {
          question: 'O termo "however" é sinônimo de:',
          options: ['Mas / No entanto / Porém', 'Além disso', 'Por causa de', 'Finalmente'],
          correctAnswerIndex: 0,
          translation: 'Escolha o conector adversativo sinônimo de "however".',
          explanation: '"However" (/háu-éver/) é o conector formal correspondente a "but", traduzido como "no entanto", "porém".'
        }
      ]
    }
  },
  {
    id: 'int-25',
    level: 'intermediate',
    title: 'U5-L5: Problem Solving & Solutions',
    titlePt: 'U5-L5: Resolução de Problemas e Propostas',
    introductionPt: 'To conclude our Intermediate program, connect problems with resolutions in workshops. Talk about causes, effects, and suggest real actions.',
    vocabulary: [
      { en: 'Root cause', pt: 'Causa raiz / Origem do problema', pronunciation: '/rúut cóz/' },
      { en: 'To solve the issue', pt: 'Resolver o problema / questão', pronunciation: '/tú sólv dã í-shiu/' },
      { en: 'We propose to...', pt: 'Propomos... / Sugerimos...', pronunciation: '/uíi pro-póuz tú/' },
      { en: 'Actionable steps', pt: 'Passos práticos / acionáveis', pronunciation: '/ék-shon-abel stéps/' }
    ],
    dialoguePt: 'Sessão de brainstorming técnico para otimizar expedições no Porto da Beira:',
    dialogue: [
      { speaker: 'Emma', textEn: 'What is the root cause of the export delays we are facing?', textPt: 'Qual é a causa raiz dos atrasos de exportação que enfrentamos?' },
      { speaker: 'Jose', textEn: 'The outdated manual checks are slow. To solve the issue, we propose to digitize the customs sheets.', textPt: 'As verificações manuais desatualizadas são lentas. Para resolver a questão, propomos digitalizar as folhas alfandegárias.' },
      { speaker: 'Emma', textEn: 'Brilliant response. These are actionable steps. Let us implement this.', textPt: 'Excelente resposta. Estes são passos práticos. Vamos implementar isto.' }
    ],
    explanationPt: 'Fluency Crown: Chegaste ao final do nível Intermediário! "To solve the issue" é mais elegante do que dizer "to fix the problem" em minutas formais. Propor "actionable steps" mostra liderança.',
    exercise: {
      id: 'ex-int-25',
      question: 'Qual frase propõe de forma ativa uma solução para atrasos no escritório?',
      options: [
        'To solve the issue, we propose to automate the Excel sheets.',
        'We have major issues but nothing to solve to him.',
        'I actually pretend the issue is hard is.',
        'The root cause is extremely bad without any proposal.'
      ],
      correctAnswerIndex: 0,
      translation: 'Selecione a resolução proativa de problemas.',
      explanation: 'Parabéns magnífico! Conseguiste formular uma resolução completa de problemas em inglês comercial, completando o currículo intermediário do Sabush English Club.',
      questions: [
        {
          question: 'O que significa identificar a "Root cause" de um problema logístico?',
          options: [
            'A causa superficial e passageira.',
            'A causa profunda / origem inicial do problema.',
            'O preço estimado de conserto.',
            'O atraso do navio.'
          ],
          correctAnswerIndex: 1,
          translation: 'Defina root cause.',
          explanation: '"Root cause" é literal a causa raiz do problema sob análise.'
        },
        {
          question: 'Ideias de resoluções que podem ser aplicadas imediatamente são chamadas de:',
          options: [
            'Actionable steps.',
            'Oversights.',
            'Touch and go conflicts.',
            'Prejudices definitions.'
          ],
          correctAnswerIndex: 0,
          translation: 'Identifique os passos concretos.',
          explanation: '"Actionable steps" representa propostas fáceis de traduzir em tarefas concretas.'
        }
      ]
    }
  }
];
