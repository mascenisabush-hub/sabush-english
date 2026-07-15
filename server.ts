/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './src/firebase';
import { LESSONS } from './src/data';
import { EnglishLevel } from './src/types';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON requests
app.use(express.json({ limit: '10mb' }));

// Initialize Gemini client lazily/safely as per SDK constraints to avoid crash if variable is empty
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API routes for the Sabush English platform
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI Tutor Chat Route
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, level, goal, roleplayScenario, debateTopic, isFeedbackRequest } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Nenhuma mensagem foi enviada.' });
    }

    const ai = getGeminiClient();

    // Contextual system instruction for the Mozambique adult learner English Tutor
    let systemInstruction = '';

    if (roleplayScenario) {
      if (isFeedbackRequest) {
        if (roleplayScenario === 'debate') {
          systemInstruction = `Você é o "Especialista Linguístico do Sabush English Club", um avaliador de debates e formador linguístico de elite extremamente perspicaz, encorajador e amigável.
Analise todo o histórico do debate intelectual em inglês que o aluno acabou de realizar no cenário de Debate & Persuasão sobre o tema "${debateTopic || 'Geral'}" (Nível de inglês do aluno: avançado).

Forneça um feedback detalhado, claro, robusto e estruturado EM PORTUGUÊS usando a formatação Markdown. O seu relatório de debate deve abranger exatamente os seguintes tópicos principais:

1. **Persuasão & Retórica**: Avalie a qualidade lógica e convicção dos argumentos colocados pelo aluno sob os questionamentos céticos do Mocho. Ele conseguiu estruturar ideias de forma coerente e persuasiva?
2. **Conectores Avançados & Registo**: Analise especificamente se o aluno incorporou conectores avançados de nível avançado (ex.: "Furthermore", "On the other hand", "Consequently", "Notwithstanding", "In contrast", "Whereas", "Therefore", "In conclusion"). Explique como ele poderia refinar o registo formal e apresente as escritas fonéticas adaptadas em barras (ex.: /fãr-der-mór/ para furthermore).
3. **Resiliência sob Pressão (Pushback)**: Avalie se o aluno demonstrou atitude resiliente diante das provocações intelectuais do "Advogado do Diabo", não recuando facilmente e respondendo com astúcia.
4. **Análise de Gramática Avançada**: Destaque pontos de excelência gramatical e aponte, de forma encorajadora e super amigável, correções construtivas com a alternativa perfeitamente correta em **negrito** (ex.: concordância, ordem das palavras, preposições avançadas).
5. **Dicas e Expressões de Elite para o Próximo Debate**: Forneça de 3 a 5 novas expressões argumentativas de alta potência com pronúncia fonética e exemplos de uso reais.

Mantenha o tom altamente profissional, caloroso, extremamente estimulante e no espírito amigável de Moçambique e do Sabush English Club!`;
        } else {
          systemInstruction = `Você é o "Especialista Linguístico do Sabush English Club", um avaliador de inglês extremamente amigável, encorajador e profissional. 
Analise todo o histórico da simulação de conversa (roleplay) em inglês que o aluno acabou de realizar no cenário "${roleplayScenario}" (Nível de inglês do aluno: "${level || 'beginner'}").

Forneça um feedback detalhado, claro e estruturado EM PORTUGUÊS usando a formatação Markdown. O seu relatório deve abranger os seguintes pontos principais:
1. **Análise de Gramática**: Destaque de forma positiva as frases que o aluno acertou e aponte correções de forma super amigável e construtiva para quaisquer erros observados (por exemplo, uso de "have" para idade, uso de preposições erradas, concordância, etc.), fornecendo as formas certas em **negrito**.
2. **Vocabulário & Expressões**: Avalie a escolha das palavras do aluno para o cenário e apresente de 3 a 5 novas palavras ou frases úmidas de uso comum em contextos reais para este cenário específico, com a tradução e a escrita fonética amigável entre barras (ex.: /bèg-graund/ para background).
3. **Comunicação Geral & Fluência**: Pontos fortes do estilo de conversação do aluno e o que ele pode focar no futuro para ganhar ainda mais confiança prática.
4. **Nota Final de Motivação**: Uma mensagem calorosa no espírito do Sabush e Moçambique para que o aluno continue motivado e sem medo de falar.

Mantenha o tom extremamente focado, acolhedor e encorajador.`;
        }
      } else {
        // Active roleplay scenario - stay strictly in character!
        let scenarioName = '';
        let scenarioPersona = '';
        if (roleplayScenario === 'job_interview') {
          scenarioName = 'Entrevista de Emprego (Job Interview)';
          scenarioPersona = 'a professional corporate HR manager conducting a job interview at an international logistics group in Mozambique. Be professional, direct, but polite';
        } else if (roleplayScenario === 'customer_service') {
          scenarioName = 'Atendimento ao Cliente (Customer Service)';
          scenarioPersona = 'an demanding international partner calling client service support helper to complain about a contract system failure. Be slightly impatient but professional, demanding quick answers';
        } else if (roleplayScenario === 'street_directions') {
          scenarioName = 'Pedir Informações na Rua (Asking for Directions)';
          scenarioPersona = 'a helpful tourist walking through Maputo city center who wants to find points of interest or landmarks. Be friendly and conversational';
        } else if (roleplayScenario === 'business_meeting') {
          scenarioName = 'Reunião de Trabalho (Business Meeting)';
          scenarioPersona = 'a proactive meeting leader reviewing department updates and discussing quarterly KPIs and project deadlines. Be collaborative and goal-oriented';
        } else if (roleplayScenario === 'debate') {
          scenarioName = `Debate & Persuasion on "${debateTopic || 'General Motion'}"`;
          scenarioPersona = `Devil's Advocate. You are an extremely articulate, highly intellectual, skeptical and provocative debater. Your job is to take an opposing or skeptical stance to whatever the user asserts. Respectfully but firmly push back on their arguments, point out logical fallacies in their statements, ask challenging and direct follow-up questions, and do NOT concede easily. Keep the conversation 100% in fluent, sophisticated, elite English and force them to think critically. Stay respectful and polite, but completely unmoved by shallow assertions. Keep your turns concise (around 2-3 sentences max) to maintain a fast-paced debate dialogue.`;
        } else {
          scenarioName = roleplayScenario;
          scenarioPersona = 'a supporting colleague in an office context';
        }

        systemInstruction = `You are a character roleplaying in English with a Mozambican adult language learner.
Scenario: "${scenarioName}"
Your Persona: Strictly stay in character as "${scenarioPersona}".

STRICT BEHAVIOURAL RULES FOR ROLEPLAY (MOST IMPORTANT):
1. NO PORTUGUESE: You must communicate 100% in English. Do not explain words, translate words, or write Portuguese remarks.
2. NO MID-CONVERSATION CORRECTIONS: Never correct the student's grammar, punctuation, or spelling errors during the conversation, as this ruins conversational immersion. Simply ignore the errors and carry on the roleplay dialogue naturally as your character would. The user will receive feedback only when they choose to finish the scenario.
3. ADAPT VOCABULARY AND PACE FOR THE LEARNER'S LEVEL:
   - If the student's level is "${level || 'beginner'}" (beginner/beginner level): Write short sentences, use simple words, and keep the sentence structure very easy to follow.
   - If the level is "intermediate": Use moderate professional vocabulary and introduce basic idiomatic expressions smoothly.
   - If the level is "advanced" or if the scenario is "debate": Speak completely naturally, like a native speaker or fluent executive, utilizing professional jargon, sophisticated syntax, and realistic conversational speeds.
4. FEEDBACK LOOP: Keep your responses highly concise (2 to 3 sentences maximum) and end each message with a realistic next question or prompt related to the roleplay context so the flow never stops.`;
      }
    } else {
      // Original standard AI tutor system prompt
      systemInstruction = `Você é o "Tutor de IA do Sabush English Club", um professor de inglês amigável, paciente, extremamente encorajador e altamente qualificado. Você ensina adultos falantes de português em Moçambique no seu percurso rumo à fluência.

O perfil atual do aluno é:
- Nível de Inglês: "${level || 'beginner'}" (iniciante: "beginner", intermediário: "intermediate", avançado: "advanced")
- Objetivo Principal de Aprendizagem: "${goal || 'Geral/Conversação'}" (por exemplo: Trabalho, Viagens, Estudos, Conversação)

Por favor, adote estritamente o seguinte comportamento de ensino personalizado:

1. COMPORTAMENTO POR NÍVEL:
   - SE o nível for "beginner" (Iniciante): Use inglês simples e de fácil compreensão acompanhado de explicações e suporte constantes em português. Faça traduções de frases complexas e novas palavras para português europeu/moçambicano. Apresente guias de pronúncia com escrita fonética amigável em português entre barras (ex.: Hello = /Helôu/).
   - SE o nível for "intermediate" (Intermediário): Comunique-se MAJORITARIAMENTE em inglês. Use o português brevemente apenas para clarificar nuances idiomáticas difíceis, falsos cognatos complicados ou pontos gramaticais específicos. Introduza expressões comuns que moçambicanos encontram em contextos profissionais ou digitais.
   - SE o nível for "advanced" (Avançado): Comunique-se 100% em inglês. Foque no refinamento da pronúncia, entonação, gírias e expressões idiomáticas, e na distinção de registo formal vs. informal. Discuta temas mais complexos e profissionais. Evite usar português.

2. CORRECÇÃO GENTIL DE ERROS (CRÍTICO):
   - Nunca diga apenas "errado" ou "wrong" de forma fria ou negativa.
   - Sempre que o aluno cometer um erro de vocabulário, ortografia ou gramática, aponte-o de forma GENTIL e encorajadora.
   - Explique brevemente EM POUCAS PALAVRAS por que é um erro e mostre a versão correcta em inglês com formatação destacada (ex.: usando **negrito**).
   - Exemplo: "You said 'I have 20 years'. In English, we use the verb 'to be' for age: '**I am 20 years old**'."

3. ALIMENTAR A CONVERSATION LOOP:
   - Sempre termine as suas respostas com uma pergunta de seguimento para incentivar o aluno a continuar a conversar e praticar. Não deixe a conversa morrer.

4. ALINHAMENTO COM O OBJETIVO DO ALUNO ("${goal || 'Conversação'}"):
   - Faça sugestões de tópicos, exemplos de frases e contextos reais de Moçambique (comércio em Maputo, pesca e turismo em Inhambane, logística na Beira ou cooperação internacional) diretamente correlacionados com o objetivo deles:
     * Trabalho / Carreira (Work): simulações de reuniões, termos de escritório, entrevistas.
     * Viagens / Turismo (Travel): aeroportos, hotéis, direções.
     * Estudos / Academia (Studies): vocabulário acadêmico, apresentações.
     * Conversação / Dia-a-dia (Conversation): hobbies, rotinas, expressões diárias.

5. CONCISÃO DO CHAT:
   - Mantenha as suas respostas sempre CURTAS e estruturadas em parágrafos de 1 a 3 linhas ou com tópicos rápidos. Os alunos costumam ler em ecrãs de telemóveis pequenos. Evite redações acadêmicas longas.

Mostre calor humano e apoio local. Use termos amigáveis como "Força! Vamos a isso!", "Estamos juntos!" ou "Excelente trabalho!".`;
    }

    if (!ai) {
      // Local highly detailed simulation in case no Gemini API key is configured
      // Ensures elegant working UX in all states
      const text = message.toLowerCase();
      let reply = '';

      if (roleplayScenario) {
        if (isFeedbackRequest) {
          if (roleplayScenario === 'debate') {
            reply = `### ⚖️ Relatório de Avaliação do Debate: Resiliência & Persuasão 🦉

Excelente prática! Acabas de concluir um debate intelectual complexo sob o cenário **Debate & Persuasão** com o Mocho como o Advogado do Diabo. Aqui está o teu feedback avançado:

#### 1. 📐 Persuasão & Retórica
* **Avaliação**: Conseguiste expor pontos importantes e mantiveste uma linha de argumentação sólida!
* **Oportunidades**: Para tornar o teu ponto irrefutável, estrutures os teus argumentos usando o modelo **PREP** (Point, Reason, Example, Point).

#### 2. 🔗 Conectores Avançados & Registo
* **Análise**: O teu registo de conversa foi polido, mas podes enriquecê-lo com conectores formais.
* **Tente incorporar**:
  * **"Furthermore"** (/fãr-der-mór/) — Além disso (Ex.: *Furthermore, remote work increases productivity.*).
  * **"Notwithstanding"** (/not-with-stán-ding/) — Apesar de / não obstante (Ex.: *Notwithstanding the challenges, automation is inevitable.*).
  * **"Consequently"** (/kón-se-kuent-li/) — Consequentemente (Ex.: *Consequently, the local economic indicators rose.*).

#### 3. 💪 Resiliência sob Pressão (Pushback)
* Respondeste muito bem às perguntas provocadoras! O Mocho tentou contra-argumentar de forma rígida, mas mantiveste a tua postura e não cedeste nas justificativas.

#### 4. 📝 Correcções Gramaticais Recomendadas
* Usaste boas estruturas avançadas. Atenção a pequenos deslizes:
  * Em vez de "it exist benefits", o correto é **"benefits exist"** ou **"there are benefits"**.
  * Preferes **"on the long term"**? O termo nativo mais polido é **"in the long run"** ou **"in the long term"**.

---
**🦉 Coach do Sabush:** "Debater obriga-nos a pensar em inglês sob stress. O teu desempenho foi fantástico e demonstrou a maturidade do teu nível avançado! Continua assim! 🇲🇿🔥"`;
          } else {
            reply = `### 🦉 Relatório do Mocho: Como correu o teu Roleplay? 🎭

Que belíssimo esforço! Completaste o cenário de **${roleplayScenario === 'job_interview' ? 'Entrevista de Emprego' : roleplayScenario === 'customer_service' ? 'Atendimento ao Cliente' : roleplayScenario === 'street_directions' ? 'Pedir Informações' : 'Reunião de Trabalho'}** com grande determinação. Aqui está uma avaliação detalhada do teu inglês:

#### 1. 📝 Análise de Gramática & Escrita
* **Pontos Fortes**: Conseguiste estruturar respostas de forma compreensível e demonstraste excelente reação imediata!
* **Dicas de Aperfeiçoamento**:
  * É comum os alunos usarem o verbo 'have' para idade. Lembra-te: diz-se sempre **"I am... years old"** em vez de "I have..."
  * Atenção ao uso de preposições comuns. Por exemplo: dizemos **"at work"** (no trabalho) ou **"on Monday"** (na segunda-feira).

#### 2. 🗣️ Vocabulário & Novas Expressões
Para brilhares ainda mais no futuro neste mesmo cenário, aprende e pratica estas expressões:
* **"Background"** (/bég-graund/) — Significa *experiência/histórico profissional*. É perfeito para usar em entrevistas (Ex.: *My background is in logistics*).
* **"To follow up"** (/tú fólou-áp/) — Significa *acompanhar/dar seguimento*. Muito útil para reuniões e clientes.
* **"Could you repeat, please?"** (/kúd iú ripít plíz/) — Uma forma super polida de pedir para repetirem quando não compreenderes bem.

#### 3. 📉 Comunicação & Fluência
Continuas a progredir lindamente no nível **${level || 'beginner'}**! O mais importante é o teu desprendimento em falar sem gaguejar. Estás no caminho certo!

---
**🦉 Mocho Coach:** "Erros são as sementes do teu crescimento linguístico. Excelente prática! Força, estamos juntos no Sabush English Club! 🇲🇿✨"`;
          }
        } else {
          // Simulate active scenario responses based on user messages
          if (roleplayScenario === 'job_interview') {
            reply = `Indeed! Thank you for sharing that about yourself. That is a solid introduction. Now, can you describe a major professional challenge you faced at work, and how you managed to resolve it successfully?`;
          } else if (roleplayScenario === 'customer_service') {
            reply = `Alright, but this is a critical delay for my operations! I understand you are trying to help, but can you guarantee this will be completely fixed by the end of today? What is the estimated recovery time?`;
          } else if (roleplayScenario === 'street_directions') {
            reply = `Oh, that is amazing! So if I turn right at the corner by the public square, I will see the big station on my left hand? Is there any famous building nearby that I can look for?`;
          } else if (roleplayScenario === 'debate') {
            if (debateTopic === 'remote_vs_office') {
              reply = `While that remote option sounds highly comfortable in theory, how do you handle the severe team fragmentation and lack of immediate creative collaboration when everyone is isolated at home? Is a physical office not the true engine of corporate innovation?`;
            } else if (debateTopic === 'automation_vs_jobs') {
              reply = `An interesting claim indeed, but won't the massive displacement of low-skilled workers outpace the creation of new high-tech opportunities, leading to severe local structural unemployment? How can Mozambican families sustain themselves in the short term?`;
            } else if (debateTopic === 'foreign_investment') {
              reply = `A traditional economic view, but aren't you overselling the trickle-down benefits? Most of these multinational corps secure massive tax exemptions, meaning they extract raw wealth and leave negligible infrastructure. Is it truly a win-win for local communities?`;
            } else {
              reply = `That point is highly debatable. You seem to gloss over the empirical data. How do you defend your stance when the real-world evidence shows a completely different and less encouraging outcome?`;
            }
          } else {
            reply = `That makes a lot of sense. Thank you for these department details. What are our key steps for this week to make sure we don't hit any blockers with the project deadline?`;
          }
        }
      } else {
        if (text.includes('olá') || text.includes('ola') || text.includes('bom dia') || text.includes('boa tarde') || text.includes('hello')) {
          reply = `Hello! Olá! Eu sou o seu **Sabush AI Tutor** pessoal (Modo Simulação local). 🦉\n\nIdentifiquei que está no nível **${level || 'beginner'}** de inglês, e o seu foco de estudo é **${goal || 'Conversação Geral'}**.\n\nComo este é um espaço seguro de aprendizagem onde errar faz parte da caminhada, pode escrever sem receio! \n\nComo posso ajudar-lhe hoje? Se quiser treinar conversação sobre **${goal || 'Conversação'}**, diga "quero praticar"! Estamos juntos!`;
        } else if (text.includes('praticar') || text.includes('conversar') || text.includes('practice')) {
          if (level === 'advanced') {
            reply = `Excellent decision! Let's practice advanced conversations regarding **${goal || 'general situations'}**. Describe your current career aspirations or a recent professional challenge you had in Mozambique. What is your take on this?`;
          } else if (level === 'intermediate') {
            reply = `That is great! Let's practice. What did you do yesterday? Tell me in 2 sentences. (Tip: Use simple past: *I worked*, *I studied*). How was your yesterday?`;
          } else {
            reply = `Awesome! Vamos treinar o inglês básico para **${goal || 'o quotidiano'}** com perguntas fáceis.\n\nResponda em inglês:\n**"Hello! What is your name and which province are you from?"**\n\n(Dica de resposta: *"My name is [Seu Nome] and I am from [Sua Província]"*). Força, dê o seu melhor!`;
          }
        } else if (text.includes('do vs does') || text.includes('do') || text.includes('does')) {
          reply = `Excelente pergunta! Em inglês, usamos **Do** e **Does** para fazer perguntas e negações no presente simples:\n\n• **DO** é usado para: *I, You, We, They*.\n  - Exemplo: *Do you speak English?* (Tu falas inglês?)\n• **DOES** é usado para o singular: *He, She, It*.\n  - Exemplo: *Does Beatriz work in Beira?* (A Beatriz trabalha na Beira?)\n\nPercebeu bem esta diferença? Tente escrever um exemplo simples de frase de teste usando um deles!`;
        } else if (text.includes('obrigado') || text.includes('thank you') || text.includes('obrigada')) {
          reply = `You are welcome! (De nada!)\n\nEm inglês, a forma padrão é **"Thank you"** ou um simples **"Thanks"**. Lembre-se de colocar a pontinha da língua entre os dentes ao articular o som "th" de "thank" (/ténk/):\n\nQuer experimentar usar "Thank you" numa frase completa?`;
        } else if (text.includes('carreira') || text.includes('emprego') || text.includes('work') || text.includes('entrevista') || text.includes('trabalho')) {
          reply = `Inglês abre portas na carreira profissional em Moçambique! 💼\n\nNum contexto de trabalho, estes termos são fundamentais:\n• **Background** (/békgraund/): a sua experiência passada.\n• **Skills** (/skílz/): qualificações/habilidades.\n• **Role** (/róul/): cargo ou função.\n\nQueremos treinar uma simulação de entrevista de emprego curta em inglês?`;
        } else {
          // Simple intelligent self-correction detection to demonstrate the error-correction behavior requested!
          if (text.includes('i have 20') || text.includes('i have 30') || text.includes('i have 25') || text.includes('i have 18') || text.includes('i have years')) {
            reply = `Excelente tentativa! Mas repare neste pormenor muito comum:\n\nEm inglês, não usamos o verbo 'to have' para a idade, mas sim o verbo 'to be'. \n\nEm vez de "I have 20", a forma correta é:\n👉 **"I am 20 years old"** ou simplesmente **"I am 20"**.\n\nFaz todo o sentido? Diga-me, *how old are you?* (Quantos anos você tem?) para treinarmos!`;
          } else {
            reply = `Muito bem! Recebi a sua mensagem: "${message}".\n\nComo está no nível **${level || 'beginner'}** e estuda para **${goal || 'Melhoria de Carreira'}**, estamos no caminho certo! Lembre-se de que este é um espaço seguro de aprendizagem.\n\nTente formular uma frase curta em inglês contanto um pouco da sua rotina, ou coloque qualquer dúvida. Qual é o próximo tema que quer aprender?`;
          }
        }
      }

      return res.json({ text: reply, isDemo: true });
    }

    // Populate historical messages if passed of type Array<{role: 'user' | 'model', text: string}>
    // In @google/genai Chats API, we can either send them or do messages. For simpler lightweight single request,
    // we can also package them into contents, but let's send with chat or generateContent with appropriate chat structured messages!
    // Since we want standard history, we can map them:
    if (history && Array.isArray(history) && history.length > 0) {
      // Let's manually generateContent with full history mapped or feed it.
      const contents = history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));
      
      // Append newest user prompt
      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({ text: response.text });
    } else {
      // Single message turn
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: message,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({ text: response.text });
    }

  } catch (error: any) {
    console.error('Erro na rota de Chat do Gemini:', error);
    res.status(500).json({ 
      error: 'De momento não conseguimos processar o pedido de IA.',
      details: error.message,
      text: 'Olá! Peço imensas desculpas, mas tivemos um pequeno problema de ligação ao meu servidor do Tutor de IA. Contudo, vamos continuar a estudar! Que perguntas tem sobre a lição atual?'
    });
  }
});

