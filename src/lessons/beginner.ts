/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lesson } from '../types';

export const BEGINNER_LESSONS: Lesson[] = [
  // UNIT 1: GREETINGS & INTRODUCTIONS (Lessons 1-5)
  {
    id: 'beg-1',
    level: 'beginner',
    title: 'Hello! What is your name?',
    titlePt: 'Olá! Qual é o seu nome?',
    introductionPt: 'Bem-vindo ao Sabush! Vamos começar do absoluto zero. Você aprenderá como dizer "Olá" e como se apresentar de forma educada.',
    vocabulary: [
      { en: 'Hello', pt: 'Olá', pronunciation: 'Helôu' },
      { en: 'Hi', pt: 'Oi (mais informal)', pronunciation: 'Hái' },
      { en: 'My name is...', pt: 'O meu nome é...', pronunciation: 'Mái neim iz' },
      { en: 'What is your name?', pt: 'Qual é o seu nome?', pronunciation: 'Uát iz iór neim' },
      { en: 'I am...', pt: 'Eu sou...', pronunciation: 'Ái em' }
    ],
    dialoguePt: 'Diálogo entre o Manuel e a Helen no Aeroporto de Maputo:',
    dialogue: [
      { speaker: 'Manuel', textEn: 'Hello! I am Manuel.', textPt: 'Olá! Eu sou o Manuel.' },
      { speaker: 'Helen', textEn: 'Hi! My name is Helen. What is your name?', textPt: 'Oi! O meu nome é Helen. Qual é o seu nome?' },
      { speaker: 'Manuel', textEn: 'My name is Manuel. Nice to meet you!', textPt: 'O meu nome é Manuel. Muito prazer em conhecer-te!' }
    ],
    explanationPt: 'Dica do Sabush: No dia-a-dia em Moçambique, a palavra "Nice to meet you" (/Náis tu míit iú/) é o nosso habitual "Muito prazer". Pratique falar sorrindo!',
    exercise: {
      id: 'ex-beg-1',
      question: 'Como diz "O meu nome é..."?',
      options: ['My name is', 'Hello', 'What is your', 'Nice to meet you'],
      correctAnswerIndex: 0,
      translation: 'Escolha a tradução de "O meu nome é..."',
      explanation: 'Perfeito! "My name is" é a base para se apresentar em inglês.',
      questions: [
        {
          question: 'Como se diz "Olá" de forma simples em inglês?',
          options: ['Goodbye', 'Please', 'Hello', 'Thank you'],
          correctAnswerIndex: 2,
          translation: 'Traduza de forma simples a palavra "Olá" para inglês.',
          explanation: 'Excelente! "Hello" é a palavra clássica e polida para dizer Olá.'
        },
        {
          question: 'Como perguntamos o nome de alguém?',
          options: ['Where are you from?', 'What is your name?', 'How are you?', 'I am Manuel'],
          correctAnswerIndex: 1,
          translation: 'Escolha a frase correspondente à pergunta "Qual é o seu nome?".',
          explanation: '"What is your name?" é a pergunta padrão em inglês para saber o nome de alguém.'
        },
        {
          question: 'Qual é a resposta ideal se alguém diz: "Nice to meet you"?',
          options: ['Good morning', 'Nice to meet you too', 'I am from Beira', 'No, thank you'],
          correctAnswerIndex: 1,
          translation: 'Se alguém diz "Muito prazer", como responde "Muito prazer também"?',
          explanation: 'Adicionamos "too" (/túu/) no final: "Nice to meet you too" significa prazer em conhecer-te também.'
        },
        {
          question: 'Complete a apresentação: "Hi! My ___ is Sarah."',
          options: ['hello', 'from', 'name', 'how'],
          correctAnswerIndex: 2,
          translation: 'Complete a frase "Oi! O meu ___ é Sarah."',
          explanation: 'Muito bem! "My name is Sarah" completa a frase correctamente.'
        },
        {
          question: 'Se Manuel quer dizer "Eu sou o Manuel", ele pode falar:',
          options: ['I am Manuel', 'What is Manuel', 'Please Manuel', 'No Manuel'],
          correctAnswerIndex: 0,
          translation: 'Como traduzir "Eu sou o Manuel" usando uma alternativa a My name is.',
          explanation: '"I am Manuel" (/Ái em Manuel/) significa "Eu sou o Manuel". Excelente!'
        }
      ]
    },
    speakingScenario: {
      prompt: 'Imagine you just arrived at Maputo Airport and met a new business partner. Record yourself introducing your name and saying "Nice to meet you!" using the vocabulary of this lesson.',
      promptPt: 'Imagine que acabou de chegar ao Aeroporto de Maputo e encontrou um novo parceiro de negócios. Grave-se a apresentar o seu nome e a dizer "Nice to meet you!" usando o vocabulário desta lição.'
    }
  },
  {
    id: 'beg-2',
    level: 'beginner',
    title: 'How are you?',
    titlePt: 'Como está / Como vais?',
    introductionPt: 'Para manter uma conversa agradável, saber perguntar se a outra pessoa está bem e responder educadamente é essencial.',
    vocabulary: [
      { en: 'How are you?', pt: 'Como está? / Como vais?', pronunciation: 'Háu ár iú' },
      { en: 'I am fine', pt: 'Estou bem', pronunciation: 'Ái em fáin' },
      { en: 'Thank you', pt: 'Obrigado / Obrigada', pronunciation: 'Ténk iú' },
      { en: 'And you?', pt: 'E você? / E tu?', pronunciation: 'End iú' },
      { en: 'Good', pt: 'Bom / Bem', pronunciation: 'Gud' }
    ],
    dialoguePt: 'Encontro rápido no café entre Amélia e John:',
    dialogue: [
      { speaker: 'Amélia', textEn: 'Hi John! How are you?', textPt: 'Oi John! Como estás?' },
      { speaker: 'John', textEn: 'Hello Amélia! I am fine, thank you. And you?', textPt: 'Olá Amélia! Estou bem, obrigado. E tu?' },
      { speaker: 'Amélia', textEn: 'I am good! Thank you.', textPt: 'Estou ótima! Obrigada.' }
    ],
    explanationPt: 'Dica do Sabush: A palavra "Thank you" começa com o som do "th" inglês. Sopre levemente o ar com a língua nos dentes. "Fine" significa que está tudo bem.',
    exercise: {
      id: 'ex-beg-2',
      question: 'Como diz "Estou bem, obrigado"?',
      options: ['I am fine, thank you', 'What is your name', 'And you?', 'Hello friend'],
      correctAnswerIndex: 0,
      translation: 'Escolha a tradução de "Estou bem, obrigado".',
      explanation: 'Correcto! "I am fine, thank you" é perfeito.',
      questions: [
        {
          question: 'Como se pergunta "Como estás?" em inglês?',
          options: ['Where is it?', 'How are you?', 'Who is she?', 'I am good'],
          correctAnswerIndex: 1,
          translation: 'Escolha a tradução para "Como estás?".',
          explanation: 'Correcto! "How are you?" é a nossa frase de ouro de cumprimento.'
        },
        {
          question: 'O que significa a expressão "And you?" na conversa?',
          options: ['E você?', 'Estou cansado', 'Por que?', 'De nada'],
          correctAnswerIndex: 0,
          translation: 'Interprete "And you?".',
          explanation: '"And you?" serve para devolver a pergunta de forma curta e amigável.'
        },
        {
          question: 'Qual é a resposta curta para dizer "Bem / Boa"?',
          options: ['Fine', 'Good', 'Nice', 'Todas as anteriores'],
          correctAnswerIndex: 3,
          translation: 'Quais destas palavras significam que está tudo ok?',
          explanation: 'Perfeito! Tanto "Fine", "Good" ou "Nice" funcionam muito bem no dia-a-dia.'
        },
        {
          question: 'Complete: "How ___ you?"',
          options: ['is', 'am', 'are', 'be'],
          correctAnswerIndex: 2,
          translation: 'Preencha a lacuna com a palavra correcta.',
          explanation: 'Com "you", usamos sempre a forma "are". Sendo assim, o correcto é "How are you?".'
        },
        {
          question: 'Na palavra "Fine", a pronúncia correcta tem som de:',
          options: ['Fín', 'Fá-in', 'Fí-ne', 'Fí-ni'],
          correctAnswerIndex: 1,
          translation: 'Identifique a fonética da palavra "Fine".',
          explanation: 'Muito bem! Pronuncia-se "Fá-in". O "e" no fim é silencioso.'
        }
      ]
    }
  },
  {
    id: 'beg-3',
    level: 'beginner',
    title: 'Where are you from?',
    titlePt: 'De onde você é?',
    introductionPt: 'Moçambique acolhe pessoas de todo o mundo. Aprenda a perguntar a nacionalidade de alguém e a dizer com orgulho de onde você é.',
    vocabulary: [
      { en: 'Where are you from?', pt: 'De onde você é / és?', pronunciation: 'Uér ár iú fróm' },
      { en: 'I am from...', pt: 'Eu sou de...', pronunciation: 'Ái em fróm' },
      { en: 'Mozambique', pt: 'Moçambique', pronunciation: 'Moçambík' },
      { en: 'Canada', pt: 'Canadá', pronunciation: 'Kén-ada' },
      { en: 'City', pt: 'Cidade', pronunciation: 'Síti' }
    ],
    dialoguePt: 'Conversa de apresentação no Porto da Beira:',
    dialogue: [
      { speaker: 'Anselmo', textEn: 'Where are you from, Helen?', textPt: 'De onde és, Helen?' },
      { speaker: 'Helen', textEn: 'I am from Canada. And you?', textPt: 'Eu sou do Canadá. E tu?' },
      { speaker: 'Anselmo', textEn: 'I am from Beira, Mozambique!', textPt: 'Eu sou da Beira, Moçambique!' }
    ],
    explanationPt: 'Dica do Sabush: A palavra "from" (/fróm/) indica origem ou proveniência em inglês. Para falar "sou de Maputo", diga "I am from Maputo".',
    exercise: {
      id: 'ex-beg-3',
      question: 'Como diz "Eu sou de Moçambique"?',
      options: ['I from Mozambique', 'I am from Mozambique', 'Where is Mozambique', 'Mozambique is nice'],
      correctAnswerIndex: 1,
      translation: 'Traduz "Eu sou de Moçambique".',
      explanation: 'Genial! Devemos sempre colocar o verbo "am": "I am from...".',
      questions: [
        {
          question: 'Qual é a tradução da palavra "Where"?',
          options: ['Quando', 'Como', 'Onde', 'Quem'],
          correctAnswerIndex: 2,
          translation: 'Escolha a tradução de "Where".',
          explanation: '"Where" (/Uér/) significa "Onde" ou "De onde" em perguntas.'
        },
        {
          question: 'Complete com a palavra correcta: "I am ___ Beira."',
          options: ['to', 'from', 'at', 'with'],
          correctAnswerIndex: 1,
          translation: 'Complete para expressar que a Beira é a sua cidade de origem.',
          explanation: 'Usamos "from" para indicar origem. "I am from Beira" é o correcto.'
        },
        {
          question: 'Como você pergunta a alguém de onde a pessoa veio?',
          options: ['Where are you from?', 'How do you do?', 'Where is your home?', 'Who are you from?'],
          correctAnswerIndex: 0,
          translation: 'Selecione a pergunta de origem e nacionalidade clássica.',
          explanation: '"Where are you from?" é a nossa frase padrão mundial para nacionalidades.'
        },
        {
          question: 'Como se diz "Canadá" com a pronúncia correcta em inglês?',
          options: ['Ca-na-dá', 'Kén-ada', 'Caná-dia', 'Canadense'],
          correctAnswerIndex: 1,
          translation: 'Escolha a reprodução fonética correcta em inglês.',
          explanation: 'Excelente! A tónica é no primeiro "Ca", soando como "Kén-ada"!'
        },
        {
          question: 'Se Sofia é de Maputo, ela diz:',
          options: ['Sofia are Maputo', 'I am from Maputo', 'My name is from Maputo', 'Sofia from Maputo is'],
          correctAnswerIndex: 1,
          translation: 'Selecione a fala correcta de Sofia.',
          explanation: '"I am from Maputo" é a frase correcta para indicar de onde ela é.'
        }
      ]
    }
  },
  {
    id: 'beg-4',
    level: 'beginner',
    title: 'Good morning & Greetings',
    titlePt: 'Bom dia e as Saudações do Dia',
    introductionPt: 'Dependendo da hora do dia, usamos cumprimentos diferentes em inglês. Vamos aprender "Bom dia", "Boa tarde" e "Boa noite".',
    vocabulary: [
      { en: 'Good morning', pt: 'Bom dia (até às 12h)', pronunciation: 'Gud mórning' },
      { en: 'Good afternoon', pt: 'Boa tarde (das 12h às 18h)', pronunciation: 'Gud áfter-núun' },
      { en: 'Good evening', pt: 'Boa noite (ao chegar / anoitecer)', pronunciation: 'Gud ív-ning' },
      { en: 'Good night', pt: 'Boa noite (ao despedir-se / ir dormir)', pronunciation: 'Gud náit' },
      { en: 'Goodbye', pt: 'Adeus / Tchau', pronunciation: 'Gud-bái' }
    ],
    dialoguePt: 'Manuel recebe uma especialista internacional no escritório à tarde:',
    dialogue: [
      { speaker: 'Manuel', textEn: 'Good afternoon! Welcome to Nampula.', textPt: 'Boa tarde! Bem-vinda a Nampula.' },
      { speaker: 'Expert', textEn: 'Good afternoon! Thank you very much.', textPt: 'Boa tarde! Muito obrigada.' },
      { speaker: 'Manuel', textEn: 'Goodbye, see you tomorrow!', textPt: 'Tchau, até amanhã!' }
    ],
    explanationPt: 'Dica do Sabush: O inglês tem duas formas de "Boa noite"! Use "Good evening" quando você chega a um restaurante ou reunião à noite. Use "Good night" apenas quando vai se deitar ou está a ir embora.',
    exercise: {
      id: 'ex-beg-4',
      question: 'Ao despedir-se para ir dormir, qual "Boa noite" deve usar?',
      options: ['Good morning', 'Good evening', 'Good night', 'Good afternoon'],
      correctAnswerIndex: 2,
      translation: 'Analise o contexto de despedida nocturna.',
      explanation: 'Perfeito! Para se deitar ou de despedida à noite, usamos "Good night".',
      questions: [
        {
          question: 'Como cumprimentamos alguém às 9 horas da manhã?',
          options: ['Good afternoon', 'Good night', 'Good evening', 'Good morning'],
          correctAnswerIndex: 3,
          translation: 'Identifique a saudação matinal.',
          explanation: 'Pela manhã usamos "Good morning" (/Gud mórning/).'
        },
        {
          question: 'Como se diz "Adeus / Tchau" em inglês?',
          options: ['Welcome', 'How are you', 'Goodbye', 'Good evening'],
          correctAnswerIndex: 2,
          translation: 'Saudação de despedida geral.',
          explanation: '"Goodbye" (/Gud-bái/) é usado para tchau ou adeus.'
        },
        {
          question: 'Se chega a uma sala de reuniões às 19:30 h, como cumprimenta as pessoas?',
          options: ['Good night', 'Good morning', 'Good afternoon', 'Good evening'],
          correctAnswerIndex: 3,
          translation: 'Qual é o boa noite usado à entrada / chegada?',
          explanation: 'Correcto! "Good evening" é usado para cumprimentar na chegada à noite.'
        },
        {
          question: 'O que significa a palavra "Welcome"?',
          options: ['Até amanhã', 'Bem-vindo(a)', 'Obrigado', 'Por favor'],
          correctAnswerIndex: 1,
          translation: 'Traduza a palavra "Welcome".',
          explanation: '"Welcome" (/Uél-kam/) significa "Bem-vindo" ou "Bem-vinda".'
        },
        {
          question: 'Como diz "Boa tarde" em inglês?',
          options: ['Good afternoon', 'Good morning', 'Good evening', 'Good-bye'],
          correctAnswerIndex: 0,
          translation: 'Identifique a saudação para o período da tarde.',
          explanation: '"Good afternoon" (/Gud áfter-núun/) cobre o período pós-meio-dia.'
        }
      ]
    }
  },
  {
    id: 'beg-5',
    level: 'beginner',
    title: 'Please and Thank You',
    titlePt: 'Por Favor e Obrigado (Cortesia)',
    introductionPt: 'A cortesia profissional e pessoal é altamente valorizada. Aprenda a usar "Por favor", "Obrigado" e "Com licença" em inglês.',
    vocabulary: [
      { en: 'Please', pt: 'Por favor', pronunciation: 'Plíiz' },
      { en: 'Thank you', pt: 'Obrigado / Obrigada', pronunciation: 'Ténk iú' },
      { en: 'Excuse me', pt: 'Com licença / Desculpe-me', pronunciation: 'Eks-kiúz mi' },
      { en: 'Sorry', pt: 'Desculpe (por um erro)', pronunciation: 'Sóri' },
      { en: 'You are welcome', pt: 'De nada / Não há de quê', pronunciation: 'Iú ár uél-kam' }
    ],
    dialoguePt: 'No escritório, pedindo um documento comercial para o colega:',
    dialogue: [
      { speaker: 'Sofia', textEn: 'Excuse me, John. The report, please.', textPt: 'Com licença, John. O relatório, por favor.' },
      { speaker: 'John', textEn: 'Here is the report, Sofia.', textPt: 'Aqui está o relatório, Sofia.' },
      { speaker: 'Sofia', textEn: 'Thank you very much!', textPt: 'Muito obrigada!' },
      { speaker: 'John', textEn: 'You are welcome.', textPt: 'De nada / Não há de quê.' }
    ],
    explanationPt: 'Dica do Sabush: Use "Excuse me" para chamar a atenção de alguém educadamente ou passar no corredor. Use "Sorry" apenas quando cometer um erro real, como pisar no pé de alguém.',
    exercise: {
      id: 'ex-beg-5',
      question: 'Como se responde educadamente ao receber um "Thank you"?',
      options: ['You are welcome', 'Sorry', 'Excuse me', 'Please'],
      correctAnswerIndex: 0,
      translation: 'Escolha a forma de dizer "De nada".',
      explanation: 'Excelente! "You are welcome" significa "De nada / Seja bem-vindo de volta".',
      questions: [
        {
          question: 'Qual palavra usamos para pedir educadamente "Por favor"?',
          options: ['Excuse me', 'Please', 'Sorry', 'Thank you'],
          correctAnswerIndex: 1,
          translation: 'Traduza por favor de forma curta.',
          explanation: '"Please" (/Plíiz/) é o nosso habitual "Por favor".'
        },
        {
          question: 'Se você esbarrar em alguém sem querer, o que deve dizer?',
          options: ['Welcome', 'English', 'Sorry', 'Please'],
          correctAnswerIndex: 2,
          translation: 'Desculpar-se por um pequeno acidente.',
          explanation: 'Usamos "Sorry" (/Sóri/) para pedir desculpa por erros ou pequenos acidentes.'
        },
        {
          question: 'Como se diz "Com licença"?',
          options: ['Excuse me', 'And you', 'How much', 'You are welcome'],
          correctAnswerIndex: 0,
          translation: 'Frase educada para passagem ou abordar alguém.',
          explanation: '"Excuse me" (/Eks-kiúz mi/) é ideal "com licença".'
        },
        {
          question: 'O que John diz quando Sofia agradece? "You are ___"',
          options: ['good', 'welcome', 'nice', 'sorry'],
          correctAnswerIndex: 1,
          translation: 'Preencha a resposta cortês "You are...".',
          explanation: 'A expressão completa para dizer de nada é "You are welcome".'
        },
        {
          question: 'Para agradecer muito, dizemos:',
          options: ['Thank you very much', 'Thank please', 'You are welcome very much', 'Excuse you'],
          correctAnswerIndex: 0,
          translation: 'Saudação de agradecimento forte.',
          explanation: '"Thank you very much" (/Ténk iú véri mátch/) significa muito obrigado.'
        }
      ]
    }
  },

  // UNIT 2: THE ALPHABET & NUMBERS (Lessons 6-10)
  {
    id: 'beg-6',
    level: 'beginner',
    title: 'The English Alphabet',
    titlePt: 'O Alfabeto e a Soletração',
    introductionPt: 'Saber soletrar seu nome e endereços de correio eletrónico (e-mail) é importantíssimo nas comunicações profissionais. Vamos praticar os sons das letras.',
    vocabulary: [
      { en: 'A, B, C', pt: 'Som: /Êi/, /Bí/, /Sí/', pronunciation: 'Êi, Bí, Sí' },
      { en: 'E, G, H', pt: 'Som: /Íi/, /Djí/, /Eitch/', pronunciation: 'Íi, Djí, Eitch' },
      { en: 'I, J, K', pt: 'Som: /Ái/, /Djei/, /Kei/', pronunciation: 'Ái, Djei, Kei' },
      { en: 'O, R, S', pt: 'Som: /Ôu/, /Ár/, /Es/', pronunciation: 'Ôu, Ár, Es' },
      { en: 'To spell', pt: 'Soletrar', pronunciation: 'Tú spél' }
    ],
    dialoguePt: 'Escritório da empresa de logística na Matola:',
    dialogue: [
      { speaker: 'Receptionist', textEn: 'How do you spell your name, please?', textPt: 'Como soletra o seu nome, por favor?' },
      { speaker: 'Client', textEn: 'An-sel-mo. A, N, S, E, L, M, O.', textPt: 'An-sel-mo. A, N, S, E, L, M, O.' },
      { speaker: 'Receptionist', textEn: 'Thank you! Perfect.', textPt: 'Obrigada! Perfeito.' }
    ],
    explanationPt: 'Dica do Sabush: Em inglês, certas letras confundem muito os moçambicanos. O "A" soa como "Êi". O "E" soa como "Íi". E o "I" soa como "Ái"! Treine isto com atenção.',
    exercise: {
      id: 'ex-beg-6',
      question: 'Como soa a pronúncia da letra "A" em inglês?',
      options: ['Ah', 'Êi', 'Ái', 'Íi'],
      correctAnswerIndex: 1,
      translation: 'Como lemos a letra "A" individualmente?',
      explanation: 'Muito bem! A letra "A" soa individualmente como "Êi".',
      questions: [
        {
          question: 'Como soa a letra "E"?',
          options: ['Êi', 'Íi', 'Ái', 'Éh'],
          correctAnswerIndex: 1,
          translation: 'Identifique o som da vogal "E".',
          explanation: 'Isso mesmo! O "E" soa como "Íi" em inglês. Cuidado para não confundir com o A!'
        },
        {
          question: 'Como se pronuncia a letra "I" em inglês?',
          options: ['Íi', 'Ái', 'Eitch', 'Iú'],
          correctAnswerIndex: 1,
          translation: 'Identifique o som da vogal "I".',
          explanation: 'O "I" em inglês lê-se "Ái" (como o pronome Eu).'
        },
        {
          question: 'O que significa o verbo "To spell"?',
          options: ['Fazer contas', 'Soletrar', 'Falar devagar', 'Ouvir audio'],
          correctAnswerIndex: 1,
          translation: 'Tradução do verbo spell.',
          explanation: '"To spell" significa soletrar letra por letra.'
        },
        {
          question: 'Como soletrar o nome "SAM" em inglês?',
          options: ['Es, Êi, Em', 'Es, Íi, Em', 'Es, Ái, Em', 'S, A, M'],
          correctAnswerIndex: 0,
          translation: 'Soletrar S-A-M em inglês.',
          explanation: 'Muito bem! S (Es), A (Êi), M (Em).'
        },
        {
          question: 'Como se pronuncia a letra "R"?',
          options: ['Ér', 'Ár', 'Rí', 'Rái'],
          correctAnswerIndex: 1,
          translation: 'Identifique o som do R.',
          explanation: 'Lê-se "Ár" em inglês. Excelente trabalho!'
        }
      ]
    }
  },
  {
    id: 'beg-7',
    level: 'beginner',
    title: 'Numbers 1 to 10',
    titlePt: 'Os Números do 1 ao 10',
    introductionPt: 'Falar de quantidades, números de telefone, balcões ou tarifas requer domínio absoluto dos números de base 1 a 10.',
    vocabulary: [
      { en: 'One, Two, Three', pt: '1, 2, 3', pronunciation: 'Uán, Túu, Tríi' },
      { en: 'Four, Five', pt: '4, 5', pronunciation: 'Fóor, Fáiv' },
      { en: 'Six, Seven, Eight', pt: '6, 7, 8', pronunciation: 'Síks, Séven, Êit' },
      { en: 'Nine, Ten', pt: '9, 10', pronunciation: 'Náin, Tén' },
      { en: 'Number', pt: 'Número', pronunciation: 'Nám-ber' }
    ],
    dialoguePt: 'Confirmando o número de telefone de um fornecedor de açúcar:',
    dialogue: [
      { speaker: 'Vendor', textEn: 'My phone number is simple.', textPt: 'O meu número de telefone é simples.' },
      { speaker: 'Manager', textEn: 'Great! Eight, four, seven, nine.', textPt: 'Ótimo! Oito, quatro, sete, nove.' },
      { speaker: 'Vendor', textEn: 'Yes! 8, 4, 7, 9.', textPt: 'Sim! 8, 4, 7, 9.' }
    ],
    explanationPt: 'Dica do Sabush: O número "Three" (3) tem o mesmo "th" característico. Se você disser "Tree" (sem dentes/língua), estará a falar "Árvore"! Tente passar vento entre os dentes ao falar "Three".',
    exercise: {
      id: 'ex-beg-7',
      question: 'Como é o número 5 em inglês?',
      options: ['Four', 'Five', 'Fine', 'Fire'],
      correctAnswerIndex: 1,
      translation: 'Escolha o número 5 correspondente.',
      explanation: 'Fabuloso! "Five" (/Fáiv/) é o número 5.',
      questions: [
        {
          question: 'Qual é a resposta para 3 + 4 em inglês?',
          options: ['Six', 'Seven', 'Eight', 'Nine'],
          correctAnswerIndex: 1,
          translation: 'Três + quatro é igual a:',
          explanation: '3 + 4 = 7, que em inglês se diz "Seven".'
        },
        {
          question: 'Como perguntamos o número de telefone de alguém?',
          options: ['What is your phone number?', 'What is your name?', 'How much number?', 'Where is your number?'],
          correctAnswerIndex: 0,
          translation: 'Escolha a frase de pergunta de telefone ideal.',
          explanation: '"What is your phone number?" é a pergunta padrão.'
        },
        {
          question: 'Como escrevemos por extenso o número 8?',
          options: ['Eight', 'Eat', 'Eighteen', 'Ait'],
          correctAnswerIndex: 0,
          translation: 'Número 8.',
          explanation: 'Escreve-se "Eight" (/Êit/).'
        },
        {
          question: 'Como pronunciamos o número 1?',
          options: ['On', 'Uán', 'Uó', 'Wan'],
          correctAnswerIndex: 1,
          translation: 'Fonetização do número 1.',
          explanation: 'O som correcto é "Uán" (ou "One").'
        },
        {
          question: 'Que número falta nesta contagem: "eight, nine, ___"',
          options: ['six', 'seven', 'ten', 'one'],
          correctAnswerIndex: 2,
          translation: 'Complete a contagem.',
          explanation: 'A sequência lógica termina com "ten" (10).'
        }
      ]
    }
  },
  {
    id: 'beg-8',
    level: 'beginner',
    title: 'Numbers 11 to 100',
    titlePt: 'Números do 11 ao 100 (Dinheiro e Idades)',
    introductionPt: 'Para lidar com compras, salários ou contar meticais e dólares com investidores, avance agora para os números de 11 a 100.',
    vocabulary: [
      { en: 'Eleven, Twelve', pt: '11, 12', pronunciation: 'I-léven, Tuélv' },
      { en: 'Thirteen, Fourteen', pt: '13, 14', pronunciation: 'Târ-tíin, Fór-tíin' },
      { en: 'Twenty, Thirty', pt: '20, 30', pronunciation: 'Tuénti, Târti' },
      { en: 'Fifty, One Hundred', pt: '50, 100', pronunciation: 'Fífti, Uán Hándred' },
      { en: 'Years old', pt: 'Anos de idade', pronunciation: 'Iírz ôuld' }
    ],
    dialoguePt: 'Falando sobre idade de trabalho de um colega:',
    dialogue: [
      { speaker: 'Sara', textEn: 'How old are you, Samuel?', textPt: 'Quantos anos tens, Samuel?' },
      { speaker: 'Samuel', textEn: 'I am thirty-five years old.', textPt: 'Eu tenho trinta e cinco anos de idade.' },
      { speaker: 'Sara', textEn: 'Wow! I am twenty years old.', textPt: 'Uau! Eu tenho vinte anos de idade.' }
    ],
    explanationPt: 'Dica do Sabush: Em inglês, não dizemos "tenho 20 anos" usando o verbo "ter" (have). Nós dizemos "I am twenty" (Eu sou/estou 20 anos velho). Sempre use o verbo To Be para idades!',
    exercise: {
      id: 'ex-beg-8',
      question: 'Como diz "Eu tenho 30 anos de idade" em inglês?',
      options: ['I have 30 years', 'I am thirty years old', 'I has thirty', 'I am thirteen years'],
      correctAnswerIndex: 1,
      translation: 'Escolha a frase perfeita para falar de idades.',
      explanation: 'Genial! Usamos "I am" para idade: "I am thirty years old".',
      questions: [
        {
          question: 'Como se fala o número 50 em inglês?',
          options: ['Fifteen', 'Five', 'Fifty', 'Fifty-hundred'],
          correctAnswerIndex: 2,
          translation: 'Identifique o número 50.',
          explanation: '"Fifty" (/Fífti/) é 50, enquanto "Fifteen" (/Fíf-tíin/) é 15.'
        },
        {
          question: 'Como se diz o número 100?',
          options: ['One hundred', 'Ten ten', 'Thousand', 'Double ten'],
          correctAnswerIndex: 0,
          translation: 'Número 100 por extenso.',
          explanation: '"One hundred" (/Uán Hándred/) ou simplesmente "a hundred" é 100.'
        },
        {
          question: 'Se Samuel tem 35 anos, que número é "thirty-five"?',
          options: ['13', '25', '35', '45'],
          correctAnswerIndex: 2,
          translation: 'Traduza o número composto.',
          explanation: 'Thirty (30) + five (5) = 35.'
        },
        {
          question: 'Como dizemos o número 12?',
          options: ['Two', 'Eleven', 'Twelve', 'Twenty'],
          correctAnswerIndex: 2,
          translation: 'Selecione o número 12 em inglês.',
          explanation: '"Twelve" (/Tuélv/) é o número 12.'
        },
        {
          question: 'O preço de um chip de celular é "twenty meticais". Quanto custa?',
          options: ['12 Meticais', '20 Meticais', '30 Meticais', '100 Meticais'],
          correctAnswerIndex: 1,
          translation: 'Traduza "twenty".',
          explanation: 'Vinte meticais. Excelente!'
        }
      ]
    }
  },
  {
    id: 'beg-9',
    level: 'beginner',
    title: 'Spelling Emails & Names',
    titlePt: 'Soletrando E-mails e Nomes no Trabalho',
    introductionPt: 'No escritório, ditar o e-mail ou o endereço Web requer o uso de termos técnicos como "ponto" (dot) ou "arroba" (at). Vamos dominá-los.',
    vocabulary: [
      { en: 'At (@)', pt: 'Arroba', pronunciation: 'Et' },
      { en: 'Dot (.)', pt: 'Ponto', pronunciation: 'Dot' },
      { en: 'Hyphen (-)', pt: 'Hífen / Traço', pronunciation: 'Hái-fen' },
      { en: 'Underscore (_)', pt: 'Traço inferior / Underscore', pronunciation: 'Ánder-skor' },
      { en: 'Email address', pt: 'Endereço de e-mail', pronunciation: 'Í-meil adrés' }
    ],
    dialoguePt: 'Passando o e-mail corporativo por telefone para um investidor:',
    dialogue: [
      { speaker: 'Secretary', textEn: 'What is your email address?', textPt: 'Qual é o seu endereço de e-mail?' },
      { speaker: 'Manager', textEn: 'It is info at sabush dot com.', textPt: 'É info arroba sabush ponto com.' },
      { speaker: 'Secretary', textEn: 'Let me spell: i, n, f, o, @, s, a, b, u, s, h, ., c, o, m.', textPt: 'Deixe-me soletrar: i, n, f, o, @, s, a, b, u, s, h, ., c, o, m.' }
    ],
    explanationPt: 'Dica do Sabush: Em informática, para ler um ponto de e-mail (como em .com), nós NUNCA dizemos "point"! Usamos sempre a palavra "dot" (/dot/). Para falar a arroba (@), diga "at" (/et/).',
    exercise: {
      id: 'ex-beg-9',
      question: 'Como se fala "arroba" (@) de e-mail em inglês?',
      options: ['Dot', 'At', 'Point', 'At-sign'],
      correctAnswerIndex: 1,
      translation: 'Escolha o termo correcto para ler @.',
      explanation: 'Perfeito! A arroba é lida como "at" (/et/).',
      questions: [
        {
          question: 'Como dizemos "ponto" (.) nos endereços de e-mail (ex: .com)?',
          options: ['Point', 'Dot', 'Comma', 'Full stop'],
          correctAnswerIndex: 1,
          translation: 'Tradução de ponto para web.',
          explanation: 'Para emails e sites usamos "dot" (/dot/).'
        },
        {
          question: 'Como se lê o e-mail "sam@work.com"?',
          options: ['sam point work dot com', 'sam at work dot com', 'sam underscore work comma com', 'sam hypen work at com'],
          correctAnswerIndex: 1,
          translation: 'Identifique a leitura correcta por extenso.',
          explanation: '"sam at work dot com" é a leitura correcta profissional.'
        },
        {
          question: 'O que significa o termo "Underscore"?',
          options: ['Espaço', 'Ponto final', 'Hífen baixo (_)', 'Arroba'],
          correctAnswerIndex: 2,
          translation: 'Traduza Underscore.',
          explanation: '"Underscore" (/Ánder-skor/) representa o traço inferior (_).'
        },
        {
          question: 'Como se soletra a parte final "com" de um site?',
          options: ['Sí, Ôu, Em', 'Sí, Óh, Em', 'Sí, Ôu, Ém', 'Es, O, M'],
          correctAnswerIndex: 0,
          translation: 'Soletrar c-o-m.',
          explanation: 'C (Sí), O (Ôu), M (Em). Corretíssimo!'
        },
        {
          question: 'Que termo inglês descreve o traço "hífen" (-)?',
          options: ['Dot', 'Underscore', 'Hyphen', 'At'],
          correctAnswerIndex: 2,
          translation: 'Traduza o hífen comum.',
          explanation: 'Diz-se "Hyphen" (/Hái-fen/).'
        }
      ]
    }
  },
  {
    id: 'beg-10',
    level: 'beginner',
    title: 'Plurals & Counting Items',
    titlePt: 'Plurais e Contagem de Itens',
    introductionPt: 'Para lidar com stock, faturas ou balanços simples de comércio, aprenda como funciona o plural no inglês de base.',
    vocabulary: [
      { en: 'Book / Books', pt: 'Livro / Livros', pronunciation: 'Búk / Búks' },
      { en: 'Phone / Phones', pt: 'Telemóvel / Telemóveis', pronunciation: 'Fóun / Fóuns' },
      { en: 'Office', pt: 'Escritório', pronunciation: 'Óf-is' },
      { en: 'How many?', pt: 'Quantos / Quantas?', pronunciation: 'Háu méni' },
      { en: 'Many', pt: 'Muitos / Muitas', pronunciation: 'Méni' }
    ],
    dialoguePt: 'Contando caixas de tablets novos que chegaram à Matola:',
    dialogue: [
      { speaker: 'Storekeeper', textEn: 'How many phones do we have?', textPt: 'Quantos telefones nós temos?' },
      { speaker: 'Assistant', textEn: 'We have ten phones and five books.', textPt: 'Nós temos dez telefones e cinco livros.' },
      { speaker: 'Storekeeper', textEn: 'Great, many items in the office computer!', textPt: 'Ótimo, muitos itens no computador do escritório!' }
    ],
    explanationPt: 'Dica do Sabush: Na maioria das palavras em inglês, basta adicionar um "s" no final para formar o plural, exactamente como em português. Exemplo: "computer" (computador), "computers" (computadores).',
    exercise: {
      id: 'ex-beg-10',
      question: 'Como se pergunta "Quantos?" para itens que podemos contar?',
      options: ['How much?', 'How many?', 'What many?', 'How are you?'],
      correctAnswerIndex: 1,
      translation: 'Escolha a pergunta de quantidade contável.',
      explanation: 'Excelente! Usamos "How many?" para coisas contáveis e "How much?" para coisas incontáveis (como dinheiro, água, café).',
      questions: [
        {
          question: 'Qual é o plural de "computer" em inglês?',
          options: ['computeres', 'computeres', 'computers', 'computering'],
          correctAnswerIndex: 2,
          translation: 'Indique o plural de computer.',
          explanation: 'Basta acrescentar o "s": "computers".'
        },
        {
          question: 'Se Sofia tem "five books", o que ela tem?',
          options: ['5 computadores', '5 livros', '5 telemóveis', '5 e-mails'],
          correctAnswerIndex: 1,
          translation: 'Traduza o item e quantidade.',
          explanation: '"Five books" traduz-se como "cinco livros".'
        },
        {
          question: 'O que significa a palavra "Office"?',
          options: ['Mercado', 'Escritório', 'Fábrica', 'Oficina de carro'],
          correctAnswerIndex: 1,
          translation: 'Tradução de Office.',
          explanation: '"Office" (/Óf-is/) significa escritório.'
        },
        {
          question: 'Como diz "muitos itens" em inglês?',
          options: ['one item', 'many items', 'few item', 'how many item'],
          correctAnswerIndex: 1,
          translation: 'Traduza muitos itens.',
          explanation: '"Many" (/Méni/) significa muitos ou muitas.'
        },
        {
          question: 'Como pronunciamos "Phones" (Plural de telefone)?',
          options: ['Fó-nes', 'Fó-nis', 'Fóuns', 'Fônias'],
          correctAnswerIndex: 2,
          translation: 'Fonética de Phones.',
          explanation: 'A pronúncia correcta é "Fóuns". Parabéns!'
        }
      ]
    }
  },

  // UNIT 3: BASIC VERBS (Lessons 11-15)
  {
    id: 'beg-11',
    level: 'beginner',
    title: 'The Verb "To Be" - Part 1',
    titlePt: 'O Verbo To Be: I e You (Eu e Tu/Você)',
    introductionPt: 'O verbo "To Be" traduz-se por "ser" ou "estar" em português. É o verbo mais importante do inglês. Vamos aprender "I am" e "You are".',
    vocabulary: [
      { en: 'I', pt: 'Eu (Pronome)', pronunciation: 'Ái' },
      { en: 'You', pt: 'Tu / Você / Vocês', pronunciation: 'Iú' },
      { en: 'I am...', pt: 'Eu sou / Eu estou...', pronunciation: 'Ái em' },
      { en: 'You are...', pt: 'Tu és / Tu estás / Você é...', pronunciation: 'Iú ár' },
      { en: 'Student', pt: 'Estudante / Aluno', pronunciation: 'Stiú-dent' }
    ],
    dialoguePt: 'Conversa rápida de incentivo na sala de aulas do Sabush:',
    dialogue: [
      { speaker: 'Teacher', textEn: 'You are a student of English!', textPt: 'Tu és um estudante de inglês!' },
      { speaker: 'Anselmo', textEn: 'Yes, and I am very happy today.', textPt: 'Sim, e eu estou muito feliz hoje.' },
      { speaker: 'Teacher', textEn: 'Perfect! You are excellent.', textPt: 'Perfeito! Tu és excelente.' }
    ],
    explanationPt: 'Dica do Sabush: Lembre-se que o mesmo "I am" serve tanto para o permanente "Eu sou Manuel" como para o estado temporário "Eu estou feliz" (I am happy). O contexto diz qual é qual!',
    exercise: {
      id: 'ex-beg-11',
      question: 'Como se conjuga "You" com o verbo To Be?',
      options: ['You am', 'You is', 'You are', 'You be'],
      correctAnswerIndex: 2,
      translation: 'Escolha a conjugação correcta para You.',
      explanation: 'Esplêndido! Usamos sempre "You are" (/Iú ár/).',
      questions: [
        {
          question: 'Como se diz "Eu sou um estudante" em inglês?',
          options: ['I are a student', 'I is student', 'I am a student', 'I student are'],
          correctAnswerIndex: 2,
          translation: 'Traduza o termo para inglês.',
          explanation: '"I am a student" é a construção perfeita para "Eu sou um estudante".'
        },
        {
          question: 'O que significa o pronome "I"?',
          options: ['Você', 'Nós', 'Eu', 'Eles'],
          correctAnswerIndex: 2,
          translation: 'Indique o significado de I.',
          explanation: '"I" em inglês escreve-se sempre com letra maiúscula e significa "Eu".'
        },
        {
          question: 'Como se traduz "You are happy"?',
          options: ['Estou com fome', 'Tu és/estás feliz', 'Vocês são tristes', 'Eu sou de Maputo'],
          correctAnswerIndex: 1,
          translation: 'Traduza a frase.',
          explanation: '"You are happy" significa "Tu és feliz" ou "Tu estás feliz".'
        },
        {
          question: 'Como diz "Eu estou feliz"?',
          options: ['I am happy', 'You are happy', 'I from happy', 'I happy is'],
          correctAnswerIndex: 0,
          translation: 'Traduza a frase de sentimento.',
          explanation: 'A expressão correcta é "I am happy" (/Ái em há-pi/).'
        },
        {
          question: 'A conjugação do verbo "To Be" para o pronome "I" é:',
          options: ['am', 'are', 'is', 'be'],
          correctAnswerIndex: 0,
          translation: 'To Be com o pronome "I".',
          explanation: 'Usamos sempre "I am".'
        }
      ]
    }
  },
  {
    id: 'beg-12',
    level: 'beginner',
    title: 'The Verb "To Be" - Part 2',
    titlePt: 'Verbo To Be: He, She, It, We, They',
    introductionPt: 'Agora que dominas "I" e "You", vamos aprender os pronomes da terceira pessoa e no plural (ele, ela, isso, nós e eles).',
    vocabulary: [
      { en: 'He / She / It', pt: 'Ele / Ela / Isto ou Coisas', pronunciation: 'Híi / Chíi / Ít' },
      { en: 'We / They', pt: 'Nós / Eles ou Elas', pronunciation: 'Uíi / Dêi' },
      { en: 'He is / She is / It is', pt: 'Ele é-está / Ela é-está / Isso é-está', pronunciation: 'Híi iz / Chíi iz / Ít iz' },
      { en: 'We are / They are', pt: 'Nós somos-estamos / Eles são-estão', pronunciation: 'Uíi ár / Dêi ár' },
      { en: 'Co-workers', pt: 'Colegas de trabalho', pronunciation: 'Côu-uêrkers' }
    ],
    dialoguePt: 'Conversa no escritório central descrevendo a equipa de Maputo:',
    dialogue: [
      { speaker: 'Armando', textEn: 'She is Sarah. She is the project manager.', textPt: 'Ela é a Sarah. Ela é a gerente do projeto.' },
      { speaker: 'Diana', textEn: 'And what about them?', textPt: 'E quanto a eles?' },
      { speaker: 'Armando', textEn: 'They are co-workers. We are a great team!', textPt: 'Eles são colegas de trabalho. Nós somos uma grande equipa!' }
    ],
    explanationPt: 'Dica do Sabush: Use "It is" (/Ít iz/) para se referir a animais, objetos, conceitos ou coisas sem género humano. Por exemplo: "It is a computer" (Isto é um computador).',
    exercise: {
      id: 'ex-beg-12',
      question: 'Como diz "Eles são colegas de trabalho"?',
      options: ['They are co-workers', 'We are co-workers', 'He is co-workers', 'She are co-workers'],
      correctAnswerIndex: 0,
      translation: 'Escolha a frase de plural e terceira pessoa.',
      explanation: 'Maravilhoso! "They are co-workers" é a forma plural certa.',
      questions: [
        {
          question: 'Como se conjuga "He" (Ele) com o verbo To Be?',
          options: ['He am', 'He are', 'He is', 'He be'],
          correctAnswerIndex: 2,
          translation: 'Conjugação de He.',
          explanation: 'Para He (Ele) usamos sempre "is" (He is).'
        },
        {
          question: 'O pronome "We" significa:',
          options: ['Ele', 'Nós', 'Eles', 'Eu'],
          correctAnswerIndex: 1,
          translation: 'Significado de We.',
          explanation: '"We" (/Uíi/) significa "Nós".'
        },
        {
          question: 'Como dizemos "Ela é a gerente" em inglês?',
          options: ['She is the manager', 'He is the manager', 'They are the manager', 'I are the manager'],
          correctAnswerIndex: 0,
          translation: 'Traduza o cargo feminino.',
          explanation: '"She" significa "Ela". "She is the manager" é a frase correcta.'
        },
        {
          question: 'Qual pronome usamos para falar de um cão ou computador de estimação?',
          options: ['He', 'She', 'It', 'They'],
          correctAnswerIndex: 2,
          translation: 'Pronome neutro para animais e coisas.',
          explanation: '"It" é o pronome neutro ideal para animais ou coisas inanimadas.'
        },
        {
          question: 'Complete com o verbo To Be correspondente: "We ___ a great team!"',
          options: ['is', 'am', 'are', 'be'],
          correctAnswerIndex: 2,
          translation: 'Preencha a lacuna para o pronome We.',
          explanation: 'Como o pronome é "We", usamos a forma de plural "are".'
        }
      ]
    }
  },
  {
    id: 'beg-13',
    level: 'beginner',
    title: 'The Verb "To Have" (Possessão)',
    titlePt: 'O Verbo To Have (Ter / Possuir)',
    introductionPt: 'O verbo "To Have" expressa o que você possui (um cargo, um telefone, dinheiro ou um tempo de pausa). Vamos aprender no básico.',
    vocabulary: [
      { en: 'I have', pt: 'Eu tenho', pronunciation: 'Ái hév' },
      { en: 'You have', pt: 'Tu tens / Você tem', pronunciation: 'Iú hév' },
      { en: 'He / She / It has', pt: 'Ele / Ela tem (singular especial)', pronunciation: 'Híi / Chíi / Ít héz' },
      { en: 'We / They have', pt: 'Nós temos / Eles têm', pronunciation: 'Uíi / Dêi hév' },
      { en: 'Money', pt: 'Dinheiro', pronunciation: 'Máni' }
    ],
    dialoguePt: 'Negociando passes de transporte de equipa na Beira:',
    dialogue: [
      { speaker: 'Driver', textEn: 'Do you have the tickets, Samuel?', textPt: 'Samuel, tens os bilhetes?' },
      { speaker: 'Samuel', textEn: 'Yes! I have five tickets. But she has the money.', textPt: 'Sim! Eu tenho cinco bilhetes. Mas ela tem o dinheiro.' },
      { speaker: 'Driver', textEn: 'Excellent. We have a safe trip!', textPt: 'Excelente. Nós temos uma viagem segura!' }
    ],
    explanationPt: 'Dica do Sabush: O verbo "To Have" muda de forma na terceira pessoa do singular! Dizemos "I have", mas para ele ou ela, o correto é sempre "He has" ou "She has" (/héz/). Atente bem ao "has".',
    exercise: {
      id: 'ex-beg-13',
      question: 'Qual é o correto para "Ela tem o dinheiro"?',
      options: ['She have the money', 'She has the money', 'She are the money', 'She is have money'],
      correctAnswerIndex: 1,
      translation: 'Escolha a forma certa para "She".',
      explanation: 'Perfeito! Para He/She/It usamos a forma singular "has". "She has the money".',
      questions: [
        {
          question: 'Como se diz "Eu tenho um telemóvel" em inglês?',
          options: ['I has a phone', 'I have a phone', 'I am a phone', 'I have phone'],
          correctAnswerIndex: 1,
          translation: 'Traduza para inglês.',
          explanation: '"I have a phone" (/Ái hév á fóun/) é a frase correcta.'
        },
        {
          question: 'Como diz "Nós temos dinheiro"?',
          options: ['We have money', 'We has money', 'We am money', 'They has money'],
          correctAnswerIndex: 0,
          translation: 'Traduza no plural.',
          explanation: '"We have money" é a tradução directa e correcta.'
        },
        {
          question: 'O pronome "They" com o verbo To Have fica:',
          options: ['They has', 'They have', 'They is have', 'They am'],
          correctAnswerIndex: 1,
          translation: 'Controle de concordância plural para "Eles têm".',
          explanation: 'Para They usamos a forma básica "have". Ficando "They have".'
        },
        {
          question: 'O que significa a palavra "Money"?',
          options: ['Chuva', 'Amigo', 'Dinheiro', 'Transporte de carro'],
          correctAnswerIndex: 2,
          translation: 'Tradução de Money.',
          explanation: '"Money" (/Máni/) significa dinheiro.'
        },
        {
          question: 'Complete: "He ___ a new car."',
          options: ['have', 'has', 'are', 'is'],
          correctAnswerIndex: 1,
          translation: 'Complete para "Ele tem um carro novo".',
          explanation: 'Como o sujeito é "He", usamos "has". He has a new car.'
        }
      ]
    }
  },
  {
    id: 'beg-14',
    level: 'beginner',
    title: 'Regular Actions with Common Verbs',
    titlePt: 'Ações Diárias com Verbos Comuns',
    introductionPt: 'Para dialogar com colegas internacionais o que você faz diariamente, aprenda verbos fundamentais: trabalhar, falar, estudar e viver.',
    vocabulary: [
      { en: 'To work', pt: 'Trabalhar', pronunciation: 'Tú uêrk' },
      { en: 'To speak', pt: 'Falar', pronunciation: 'Tú spíik' },
      { en: 'To study', pt: 'Estudar', pronunciation: 'Tú stá-di' },
      { en: 'To live', pt: 'Viver / Morar', pronunciation: 'Tú líiv' },
      { en: 'Every day', pt: 'Todos os dias', pronunciation: 'Évri dêi' }
    ],
    dialoguePt: 'Apresentando as atividades do Manuel para John em Nampula:',
    dialogue: [
      { speaker: 'Manuel', textEn: 'I live in Nampula and I work here.', textPt: 'Eu vivo em Nampula e trabalho aqui.' },
      { speaker: 'John', textEn: 'Do you study English?', textPt: 'Tu estudas inglês?' },
      { speaker: 'Manuel', textEn: 'Yes! I study English with Sabush every day.', textPt: 'Sim! Eu estudo inglês com o Sabush todos os dias.' }
    ],
    explanationPt: 'Dica do Sabush: No inglês básico, falar do presente é simples! O verbo fica na forma pura para I, You, We e They (Ex: "I speak"). Apenas adicionamos um "s" no fim se for He ou She (Ex: "He speaks English").',
    exercise: {
      id: 'ex-beg-14',
      question: 'Como se diz "Eu trabalho todos os dias" em inglês?',
      options: ['I work every day', 'I study every day', 'He works every day', 'I am work every day'],
      correctAnswerIndex: 0,
      translation: 'Escolha a frase correspondente.',
      explanation: 'Espetacular! "I work every day" (/Ái uêrk évri dêi/) é o correto.',
      questions: [
        {
          question: 'Como dizemos "Eu falo inglês"?',
          options: ['I work English', 'I live English', 'I speak English', 'I speak Portuguese'],
          correctAnswerIndex: 2,
          translation: 'Traduza o seu novo superpoder.',
          explanation: '"I speak English" (/Ái spíik Ínglich/) é a tradução exacta.'
        },
        {
          question: 'Se Sofia vive em Maputo, como dizemos isso?',
          options: ['Sofia live in Maputo', 'Sofia lives in Maputo', 'Sofia living Maputo', 'Sofia are live Maputo'],
          correctAnswerIndex: 1,
          translation: 'Adicione a regra do "s" para terceira pessoa singular.',
          explanation: 'Como Sofia equivale a "She" (Ela), acrescentamos "s" ao verbo: "lives". "Sofia lives in Maputo".'
        },
        {
          question: 'O que significa "Every day"?',
          options: ['No próximo ano', 'De vez em quando', 'Hoje à tarde', 'Todos os dias'],
          correctAnswerIndex: 3,
          translation: 'Tradução do marcador temporal.',
          explanation: '"Every day" (/Évri dêi/) significa todos os dias diários.'
        },
        {
          question: 'Complete com o verbo falar apropriado: "They ___ English well."',
          options: ['speaks', 'speak', 'speaking', 'speaks is'],
          correctAnswerIndex: 1,
          translation: 'Complete para "Eles falam inglês bem".',
          explanation: 'Para "They", o verbo fica na forma normal sem o "s". Ficando "They speak".'
        },
        {
          question: 'Como se traduz "I study here"?',
          options: ['Eu trabalho aqui', 'Eu moro lá', 'Eu estudo aqui', 'Eu falo inglês'],
          correctAnswerIndex: 2,
          translation: 'Escolha a tradução correspondente.',
          explanation: '"I study here" significa "Eu estudo aqui" (/Ái stá-di ríi/).'
        }
      ]
    }
  },
  {
    id: 'beg-15',
    level: 'beginner',
    title: 'Do you speak English? (Questions)',
    titlePt: 'Perguntas e Negativas Curtas',
    introductionPt: 'Aprenda a fazer perguntas no presente com o auxiliar "Do" e a responder negativamente dizendo "I do not" (eu não).',
    vocabulary: [
      { en: 'Do you...?', pt: 'Você...? (Auxiliar de pergunta)', pronunciation: 'Du iú' },
      { en: 'No, I do not', pt: 'Não, eu não (Resposta curta)', pronunciation: 'Nóu, ái du nót' },
      { en: 'Yes, I do', pt: 'Sim, eu faço/falo (Resposta curta)', pronunciation: 'Iés, ái du' },
      { en: 'Not', pt: 'Não (Modificador de negação)', pronunciation: 'Nót' },
      { en: 'To understand', pt: 'Compreender / Entender', pronunciation: 'Tú ánder-sténd' }
    ],
    dialoguePt: 'Sara aborda um visitante estrangeiro de comércio internacional na Beira:',
    dialogue: [
      { speaker: 'Sara', textEn: 'Excuse me, do you speak Portuguese?', textPt: 'Com licença, fala português?' },
      { speaker: 'Visitor', textEn: 'No, I do not speak Portuguese. Do you understand English?', textPt: 'Não, não falo português. Tu entendes inglês?' },
      { speaker: 'Sara', textEn: 'Yes, I do! I speak English a little.', textPt: 'Sim, entendo! Falo um pouco de inglês.' }
    ],
    explanationPt: 'Dica do Sabush: Para fazer perguntas no presente em inglês, os verbos comuns necessitam da ajuda da palavra "Do" no início de tudo! Ex: "Do you work?" (Trabalhas?). Isso não se traduz à letra, serve apenas como sinal de pergunta!',
    exercise: {
      id: 'ex-beg-15',
      question: 'Como se pergunta "Você trabalha?" em inglês?',
      options: ['You work?', 'Do you work?', 'Do you working?', 'Are you have work?'],
      correctAnswerIndex: 1,
      translation: 'Escolha a pergunta correctamente construída.',
      explanation: 'Genial! Usamos o auxiliar "Do" à frente: "Do you work?".',
      questions: [
        {
          question: 'O auxiliar "Do" no início de frases interrogativas serve para:',
          options: ['Indicar que é uma pergunta no presente', 'Significar "fazer" sempre', 'Servir como ponto final', 'Nenhuma das anteriores'],
          correctAnswerIndex: 0,
          translation: 'Para que serve o "Do" em perguntas?',
          explanation: 'O "Do" não tem tradução literal nestas perguntas, serve unicamente para marcar uma questão no tempo presente.'
        },
        {
          question: 'Como dizemos de forma curta e polida "Sim, eu falo/estudo" quando alguém nos pergunta?',
          options: ['Yes, I am', 'Yes, I do', 'Yes, I have', 'Yes, I not'],
          correctAnswerIndex: 1,
          translation: 'Resposta afirmativa curta perfeita.',
          explanation: '"Yes, I do" (/Iés, ái du/) é a resposta curta padrão.'
        },
        {
          question: 'Como diz "Eu não entendo" em inglês?',
          options: ['I do not understand', 'I not am understand', 'I does not under', 'Do you understand'],
          correctAnswerIndex: 0,
          translation: 'Negação completa.',
          explanation: 'Dizemos "I do not understand" (/Ái du nót ánder-sténd/).'
        },
        {
          question: 'Se lhe perguntam "Do you study English?", qual a resposta certa se você estuda?',
          options: ['No, I am not', 'Yes, I do', 'Goodbye', 'What is your name?'],
          correctAnswerIndex: 1,
          translation: 'Selecione a resposta ideal para o seu caso.',
          explanation: 'Com certeza! "Yes, I do" é a resposta correta de quem já é aluno do Sabush English Club!'
        },
        {
          question: 'Como se diz "falar um pouco" em inglês?',
          options: ['speak many', 'speak a little', 'speak do', 'speak study'],
          correctAnswerIndex: 1,
          translation: 'Traduza o termo "um pouco".',
          explanation: '"A little" (/á lítel/) significa um pouco ou pequena quantidade.'
        }
      ]
    }
  },

  // UNIT 4: EVERYDAY PHRASES (Lessons 16-20)
  {
    id: 'beg-16',
    level: 'beginner',
    title: 'Asking for Help & Directions',
    titlePt: 'Pedindo Ajuda e Informação de Direções',
    introductionPt: 'Saber como perguntar onde fica um local e pedir ajuda pode salvar o seu dia no turismo ou quando lidamos com motoristas e passageiros noutros países.',
    vocabulary: [
      { en: 'Help', pt: 'Ajuda / Socorro', pronunciation: 'Help' },
      { en: 'Where is...?', pt: 'Onde fica / Onde está...?', pronunciation: 'Uér iz' },
      { en: 'The market', pt: 'O mercado', pronunciation: 'Dã már-ket' },
      { en: 'The bus stop', pt: 'A paragem de autocarro / chapa', pronunciation: 'Dã bás stop' },
      { en: 'Here / There', pt: 'Aqui / Ali ou Lá', pronunciation: 'Ríir / Dér' }
    ],
    dialoguePt: 'John está perdido e pede indicações na cidade de Maputo:',
    dialogue: [
      { speaker: 'John', textEn: 'Excuse me, can you help me?', textPt: 'Com licença, podes ajudar-me?' },
      { speaker: 'Local', textEn: 'Yes! Where is your hotel?', textPt: 'Sim! Onde fica o seu hotel?' },
      { speaker: 'John', textEn: 'Where is the bus stop, please?', textPt: 'Onde fica a paragem de autocarro, por favor?' },
      { speaker: 'Local', textEn: 'It is there, near the market.', textPt: 'É ali, perto do mercado.' }
    ],
    explanationPt: 'Dica do Sabush: A estrutura "Can you help me?" (/Kén iú help mi/) significa "Você pode ajudar-me?". Use-a com um sorriso para abrir caminhos com qualquer estrangeiro!',
    exercise: {
      id: 'ex-beg-16',
      question: 'Como se pergunta "Onde fica o mercado?" em inglês?',
      options: ['Where are market?', 'Where is the market?', 'How are market?', 'Welcome to market'],
      correctAnswerIndex: 1,
      translation: 'Pergunte pela localização do mercado.',
      explanation: 'Parabéns! "Where is the market?" é a construção padrão ideal para direções.',
      questions: [
        {
          question: 'Como se pede "pode ajudar-me?" em inglês?',
          options: ['Do you help?', 'Can you help me?', 'Where is help?', 'Please are you help'],
          correctAnswerIndex: 1,
          translation: 'Pedido polido de apoio.',
          explanation: '"Can you help me?" é a frase correta e muito polida.'
        },
        {
          question: 'O que significa o termo "Bus stop"?',
          options: ['Aeroporto', 'Paragem de autocarro / chapa', 'Restaurante', 'Escola primária'],
          correctAnswerIndex: 1,
          translation: 'Traduza o transporte urbano.',
          explanation: '"Bus stop" (/bás stop/) refere-se à paragem de transporte colectivo.'
        },
        {
          question: 'Como se traduz "here"?',
          options: ['Lá', 'Ali', 'Aqui', 'Onde'],
          correctAnswerIndex: 2,
          translation: 'Traduza o advérbio de lugar presential.',
          explanation: '"Here" (/Ríir/) significa "Aqui".'
        },
        {
          question: 'Se alguém aponta para longe e diz "There", significa:',
          options: ['Lá / Ali', 'Aqui', 'Dentro do carro', 'Por favor'],
          correctAnswerIndex: 0,
          translation: 'Assinale a alternativa que indica o lugar distante.',
          explanation: '"There" (/Dér/) indica proximidade média-longa: acolá, ali, lá.'
        },
        {
          question: 'Como diz "Onde está o meu telefone?"',
          options: ['Where is my phone?', 'What is my phone?', 'Who is my phone?', 'Do you my phone?'],
          correctAnswerIndex: 0,
          translation: 'Combine "Where is" com pertences.',
          explanation: '"Where is my phone?" (/Uér iz mái fóun/) é a forma certa.'
        }
      ]
    }
  },
  {
    id: 'beg-17',
    level: 'beginner',
    title: 'Shopping at the Market',
    titlePt: 'Comprando no Mercado (Comércio)',
    introductionPt: 'Para fechar vendas com clientes estrangeiros ou comprar suprimentos no mercado, domine expressões básicas de compra.',
    vocabulary: [
      { en: 'How much?', pt: 'Quanto custa?', pronunciation: 'Háu mátch' },
      { en: 'Bargain / Price', pt: 'Negociar preço / Preço', pronunciation: 'Bár-guin / Práis' },
      { en: 'This', pt: 'Este / Esta / Isto (junto de mim)', pronunciation: 'Dís' },
      { en: 'That', pt: 'Aquele / Aquela (longe de mim)', pronunciation: 'Dét' },
      { en: 'Meticais / Dollars', pt: 'Meticais / Dólares', pronunciation: 'Meticaiz / Dól-arz' }
    ],
    dialoguePt: 'Conversação simulada no Mercado de Peixe em Maputo:',
    dialogue: [
      { speaker: 'Tourist', textEn: 'Excuse me, how much is this fish?', textPt: 'Com licença, quanto custa este peixe?' },
      { speaker: 'Seller', textEn: 'That fish is five hundred Meticais.', textPt: 'Aquele peixe ali custa quinhentos Meticais.' },
      { speaker: 'Tourist', textEn: 'Okay, I agree with the price.', textPt: 'Está bem, eu concordo com o preço.' }
    ],
    explanationPt: 'Dica do Sabush: Use "this" (/dís/) para apontar para coisas que estão próximas de si, e use "that" (/dét/) para coisas que estão mais afastadas.',
    exercise: {
      id: 'ex-beg-17',
      question: 'Como se pergunta "Quanto custa?" de forma curta?',
      options: ['How many?', 'How much?', 'What much?', 'Where much?'],
      correctAnswerIndex: 1,
      translation: 'Escolha a pergunta de quantia monetária.',
      explanation: 'Maravilhoso! "How much?" (/Háu mátch/) é a frase ideal de preço.',
      questions: [
        {
          question: 'Como dizemos "este peixe" (perto de mim)?',
          options: ['that fish', 'this fish', 'those fish', 'it fish'],
          correctAnswerIndex: 1,
          translation: 'Demonstrativo próximo.',
          explanation: 'Usamos "this" para proximidade: "this fish".'
        },
        {
          question: 'Como de diz "aquele peixe" (longe de mim)?',
          options: ['this fish', 'that fish', 'one fish', 'here fish'],
          correctAnswerIndex: 1,
          translation: 'Demonstrativo distante.',
          explanation: 'Usamos "that" para o objeto que está distante de quem fala: "that fish".'
        },
        {
          question: 'Qual é a tradução da palavra "Price"?',
          options: ['Praça', 'Prémio', 'Preço', 'Presente'],
          correctAnswerIndex: 2,
          translation: 'Selecione o significado de price.',
          explanation: '"Price" (/Práis/) significa "Preço".'
        },
        {
          question: 'Se o vendedor diz "five hundred Meticais", qual o valor?',
          options: ['50 Meticais', '15 Meticais', '500 Meticais', '5000 Meticais'],
          correctAnswerIndex: 2,
          translation: 'Traduza o preço total.',
          explanation: 'Five (5) + hundred (cem/centena) = 500 Meticais. Excelente!'
        },
        {
          question: 'Como você confirma que aceita o preço? "I agree with the ___"',
          options: ['fish', 'ticket', 'price', 'name'],
          correctAnswerIndex: 2,
          translation: 'Preencha com o termo preço em inglês.',
          explanation: 'Frase final: "I agree with the price".'
        }
      ]
    }
  },
  {
    id: 'beg-18',
    level: 'beginner',
    title: 'Buying Drinks & Food',
    titlePt: 'Pedindo Comida e Bebida em Restaurantes',
    introductionPt: 'Restaurantes, lanchonetes e hotéis são locais excelentes para usar as suas primeiras interações educadas de pedidos de comida e de água.',
    vocabulary: [
      { en: 'Water', pt: 'Água', pronunciation: 'Uó-ter' },
      { en: 'Coffee', pt: 'Café', pronunciation: 'Kó-fi' },
      { en: 'I would like...', pt: 'Eu gostaria de...', pronunciation: 'Ái uúd láik' },
      { en: 'The bill, please', pt: 'A conta, por favor (em mesa)', pronunciation: 'Dã bíl, plíiz' },
      { en: 'Food', pt: 'Comida / Alimento', pronunciation: 'Fúud' }
    ],
    dialoguePt: 'Pedindo uma garrafa de água fresca e um café no café do hotel:',
    dialogue: [
      { speaker: 'Guest', textEn: 'Good morning! I would like a water, please.', textPt: 'Bom dia! Eu gostaria de uma água, por favor.' },
      { speaker: 'Waiter', textEn: 'Cold or normal water?', textPt: 'Água fria ou normal?' },
      { speaker: 'Guest', textEn: 'Cold, please. And a coffee.', textPt: 'Fria, por favor. E um café.' },
      { speaker: 'Guest', textEn: 'The bill, please.', textPt: 'A conta, por favor.' }
    ],
    explanationPt: 'Dica do Sabush: Dizer "I want" (eu quero) em restaurantes pode soar muito impessoal ou agressivo na cultura anglofónia. Prefira sempre a modalidade polida: "I would like..." (/Ái uúd láik/) que é o elegante "Eu gostaria de...".',
    exercise: {
      id: 'ex-beg-18',
      question: 'Como se pede a conta num restaurante em inglês?',
      options: ['Pay money please', 'The bill, please', 'Where is food?', 'Goodbye waiter'],
      correctAnswerIndex: 1,
      translation: 'Escolha a frase de pedido de pagamento.',
      explanation: 'Genial! "The bill, please" (/Dã bíl, plíiz/) é o padrão correto para pedir a conta.',
      questions: [
        {
          question: 'Como traduzimos "Eu gostaria de..."?',
          options: ['I want', 'I have', 'I would like', 'I study'],
          correctAnswerIndex: 2,
          translation: 'Selecione a forma cortês de fazer pedidos.',
          explanation: '"I would like..." (/Ái uúd láik/) é a forma cortês padrão para pedidos de hotéis ou lojas.'
        },
        {
          question: 'Se você quer café, o que deve pedir ao funcionário?',
          options: ['water', 'coffee', 'bill', 'food'],
          correctAnswerIndex: 1,
          translation: 'Traduza café.',
          explanation: '"Coffee" (/Kó-fi/) significa café.'
        },
        {
          question: 'Qual é a palavra standard de restaurante para "Água"?',
          options: ['Soda', 'Tea', 'Water', 'Beer'],
          correctAnswerIndex: 2,
          translation: 'Identifique a grafia.',
          explanation: '"Water" (/Uó-ter/) significa água de beber.'
        },
        {
          question: 'O garçom pergunta: "Cold or normal water?". O que significa "Cold"?',
          options: ['Quente', 'Fria / Gelada', 'Natural', 'Sem gás'],
          correctAnswerIndex: 1,
          translation: 'Traduza o estado de temperatura.',
          explanation: '"Cold" (/kôuld/) significa frio ou gelado.'
        },
        {
          question: 'Complete: "I would like a coffee, ___"',
          options: ['sorry', 'welcome', 'please', 'thanks you'],
          correctAnswerIndex: 2,
          translation: 'Finalize o pedido com a palavra cortês ideal.',
          explanation: 'Usamos sempre "please" (por favor) para polidez ideal.'
        }
      ]
    }
  },
  {
    id: 'beg-19',
    level: 'beginner',
    title: 'Days of the Week',
    titlePt: 'Os Dias da Semana',
    introductionPt: 'Para agendar reuniões, saber que dias você trabalha ou estuda, confira os nomes dos dias de segunda a domingo.',
    vocabulary: [
      { en: 'Monday', pt: 'Segunda-feira', pronunciation: 'Mán-dêi' },
      { en: 'Wednesday', pt: 'Quarta-feira (difícil pronunciar!)', pronunciation: 'Uénz-dêi' },
      { en: 'Friday', pt: 'Sexta-feira (dia de lazer!)', pronunciation: 'Frái-dêi' },
      { en: 'Saturday / Sunday', pt: 'Sábado / Domingo (fim de semana)', pronunciation: 'Sá-ter-dêi / Sán-dêi' },
      { en: 'Week', pt: 'Semana', pronunciation: 'Uíik' }
    ],
    dialoguePt: 'Marcando uma aula de conversação em inglês:',
    dialogue: [
      { speaker: 'Student', textEn: 'Do we have class on Monday?', textPt: 'Nós temos aula na segunda-feira?' },
      { speaker: 'Teacher', textEn: 'No! The class is on Wednesday and Friday.', textPt: 'Não! A aula é na quarta-feira e na sexta-feira.' },
      { speaker: 'Student', textEn: 'Great, see you on Wednesday!', textPt: 'Ótimo, vemo-nos na quarta-feira!' }
    ],
    explanationPt: 'Dica do Sabush: Todos os dias da semana em inglês terminam com a terminação "day" (/dêi/). Observe também que na escrita, os dias da semana em inglês devem ser escritos SEMPRE com a primeira letra maiúscula (ex: Monday, nunca monday!).',
    exercise: {
      id: 'ex-beg-19',
      question: 'Qual dia da semana significa "Sexta-feira"?',
      options: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
      correctAnswerIndex: 2,
      translation: 'Escolha o dia de trabalho correspondente.',
      explanation: 'Excelente! "Friday" (/Frái-dêi/) é sexta-feira.',
      questions: [
        {
          question: 'Como diz "Segunda-feira" em inglês?',
          options: ['Monday', 'Tuesday', 'Sunday', 'Saturday'],
          correctAnswerIndex: 0,
          translation: 'Traduza o dia.',
          explanation: '"Monday" (/Mán-dêi/) é o primeiro dia útil do nosso calendário.'
        },
        {
          question: 'Para convidar no fim de semana, quais dias compõem o Weekend?',
          options: ['Monday and Tuesday', 'Wednesday and Thursday', 'Saturday and Sunday', 'Thursday and Friday'],
          correctAnswerIndex: 2,
          translation: 'Identifique os dias de repouso.',
          explanation: 'Saturday (sábado) e Sunday (domingo) constituem o nosso amado "Weekend" (fim de semana).'
        },
        {
          question: 'Como pronunciamos a palavra "Wednesday"?',
          options: ['Uéd-nes-dei', 'Uénz-dêi', 'Uéd-niz-dei', 'Uéns-dei'],
          correctAnswerIndex: 1,
          translation: 'Identifique a pronúncia correcta (onde o d é mudo!).',
          explanation: 'A pronúncia correcta de Wednesday é "Uénz-dêi". O primeiro d de wednesday é totalmente silencioso para o ouvido.'
        },
        {
          question: 'O que significa a palavra "Week"?',
          options: ['Mês', 'Ano', 'Dia de sol', 'Semana'],
          correctAnswerIndex: 3,
          translation: 'Significado do termo.',
          explanation: '"Week" (/Uíik/) é o termo que define o período de sete dias.'
        },
        {
          question: 'Complete com segunda-feira escrita correcta: "Class is on ___."',
          options: ['monday', 'Monday', 'mondays', 'Mondays are'],
          correctAnswerIndex: 1,
          translation: 'Qual é a grafia correcta?',
          explanation: 'Os dias devem começar com maiúscula: "Monday".'
        }
      ]
    }
  },
  {
    id: 'beg-20',
    level: 'beginner',
    title: 'Telling Time (Horas básicas)',
    titlePt: 'Dizendo as Horas no Quotidiano',
    introductionPt: 'Para não se atrasar no embarque de barcos ou transportes, ou chegar a tempo às suas entrevistas de emprego, aprenda a falar as horas práticas.',
    vocabulary: [
      { en: 'What time is it?', pt: 'Que horas são?', pronunciation: 'Uát táim iz ít' },
      { en: 'It is... o\'clock', pt: 'São... horas em ponto', pronunciation: 'Ít iz... o-klók' },
      { en: 'Half past...', pt: 'E meia (meia hora depois de)', pronunciation: 'Háf pást' },
      { en: 'Time', pt: 'Tempo / Hora', pronunciation: 'Táim' },
      { en: 'AM / PM', pt: 'Manhã (AM) / Tarde ou Noite (PM)', pronunciation: 'Êi Em / Píi Em' }
    ],
    dialoguePt: 'Verificando o horário de um encontro de negócios na Matola:',
    dialogue: [
      { speaker: 'Colleague', textEn: 'Excuse me, what time is it?', textPt: 'Com licença, que horas são?' },
      { speaker: 'Samuel', textEn: 'It is eight o\'clock AM.', textPt: 'São oito horas em ponto da manhã.' },
      { speaker: 'Colleague', textEn: 'Great! The bus arrives at eight-thirty.', textPt: 'Ótimo! O autocarro chega às oito e trinta.' }
    ],
    explanationPt: 'Dica do Sabush: O termo "o\'clock" (/o-klók/) só é usado para horas cheias e exatas, como 9:00 ou 10:00. Para ler minutos, diga o número de seguida (exemplo: "eight-thirty" para 8:30).',
    exercise: {
      id: 'ex-beg-20',
      question: 'Como perguntamos "Que horas são?" em inglês?',
      options: ['How is time?', 'Where is time?', 'What time is it?', 'Do you have hours?'],
      correctAnswerIndex: 2,
      translation: 'Escolha a pergunta de horário perfeita.',
      explanation: 'Genial! "What time is it?" (/Uát táim iz ít/) é a forma universal.',
      questions: [
        {
          question: 'Como dizemos "São nove horas em ponto"?',
          options: ['It is nine half', 'It is nine past', 'It is nine o\'clock', 'It is nine AM-PM'],
          correctAnswerIndex: 2,
          translation: 'Indicação de hora redonda / exacta.',
          explanation: 'Utilizamos "o\'clock" para horas exactas: "It is nine o\'clock".'
        },
        {
          question: 'O que indica a sigla "AM" em inglês?',
          options: ['Período da tarde', 'Período da meia-noite ao meio-dia (manhã)', 'Feriados nacionais', 'Noite profunda'],
          correctAnswerIndex: 1,
          translation: 'Significado de AM.',
          explanation: '"AM" (Ante Meridiem) representa o tempo da manhã.'
        },
        {
          question: 'Como diz-se "oito e trinta" (8:30) em inglês coloquial por números?',
          options: ['eight-three', 'eight-thirty', 'eight-teen', 'eighty-three'],
          correctAnswerIndex: 1,
          translation: 'Traduza o horário 8:30.',
          explanation: '"Eight" (8) + "thirty" (30) = eight-thirty. Muito simples e directo!'
        },
        {
          question: 'Se o seu trabalho começa às "eight o\'clock PM", a que hora começa?',
          options: ['8 da manhã', '8 da noite', '18 horas', 'Nenhuma das anteriores'],
          correctAnswerIndex: 1,
          translation: 'Identifique o período temporal correspondente ao PM.',
          explanation: '"PM" (Post Meridiem) marca o período da tarde/noite, logo 8h PM são 20h (8h da noite).'
        },
        {
          question: 'Que palavra inglesa significa "Tempo" ou "Hora"?',
          options: ['O\'clock', 'Timely', 'Time', 'Day'],
          correctAnswerIndex: 2,
          translation: 'Selecione o substantivo.',
          explanation: '"Time" (/Táim/) significa tempo ou hora.'
        }
      ]
    }
  },

  // UNIT 5: FAMILY & DAILY ROUTINE (Lessons 21-25)
  {
    id: 'beg-21',
    level: 'beginner',
    title: 'Talking about Family',
    titlePt: 'A Minha Família',
    introductionPt: 'Saber falar da família ajuda a construir conexões humanas profundas com novos colegas e parceiros comerciais de outros países.',
    vocabulary: [
      { en: 'Father / Mother', pt: 'Pai / Mãe', pronunciation: 'Fá-der / Má-der' },
      { en: 'Brother / Sister', pt: 'Irmão / Irmã', pronunciation: 'Bró-der / Sís-ter' },
      { en: 'Children', pt: 'Filhos / Crianças (plural)', pronunciation: 'Tchíl-dren' },
      { en: 'Son / Daughter', pt: 'Filho / Filha', pronunciation: 'Sán / Dó-ter' },
      { en: 'Family', pt: 'Família', pronunciation: 'Fém-ili' }
    ],
    dialoguePt: 'Manuel fala sobre a sua família para Amélia:',
    dialogue: [
      { speaker: 'Manuel', textEn: 'Do you have children, Amélia?', textPt: 'Tu tens filhos, Amélia?' },
      { speaker: 'Amélia', textEn: 'Yes, I have one son and one daughter. And you?', textPt: 'Sim, tenho um filho e uma filha. E tu?' },
      { speaker: 'Manuel', textEn: 'I have two brothers, but no children.', textPt: 'Eu tenho dois irmãos, mas não tenho filhos.' }
    ],
    explanationPt: 'Dica do Sabush: A pronúncia do "th" de "Father" e "Brother" é suave e sonora (parece o som de um "D" ou "V" feito com a ponta da língua sob os dentes). Pratique falando "fá-der" e "bró-der".',
    exercise: {
      id: 'ex-beg-21',
      question: 'Como se diz "Mãe" em inglês?',
      options: ['Father', 'Mother', 'Sister', 'Daughter'],
      correctAnswerIndex: 1,
      translation: 'Escolha o termo familiar correspondente.',
      explanation: 'Excelente! "Mother" (/Má-der/) é mãe.',
      questions: [
        {
          question: 'Se Sofia tem um filho homem, ela refere-se a ele como seu:',
          options: ['Son', 'Daughter', 'Sister', 'Brother'],
          correctAnswerIndex: 0,
          translation: 'Traduza o parentesco masculino.',
          explanation: '"Son" (/Sán/) é a palavra em inglês para filho homem.'
        },
        {
          question: 'O plural "Children" significa:',
          options: ['Casal', 'Filhos / Crianças', 'Bebés apenas', 'Tios'],
          correctAnswerIndex: 1,
          translation: 'Traduza o plural irregular.',
          explanation: 'Children (/Tchíl-dren/) é o plural irregular para filhos ou crianças.'
        },
        {
          question: 'Como se diz "Irmã" em inglês?',
          options: ['Brother', 'Sister', 'Mother', 'Daughter'],
          correctAnswerIndex: 1,
          translation: 'Identifique o termo feminino.',
          explanation: '"Sister" (/Sís-ter/) é a nossa irmã.'
        },
        {
          question: 'Como se traduz "I have two brothers"?',
          options: ['Eu tenho dois pais', 'Eu tenho duas irmãs', 'Eu tenho dois irmãos', 'Eu não tenho irmãos'],
          correctAnswerIndex: 2,
          translation: 'Traduza o número e o parentesco.',
          explanation: '"Brothers" (/bró-derz/) é o plural de irmãos masculinos.'
        },
        {
          question: 'Que termo inglês engloba todo o grupo familiar de base?',
          options: ['Co-workers', 'Company', 'Family', 'Children'],
          correctAnswerIndex: 2,
          translation: 'Substantivo geral familiar.',
          explanation: 'Chama-se "Family" (/Fém-ili/).'
        }
      ]
    }
  },
  {
    id: 'beg-22',
    level: 'beginner',
    title: 'Daily Routine',
    titlePt: 'Minha Rotina Diária',
    introductionPt: 'Aprenda verbos essenciais para descrever a sua rotina habitual de trabalho de manhã à noite.',
    vocabulary: [
      { en: 'To wake up', pt: 'Acordar / Despertar', pronunciation: 'Tú uêik áp' },
      { en: 'To go to work', pt: 'Ir trabalhar / Ir para o trabalho', pronunciation: 'Tú gôu tú uêrk' },
      { en: 'To eat breakfast', pt: 'Tomar o pequeno-almoço', pronunciation: 'Tú íit brék-fast' },
      { en: 'To go home', pt: 'Ir para casa / Regressar a casa', pronunciation: 'Tú gôu hôi-m' },
      { en: 'To sleep', pt: 'Dormir', pronunciation: 'Tú slíip' }
    ],
    dialoguePt: 'Conversando sobre hábitos diários de transporte e trabalho:',
    dialogue: [
      { speaker: 'Samuel', textEn: 'I wake up at six o\'clock and eat breakfast.', textPt: 'Eu acordo às seis horas e tomo o pequeno-almoço.' },
      { speaker: 'John', textEn: 'Then, do you go to work by bus?', textPt: 'Depois disso, vais para o trabalho de autocarro?' },
      { speaker: 'Samuel', textEn: 'Yes! I go to work and return home at five o\'clock.', textPt: 'Sim! Vou para o trabalho e regresso a casa às cinco horas.' }
    ],
    explanationPt: 'Dica do Sabush: O pequeno-almoço em Moçambique é a refeição mais sagrada antes do escritório! Em inglês, dizemos de forma clássica "eat breakfast" (/íit brék-fast/) ou "have breakfast".',
    exercise: {
      id: 'ex-beg-22',
      question: 'Como diz "Eu vou para o trabalho"?',
      options: ['I wake up', 'I go to work', 'I go home', 'I go sleep'],
      correctAnswerIndex: 1,
      translation: 'Escolha a rotina laboral.',
      explanation: 'Correctíssimo! "I go to work" significa "Eu vou trabalhar/para o trabalho".',
      questions: [
        {
          question: 'O que fazemos primeiro na cama logo pela manhã?',
          options: ['sleep', 'go to work', 'wake up', 'drink beer'],
          correctAnswerIndex: 2,
          translation: 'Ação inicial do dia.',
          explanation: '"To wake up" (/uêik áp/) significa acordar ou levantar da cama.'
        },
        {
          question: 'O que se consome na refeição do "Breakfast"?',
          options: ['Almoço pesado', 'Pequeno-almoço / Mata-bicho', 'Jantar de gala', 'Lanche da noite'],
          correctAnswerIndex: 1,
          translation: 'Traduza o breakfast moçambicano.',
          explanation: '"Breakfast" (/Brék-fast/) representa a primeira refeição, o pequeno-almoço.'
        },
        {
          question: 'Como dizemos "Ir para casa"?',
          options: ['go home', 'go work', 'wake up', 'go to sleeping'],
          correctAnswerIndex: 0,
          translation: 'Mudar-se para a própria residência pós expediente.',
          explanation: 'Diz-se "go home" (/gôu hôi-m/). Não necessita da preposição "to".'
        },
        {
          question: 'Complete com o verbo dormir: "At ten o\'clock, I go to ___."',
          options: ['work', 'wake', 'sleep', 'breakfast'],
          correctAnswerIndex: 2,
          translation: 'Complete para repouso nocturno.',
          explanation: '"Sleep" (/slíip/) representa dormir.'
        },
        {
          question: 'Qual é a pronúncia de "Wake up"?',
          options: ['Uái-qui áp', 'Uêik áp', 'Uá-quê áp', 'Uék-te áp'],
          correctAnswerIndex: 1,
          translation: 'Fonetização do verbo acordar.',
          explanation: 'Lê-se "Uêik áp". Muito bem!'
        }
      ]
    }
  },
  {
    id: 'beg-23',
    level: 'beginner',
    title: 'Free Time & Lazer Vocabulary',
    titlePt: 'Tempo Livre e Hobbies',
    introductionPt: 'Diga aos seus novos amigos estrangeiros de que forma gosta de aproveitar o seu fim de semana e os momentos de folga.',
    vocabulary: [
      { en: 'Free time', pt: 'Tempo livre / Folga', pronunciation: 'Fríi táim' },
      { en: 'To play soccer', pt: 'Jogar futebol (bola)', pronunciation: 'Tú pléi só-ker' },
      { en: 'To listen to music', pt: 'Ouvir música', pronunciation: 'Tú lísen tú miú-zik' },
      { en: 'To go to church', pt: 'Ir à igreja', pronunciation: 'Tú gôu tú tcher-tch' },
      { en: 'To watch TV', pt: 'Ver televisão', pronunciation: 'Tú uótch tí-ví' }
    ],
    dialoguePt: 'Sofia e Diana trocam planos amigáveis de fim de semana na Beira:',
    dialogue: [
      { speaker: 'Diana', textEn: 'What do you do in your free time, Sofia?', textPt: 'O que fazes nas tuas folgas, Sofia?' },
      { speaker: 'Sofia', textEn: 'On Sunday, I go to church and listen to music. And you?', textPt: 'Ao domingo, vou à igreja e ouço música. E tu?' },
      { speaker: 'Diana', textEn: 'I play soccer with my friends and watch TV.', textPt: 'Eu jogo futebol com os meus amigos e vejo televisão.' }
    ],
    explanationPt: 'Dica do Sabush: O nosso futebol nacional é chamado de "soccer" (/só-ker/) no inglês americano, e de "football" (/fút-ból/) no inglês britânico e europeu. Os dois são entendidos perfeitamente!',
    exercise: {
      id: 'ex-beg-23',
      question: 'O que significa jogar o desporto "soccer" em português?',
      options: ['Jogar cartas / bisca', 'Jogar futebol', 'Ir correr', 'Ler livros na biblioteca'],
      correctAnswerIndex: 1,
      translation: 'Traduza o hobby desportivo.',
      explanation: 'Genial! "Soccer" refere-se ao nosso apaixonante futebol nacional.',
      questions: [
        {
          question: 'Como dizemos "Tempo livre / Folga"?',
          options: ['Work time', 'Free time', 'Study day', 'Week time'],
          correctAnswerIndex: 1,
          translation: 'Escolha o substantivo composto.',
          explanation: '"Free time" (/Fríi táim/) traduz-se como tempo livre ou de lazer.'
        },
        {
          question: 'Como diz em inglês "Eu ouço música"?',
          options: ['I play music', 'I listen to music', 'I watch music', 'I study music'],
          correctAnswerIndex: 1,
          translation: 'Traduza a ação sonora.',
          explanation: 'Dizemos "I listen to music" (/Ái lísen tú miú-zik/). Lembre de colocar o "to" depois de listen!'
        },
        {
          question: 'Onde muitas famílias moçambicanas vão ao Domingo? "They go to ___"',
          options: ['church', 'work', 'office', 'computer'],
          correctAnswerIndex: 0,
          translation: 'Selecione o templo de culto em inglês.',
          explanation: '"Church" (/Tcher-tch/) significa igreja.'
        },
        {
          question: 'O que significa o verbo "To watch"?',
          options: ['Ouvir atentamente', 'Caminhar na praia', 'Ver / Assistir (tela/TV)', 'Beber água'],
          correctAnswerIndex: 2,
          translation: 'Traduza o verbo visual.',
          explanation: '"To watch" (/uótch/) significa assistir ou assistir e ver ecrãs.'
        },
        {
          question: 'Como diz "Eu vejo TV no meu tempo livre"?',
          options: ['I check TV every day', 'I watch TV in my free time', 'I go TV on Sunday', 'I have church and TV'],
          correctAnswerIndex: 1,
          translation: 'Combine "watch TV" com "free time".',
          explanation: '"I watch TV in my free time" é a construção idiomática perfeita.'
        }
      ]
    }
  },
  {
    id: 'beg-24',
    level: 'beginner',
    title: 'Common Offices & Jobs',
    titlePt: 'Profissões Comuns do Dia-a-dia',
    introductionPt: 'Falar sobre o seu cargo profissional ou as funções de outras pessoas do escritório ajuda muito nas trocas de rede comercial.',
    vocabulary: [
      { en: 'Manager', pt: 'Gestor(a) / Diretor(a)', pronunciation: 'Mén-adjer' },
      { en: 'Driver', pt: 'Motorista / Condutor', pronunciation: 'Drái-ver' },
      { en: 'Security guard', pt: 'Guarda / Agente de segurança', pronunciation: 'Se-kiú-riti gárd' },
      { en: 'Job', pt: 'Emprego / Trabalho', pronunciation: 'Djób' },
      { en: 'Company', pt: 'Empresa / Companhia', pronunciation: 'Kám-pani' }
    ],
    dialoguePt: 'John descobre as profissões da equipa na paragem de chapa na Matola:',
    dialogue: [
      { speaker: 'John', textEn: 'What is your job, Samuel?', textPt: 'Qual é o teu trabalho, Samuel?' },
      { speaker: 'Samuel', textEn: 'I am a driver for a logistics company. And Sofia?', textPt: 'Eu sou motorista para uma empresa de logística. E a Sofia?' },
      { speaker: 'John', textEn: 'She is an office manager.', textPt: 'Ela é gestora de escritório.' }
    ],
    explanationPt: 'Dica do Sabush: Em inglês, antes de dizermos a nossa profissão no singular, devemos usar a pequena palavra "a" ou "an" (que significa "um" ou "uma"). Exemplo: "I am A manager" (Eu sou gestor), "I am AN engineer" (Eu sou engenheiro).',
    exercise: {
      id: 'ex-beg-24',
      question: 'O que significa profissionalmente o termo "Manager"?',
      options: ['Motorista de viatura', 'Gestor(a) ou Diretor(a)', 'Segurança nocturno', 'Operário fabril'],
      correctAnswerIndex: 1,
      translation: 'Escolha o cargo de liderança organizacional.',
      explanation: 'Uau! "Manager" (/Mén-adjer/) é o cargo de gestor ou diretor operacional.',
      questions: [
        {
          question: 'Como se diz "motorista" em inglês?',
          options: ['Manager', 'Driver', 'Guard', 'Co-worker'],
          correctAnswerIndex: 1,
          translation: 'Traduza o encarregado da condução viária.',
          explanation: '"Driver" (/Drái-ver/) significa motorista.'
        },
        {
          question: 'Como se traduz "Eu trabalho para uma empresa"?',
          options: ['I work for a company', 'I am a manager', 'I study company', 'I have a job company'],
          correctAnswerIndex: 0,
          translation: 'Traduza a ligação laboral.',
          explanation: '"I work for a company" (/Ái uêrk for á kám-pani/) é a frase exacta.'
        },
        {
          question: 'Qual é a palavra de base inglesa para "Emprego"?',
          options: ['Goal', 'Job', 'Office', 'Company'],
          correctAnswerIndex: 1,
          translation: 'Selecione o sinónimo correspondente.',
          explanation: '"Job" (/Djób/) é a palavra comum para emprego ou trabalho.'
        },
        {
          question: 'Qual é a regra correcta de artigo antes de profissão que começa com consoante (ex: driver)?',
          options: ['I am an driver', 'I am a driver', 'I driver are', 'I is have driver'],
          correctAnswerIndex: 1,
          translation: 'Selecione o artigo correcto.',
          explanation: 'Usamos "a" antes de consoantes: "I am a driver".'
        },
        {
          question: 'O que faz um "Security guard" corporativo?',
          options: ['Gere as finanças', 'Conduz camiões', 'Protege / Guarda o espaço físico', 'Limpa as secretárias'],
          correctAnswerIndex: 2,
          translation: 'Escolha a atribuição desta atividade de segurança.',
          explanation: 'Security guard (/Se-kiú-riti gárd/) é o agente encarregado de guardar as portas da empresa.'
        }
      ]
    }
  },
  {
    id: 'beg-25',
    level: 'beginner',
    title: 'Final Review: Complete Conversation',
    titlePt: 'Revisão Final: Conversa Real Completa',
    introductionPt: 'Parabéns! Você chegou à última lição do nível Iniciante do Sabush English Club. Vamos unir todas as peças numa conversa real fluida!',
    vocabulary: [
      { en: 'I speak English', pt: 'Eu falo inglês', pronunciation: 'Ái spíik Ínglich' },
      { en: 'My level is...', pt: 'O meu nível é...', pronunciation: 'Mái lével iz' },
      { en: 'Club', pt: 'Clube / Comunidade de apoio', pronunciation: 'Kláb' },
      { en: 'To speak well', pt: 'Falar bem', pronunciation: 'Tú spíik uél' },
      { en: 'See you next time!', pt: 'Até à próxima / Vemo-nos de seguida!', pronunciation: 'Síi iú nekst táim' }
    ],
    dialoguePt: 'Manuel fala confiante e despede-se com distinção de Helen:',
    dialogue: [
      { speaker: 'Manuel', textEn: 'Hello Helen! I speak English now. I study with Sabush.', textPt: 'Olá Helen! Eu já falo inglês. Estudo com o Sabush.' },
      { speaker: 'Helen', textEn: 'That is wonderful, Manuel! You speak very well.', textPt: 'Isso é maravilhoso, Manuel! Tu falas muito bem.' },
      { speaker: 'Manuel', textEn: 'Thank you very much. See you next time!', textPt: 'Muito obrigado. Até à próxima!' }
    ],
    explanationPt: 'Mensagem do Tutor Sabush: A persistência transforma estudantes em vencedores profissionais. O inglês irá alavancar todas as suas oportunidades de negócios em Moçambique! Continue praticando diariamente.',
    exercise: {
      id: 'ex-beg-25',
      question: 'Como diz "Eu falo inglês" de forma confiante?',
      options: ['I am speak English', 'I speak English', 'I code English', 'I have English name'],
      correctAnswerIndex: 1,
      translation: 'Escolha a frase da vitória em inglês.',
      explanation: 'Incrível! Você concluiu a jornada de base do Sabush! Agora pode dizer com toda a propriedade: "I speak English"!',
      questions: [
        {
          question: 'Como dizemos para desejar um "Até à próxima"?',
          options: ['Welcome you', 'How much price', 'See you next time!', 'Goodbye sorry'],
          correctAnswerIndex: 2,
          translation: 'Traduza o fecho elegante de conversas.',
          explanation: '"See you next time!" (/Síi iú nekst táim/) significa vemo-nos na próxima.'
        },
        {
          question: 'O que Helen diz sobre a fala de Manuel? "You speak very ___"',
          options: ['well', 'morning', 'under', 'help'],
          correctAnswerIndex: 0,
          translation: 'Complete com o advérbio "bem".',
          explanation: '"You speak very well" significa que falas muito bem.'
        },
        {
          question: 'O Sabush English é um:',
          options: ['Jogo de cartas', 'Clube / Comunidade móvel de apoio', 'Dicionário de papel', 'Curso em Nova York'],
          correctAnswerIndex: 1,
          translation: 'Selecione a definição do Sabush Club.',
          explanation: 'O Sabush English Club é a nossa amável comunidade local de inglês para Moçambique!'
        },
        {
          question: 'Qual é o seu nível agora concluído?',
          options: ['Beginner (Iniciante)', 'Advanced (Avançado)', 'Academic (Académico)', 'Nenhum de nós'],
          correctAnswerIndex: 0,
          translation: 'Indique o patamar completado.',
          explanation: 'Concluiu o nível "Beginner" (Iniciante)! Agora pode avançar com toda a segurança!'
        },
        {
          question: 'Como você agradece o elogio da Helen? "Thank you ___"',
          options: ['much more', 'very much', 'many ticket', 'you welcome'],
          correctAnswerIndex: 1,
          translation: 'Selecione a maneira educada de dizer muito obrigado.',
          explanation: 'Muito bem! "Thank you very much" é a resposta de cortesia polida.'
        }
      ]
    }
  }
];
