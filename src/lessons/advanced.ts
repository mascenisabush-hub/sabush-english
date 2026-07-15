/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lesson } from '../types';

export const ADVANCED_LESSONS: Lesson[] = [
  // ==========================================
  // UNIT 1: IDIOMS, SLANG, AND REGISTER (FORMAL VS. INFORMAL)
  // ==========================================
  {
    id: 'adv-1',
    level: 'advanced',
    title: 'U1-L1: Mastering Registers: Informal Chat vs. Executive Boardroom',
    titlePt: 'U1-L1: Domínio de Registos: Conversa Informal vs. Sala de Administração',
    introductionPt: 'To reach corporate fluency, you must effortlessly adapt your tone depending on your audience. This lesson explores the structural differences between colloquial phrasing and polished executive styles, helping you project authority or bond naturally.',
    vocabulary: [
      { en: 'Colloquialism', pt: 'Coloquialismo / Expressão popular', pronunciation: '/ko-lóu-kwi-a-lizm/' },
      { en: 'To project authority', pt: 'Transmitir / Projetar autoridade', pronunciation: '/tú pro-djékt o-fó-ri-ti/' },
      { en: 'Polished register', pt: 'Registo polido / Linguagem refinada', pronunciation: '/pó-lisht ré-djis-ter/' },
      { en: 'To cut corners', pt: 'Poupar esforços inapropriadamente / Seguir atalhos que prejudicam a qualidade', pronunciation: '/tú kát kór-nerz/' },
      { en: 'To leverage', pt: 'Potencializar / Retirar proveito estratégico de', pronunciation: '/tú lée-ver-idj/' }
    ],
    dialoguePt: 'Contrast of informal slang at lunch versus formal phrasing in a Boardroom briefing in Maputo:',
    dialogue: [
      { speaker: 'Informal Conversation (Lunch)', textEn: 'Hey, honestly, we shouldn\'t cut corners just to finish this early. It\'s going to look super cheap.', textPt: 'Olha, sinceramente, não devíamos desleixar-nos só para acabar isto cedo. Vai parecer super reles.' },
      { speaker: 'Formal Briefing (Boardroom)', textEn: 'We must not compromise our strict quality standards to expedite the timeline; doing so would look severely detrimental to our brand reputation.', textPt: 'Não devemos comprometer os nossos rigorosos padrões de qualidade para acelerar o cronograma; fazê-lo seria prejudicial para a reputação da nossa marca.' },
      { speaker: 'Informal Conversation (Lunch)', textEn: 'Yeah, let\'s leverage John\'s connection to grab that license.', textPt: 'É, vamos usar as cunhas do John para arranjar logo aquela licença.' },
      { speaker: 'Formal Briefing (Boardroom)', textEn: 'It is highly advisable that we leverage our regional partnerships to secure the official operating licenses.', textPt: 'É altamente recomendável que aproveitemos as nossas parcerias regionais para garantir as licenças oficiais de funcionamento.' }
    ],
    explanationPt: 'Fluency Note: Formal English relies on passive voice constructions, precise action verbs instead of phrasal verbs ("expedite" instead of "speed up", "detrimental" instead of "bad"), and complex sentence linkages (such as "consequently", "nevertheless"). Colloquial English relies heavily on idioms, phrasal verbs, and expressive modal verbs.',
    discussionPrompt: 'In your line of work, under what circumstances do you need to shift your tone from extremely casual to highly polished? Describe an administrative situation where using advanced formal English made a real impact on your success.',
    discussionPromptPt: 'Em que circunstâncias do seu trabalho precisa de mudar o registo para altamente polido? Descreva um momento em que utilizar o inglês formal fez a diferença.',
    exercise: {
      id: 'ex-adv-1',
      question: 'Which of the following sentences represents the most appropriate executive register for a corporate report?',
      options: [
        'We gotta speed up the work or our boss will throw a fit.',
        'It is crucial to expedite our deliverables to avoid negative feedback from senior stakeholders.',
        'We should do the work faster before the big guys get mad.',
        'Currently, we are cutting corners so we don\'t fall behind.'
      ],
      correctAnswerIndex: 1,
      translation: 'Escolha a opção que representa o melhor registo executivo para um relatório empresarial.',
      explanation: 'Superb! "Expedite our deliverables" and "stakeholders" are classic C-suite terminology. Phrasal verbs like "speed up" or slang like "big guys getting mad" should be strictly avoided in high-level briefs.',
      questions: [
        {
          question: 'In formal registers, which verb represents a better substitute for "to use" when talking about assets or skills?',
          options: ['To leverage', 'To get by', 'To exploit badly', 'To run with'],
          correctAnswerIndex: 0,
          translation: 'No registo formal, qual verbo substitui melhor "to use" para ativos ou habilidades?',
          explanation: '"To leverage" is an excellent executive verb meaning to strategically use existing assets to achieve a greater competitive result.'
        },
        {
          question: 'Identify the formal equivalent of: "I don\'t think the deal will go through because they want too much cash."',
          options: [
            'I bet the contract will break since they want crazy cash.',
            'We foresee that the transaction is unlikely to materialize due to their excessive financial demands.',
            'The agreement can\'t happen because they are asking for too much money.',
            'It is touch and go because of the budget requirements.'
          ],
          correctAnswerIndex: 1,
          translation: 'Identifique o equivalente formal de "I don\'t think the deal will go through..."',
          explanation: '"We foresee that the transaction is unlikely to materialize..." uses precise planning terms and formal transitions.'
        }
      ]
    },
    listeningComprehension: {
      passage: "According to the formal boardroom briefing, we must not compromise our strict quality standards to expedite the timeline. Doing so would look severely detrimental to our brand reputation. Therefore, it is highly advisable that we leverage our regional partnerships to secure the official operating licenses.",
      passagePt: "De acordo com o briefing formal da administração, não devemos comprometer os nossos rigorosos padrões de qualidade para acelerar o cronograma. Fazê-lo seria prejudicial para a reputação da nossa marca. Portanto, é altamente recomendável que aproveitemos as nossas parcerias regionais para garantir as licenças de funcionamento oficiais.",
      questions: [
        {
          question: "According to the boardroom briefing, why shouldn't the company compromise quality standards?",
          options: ["Because it would take too long", "Because it is severely detrimental to brand reputation", "Because they lack regional partnerships", "Because budgets are already fixed"],
          correctAnswerIndex: 1,
          explanation: "Correct! The briefing states that doing so would look 'severely detrimental to our brand reputation.'"
        },
        {
          question: "How does the speaker suggest securing official operating licenses?",
          options: ["By spending more cash immediately", "By hiring external auditors", "By leveraging regional partnerships", "By expediting all administrative files"],
          correctAnswerIndex: 2,
          explanation: "Excellent! The speaker asserts: 'leveraging regional partnerships to secure official operating licenses.'"
        }
      ]
    }
  },
  {
    id: 'adv-2',
    level: 'advanced',
    title: 'U1-L2: Advanced Idioms of Leadership, Strategy, & Resilience',
    titlePt: 'U1-L2: Idiomas Avançados de Liderança, Estratégia e Resiliência',
    introductionPt: 'To understand board members, foreign embassy officials, or international development leaders, you must interpret abstract idioms. These express deep strategic realities with dry, colorful nuance.',
    vocabulary: [
      { en: 'To bite the bullet', pt: 'Encarar uma decisão dolorosa inevitável com coragem / Tomar uma decisão difícil', pronunciation: '/tú báit dã bú-let/' },
      { en: 'To read between the lines', pt: 'Ler nas entrelinhas / Perceber o significado implícito', pronunciation: '/tú ríid bi-twíin dã láinz/' },
      { en: 'Across the board', pt: 'De forma geral / Abrangendo todo o espectro ou setores', pronunciation: '/a-krós dã bóord/' },
      { en: 'Out of the loop', pt: 'Fora do círculo de informação / Desinformado', pronunciation: '/áut óv dã lúup/' },
      { en: 'To shed light on', pt: 'Clarificar / Trazer luz a um mistério administrativo', pronunciation: '/tú shéd láit ón/' }
    ],
    dialoguePt: 'Strategic dispute over budget restructuring between Chief Operating Officers, Clara and David:',
    dialogue: [
      { speaker: 'Clara', textEn: 'David, we are completely out of the loop on the latest fiscal budget cuts.', textPt: 'David, estamos totalmente desinformados sobre os últimos cortes no orçamento fiscal.' },
      { speaker: 'David', textEn: 'Indeed. The board decided on a ten percent resource reduction across the board. We must bite the bullet and downsize our experimental lab.', textPt: 'De facto. O conselho decidiu por uma redução de dez por cento nos recursos de forma geral. Temos de tomar esta decisão difícil e reduzir a nossa equipa laboratorial.' },
      { speaker: 'Clara', textEn: 'That is unfortunate, but reading between the lines, they are pivoting resources towards digital services.', textPt: 'Isso é lamentável, mas lendo nas entrelinhas, estão a redirecionar os recursos para serviços digitais.' }
    ],
    explanationPt: 'Grammar & Nuance Note: Portuguese speakers often use "in general" or "globally". "Across the board" is highly valued in administrative settings as it specifies that a rule, cut, or wage increase applies to every single department simultaneously without exceptions.',
    discussionPrompt: 'Think of a time when you or your manager had to "bite the bullet" to resolve a serious organizational challenge. What were the long-term results of that decision?',
    discussionPromptPt: 'Pense numa ocasião em que teve de encarar uma situação difícil para resolver um problema. Quais foram os impactos a longo prazo?',
    exercise: {
      id: 'ex-adv-2',
      question: 'What is the exact implication of "reading between the lines"?',
      options: [
        'Finding spelling errors in a legal contract.',
        'Discerning non-explicit, subtle messages or intentions within an official text or statement.',
        'Refusing to read the whole text because of long paragraphs.',
        'Reading only the introduction and conclusion of reports.'
      ],
      correctAnswerIndex: 1,
      translation: 'Qual é a implicação exacta de "reading between the lines"?',
      explanation: 'Excellent choice. "To read between the lines" is a key cognitive and linguistic skill in high-stakes diplomacy and corporate politics.',
      questions: [
        {
          question: 'If salary increases are applied to every single employee in the organization, they are applied:',
          options: ['Across the board', 'Out of the loop', 'On the fly', 'Inside the box'],
          correctAnswerIndex: 0,
          translation: 'Se os aumentos salariais são aplicados a todos os colaboradores, são aplicados:',
          explanation: '"Across the board" indicates systematic, complete coverage without departmental boundary exclusions.'
        },
        {
          question: 'Choose the correct context for "to bite the bullet":',
          options: [
            'We bit the bullet and celebrated our record-high profit profits.',
            'After postponing critical decisions, we had to bite the bullet and close our unprofitable branch.',
            'He bit the bullet because he forgot his technical dictionary at home.',
            'She was out of the loop, so she bit the bullet happily.'
          ],
          correctAnswerIndex: 1,
          translation: 'Escolha o contexto correcto para a utilização desta expressão.',
          explanation: '"Bite the bullet" means accepting a painful necessity to move forward.'
        }
      ]
    },
    listeningComprehension: {
      passage: "Clara admits they are completely out of the loop on the latest fiscal budget cuts. David confirms the board decided on a ten percent resource reduction across the board. They must bite the bullet and downsize their lab. Clara thinks that, reading between the lines, resources are being focused on digital services instead.",
      passagePt: "A Clara admite que eles estão totalmente desinformados sobre os últimos cortes no orçamento fiscal. O David confirma que o conselho de administração decidiu uma redução de dez por cento de recursos em toda a linha. Eles têm de tomar a decisão difícil e reduzir o tamanho do laboratório. A Clara pensa que, lendo nas entrelinhas, os recursos estão a ser focados em serviços digitais.",
      questions: [
        {
          question: "What percentage cuts were decided across the board?",
          options: ["Five percent", "Ten percent", "Twenty percent", "Fifteen percent"],
          correctAnswerIndex: 1,
          explanation: "That is correct! David says: 'The board decided on a ten percent resource reduction across the board.'"
        },
        {
          question: "When Clara reads between the lines, where are resources being pivoted to?",
          options: ["Offline research facilities", "Digital services", "Direct wage increases", "Experimental training modules"],
          correctAnswerIndex: 1,
          explanation: "Perfect! Clara mentions: 'reading between the lines, they are pivoting resources towards digital services.'"
        }
      ]
    }
  },

  // ==========================================
  // UNIT 2: ADVANCED GRAMMAR NUANCES (CONDITIONALS, PASSIVE, REPORTED SPEECH)
  // ==========================================
  {
    id: 'adv-3',
    level: 'advanced',
    title: 'U2-L1: Strategic Risk Analysis and Mixed Conditionals',
    titlePt: 'U2-L1: Análise de Risco e Condicionais Mistas',
    introductionPt: 'Mastering mixed conditionals allows you to analyze how past errors or historical decisions shape present realities. It is the language of risk mitigation, forensic auditing, and post-mortem project analyses.',
    vocabulary: [
      { en: 'Unforeseen circumstances', pt: 'Circunstâncias imprevistas / de força maior', pronunciation: '/an-foor-síin sêr-kam-stên-siz/' },
      { en: 'Hindsight', pt: 'Retrospetiva / Compreensão tardia (com o benefício do passado)', pronunciation: '/háind-sáit/' },
      { en: 'In retrospect', pt: 'Olhando para trás / Em retrospetiva', pronunciation: '/ín ré-tro-spekt/' },
      { en: 'Risk mitigation', pt: 'Mitigação / Redução de riscos', pronunciation: '/rísk mi-ti-géi-shen/' },
      { en: 'To overhaul', pt: 'Reestruturar completamente / Reformar profundamente', pronunciation: '/tú óu-ver-hól/' }
    ],
    dialoguePt: 'Expert strategic diagnostic discussion between Beira Port logistics auditors, Samuel and Antonio:',
    dialogue: [
      { speaker: 'Antonio', textEn: 'Samuel, if we had overhauled our digital database last year, we would not be experiencing this customs backlog today.', textPt: 'Samuel, se tivéssemos reestruturado a nossa base de dados digital no ano passado, não estaríamos a passar por este congestionamento aduaneiro hoje.' },
      { speaker: 'Samuel', textEn: 'I fully agree. But in retrospect, the administration did not anticipate such rapid expansion in regional freight.', textPt: 'Concordo plenamente. Mas, em retrospetiva, a administração não antecipou uma expansão tão rápida no frete regional.' },
      { speaker: 'Antonio', textEn: 'Well, with the benefit of hindsight, we should have prioritized risk mitigation.', textPt: 'Bem, olhando para trás, devíamos ter priorizado a mitigação de riscos.' }
    ],
    explanationPt: 'Grammar Nuance: Classically, Third Conditional discusses past condition & past result ("If we had prepared, we would have won"). A Mixed Conditional merges Past Condition with Present Result ("If we had prepared then, we would be successful now!"). Structure: If + Past Perfect, would + Verb (base form).',
    discussionPrompt: 'If you could go back to the beginning of your professional life, what decisions would you have made differently, and how would that have altered your current career path?',
    discussionPromptPt: 'Se pudesse voltar ao início da sua vida profissional, que decisões teria tomado de forma diferente e como é que isso teria alterado o seu caminho atual?',
    exercise: {
      id: 'ex-adv-3',
      question: 'Identify the grammatically correct hybrid mixed conditional sentence:',
      options: [
        'If they didn\'t fail the audit last year, they wouldn\'t be in court today.',
        'If they had not failed the audit last year, they would not be facing legal investigation today.',
        'If they had failed the audit last year, they will be happy today.',
        'If they fail the audit last year, they would have been safe today.'
      ],
      correctAnswerIndex: 1,
      translation: 'Identifique a frase de condicional mista gramaticalmente correcta.',
      explanation: 'Correct! "If they had not failed" (past perfect describing past condition) + "they would not be facing" (conditional continuous describing ongoing present result) is a stellar example of Mixed Conditionals.',
      questions: [
        {
          question: 'What is the meaning of "In hindsight" during a technical meeting?',
          options: [
            'Looking back at an event with the wisdom gained after it occurred.',
            'Predicting scientific futures accurately.',
            'Hiding critical data from regional managers.',
            'A delay in loading maritime vessels.'
          ],
          correctAnswerIndex: 0,
          translation: 'O que significa "In hindsight" numa reunião técnica?',
          explanation: '"Hindsight" is the opposite of foresight. It is evaluating an action with the complete knowledge we possess now.'
        },
        {
          question: 'Complete the sentence: "If Mozambique ___ digital signatures earlier, our businesses would save thousands of hours today."',
          options: ['had legalized', 'legalize', 'has legalized', 'will legalize'],
          correctAnswerIndex: 0,
          translation: 'Complete a frase condicional correctamente.',
          explanation: '"Had legalized" (Past Perfect) sets up the past hypothetical cause for a present continuous saving.'
        }
      ]
    },
    listeningComprehension: {
      passage: "Let's review the risk report. In retrospect, if our board had legalized mixed conditional strategies earlier, we wouldn't be facing this severe administrative bottleneck today. With the benefit of hindsight, we realize that unforeseen circumstances in the supply chain demand a much more resilient corporate posture in Beira.",
      passagePt: "Vamos analisar o relatório de risco. Em retrospetiva, se o nosso conselho tivesse legalizado estratégias condicionais mistas mais cedo, não estaríamos a enfrentar este grave estrangulamento administrativo hoje. Com o benefício da retrospetiva, percebemos que circunstâncias imprevistas na cadeia de abastecimento exigem uma postura corporativa muito mais resiliente na Beira.",
      questions: [
        {
          question: "According to the passage, what is the cause of today's severe administrative bottleneck?",
          options: ["A lack of digital signature laws", "Unforeseen circumstances in Beira", "The failure to legalize mixed conditional strategies earlier", "A delay in supply chain audits"],
          correctAnswerIndex: 2,
          explanation: "That's correct! The passage states: 'if our board had legalized mixed conditional strategies earlier, we wouldn't be facing this severe administrative bottleneck today.'"
        },
        {
          question: "With hindsight, what do unforeseen circumstances in the supply chain require?",
          options: ["A much more resilient corporate posture", "A direct change in board members", "More investments in Maputo Port", "An immediate mixed strategy audit"],
          correctAnswerIndex: 0,
          explanation: "Perfect! The speaker explicitly notes that these circumstances 'demand a much more resilient corporate posture inside Beira.'"
        }
      ]
    }
  },
  {
    id: 'adv-4',
    level: 'advanced',
    title: 'U2-L2: Corporate Diplomacy and Strategic Passive Voice',
    titlePt: 'U2-L2: Diplomacia Corporativa e Voz Passiva Estratégica',
    introductionPt: 'In international negotiations and press releases, active blaming can break alliances. High-level professionals use the agents-deleted Passive Voice to preserve corporate diplomacy, focus on systemic processes, and write unbiased reports.',
    vocabulary: [
      { en: 'Objective stance', pt: 'Postura objetiva / Neutra', pronunciation: '/ob-djék-tiv sténsz/' },
      { en: 'Discrepancy', pt: 'Divergência / Discrepância / Erro nos números', pronunciation: '/dis-kré-pan-si/' },
      { en: 'To be deemed', pt: 'Ser considerado / Julgado como', pronunciation: '/tú bíi díimd/' },
      { en: 'Omission', pt: 'Omissão / Lapso de preenchimento', pronunciation: '/o-mí-shen/' },
      { en: 'Unbiased report', pt: 'Relatório imparcial / Sem viés', pronunciation: '/an-bái-asst/' }
    ],
    dialoguePt: 'Diplomatic revision of a strategic error audit between Amelia and Luis:',
    dialogue: [
      { speaker: 'Amelia (Direct Blame)', textEn: 'Luis, your financial team made a massive mistake. You left out critical tax payments in the declaration.', textPt: 'Luís, a tua equipa financeira cometeu um grande erro. Vocês omitiram pagamentos de impostos cruciais na declaração.' },
      { speaker: 'Luis (Diplomatic Redirection)', textEn: 'An unexpected discrepancy has been identified in the audit. This omission is being promptly rectified, and measures are being put in place to secure compliance.', textPt: 'Foi identificada uma discrepância inesperada na auditoria. Esta omissão está a ser prontamente retificada, e estão a ser implementadas medidas para garantir a conformidade.' }
    ],
    explanationPt: 'Grammar Nuance: Strategic Passive Voice removes the subject (the "blamed agent") to focus on the action ("An error was committed"). Use: Subject + form of verb "To Be" + Past Participle. This structure is essential when communicating operational failures to external partners.',
    discussionPrompt: 'Why do you think international agencies and business executives prefer passive constructions in scientific audits or financial reports? Do you agree that avoiding personal pronouns makes communication sound more neutral?',
    discussionPromptPt: 'Por que é que as agências internacionais e executivos preferem a voz passiva em auditorias e relatórios? Concorda que evitar pronomes pessoais torna a comunicação mais neutra?',
    exercise: {
      id: 'ex-adv-4',
      question: 'Convert this aggressive statement: "Your project manager failed to hit the timeline." into diplomatic, process-driven Passive voice.',
      options: [
        'You didn\'t hit the timeline again so we are sad.',
        'The project timeline was unfortunately not adhered to, but mitigation parameters are being optimized.',
        'The manager was failing to deliver everything completely.',
        ' timelines were broken on the fly by the managers.'
      ],
      correctAnswerIndex: 1,
      translation: 'Converta a declaração agressiva numa declaração diplomática utilizando a voz passiva.',
      explanation: 'Bravo. This passive statement focuses on the project timeline as the main objective topic, avoiding personal finger-pointing and guiding the conversation toward a professional path.',
      questions: [
        {
          question: 'What is the meaning of "To be deemed"?',
          options: [
            'To be destroyed completely.',
            'To be considered, judged, or evaluated as such.',
            'To be delivered late to ports.',
            'To be hidden underground.'
          ],
          correctAnswerIndex: 1,
          translation: 'Qual é o significado de "To be deemed"?',
          explanation: '"Deemed" is a highly formal synonym for "considered" (e.g., "The safety measures were deemed highly effective").'
        },
        {
          question: 'Identify the passive voice sentence that omits the blamed agent entirely:',
          options: [
            'John forgot the legal templates in the taxi.',
            'Critical documents were unfortunately classified as lost during international transit.',
            'The client blamed our administration for the error.',
            'We apologize for we forgot your document.'
          ],
          correctAnswerIndex: 1,
          translation: 'Identifique a frase na voz passiva que omite o agente responsável pela falha.',
          explanation: '"Critical documents were classified..." focus is strictly on the passive status of the document, protecting internal staff from reputational exposure.'
        }
      ]
    }
  },
  {
    id: 'adv-5',
    level: 'advanced',
    title: 'U2-L3: High-Stakes Briefing & Reported Speech',
    titlePt: 'U2-L3: Relatórios de Alto Nível e Discurso Indireto',
    introductionPt: 'To brief board members or write minutes, you must convey other stakeholders\' statements with absolute precision. Relying on basic reporting verbs like "said" is repetitive; advanced speakers use precise reporting verbs that indicate attitude and intent.',
    vocabulary: [
      { en: 'To assert', pt: 'Asseverar / Afirmar categoricamente', pronunciation: '/tú a-sêrt/' },
      { en: 'To concede', pt: 'Conceder / Admitir (frequentemente contra a própria vontade)', pronunciation: '/tú kon-síid/' },
      { en: 'To urge', pt: 'Exortar / Instar com veemência', pronunciation: '/tú êrdj/' },
      { en: 'Minutes', pt: 'Atas de reunião (Falso amigo! Não indica apenas tempo)', pronunciation: '/mí-nits/' },
      { en: 'Allegation', pt: 'alegação / Afirmação sem prova definitiva', pronunciation: '/a-le-géi-shen/' }
    ],
    dialoguePt: 'Briefing an executive board using indirect professional reported speech:',
    dialogue: [
      { speaker: 'Direct Speech (CEO)', textEn: 'We must implement this platform because we need to adapt our business model immediately!', textPt: 'Temos de implementar esta plataforma porque precisamos de adaptar o nosso modelo de negócio imediatamente!' },
      { speaker: 'Reported Briefing (Minutes)', textEn: 'The CEO urged that the digital platform be implemented immediately, pointing out that our model required absolute adaptation.', textPt: 'O CEO exortou a que a plataforma digital fosse implementada imediatamente, salientando que o nosso modelo exigia uma adaptação absoluta.' }
    ],
    explanationPt: 'Grammar Note: Advanced reported speech uses "backshifting" (Present changes to Past, Past simple changes to Past Perfect) but adds nuance using verbs like "insisted that", "conceded that", or "urged that". Verbs of demand or recommendation often utilize the English Subjunctive ("urged that the system *be* updated").',
    discussionPrompt: 'Imagine you must brief a foreign embassy representative about a recent policy debate. How would you objectively report what different public figures asserted, without taking sides?',
    discussionPromptPt: 'Imagine que deve fazer um briefing detalhado sobre um debate político. Como relataria objetivamente o que as partes afirmaram, sem tomar partido?',
    exercise: {
      id: 'ex-adv-5',
      question: 'Which sentence utilizes backshifting correctly to report the statement: "I will sign the contract if the terms remain stable."',
      options: [
        'He said he signs the contract if the terms are stable.',
        'He asserted that he would sign the contract if the terms remained stable.',
        'He concedes that he will sign the contract on the fly.',
        'He urges to sign the contract currently if stable.'
      ],
      correctAnswerIndex: 1,
      translation: 'Qual frase utiliza o recuo temporal (backshifting) corretamente para relatar o discurso direto?',
      explanation: 'Excellent. When backshifting from the future ("will sign", "remain"), we shift down to the past conditional ("would sign") and simple past ("remained"). using "asserted" indicates robust intent.',
      questions: [
        {
          question: 'What is the correct English translation of "Atas de Reunião" in corporate settings?',
          options: ['Meeting Times', 'Minutes of the Meeting', 'Meeting Directives', 'Registration protocols'],
          correctAnswerIndex: 1,
          translation: 'Qual é a tradução correcta para Atas de Reunião no mundo empresarial?',
          explanation: '"Minutes" or "meeting minutes" are the official written files tracking summaries and updates resolved at a business meeting.'
        },
        {
          question: 'If a director admits that their division made an operational mistake, they:',
          options: ['Conceded that there had been operational issues.', 'Asserted that they are perfect.', 'Urged others to work faster.', 'Deemed the mistake impossible.'],
          correctAnswerIndex: 0,
          translation: 'Se um diretor admite que o seu departamento falhou, ele:',
          explanation: '"To concede" is precisely used when admitting that something is true, often after initial denial or reluctance.'
        }
      ]
    }
  },

  // ==========================================
  // UNIT 3: DISCUSSION TOPICS (CURRENT EVENTS, GLOBAL DYNAMICS, DEBATES, NARRATIVES)
  // ==========================================
  {
    id: 'adv-6',
    level: 'advanced',
    title: 'U3-L1: Global Trade, Deep Ports, and Regional Integration',
    titlePt: 'U3-L1: Comércio Global, Portos de Águas Profundas e Integração Regional',
    introductionPt: 'This analytical discussion enables you to participate in debates about regional trading networks, macroeconomics, and supply chains. Engage with terms used by IMF, Word Bank, and global developmental partners.',
    vocabulary: [
      { en: 'Inflationary pressure', pt: 'Pressão inflacionária', pronunciation: '/in-fléi-sho-ne-ri prée-sher/' },
      { en: 'Foreign direct investment', pt: 'Investimento directo estrangeiro (FDI)', pronunciation: '/fó-ren di-rékt in-vést-ment/' },
      { en: 'Economic diversification', pt: 'Diversificação económica', pronunciation: '/e-ko-nó-mik di-vêr-si-fi-kéi-shen/' },
      { en: 'Sovereign wealth fund', pt: 'Fundo soberano', pronunciation: '/só-ve-rin wélth fánd/' },
      { en: 'Maritime logistics corridor', pt: 'Corredor de logística marítima', pronunciation: '/mæ-ri-táim /' }
    ],
    dialoguePt: 'High-level discussion regarding the port expansions of Maputo, Beira, and Nacala between regional economists Anita and Jose:',
    dialogue: [
      { speaker: 'Jose', textEn: 'Anita, do you believe Mozambique is maximizing foreign direct investment in maritime corridors?', textPt: 'Anita, acredita que Moçambique está a maximizar o investimento directo estrangeiro nos corredores marítimos?' },
      { speaker: 'Anita', textEn: 'Yes, Nacala has deep waters, which offers a competitive geographic advantage. However, economic diversification is crucial. We cannot rely solely on raw natural resource export yields.', textPt: 'Sim, Nacala tem águas profundas, o que oferece uma vantagem geográfica competitiva. No entanto, a diversificação económica é crucial. Não podemos depender exclusivamente do rendimento das exportações de recursos minerais brutos.' },
      { speaker: 'Jose', textEn: 'True. Leveraging a sovereign wealth fund will help stabilize the country against global inflationary pressures.', textPt: 'Verdade. Tirar partido de um fundo soberano ajudará a estabilizar o país contra pressões inflacionárias globais.' }
    ],
    explanationPt: 'Advanced Vocabulary Note: Use "solely" instead of "just" or "only" for academic reports. When arguing pros and cons during conferences, use analytical framing structures like "On the one hand... nevertheless..." to construct balanced paragraphs.',
    discussionPrompt: 'Moçambique has a strategic geographical position with its deep-water sea ports. In your view, how can the nation leverage regional integration to cushion itself against global inflationary pressures?',
    discussionPromptPt: 'Moçambique tem uma posição estratégica com as suas bacias portuárias. Na sua visão, como podemos alavancar a integração regional para conter inflações?',
    exercise: {
      id: 'ex-adv-6',
      question: 'Which of the following terms describes capital injected into local enterprise by foreign corporations or entities?',
      options: [
        'Sovereign raw cash',
        'Foreign direct investment (FDI)',
        'Inflationary pressure systems',
        'Direct corridors trade'
      ],
      correctAnswerIndex: 1,
      translation: 'Qual termo descreve o capital injetado por empresas estrangeiras na economia local?',
      explanation: 'Exquisite! "Foreign Direct Investment" (FDI) represents the official economic term for international capital allocation into domestic infrastructure.',
      questions: [
        {
          question: 'If you want to say something is done "uniquely and only" in dynamic finance, the ideal advanced adverb is:',
          options: ['Solely', 'Nearly', 'Highly', 'Roughly'],
          correctAnswerIndex: 0,
          translation: 'Se quer dizer que uma ação é feita unicamente, qual é o advérbio avançado ideal?',
          explanation: '"Solely" is highly academic and formal (e.g., "The system relies solely on solar panels").'
        },
        {
          question: 'What is the role of a "Sovereign Wealth Fund"?',
          options: [
            'Charging local container processing fees.',
            'A state-owned investment fund composed of real assets, capital surplus, and resources allocated for future national generations.',
            'A private commercial bank located inside a port corridor.',
            'A program designed solely to manage port security.'
          ],
          correctAnswerIndex: 1,
          translation: 'Qual é o papel de um Fundo Soberano?',
          explanation: 'Exactly, it helps stabilize public funds and preserves asset revenues for national welfare generations.'
        }
      ]
    }
  },
  {
    id: 'adv-7',
    level: 'advanced',
    title: 'U3-L2: Masterful Storytelling and Narrative Framing',
    titlePt: 'U3-L2: Storytelling Magistral e Enquadramento Narrativo',
    introductionPt: 'In boardrooms, public speeches, and client acquisitions, facts tell but stories sell. Near-fluent communicators construct emotional arcs using sophisticated sequencing, narrative tenses, and suspense triggers.',
    vocabulary: [
      { en: 'Compelling narrative', pt: 'Narrativa convincente / cativante', pronunciation: '/kom-pé-ling næ-ra-tiv/' },
      { en: 'Unbeknownst to...', pt: 'Sem o conhecimento de... / À revelia de...', pronunciation: '/an-bi-nóunst tú/' },
      { en: 'Climax', pt: 'Ápice / Ponto culminante da história', pronunciation: '/klái-maks/' },
      { en: 'To resonate', pt: 'Ressoar / Gerar identificação profunda com a audiência', pronunciation: '/tú ré-zo-neit/' },
      { en: 'Aesthetic twist', pt: 'Reviravolta estética / surpresa na trama', pronunciation: '/es-fée-tik twíst/' }
    ],
    dialoguePt: 'Storytelling training: Olivia explains to Mario how to present a logistics crisis as an epic heroic recovery:',
    dialogue: [
      { speaker: 'Olivia', textEn: 'Mario, do not just list numbers. Hook them! Try: "Everything was failing..."', textPt: 'Mário, não te limites a listar números. Cativa-os! Tenta: "Tudo estava a falhar..."' },
      { speaker: 'Mario', textEn: 'Right. So: Unbeknownst to the executive board, the servers had completely crashed. By midnight, our team had developed a backup script. That was the climax.', textPt: 'Certo. Então: Sem o conhecimento do conselho de administração, os servidores tinham falhado por completo. À meia-noite, a nossa equipa tinha desenvolvido um script de segurança. Esse foi o ponto alto.' },
      { speaker: 'Olivia', textEn: 'Brilliant! That compelling narrative will resonate deeply with our private potential investors.', textPt: 'Brilhante! Essa narrativa convincente irá ressoar profundamente junto dos nossos potenciais investidores privados.' }
    ],
    explanationPt: 'Narrative Structures: Storytellers use the "Past Perfect" for context set prior to the story ("the backup script had failed before we arrived") and adverbials likes "unbeknownst to us" or "suddenly, out of the blue" to establish dramatic tension that keeps investors focused.',
    discussionPrompt: 'Share an inspiring personal or professional story where you faced an overwhelming obstacle. What was the climax of the story, and what did the resolution teach you about resilience?',
    discussionPromptPt: 'Partilhe uma história pessoal ou profissional inspiradora onde enfrentou grandes dificuldades. Qual foi o clímax e o que aprendeu com a solução?',
    exercise: {
      id: 'ex-adv-7',
      question: 'What is the function of the phrase "Unbeknownst to the team"?',
      options: [
        'It indicates that everyone on the team agreed with the project parameters.',
        'It expresses that something occurred without the awareness or knowledge of the team members.',
        'It describes a document that is classified as strictly confidential.',
        'It means the team completed their tasks ahead of schedule.'
      ],
      correctAnswerIndex: 1,
      translation: 'Qual é a função da frase "Unbeknownst to the team"?',
      explanation: 'Stunning expression! "Unbeknownst to [someone]" is a highly literary and advanced device to denote that something was happening in secret or without their knowledge.',
      questions: [
        {
          question: 'If a story has a message that "resonates" with the client, it:',
          options: [
            'Makes a loud disturbing sound during presentation.',
            'Strikes a chords of emotional matching and connects with their values.',
            'Is too long and they reject the contracts.',
            'Contains spelling errors.'
          ],
          correctAnswerIndex: 1,
          translation: 'Se uma história ressoa com o cliente, ela:',
          explanation: '"To resonate" means to evoke shared feelings, validation, or agreement in the minds of the listeners.'
        },
        {
          question: 'Complete the narrative with the correct tense: "Unbeknownst to me, my team ___ already resolved the shipment delay before I called the client."',
          options: ['had', 'did', 'have', 'was'],
          correctAnswerIndex: 0,
          translation: 'Complete a narrativa com o tempo verbal correcto.',
          explanation: '"Had already resolved" (Past Perfect) indicates the action happened before another past event (calling the client).'
        }
      ]
    }
  },
  {
    id: 'adv-8',
    level: 'advanced',
    title: 'U3-L3: High-Stake Diplomacy and Safe Contradiction',
    titlePt: 'U3-L3: Diplomacia em Reuniões e Contradição Segura',
    introductionPt: 'To disagree with directness in an international meeting is often interpreted as aggressive or rude. Learn the linguistic shields used to challenge a colleague\'s thesis politely while preserving absolute executive respect.',
    vocabulary: [
      { en: 'With all due respect', pt: 'Com todo o respeito (Prepara o ouvinte para discordância)', pronunciation: '/wíd ól diú ri-spékt/' },
      { en: 'To play devil\'s advocate', pt: 'Fazer o papel de advogado do diabo (fazer perguntas difíceis para testar a tese)', pronunciation: '/tú pléi dé-velz ád-vo-keit/' },
      { en: 'Stumbling block', pt: 'Pedra no caminho / Obstáculo crítico', pronunciation: '/stám-bling blók/' },
      { en: 'On a final note', pt: 'Como reflexão final / Em conclusão', pronunciation: '/ón á fái-nal nóut/' },
      { en: 'Compromise', pt: 'Acordo mútuo / Concessão equilibrada (Não significa compromisso social! Falso amigo)', pronunciation: '/kóm-pro-máiz/' }
    ],
    dialoguePt: 'Challenging an unfeasible marketing budget expansion at a leadership retreat:',
    dialogue: [
      { speaker: 'Liam', textEn: 'We should invest all of our remaining emergency funds into online influencer ads.', textPt: 'Devíamos investir todos os nossos fundos de emergência restantes em anúncios com influenciadores online.' },
      { speaker: 'Elena', textEn: 'With all due respect Liam, that approach might be risky. Allow me to play devil\'s advocate: what if social media engagement dips next quarter? That is our primary stumbling block.', textPt: 'Com todo o respeito Liam, essa abordagem pode ser arriscada. Deixa-me fazer de advogada do diabo: e se o envolvimento nas redes sociais diminuir no próximo trimestre? Esse é o nosso principal obstáculo.' },
      { speaker: 'Liam', textEn: 'I see. Perhaps we can reach a compromise and dedicate only half of the capital.', textPt: 'Compreendo. Talvez possamos chegar a um acordo intermédio e dedicar apenas metade do capital.' }
    ],
    explanationPt: 'Diplomatic Framing: "To play devil\'s advocate" is a spectacular idiom to introduce logical counter-arguments without making the opponent feel personally attacked. Always phrase objections as questions or hypothetical situations rather than direct negatives ("I disagree").',
    discussionPrompt: 'How do you handle professional disagreements in your workplace? In your opinion, is it always possible to reach a compromise, or are some values non-negotiable?',
    discussionPromptPt: 'Como lida com discordâncias profissionais no seu trabalho? Na sua opinião, é sempre possível chegar a um consenso ou há valores inegociáveis?',
    exercise: {
      id: 'ex-adv-8',
      question: 'Which phrase introduces a tough counter-argument while protecting the professional peace?',
      options: [
        'You are completely wrong about the logistics and this is stupid.',
        'With all due respect, allow me to play devil\'s advocate regarding this strategy.',
        'I reject your plan completely because it\'s a stumbling block.',
        'You don\'t read between the lines, your plan is bad.'
      ],
      correctAnswerIndex: 1,
      translation: 'Qual frase introduz um contra-argumento mantendo a paz profissional?',
      explanation: 'Flawless execution! "With all due respect, allow me to play devil\'s advocate" establishes an elegant, safe boundary for professional debate.',
      questions: [
        {
          question: 'What is a "Stumbling block"?',
          options: [
            'A beautiful brick designed for aesthetic building designs.',
            'An obstacle, barricade, or barrier that delays progress or testing.',
            'A successful asset allocation.',
            'A custom operating license.'
          ],
          correctAnswerIndex: 1,
          translation: 'O que é um "Stumbling block"?',
          explanation: '"Stumbling block" refers metaphorically to a block over which you stumble—a hurdle or barrier.'
        },
        {
          question: 'What does "Compromise" mean in business?',
          options: [
            'An appointment with friends on Saturday night.',
            'An agreement where both parties make concessions to resolve a dispute.',
            'A rigid rule that cannot be changed under any circumstances.',
            'A technical breakdown in customs databases.'
          ],
          correctAnswerIndex: 1,
          translation: 'O que significa "Compromise" nos negócios?',
          explanation: 'Excellent. "Compromise" is a mutual concession, whereas "commitment" is the true translation for a personal or professional appointment/obligation.'
        }
      ]
    }
  },

  // ==========================================
  // UNIT 4: PRONUNCIATION REFINEMENT AND INTONATION PATTERNS
  // ==========================================
  {
    id: 'adv-9',
    level: 'advanced',
    title: 'U4-L1: Strategic Emphasis and Semantic Sentence Stress',
    titlePt: 'U4-L1: Ênfase Estratégica e Stress Frásico Semântico',
    introductionPt: 'In advanced English, the words you stress determine what your sentence actually means. By shifting sentence stress, you can highlight different aspects of an issue, signal sarcasm, or subtly correct misconceptions.',
    vocabulary: [
      { en: 'Sentence stress', pt: 'Acento tónico da palavra dentro da frase', pronunciation: '/sén-tens stréss/' },
      { en: 'Implicit meaning', pt: 'Significado implícito / oculto', pronunciation: '/im-plí-sit míi-ning/' },
      { en: 'To alternate stress', pt: 'Alternar a ênfase das palavras para modular o sentido', pronunciation: '/tú ól-ter-neit/' },
      { en: 'Auditory contrast', pt: 'Contraste auditivo para o ouvinte', pronunciation: '/ó-di-to-ri/' },
      { en: 'Acoustic cues', pt: 'Sinais sonoros de pronúncia', pronunciation: '/a-kúustik kiúuz/' }
    ],
    dialoguePt: 'Exploring meaning shifts on the same sentence: "I didn\'t say she stole our program.":',
    dialogue: [
      { speaker: 'Asserting difference A', textEn: '"I" didn\'t say she stole our program. (Implication: Someone else said it, not me!)', textPt: '"EU" não disse que ela roubou o nosso programa. (Implicação: Outra pessoa disse, não eu!)' },
      { speaker: 'Asserting difference B', textEn: 'I didn\'t "say" she stole our program. (Implication: I might have written it, implied it, or hinted at it, but didn\'t say it out loud.)', textPt: 'Eu não "DISSE" que ela roubou o nosso programa. (Implicação: Posso ter escrito ou sugerido, mas não disse em voz alta.)' },
      { speaker: 'Asserting difference C', textEn: 'I didn\'t say she "stole" our program. (Implication: I thought she copied it, borrowed it, or customized it, not that she stole it.)', textPt: 'Eu não disse que ela "ROUBOU" o nosso programa. (Implicação: Pensei que ela copiou ou emprestou, mas não que roubou.)' }
    ],
    explanationPt: 'Acoustic Strategy: To stress a word to convey implicit meaning, make the vowel sound longer, slightly higher in pitch, and louder. Monotone voices lack this command, often causing confusion among native English ears.',
    discussionPrompt: 'Intonation reflects confidence. When presenting to international stakeholders, a monotone delivery can weaken your authority. What strategies can you use to practice dynamic vocal variety before a major talk?',
    discussionPromptPt: 'A entonação reflete confiança. Falar de forma monótona pode enfraquecer a sua autoridade. Que estratégias pode usar para treinar a variação vocal?',
    exercise: {
      id: 'ex-adv-9',
      question: 'Evaluate this sentence stress: "I didn\'t sign the CONTRACT." What is the implicit, unspoken meaning of this sentence?',
      options: [
        'Someone else signed the contract for me.',
        'I signed something else, perhaps a memorandum or a proposal, but not the contract.',
        'I absolutely signed the contract, but I am lying.',
        'The contract is deemed invalid by local authorities.'
      ],
      correctAnswerIndex: 1,
      translation: 'Avalie a ênfase: "I didn\'t sign the CONTRACT." Qual é o significado implícito da frase?',
      explanation: 'Amazing phonetic deduction. By putting extreme stress on "CONTRACT", you imply that you signed something, but a contract was not the specific object signed.',
      questions: [
        {
          question: 'If you want to imply that a mistake was made by another department, not your own, which word should you stress in: "We did not create this database error."?',
          options: ['WE', 'not', 'create', 'error'],
          correctAnswerIndex: 0,
          translation: 'Se quer implicar que outra equipa cometeu o erro, qual palavra deve enfatizar?',
          explanation: 'Yes! Highlighting "WE" emphasizes that "others might have done it, but our department is absolutely clear of liability".'
        },
        {
          question: 'What happens to stressed syllable vowels in English?',
          options: [
            'They are skipped entirely.',
            'They are spoken with longer duration, higher pitch, and higher acoustic energy.',
            'They are spoken very quietly.',
            'They always take a schwa sound.'
          ],
          correctAnswerIndex: 1,
          translation: 'O que acontece às vogais nas sílabas enfatizadas em inglês?',
          explanation: 'Indeed. English is a stress-timed language, and stressed vowel syllables receive full breath weight.'
        }
      ]
    }
  },
  {
    id: 'adv-10',
    level: 'advanced',
    title: 'U4-L2: Connected Speech, Liaison, and Elision in Dialogues',
    titlePt: 'U4-L2: Discurso Conectado: Ligações e Elisões no Diálogo',
    introductionPt: 'Many advanced learners speak grammatically flawless English but sound artificial because they pronounce every single word in isolation. Fluid speakers chain letters together using connected speech, linking consonant endings to vowel beginnings.',
    vocabulary: [
      { en: 'Connected speech', pt: 'Discurso conectado / fala encadeada fluida', pronunciation: '/ko-nék-ted spíitch/' },
      { en: 'Liaison', pt: 'Ligação / Junção fonética de consoante-vogal', pronunciation: '/li-éiz-on/' },
      { en: 'Elision', pt: 'Elisão / Supressão de sons fonéticos na fala rápida (ex. "nex year" em vez de "next year")', pronunciation: '/i-lí-zhen/' },
      { en: 'Phonetic blending', pt: 'Mistura / fusão fonética de vogais e consoantes', pronunciation: '/fó-né-tik/' },
      { en: 'Mechanical execution', pt: 'Execução mecânica / fala robotizada', pronunciation: '/mi-kæ-ni-kel/' }
    ],
    dialoguePt: 'How native speakers blend and execute sentences in rapid administrative transitions:',
    dialogue: [
      { speaker: 'Robotic Execution', textEn: 'Do | you | want | to | run | an | audit | next | month?', textPt: 'Do.. you.. want.. to.. run.. an.. audit.. next.. month?' },
      { speaker: 'Connected Speech Blending', textEn: "D'ya wanna run'an audit nex'month?", textPt: "D'ya wanna rə-n'andit nex'month?" },
      { speaker: 'Robotic Execution', textEn: 'I | would | have | told | him | about | the | deal.', textPt: 'I.. would.. have.. told.. him.. about.. the.. deal.' },
      { speaker: 'Connected Speech Blending', textEn: "I woulda told'im about the deal.", textPt: "I wuda told'im about dadeal." }
    ],
    explanationPt: 'Phonetic Tip: When we say "run an", the consonant "n" shifts: "ru-nan". When we say "about the", the "t" disappears: "abou-the". "Next year" drops the "t" to sound like "nex-year". Emulating these linking formulas prevents physical jaw fatigue during extended public speaking engagements in English.',
    discussionPrompt: 'Many advanced learners speak grammatically perfect English but sound mechanical because they separate every word. Do you find connected speech difficult to understand in fast native podcasts? What are your tricks for tuning your ear?',
    discussionPromptPt: 'Muitos estudantes avançados parecem robóticos por separarem cada palavra. Acha difícil compreender o discurso conectado de falantes nativos? Qual é o seu truque?',
    exercise: {
      id: 'ex-adv-10',
      question: 'Which of the following phonetic transcriptions represents the correct consonant-to-vowel linking realization of: "Hold on a second"?',
      options: [
        'Hold | on | a | second (separated)',
        'Hol-do-na-second',
        'Hol-on-second (omitted)',
        'Hod-on-sec'
      ],
      correctAnswerIndex: 1,
      translation: 'Qual das transcrições fonéticas representa a ligação consoante-vogal correcta para "Hold on a second"?',
      explanation: 'Genius! Liquid merging shifts the "d" and "n" to the subsequent vowels: "Hol-do-na-second" (Hold - on - a second).',
      questions: [
        {
          question: 'What syllable reduction occurs when native executives merge: "Would have"?',
          options: ['Woulda', 'Willing', 'Had', 'Wood'],
          correctAnswerIndex: 0,
          translation: 'Que redução silábica ocorre quando nativos juntam "would have"?',
          explanation: '"Woulda" or "would\'ve" is the classic informal spoken contraction representing past continuous modal structures.'
        },
        {
          question: 'What phonetic term describes completely deleting the trailing "t" sound in: "first project" (sounding like "firs-project")?',
          options: ['Elision', 'Intonation shift', 'Sovereign wealth', 'Tone overhauling'],
          correctAnswerIndex: 0,
          translation: 'Qual termo descreve a eliminação completa do "t" final em "first project"?',
          explanation: '"Elision" describes the acoustic disappearance of a weak consonant at the end of a word when followed by another consonant.'
        }
      ]
    }
  },

  // ==========================================
  // UNIT 5: WRITING SKILLS: ESSAYS, PROFESSIONAL EMAILS, PRESENTATIONS
  // ==========================================
  {
    id: 'adv-11',
    level: 'advanced',
    title: 'U5-L1: Strategic Cohesion in Argumentative Essays & Proposals',
    titlePt: 'U5-L1: Coesão Estratégica em Ensaios Argumentativos e Propostas',
    introductionPt: 'To write proposals that convince corporate investors or secure international development research grants, you must master logical structuring and cohesive devices. A simple sequence of "and / but / because" is insufficient at this level.',
    vocabulary: [
      { en: 'Cohesive devices', pt: 'Elementos de coesão / Conetores lógicos', pronunciation: '/ko-híi-siv di-váiz-ez/' },
      { en: 'Notwithstanding', pt: 'Não obstante / Apesar de', pronunciation: '/not-wid-stæn-ding/' },
      { en: 'Furthermore', pt: 'Além disso / Adicionalmente', pronunciation: '/fêr-der-moor/' },
      { en: 'In light of this', pt: 'Diante disto / Tendo isto em consideração', pronunciation: '/ín láit óv díz/' },
      { en: 'To substantiate', pt: 'Substanciar / Fundamentar com dados e provas', pronunciation: '/tú sab-stén-shieit/' }
    ],
    dialoguePt: 'Anselmo reviews Anita\'s research prospectus draft for sustainable forestry investment credits:',
    dialogue: [
      { speaker: 'Anselmo', textEn: 'Anita, your technical data is robust. However, you need stronger cohesive devices to link your arguments.', textPt: 'Anita, os teus dados técnicos são robustos. No entanto, precisas de elementos de coesão mais fortes para ligar os teus argumentos.' },
      { speaker: 'Anita', textEn: 'Yes. In the second paragraph, I wrote: "We need more funds because forests are dying." That sounds too basic.', textPt: 'Sim. No segundo parágrafo, escrevi: "Precisamos de mais fundos porque as florestas estão a morrer." Isso parece básico demais.' },
      { speaker: 'Anselmo', textEn: 'Let\'s refine that. Use: "In light of this deforestation rate, allocation of budget remains critical. Furthermore, it is necessary to substantiate our soil metrics..."', textPt: 'Vamos melhorar isso. Usa: "Diante desta taxa de desflorestação, a alocação de orçamento continua crítica. Além disso, é necessário fundamentar as nossas métricas de solo..."' }
    ],
    explanationPt: 'Cohesion Mastery: "Notwithstanding" places equal focus on a drawback while prioritizing the primary benefit (e.g., "Notwithstanding the high setup costs, solar energy represents a viable investment"). "Furthermore" is used to stack strong supportive evidence.',
    discussionPrompt: 'Write a short defense of your main professional thesis: What is the single most urgent reform or innovation needed in your industry today, and how would you defend it against critics?',
    discussionPromptPt: 'Escreva uma curta defesa da sua tese profissional: qual é a reforma ou inovação mais urgente necessária no seu setor e como a defenderia de críticas?',
    exercise: {
      id: 'ex-adv-11',
      question: 'Choose the most cohesive and grammatically correct connector to fill the blank: "The port infrastructure has been optimized; ________, operational delays have plummeted by 30%."',
      options: [
        'consequently',
        'notwithstanding',
        'but indeed',
        'on a final loop'
      ],
      correctAnswerIndex: 0,
      translation: 'Escolha o conector de coesão mais adequado para preencher a lacuna.',
      explanation: '"Consequently" is a transitional adverb meaning "as a direct result", representing the pinnacle of academic and professional cause-and-effect structuring.',
      questions: [
        {
          question: 'What is the function of the formal cohesive connector "Notwithstanding"?',
          options: [
            'It indicates a direct temporal delay.',
            'It establishes a concession meaning "despite the fact that" or "although".',
            'It lists a sequence of numerical variables.',
            'It is used solely to sign formal business e-mails.'
          ],
          correctAnswerIndex: 1,
          translation: 'Qual é a função do conector formal "Notwithstanding"?',
          explanation: '"Notwithstanding" is a classy conjunctive preposition that adds an elegant nuance of contrast or concession.'
        },
        {
          question: 'What is the best way to say you want to "prove / give evidence for" a business claim?',
          options: ['To substantiate', 'To talk up', 'To say yes indeed', 'To make viable'],
          correctAnswerIndex: 0,
          translation: 'Qual é a melhor forma de expressar que deseja "provar/dar evidências" de um argumento?',
          explanation: '"To substantiate" means to validate a statement by providing concrete proof, statistics, or analytical findings.'
        }
      ]
    }
  },
  {
    id: 'adv-12',
    level: 'advanced',
    title: 'U5-L2: High-Stakes Public Presentations & Fielding Difficult Q&As',
    titlePt: 'U5-L2: Apresentações Públicas de Alto Nível e Como Responder a Perguntas Difíceis',
    introductionPt: 'The ultimate showcase of fluency is the ability to present complex proposals with executive presence and handle critical, unexpected audience cross-examination during the Q&A session without losing composure.',
    vocabulary: [
      { en: 'Fielding difficult questions', pt: 'Responder a perguntas difíceis com segurança', pronunciation: '/fíil-ding/' },
      { en: 'Value proposition', pt: 'Proposta de valor (benefício crítico oferecido aos investidores)', pronunciation: '/væ-liu pro-po-zí-shen/' },
      { en: 'To get sidetracked', pt: 'Desviar-se do tema principal / perder o foco', pronunciation: '/tú gét sáid-trækt/' },
      { en: 'To bridge', pt: 'Fazer a ponte (conectar uma pergunta hostil de volta ao seu argumento forte)', pronunciation: '/tú brídj/' },
      { en: 'Call to action', pt: 'Chamada para ação / fecho persuasivo de impacto', pronunciation: '/kól tú æk-shen/' }
    ],
    dialoguePt: 'Fielding a challenging stakeholder question during a regional transport proposal presentation:',
    dialogue: [
      { speaker: 'Skeptical Investor', textEn: 'Your presentation highlights speed, but what about the risk of border delays? Your projections might be completely unrealistic.', textPt: 'A vossa apresentação destaca a rapidez, mas e quanto ao risco de atrasos nas fronteiras? As vossas projeções podem ser totalmente irrealistas.' },
      { speaker: 'Presenter (Bridge Strategy)', textEn: 'That is a critical point. Allow me to bridge that concern to our custom electronic pre-clearance tests, which we designed specifically to mitigate border friction by 50 percent.', textPt: 'Esse é um ponto crucial. Permita-me fazer a ponte entre essa preocupação e os nossos testes alfandegários eletrónicos de pré-desalfandegamento, que concebemos especificamente para reduzir em 50 por cento as fricções na fronteira.' },
      { speaker: 'Skeptical Investor', textEn: 'Ah, I see. So you have a robust value proposition indeed.', textPt: 'Ah, compreendo. Então têm de facto uma proposta de valor robusta.' }
    ],
    explanationPt: 'Presentation Framing: When an audience member attacks your data, always validate their query first ("That is an excellent question"). Do not get sidetracked. Use "bridge phrases" like "While that is a concern, what our data actually indicates is..." to diplomatically guide their attention back to your core value proposition.',
    discussionPrompt: 'Imagine a stakeholder interrupts your presentation with a highly critical, unexpected question. What mental or verbal strategies can you use to remain calm, buy time, and pivot to a strong point?',
    discussionPromptPt: 'Imagine que um investidor interrompe a sua apresentação com uma pergunta crítica inesperada. Que estratégias mentais e verbais pode utilizar para manter a calma e responder com mestria?',
    exercise: {
      id: 'ex-adv-12',
      question: 'Which of the following phrases is the most professional "bridge phrase" to pivot away from a hostile question back to your strong point?',
      options: [
        'You don\'t know what you are talking about, so let me explain speed.',
        'That is a valuable perspective; however, looking closer at the operational metrics, the primary value lies in our software optimization.',
        'I want to skip your hard question and speak solely about the money instead.',
        'You got sidetracked, please read between our lines.'
      ],
      correctAnswerIndex: 1,
      translation: 'Qual das frases seguintes é a "frase de ponte" mais profissional para contornar uma pergunta hostil?',
      explanation: 'Exotic precision! This response acknowledges their point politely ("That is a valuable perspective") and bridges seamlessly to your strongest operational metrics without getting defensive.',
      questions: [
        {
          question: 'What is the "Value Proposition" of a project or startup?',
          options: [
            'The total budget spent on physical offices.',
            'The unique value, competitive edge, and concrete savings your company guarantees to deliver.',
            'A presentation slide listing email contacts.',
            'A protocol for cutting customs processing times.'
          ],
          correctAnswerIndex: 1,
          translation: 'O que é a Proposta de Valor?',
          explanation: '"Value Proposition" is the core promise of value to be delivered. It\'s the primary reason a client should buy from you.'
        },
        {
          question: 'If a speaker gets "sidetracked" during a board pitch, they:',
          options: [
            'Lose focus on the main objective and drift into redundant details.',
            'Answer the question with absolute diplomatic mastery.',
            'Secure massive capital investment from multi-lateral agencies.',
            'Speak with perfect connected speech.'
          ],
          correctAnswerIndex: 0,
          translation: 'Se um orador se desvia (gets sidetracked) na sua apresentação, ele:',
          explanation: '"To get sidetracked" means to stray from the main path or schedule of your presentation, weakening your call to action.'
        }
      ]
    }
  }
];