// Subscription Q&A Route
app.post('/api/subscription-qa', async (req, res) => {
  try {
    const { question, history } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Nenhuma pergunta foi enviada.' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `Você é o "Assistente de Suporte e Pagamentos do Sabush English Club" (Sabush Support Bot).
Sua missão é responder a dúvidas dos estudantes moçambicanos sobre o processo de subscrição, métodos de pagamento, preços e ativação de contas na plataforma Sabush English Club.

Por favor, siga rigorosamente as seguintes diretrizes de informação ao responder:

1. INFORMAÇÕES DE PREÇOS E PLANOS:
   - O plano atual do Sabush English Club custa apenas **299 MT por mês** (Meticais).
   - Este valor é um preço promocional por tempo limitado (poupança de 70%, o preço normal é de 999 MT por mês).
   - Benefícios da subscrição: Acesso ilimitado a todas as lições Intermédias, lições Avançadas (inglês de negócios/carreiras), galeria de cartões de inspiração e prática de conversação ilimitada 24/7 com o nosso Tutor de IA Inteligente.

2. MÉTODOS DE PAGAMENTO ACEITES:
   - **M-Pesa (Vodacom)**: Transferência para o número de celular **858624086**.
   - **E-Mola (Movitel)**: Transferência para o número de celular **870242114**.
   - **Banco BIM (Millennium BIM)**: Transferência ou depósito para a conta oficial:
     * Número de Conta/NIB: **1176885675**
     * Titular da Conta: **SABUSHIMIKE MASCENI DIEUDONNE**

3. TERMOS DA ASSINATURA & CANCELAMENTO (FAQs):
   - **Fidelização**: Não existe qualquer fidelização! O estudante pode cancelar ou deixar de pagar quando quiser.
   - **Frequência de Envio**: Como os pagamentos em Moçambique via carteiras móveis/BIM são manuais, o aluno deve efetuar a transferência e submeter o comprovativo (ID de transação) **todos os meses** para renovar o acesso.
   - **Garantia de Reembolso**: Há uma garantia incondicional de satisfação de **7 dias**. Se o estudante não se adaptar ao método, pode solicitar o reembolso total enviando mensagem no WhatsApp de suporte.
   - **Progresso de Estudos**: Caso a assinatura expire, o progresso acumulado (lições completas, nível, histórico) **nunca é perdido**, ficando guardado com segurança na conta do estudante. Apenas o acesso às lições e tutor é suspenso até que se faça um novo envio de comprovativo.

4. PROCESSO DE ATIVAÇÃO / CONFIRMAÇÃO:
   - Após efetuar o pagamento (seja por M-Pesa, E-Mola ou BIM), o aluno deve submeter o comprovante na plataforma.
   - O aluno deve aceder à secção "Torne-se Membro", selecionar o método usado, e introduzir o **ID de Transação ou Referência** (por exemplo: PP260613.1234.AB789CD) que recebeu na SMS de confirmação da carteira móvel ou talão de depósito.
   - O administrador do Sabush English Club analisa a referência e confirma manualmente.
   - O processo de ativação demora geralmente **menos de 24 horas**.

5. REGRAS DE ATITUDE E IDIOMA:
   - Responda sempre em **Português de Moçambique** de forma extremamente calorosa, encorajadora, respeitosa e clara.
   - Use termos amigáveis como "Estamos juntos!", "Força nos estudos!" ou "Excelente iniciativa!".
   - Mantenha a resposta concisa, limpa e estruturada com tópicos simples se necessário. Ideal para leitura rápida no telemóvel.
   - Se o usuário perguntar algo que não seja relacionado a pagamentos ou ao Sabush English Club, responda de forma educada redirecionando o foco para os planos de inglês do Sabush.`;

    if (!ai) {
      // Local simulated response for preview and fallback
      const text = question.toLowerCase();
      let reply = '';

      if (text.includes('preço') || text.includes('preco') || text.includes('quanto custa') || text.includes('valor') || text.includes('mensal') || text.includes('pagar')) {
        reply = `O acesso ao **Sabush English Club** está com uma super promoção especial! 🌟\n\nPor apenas **299 MT/mês** (antes 999 MT), você ganha acesso ilimitado a todas as lições intermédias, avançadas de negócios, e prática de conversação ilimitada 24/7 com o nosso Tutor de IA.\n\nVocê pode pagar via **M-Pesa**, **E-Mola** ou **BIM**. Gostaria de ver os dados para transferência?`;
      } else if (text.includes('fideliza') || text.includes('contrato') || text.includes('cancelar') || text.includes('cancela')) {
        reply = `Não existe qualquer contrato de fidelização ou compromisso! 🤝\n\nVocê pode cancelar ou deixar de pagar a sua subscrição do Sabush English Club quando quiser, sem qualquer tipo de multa ou complicação. O seu acesso continuará ativo até que o período mensal atual expire. Força nos estudos!`;
      } else if (text.includes('todos os meses') || text.includes('enviar todos') || text.includes('enviar o comprovativo') || text.includes('renova')) {
        reply = `Sim, o envio do comprovativo deve ser feito **todos os meses** na sua renovação. \n\nComo as transferências via M-Pesa, E-Mola e BIM em Moçambique são processadas de forma manual pelo nosso administrador, precisamos que insira o novo **ID de Transação** a cada ciclo de 30 dias para revalidarmos e estendermos o seu plano por mais um mês. É muito simples e rápido!`;
      } else if (text.includes('reembolso') || text.includes('devolução') || text.includes('reembolsar') || text.includes('devolver')) {
        reply = `Nós garantimos a sua satisfação total! 🌟\n\nOferecemos uma **garantia de reembolso incondicional de 7 dias**. Se por alguma razão você sentir que a nossa plataforma não é para si dentro de uma semana após a ativação, basta contactar-nos diretamente pelo suporte do **WhatsApp** no rodapé que devolveremos 100% do seu valor pago. Sem burocracias!`;
      } else if (text.includes('perder') || text.includes('expirar') || text.includes('perco o progresso') || text.includes('progresso')) {
        reply = `O seu progresso de estudos está seguro! 🔒\n\nCaso a sua assinatura expire, você **não perde as lições já concluídas, nem o seu nível, nem os seus cartões guardados**. Tudo fica guardado na sua conta. Apenas o acesso às novas lições intermédias/avançadas e ao Tutor de IA ficará suspenso até que efetue um novo pagamento e submeta o ID correspondente.`;
      } else if (text.includes('mpesa') || text.includes('m-pesa') || text.includes('858624086')) {
        reply = `Para pagar via **M-Pesa**, envie o valor de **299 MT** para o número de celular oficial:\n\n👉 Celular Vodacom: **858624086**\n\nApós o envio, copie o **ID de Transação** (referência da SMS) e envie no formulário de confirmação acima para ativarmos o seu acesso em menos de 24 horas! Estamos juntos!`;
      } else if (text.includes('emola') || text.includes('e-mola') || text.includes('870242114')) {
        reply = `Para pagar via **E-Mola**, envie o valor de **299 MT** para o número oficial:\n\n👉 Celular Movitel: **870242114**\n\nDepois, insira a **referência ou ID de transação** recebida na SMS aqui no formulário da página "Torne-se Membro". O administrador validará e libertará o seu acesso em menos de 24 horas!`;
      } else if (text.includes('bim') || text.includes('banco') || text.includes('nib') || text.includes('conta') || text.includes('transferencia') || text.includes('transferência')) {
        reply = `Claro! Aceitamos transferência bancária direta para o **Millennium BIM**:\n\n👉 Número de Conta/NIB: **1176885675**\n👉 Titular: **SABUSHIMIKE MASCENI DIEUDONNE**\n\nDepois de efetuar o depósito ou transferência, basta submeter o ID de transação ou número do comprovante no formulário acima para validação manual de ativação em até 24 horas.`;
      } else if (text.includes('tempo') || text.includes('demora') || text.includes('ativar') || text.includes('ativação') || text.includes('pendente') || text.includes('horas')) {
        reply = `Após submeter o seu comprovativo (ID de transação ou referência) no formulário, a ativação do seu plano Sabush Club é feita de forma manual pelo nosso administrador. \n\nO processo de validação é rápido e demora geralmente **menos de 24 horas**. Assim que confirmado, o seu acesso a todas as ferramentas será libertado automaticamente! 🚀`;
      } else if (text.includes('comprovativo') || text.includes('referencia') || text.includes('referência') || text.includes('id') || text.includes('onde colocar')) {
        reply = `Para submeter o seu comprovativo:\n1. Vá ao **Passo 2 (Submeter Comprovativo)** nesta mesma página.\n2. Escolha o método que utilizou (M-Pesa, E-Mola ou BIM).\n3. No campo **ID de Transação ou Referência**, escreva o código que recebeu por SMS ou o número do talão (ex: PP260613...).\n4. Clique em "Submeter Comprovativo de Verificação".\n\nO nosso administrador irá validar e ativar a sua subscrição dentro de 24 horas!`;
      } else if (text.includes('contacto') || text.includes('whatsapp') || text.includes('suporte') || text.includes('ajuda') || text.includes('problema')) {
        reply = `Se tiver qualquer dúvida ou se encontrar algum problema ao enviar o seu comprovante, não hesite em contactar-nos diretamente via **WhatsApp** clicando no botão de suporte no rodapé da aplicação. A equipa da Sabush Agency está sempre pronta a ajudar-lhe! 🇲🇿`;
      } else {
        reply = `Olá! Sou o **Sabush Payment Assistant**. 🦉\n\nEstou aqui para esclarecer qualquer dúvida sobre a nossa subscrição de **299 MT/mês** ou termos da assinatura (**M-Pesa, E-Mola, BIM, Cancelamentos, Reembolsos**).\n\nComo posso ajudar-lhe hoje? Pode perguntar-me por exemplo:\n- *"Existe fidelização ou posso cancelar?"*\n- *"Tenho que pagar todos os meses?"*\n- *"Como funciona o reembolso?"*\n- *"Perco o meu progresso se expirar?"*`;
      }

      return res.json({ text: reply, isDemo: true });
    }

    // Call real Gemini API
    const contents = [];
    if (history && Array.isArray(history) && history.length > 0) {
      history.forEach((msg: any) => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: question }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.4, // lower temperature for factual and support queries
      },
    });

    return res.json({ text: response.text });

  } catch (error: any) {
    console.error('Erro na rota de Suporte de Assinatura do Gemini:', error);
    res.status(500).json({
      error: 'De momento não conseguimos processar a pergunta por IA.',
      details: error.message,
      text: 'Olá! De momento estamos com dificuldades de ligação à IA do Assistente de Pagamentos. No entanto, o custo da assinatura é de 299 MT/mês e aceitamos M-Pesa (858624086), E-Mola (870242114) e BIM (1176885675). Se precisar de apoio imediato, contacte-nos pelo WhatsApp!'
    });
  }
});

// Evaluate Recording Route
app.post('/api/evaluate-recording', async (req, res) => {
  try {
    const { audioBase64, mimeType, speakingPrompt } = req.body;

    if (!speakingPrompt) {
      return res.status(400).json({ error: 'O prompt falado esperado é obrigatório.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Return a simulated structured response if Gemini API key is missing
      // to keep development local preview running gracefully.
      return res.json({
        transcript: speakingPrompt,
        feedbackPt: "Excelente esforço! A sua pronúncia foi clara e próxima do nativo. Continue a praticar no Sabush para aperfeiçoar cada detalhe!",
        matchLevel: "excelente",
        isDemo: true
      });
    }

    const systemInstruction = `Você é o "Especialista em Pronúncia do Sabush English Club" (Mocho AI Coach), um avaliador de pronúncia e fluência em inglês extremamente amigável, acolhedor e encorajador para estudantes moçambicanos.

Instruções:
1. Você receberá o áudio gravado do aluno (se fornecido) e a frase que ele deveria tentar falar em inglês: "${speakingPrompt}".
2. Analise o áudio e faça a transcrição exata em inglês do que foi falado no áudio (no campo "transcript"). Se o áudio for simulado, vazio ou não enviado, defina o "transcript" como sendo a frase esperada ou muito parecida.
3. Compare o que foi dito com a frase esperada e determine o nível de correspondência ("matchLevel"):
   - "excelente": se corresponder perfeitamente ou quase perfeitamente (mais de 90% correto).
   - "bom": se estiver compreensível mas com alguns pequenos deslizes de pronúncia ou ritmo (70% - 90% correto).
   - "pratique_mais": se estiver muito distante, silencioso ou difícil de compreender (menos de 70% correto).
4. No campo "feedbackPt", forneça uma avaliação encorajadora em PORTUGUÊS adequada para um adulto de Moçambique. Inclua:
   - (a) como a fala se aproxima da frase esperada,
   - (b) 1-2 dicas super práticas de pronúncia ou gramática se aplicável (ex: como pronunciar sons difíceis como "th", sons mudos, ou consoantes terminais),
   - (c) uma frase acolhedora de incentivo típica no espírito moçambicano (ex: "Força!", "Estamos juntos!", "Excelente trabalho!").
5. Responda estritamente no formato JSON estruturado com os campos solicitados.`;

    const contents: any[] = [];
    if (audioBase64) {
      contents.push({
        inlineData: {
          mimeType: mimeType || 'audio/webm',
          data: audioBase64,
        },
      });
    }

    const promptText = audioBase64 
      ? "Por favor, oiça esta gravação de áudio do aluno e compare-a com a frase esperada. Transcreva-a e avalie-a estruturadamente."
      : `Simule um feedback amigável de nível "excelente" para a frase esperada: "${speakingPrompt}", pois o áudio foi enviado como simulação.`;

    contents.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            transcript: {
              type: Type.STRING,
              description: "A transcrição exata em inglês do que foi falado no áudio.",
            },
            feedbackPt: {
              type: Type.STRING,
              description: "Avaliação amigável em português com 1-2 dicas específicas de pronúncia ou gramática e incentivo caloroso.",
            },
            matchLevel: {
              type: Type.STRING,
              enum: ["excelente", "bom", "pratique_mais"],
              description: "Nível de correspondência entre o falado e a frase esperada.",
            },
          },
          required: ["transcript", "feedbackPt", "matchLevel"],
        },
        temperature: 0.4,
      },
    });

    const resultText = response.text || '';
    const parsedResult = JSON.parse(resultText.trim());

    return res.json(parsedResult);
  } catch (error: any) {
    console.error('Erro na avaliação de gravação com o Gemini:', error);
    res.status(500).json({
      error: 'De momento não conseguimos processar a avaliação por IA.',
      details: error.message,
    });
  }
});

// ==========================================
// WHATSAPP BUSINESS CLOUD API INTEGRATION
// ==========================================

interface ServerVocabWord {
  en: string;
  pt: string;
  pronunciation: string;
}

function getWordOfTheDayServer(level: EnglishLevel): ServerVocabWord {
  const levelVocabMap = new Map<string, ServerVocabWord>();

  LESSONS.forEach(lesson => {
    if (lesson.level === level) {
      if (lesson.vocabulary && Array.isArray(lesson.vocabulary)) {
        lesson.vocabulary.forEach(v => {
          if (v.en && v.pt) {
            const normalizedKey = v.en.trim().toLowerCase();
            if (!levelVocabMap.has(normalizedKey)) {
              levelVocabMap.set(normalizedKey, {
                en: v.en.trim(),
                pt: v.pt.trim(),
                pronunciation: (v.pronunciation || '').trim()
              });
            }
          }
        });
      }
    }
  });

  const filteredVocab = Array.from(levelVocabMap.values());

  if (filteredVocab.length === 0) {
    return {
      en: "Consistency",
      pt: "Consistência",
      pronunciation: "/kənˈsɪstənsi/"
    };
  }

  // Consistent date-hash picker
  const today = new Date();
  const dateHash = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = Math.abs(dateHash) % filteredVocab.length;
  return filteredVocab[index];
}

function getLevelLabelPt(lvl: string): string {
  switch (lvl) {
    case 'beginner': return 'Iniciante (Beginner)';
    case 'intermediate': return 'Intermediário (Intermediate)';
    case 'advanced': return 'Avançado (Advanced)';
    default: return 'Iniciante';
  }
}

async function sendWhatsAppMessage(to: string, messageText: string): Promise<{ success: boolean; error?: string; response?: any }> {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || token === 'MY_WHATSAPP_API_TOKEN' || !phoneId || phoneId === 'MY_WHATSAPP_PHONE_NUMBER_ID') {
    const errMsg = 'WhatsApp environment variables are not configured or contain placeholder values.';
    console.warn(`[WHATSAPP CLIENT SIMULATOR] To: ${to} | Message: ${messageText} | Status: (Simulated Success - credentials missing)`);
    return { success: true, response: { simulated: true, message: messageText } };
  }

  try {
    let formattedTo = to.trim().replace(/\s+/g, '');
    if (!formattedTo.startsWith('+')) {
      formattedTo = '+' + formattedTo;
    }

    const url = `https://graph.facebook.com/v18.0/${phoneId}/messages`;
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: formattedTo,
      type: "text",
      text: {
        preview_url: true,
        body: messageText
      }
    };

    console.log(`[WHATSAPP API] Dispatching message to ${formattedTo}...`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json() as any;

    if (!response.ok) {
      console.error('[WHATSAPP API ERROR]', data);
      return { 
        success: false, 
        error: data?.error?.message || `HTTP error ${response.status}`, 
        response: data 
      };
    }

    console.log(`[WHATSAPP API SUCCESS] Message successfully sent to ${formattedTo}. ID:`, data?.messages?.[0]?.id);
    return { success: true, response: data };
  } catch (err: any) {
    console.error('[WHATSAPP API EXCEPTION]', err);
    return { success: false, error: err.message || 'Unknown network error' };
  }
}

// Single daily reminders / word of the day dispatcher triggerable by HTTP Cron trigger (GET/POST)
app.all('/api/cron/whatsapp-reminders', async (req, res) => {
  console.log('[CRON JOBS] Starting WhatsApp daily reminder execution batch...');
  
  // Calculate today in Mozambique time zone (UTC+2)
  const mozDate = new Date(new Date().getTime() + (2 * 60 * 60 * 1000));
  const mozTodayStr = mozDate.toISOString().split('T')[0];

  const report = {
    date: mozTodayStr,
    processedCount: 0,
    sentReminders: 0,
    sentWordOfTheDay: 0,
    skippedAlreadySent: 0,
    failures: [] as Array<{ userId: string; name: string; error: string }>,
    successes: [] as Array<{ userId: string; name: string; type: 'streak_reminder' | 'word_of_the_day'; to: string }>
  };

  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);

    for (const d of snapshot.docs) {
      const user = d.data();
      const userId = d.id;
      
      // Filter out users who don't have WhatsApp set up or enabled
      if (!user.whatsappNumber || !user.whatsappNotificationsEnabled) {
        continue;
      }

      report.processedCount++;

      // Prevent duplicate sends per day
      if (user.lastWhatsappNotifiedDate === mozTodayStr) {
        report.skippedAlreadySent++;
        continue;
      }

      const level = (user.level || 'beginner') as EnglishLevel;
      const streak = user.streak || 0;
      const lastActiveDate = user.lastActiveDate || '';
      const name = user.name || 'Estudante';
      const to = user.whatsappNumber;

      let msgText = '';
      let messageType: 'streak_reminder' | 'word_of_the_day' = 'word_of_the_day';

      // Rule: Active streak and has not been active today -> Send streak reminder
      if (streak > 0 && lastActiveDate !== mozTodayStr) {
        messageType = 'streak_reminder';
        report.sentReminders++;

        if (level === 'beginner') {
          msgText = `🔥 *Não perca o seu streak no Sabush English Club!* 🔥\n\nOlá, *${name}*! Sabia que já conquistou *${streak} ${streak === 1 ? 'dia' : 'dias'}* de streak? 🥳 Parabéns pelo seu progresso!\n\nNão deixe este hábito inicial arrefecer hoje. Dedique apenas 5 minutinhos para fixar as bases! 🦉🇲🇿\n\nAceda ao Sabush Club aqui:\n${process.env.APP_URL || 'https://ais-pre-tzgs5o34sl2niugeeg2f4s-926917621799.europe-west2.run.app'}`;
        } else if (level === 'intermediate') {
          msgText = `🔥 *Mantenha o ritmo rumo à fluência!* 🔥\n\nOlá, *${name}*! Já são *${streak} ${streak === 1 ? 'dia' : 'dias'}* de streak acumulados. No nível Intermédio, a consistência diária é a verdadeira chave para destravar a sua fala! 📈\n\nNão deixe a chama apagar hoje, faça uma lição rápida agora 🦉🇲🇿\n\nAceda ao Sabush Club aqui:\n${process.env.APP_URL || 'https://ais-pre-tzgs5o34sl2niugeeg2f4s-926917621799.europe-west2.run.app'}`;
        } else {
          msgText = `🔥 *Desafio de Mestre: Streak de ${streak} ${streak === 1 ? 'dia' : 'dias'}!* 🔥\n\nOlá, *${name}*! O seu streak avançado é um exemplo brilhante para todo o club. A excelência e a naturalidade requerem prática diária e contacto constante. 🎯\n\nDedique alguns minutos hoje para exercitar a sua pronúncia com a nossa IA! 🦉🇲🇿\n\nAceda ao Sabush Club aqui:\n${process.env.APP_URL || 'https://ais-pre-tzgs5o34sl2niugeeg2f4s-926917621799.europe-west2.run.app'}`;
        }
      } else {
        // Otherwise -> Send daily Word of the Day!
        messageType = 'word_of_the_day';
        report.sentWordOfTheDay++;

        const word = getWordOfTheDayServer(level);
        msgText = `📖 *Palavra do Dia no Sabush English Club* 🦉🇲🇿\n\n*Nível:* ${getLevelLabelPt(level)}\n*Termo:* ${word.en}\n*Tradução:* ${word.pt}\n*Pronúncia:* ${word.pronunciation}\n\nConsistência diária é o segredo da fluência! Continue a aprender hoje ✨\n\nAceda ao Club:\n${process.env.APP_URL || 'https://ais-pre-tzgs5o34sl2niugeeg2f4s-926917621799.europe-west2.run.app'}`;
      }

      // Dispatch Message
      const result = await sendWhatsAppMessage(to, msgText);

      if (result.success) {
        // Mark as successfully notified for today
        try {
          await updateDoc(doc(db, 'users', userId), {
            lastWhatsappNotifiedDate: mozTodayStr,
            updatedAt: new Date()
          });
          report.successes.push({ userId, name, type: messageType, to });
        } catch (dbErr: any) {
          console.error(`[CRON ERROR] Failed to update lastWhatsappNotifiedDate for ${name}:`, dbErr);
          report.failures.push({ userId, name, error: `DB Update Error: ${dbErr.message}` });
        }
      } else {
        report.failures.push({ userId, name, error: result.error || 'WhatsApp delivery failed' });
      }
    }

    console.log(`[CRON SUMMARY] Finished batch processing. Successes: ${report.successes.length}, Failures: ${report.failures.length}`);
    return res.json({ success: true, report });
  } catch (error: any) {
    console.error('[CRON FATAL EXCEPTION]', error);
    return res.status(500).json({ success: false, error: error.message, report });
  }
});

// Setup Vite Dev Server / Static Hosting Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted in DEVELOPMENT mode');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Wildcard handler for SPA routing in client-side router
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static files route mounted pointing to:', distPath);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sabush English server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
