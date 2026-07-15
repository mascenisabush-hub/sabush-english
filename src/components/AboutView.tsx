/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Mascot } from './Mascot';
import { SabushLogo } from './SabushLogo';
import { 
  ArrowLeft, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  WifiOff, 
  Brain, 
  Users,
  Mail,
  Calendar,
  Clock,
  ChevronRight,
  BookOpen,
  MessageSquare,
  Search,
  X
} from 'lucide-react';

interface AboutViewProps {
  onGoBack: () => void;
  onNavigateToTab?: (tab: string) => void;
}

interface BlogPost {
  id: string;
  category: 'Palavra da Semana' | 'Erros Comuns' | 'Expressões do Dia-a-Dia' | 'Dica de Pronúncia' | 'História de Sucesso';
  title: string;
  excerpt: string;
  publishDate: string;
  readTime: string;
  contentLines: string[];
  accentColor: string; // Tailwind color name for highlights
  bgClass: string;
  textClass: string;
  borderClass: string;
  badgeAccentClass: string;
}

export function AboutView({ onGoBack, onNavigateToTab }: AboutViewProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'blog'>('info');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const blogPosts: BlogPost[] = [
    {
      id: 'overwhelmed',
      category: 'Palavra da Semana',
      title: 'Palavra da Semana: "Overwhelmed" (Sobrecarregado)',
      excerpt: 'Sente-se sufocado por tantas tarefas no trabalho? Aprenda a usar a palavra certa para expressar esse sentimento em inglês profissional.',
      publishDate: '12 de Junho',
      readTime: '2 min de leitura',
      accentColor: 'amber',
      bgClass: 'bg-amber-50/50',
      textClass: 'text-amber-800',
      borderClass: 'border-amber-250',
      badgeAccentClass: 'bg-amber-500',
      contentLines: [
        'No ambiente de trabalho moderno, é muito comum termos mais responsabilidades do que conseguimos gerir no momento. A palavra ideal em inglês para expressar esse sentimento de estar "sobrecarregado" ou "esmagado de tarefas" é **Overwhelmed**.',
        '**O que significa:** Estar com excesso de coisas para processar (física ou emocionalmente). É usado tanto para sentimentos de ansiedade de trabalho como para sentimentos positivos (ex: "overwhelmed with joy" - transbordando de alegria).',
        '**Como pronunciar (Fonética adaptada):** Diga algo próximo a *"ô-vêr-uelmd"*. O *"w"* tem som de *"u"*, e o *"ed"* no final é quase mudo, terminando com um som seco de *"d"*. Pratique em frente ao espelho puxando o ar!',
        '**Frase prática de exemplo:**',
        '*"I feel a bit overwhelmed with this new logistics project in Tete."*',
        '(Sinto-me um pouco sobrecarregado com este novo projeto de logística em Tete.)',
        '**Dica Pro de Gramática:** Pode usar também o substantivo *"overwhelming"* para falar de algo que gera essa sensação: *"This client meeting was overwhelming."* (Esta reunião de clientes foi avassaladora).'
      ]
    },
    {
      id: 'age-error',
      category: 'Erros Comuns',
      title: 'Não cometa este erro: Como dizer a sua idade correctamente!',
      excerpt: 'Descubra porque usar o verbo "to have" ao falar sobre quantos anos tem é um dos erros mais comuns de tradução literal.',
      publishDate: '10 de Junho',
      readTime: '1.5 min de leitura',
      accentColor: 'rose',
      bgClass: 'bg-rose-50/50',
      textClass: 'text-rose-800',
      borderClass: 'border-rose-250',
      badgeAccentClass: 'bg-rose-500',
      contentLines: [
        'Em português, nós "temos" idade (ex: *"Eu tenho 28 anos"*). Por isso, a tendência natural na tradução literal para o inglês é dizer: *"I have 28 years"*. **Isto está incorreto e soa muito estranho para falantes nativos!**',
        '**Como funciona em Inglês:**',
        'Em inglês, nós "somos" velhos. Usamos o verbo **to be (am/is/are)** seguido do número e da expressão opcional *"years old"*.',
        '**Forma Correcta:**',
        '*- "I am 28 years old."* (Ou simplesmente: *"I am 28."*)',
        '**Porquê?**',
        'Em inglês, a idade é vista como um estado de existência temporário ou contínuo, e não um objeto físico ou posse que guardamos numa caixa.',
        '**Exemplo Diário:**',
        'Se estiver numa entrevista de emprego e lhe perguntarem a sua idade, responda sempre:',
        '*"I am thirty years old"* em vez de *"I have thirty years"*. Guarde o verbo *have* apenas para indicar posses, como o seu diploma universitário ou certificado de inglês!'
      ]
    },
    {
      id: 'beyond-im-fine',
      category: 'Expressões do Dia-a-Dia',
      title: 'Vá além do "I\'m fine, thank you" diário',
      excerpt: 'Aprenda frases do dia-a-dia muito mais naturais e profissionais para saudar os seus colegas e parceiros no trabalho.',
      publishDate: '08 de Junho',
      readTime: '2 min de leitura',
      accentColor: 'blue',
      bgClass: 'bg-blue-50/50',
      textClass: 'text-blue-800',
      borderClass: 'border-blue-250',
      badgeAccentClass: 'bg-blue-500',
      contentLines: [
        'Nas escolas tradicionais, ensina-se que a única resposta correcta para *"How are you?"* é o robótico *"I\'m fine, thank you, and you?"*. No entanto, no ambiente corporativo e profissional atual, essa resposta soa muito mecânica.',
        '**Alternativas mais expressivas, fluidas e naturais:**',
        '1. **"I\'m doing well, thanks!"** (Estou a ir muito bem, obrigado!) — Super profissional, positivo e simpático.',
        '2. **"Can\'t complain!"** (Não me posso queixar!) — Excelente para saudações amigáveis com colegas de trabalho diários.',
        '3. **"Pretty good, how about you?"** (Bastante bem, e você?) — Excelente para manter o ritmo e passar a palavra de volta.',
        'Se tiver tido um dia muito atarefado, pode responder de forma educada: *"Keeping busy!"* (Mantendo-me ocupado!).',
        'Experimente usar esta expressão hoje mesmo na sua próxima simulação com o Tutor de IA do Sabush Club!'
      ]
    },
    {
      id: 'th-sound',
      category: 'Dica de Pronúncia',
      title: 'Domine o temido som do "TH" com esta técnica simples',
      excerpt: 'Saiba como posicionar os lábios e dentes para pronunciar palavras como "this", "think" e "with" sem parecer forçado.',
      publishDate: '05 de Junho',
      readTime: '2.5 min de leitura',
      accentColor: 'emerald',
      bgClass: 'bg-emerald-50/50',
      textClass: 'text-emerald-800',
      borderClass: 'border-emerald-250',
      badgeAccentClass: 'bg-emerald-500',
      contentLines: [
        'O som do dígrafo **TH** não existe em português cabo-verdiano ou moçambicano, o que faz com que muitos alunos o substituam pelo som de *"T"* (dizendo *"tank"* em vez de *"thank" - obrigado*) ou *"F"* (dizendo *"free"* em vez de *"three" - três*).',
        'Aqui está o segredo anatómico simples para nunca mais errar nas suas reuniões:',
        '**A Técnica da Língua presa:**',
        'Coloque a ponta da sua língua suavemente entre os dentes da frente (como se estivesse com a língua ligeiramente presa) e sopre o ar suavemente para fora. É impossível fazer o som errado se fizer isso!',
        'Existem dois tipos principais de pronúncia do "TH":',
        '1. **Soprado (Sem som nas cordas vocais):** Em palavras como **"Three"** (Três), **"Think"** (Pensar) ou **"Thank you"**. Soa como soprar um *"s"* ou *"f"* enquanto remove a língua do dente.',
        '2. **Vibrado (Com som nas cordas vocais):** Em palavras como **"This"** (Isto), **"The"** (O/A) ou **"With"** (Com). Soa como um *"z"* ou *"d"* vibrante bem suave. Diz-se *"dh-is"*.',
        'Pratique em voz alta em frente ao espelho a frase mágica: *"Think about this thing!"*.'
      ]
    },
    {
      id: 'success-nilton',
      category: 'História de Sucesso',
      title: 'Do Porto de Maputo à Equipa Alemã de Logística',
      excerpt: 'Conheça a história inspiradora do Nilton, que usou o inglês prático para deixar de ser ajudante geral e tornou-se gestor remoto em 6 meses.',
      publishDate: '01 de Junho',
      readTime: '2.5 min de leitura',
      accentColor: 'indigo',
      bgClass: 'bg-indigo-50/50',
      textClass: 'text-indigo-800',
      borderClass: 'border-indigo-250',
      badgeAccentClass: 'bg-indigo-500',
      contentLines: [
        'Nilton C., de 24 anos, trabalhava como assistente geral de pátio numa empresa distribuidora perto do Porto de Maputo. Apesar de dominar todo o processo logístico de desalfandegamento, sentia-se limitado pela falta de inglês fluido para lidar com faturas estrangeiras e tripulações.',
        'Em vez de investir milhares de meticais em faculdades com manuais teóricos maçadores, Nilton tomou a decisão de praticar apenas **15 minutos todas as noites** focado em vocabulário técnico prático corporativo do Sabush Club.',
        '*"O segredo foi perder a vergonha. A área de treino e simulação com IA deu-me a confiança de criar frases sem o receio de ser julgado ou gozado"*, confessa Nilton.',
        'Após 6 meses de consistência assinalável, Nilton candidatou-se e foi aprovado para uma vaga de assistente de expedição numa multinacional alemã com operações remotas em Moçambique.',
        'Seu salário triplicou, mas o seu maior orgulho é a independência corporativa: *"Hoje respondo e-mails para Berlim e Hamburgo e coordeno contentores em inglês com a maior naturalidade!"*.',
        'A história do Nilton prova que o inglês útil do dia-a-dia abre portas reais imediatas para quem pratica de forma consistente.'
      ]
    }
  ];

  const activePost = blogPosts.find(p => p.id === selectedPostId);

  // Handle CTA redirection to Chat state
  const handleGoToChat = () => {
    if (onNavigateToTab) {
      onNavigateToTab('chat');
    }
  };

  const handleGoToLessons = () => {
    if (onNavigateToTab) {
      onNavigateToTab('lessons');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Upper Navigation Back Button */}
      <button
        onClick={onGoBack}
        className="inline-flex items-center space-x-2 text-brand-navy-800 hover:text-brand-navy-950 font-extrabold text-xs uppercase tracking-wider py-2 px-3 hover:bg-slate-200/60 rounded-xl transition-all cursor-pointer min-h-[44px]"
        id="about_back_btn"
      >
        <ArrowLeft className="w-4.5 h-4.5 stroke-[2.5]" />
        <span>Voltar</span>
      </button>

      {/* Main Branding Header Row */}
      <div className="bg-brand-navy-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden border-2 border-brand-red-650">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red-500/10 rounded-full blur-2xl animate-pulse" />
        
        <div className="flex flex-col items-center text-center space-y-4">
          <SabushLogo size="lg" onDark={true} />
          <span className="text-[10px] text-white font-extrabold uppercase tracking-widest bg-brand-red-650 border border-brand-red-500 px-3 py-1 rounded-full">
            Escola Oficial de Inglês Moçambicana 🇲🇿
          </span>
          <h2 className="text-xl font-black text-[#ffffff]" id="about_main_title">Sabush English Club</h2>
          <p className="text-xs text-slate-100 max-w-xs leading-relaxed font-semibold">
            Uma iniciativa focada em democratizar o acesso à fluência corporativa, comercial e quotidiana no nosso país.
          </p>
        </div>
      </div>

      {/* Segmented Tab Bar for Mobile Navigation with 44px active touch targets */}
      <div className="bg-slate-200/60 p-1.5 rounded-2xl grid grid-cols-2 gap-2 border border-slate-200">
        <button
          onClick={() => {
            setActiveTab('info');
            setSelectedPostId(null);
          }}
          className={`py-3 text-xs font-black tracking-wide rounded-xl transition-all cursor-pointer min-h-[44px] ${
            activeTab === 'info' && selectedPostId === null
              ? 'bg-brand-navy-800 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
          id="tab_about_info"
        >
          Nossa Escola
        </button>
        <button
          onClick={() => {
            setActiveTab('blog');
          }}
          className={`py-3 text-xs font-black tracking-wide rounded-xl transition-all cursor-pointer min-h-[44px] ${
            activeTab === 'blog' || selectedPostId !== null
              ? 'bg-brand-navy-800 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
          id="tab_about_blog"
        >
          Sabush Blog
        </button>
      </div>

      {/* --------------------- SECTION 1: ABOUT US INFO TAB --------------------- */}
      {activeTab === 'info' && selectedPostId === null && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-6">
            {/* Mission statement */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4" id="about_mission_card">
              <h3 className="font-extrabold text-base text-brand-navy-900 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-brand-red-500" />
                <span>A Nossa Missão</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                O <strong>Sabush English Club</strong> nasceu em Moçambique com o claro objetivo de apoiar profissionais, estudantes e empreendedores locais de todos os patamares — do absoluto iniciante literário à fluência refinada.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Sabemos que nas principais províncias — de <strong>Maputo à Beira, de Tete a Nampula</strong> — as maiores vagas no sector de recursos minerais, logistics, ONGs estrangeiras e turismo exigem a destreza prática de falar e redigir e-mails formais em inglês. Desenhamos esta plataforma leve e didáctica para fazer com que as portas da SADC e do mundo corporativo se abram para si!
              </p>
            </div>

            {/* Contact Details Card (Strictly Required by User Request) */}
            <div className="bg-white rounded-3xl p-5 border-2 border-brand-red-650 shadow-sm space-y-4" id="about_contacts_card">
              <div className="border-b pb-3 border-slate-100">
                <h3 className="font-extrabold text-base text-brand-navy-900 tracking-tight flex items-center space-x-2">
                  <span className="text-base">📞</span>
                  <span>Contactos Oficiais Sabush</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Tem dúvidas sobre planos corporativos, parcerias escolares ou necessita de suporte personalizado? A nossa equipa em Maputo responde de imediato:
                </p>
              </div>

              <div className="space-y-3.5">
                {/* Email link with touch size override */}
                <a 
                  href="mailto:sabushagency@gmail.com"
                  className="flex items-center space-x-3.5 p-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-150 transition-colors min-h-[48px] cursor-pointer"
                  id="contact_email_link"
                >
                  <div className="bg-brand-red-50 text-brand-red-700 p-2.5 rounded-xl shrink-0">
                    <Mail className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Endereço de E-mail</span>
                    <span className="font-extrabold text-xs sm:text-sm text-brand-navy-900 truncate block">sabushagency@gmail.com</span>
                  </div>
                </a>

                {/* WhatsApp direct link with country code 258 and active number 858624086 */}
                <a 
                  href="https://wa.me/258858624086"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3.5 p-3.5 bg-emerald-50/50 hover:bg-emerald-50 rounded-2xl border border-emerald-100 transition-colors min-h-[48px] cursor-pointer"
                  id="contact_whatsapp_link"
                >
                  <div className="bg-emerald-100 text-emerald-800 p-2.5 rounded-xl shrink-0">
                    <MessageSquare className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-wider block">WhatsApp de Moçambique</span>
                    <span className="font-extrabold text-xs sm:text-sm text-emerald-800 block">+258 85 862 4086</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Pillars of success review */}
          <div className="space-y-3">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block pl-1">Os Pilares Tecnológicos do Club:</span>
            
            <div className="bg-white p-4.5 rounded-2xl border border-slate-150 shadow-sm flex items-start space-x-3.5">
              <div className="p-2.5 bg-brand-navy-100 text-brand-navy-800 rounded-xl shrink-0 mt-0.5">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm text-brand-navy-900">Treinamento Científico de Retenção</h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  O nosso sistema reintroduz vocabulários estudados no seu Dashboard em tempos definidos. Isso treina a retenção imediata antes do esquecimento de termos vitais.
                </p>
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-slate-150 shadow-sm flex items-start space-x-3.5">
              <div className="p-2.5 bg-brand-red-50 text-brand-red-700 rounded-xl shrink-0 mt-0.5">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm text-brand-navy-900">IA Amigável e Silenciosa</h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  Interaja sem timidez! O Sabush Tutor analisa as suas respostas, sugere correções no seu português de apoio e impulsiona a conversação.
                </p>
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-slate-150 shadow-sm flex items-start space-x-3.5">
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl shrink-0 mt-0.5">
                <WifiOff className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm text-brand-navy-900">Conforto com Dados Móveis</h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  A maior parte das lições corporativas prontas é gerida localmente, poupando ao máximo seus megas de saldo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------- SECTION 2: BLOG LISTING TAB --------------------- */}
      {(activeTab === 'blog' && selectedPostId === null) && (() => {
        const filteredBlogPosts = blogPosts.filter((post) => {
          if (!searchQuery.trim()) return true;
          const query = searchQuery.toLowerCase();
          return (
            post.title.toLowerCase().includes(query) ||
            post.category.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query) ||
            post.contentLines.some(line => line.toLowerCase().includes(query))
          );
        });

        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between pl-1">
              <div>
                <h3 className="font-black text-base text-brand-navy-900 tracking-tight">Artigos e Dicas do Club</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Aprenda inglês rápido com as nossas dicas de 1 minuto</p>
              </div>
              <span className="text-[10px] bg-brand-red-50 text-brand-red-700 font-extrabold uppercase px-2.5 py-1 rounded-lg border border-brand-red-100">
                {searchQuery ? `${filteredBlogPosts.length} / ` : ''}{blogPosts.length} Artigos
              </span>
            </div>

            {/* Premium, accessible blog search input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Procurar dicas, erros comuns, palavras..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-10 pr-10 py-3.5 rounded-2xl border-2 border-slate-200 outline-none focus:border-brand-navy-800 bg-white placeholder-slate-400 text-slate-800 transition-all font-sans min-h-[44px] shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors min-h-[44px] min-w-[44px] justify-center cursor-pointer"
                  title="Limpar pesquisa"
                  aria-label="Limpar pesquisa"
                >
                  <X className="w-4.5 h-4.5 stroke-[2.5]" />
                </button>
              )}
            </div>

            {/* Blog Listing Grid */}
            {filteredBlogPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                {filteredBlogPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPostId(post.id)}
                    className="cursor-pointer bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:border-brand-red-400 hover:shadow-md transition-all space-y-3.5 flex flex-col justify-between group"
                    id={`blog_post_card_${post.id}`}
                  >
                    <div className="space-y-2">
                      {/* Category and meta info row */}
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${post.bgClass} ${post.textClass} ${post.borderClass}`}>
                          {post.category}
                        </span>
                        <div className="flex items-center space-x-2.5 text-[10px] text-slate-400 font-bold">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 stroke-[2]" />
                            <span>{post.readTime}</span>
                          </span>
                        </div>
                      </div>

                      {/* Title and Excerpt */}
                      <h4 className="font-extrabold text-sm sm:text-base text-brand-navy-900 group-hover:text-brand-red-650 transition-colors leading-tight">
                        {post.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Read more footer element */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-black text-brand-red-600">
                      <span className="text-[10.5px] text-slate-400 font-medium">Publicado a {post.publishDate}</span>
                      <span className="inline-flex items-center space-x-1 group-hover:translate-x-1 transition-all min-h-[44px]">
                        <span>Ler Artigo</span>
                        <ChevronRight className="w-4.5 h-4.5 stroke-[3]" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4 shadow-sm animate-fade-in" id="blog_search_empty">
                <div className="flex justify-center">
                  <Mascot expression="thinking" size="md" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-brand-navy-900 text-sm">Nenhum artigo encontrado</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Não encontramos artigos para <strong className="text-brand-red-600">"{searchQuery}"</strong>. Tente procurar por <strong className="text-brand-navy-800">"age"</strong>, <strong className="text-brand-navy-800">"overwhelmed"</strong> ou <strong className="text-brand-navy-800">"pronúncia"</strong>!
                  </p>
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center justify-center bg-brand-navy-800 hover:bg-brand-navy-950 hover:border-brand-gold-400 border border-transparent text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl transition-all shadow-sm min-h-[40px] cursor-pointer"
                >
                  Limpar Pesquisa
                </button>
              </div>
            )}
          </div>
        );
      })()}

      {/* --------------------- SECTION 3: INDIVIDUAL POST TEMPLATE VIEW --------------------- */}
      {selectedPostId !== null && activePost && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-6 animate-fade-in" id="blog_post_template">
          
          {/* Header Actions (Back to List button) */}
          <button
            onClick={() => setSelectedPostId(null)}
            className="inline-flex items-center space-x-1.5 text-slate-500 hover:text-brand-navy-900 font-extrabold text-xs uppercase tracking-wider py-2 px-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer min-h-[44px]"
            id="blog_back_to_list"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.8]" />
            <span>Voltar ao Blog</span>
          </button>

          {/* Post Header */}
          <div className="space-y-3.5 border-b pb-5 border-slate-100">
            <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${activePost.bgClass} ${activePost.textClass} ${activePost.borderClass}`}>
              {activePost.category}
            </span>
            <h3 className="text-base sm:text-lg font-black text-brand-navy-900 leading-snug">
              {activePost.title}
            </h3>
            
            {/* Metadata row with Head Writer details */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold pt-1">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 bg-brand-navy-700/80 rounded-lg flex items-center justify-center border border-brand-red-500/30">
                  <Mascot expression="happy" size="sm" onDark={true} />
                </div>
                <span className="text-slate-600 font-black">Editorial Sabush</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{activePost.publishDate}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activePost.readTime}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Post Body (Clean Paragraphs block with deep line height) */}
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {activePost.contentLines.map((line, index) => {
              // Highlight code lines or bullet formats cleanly
              if (line.startsWith('*-') || line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.')) {
                return (
                  <div key={index} className="pl-3.5 py-1.5 border-l-2 border-brand-red-500 bg-slate-50 rounded-r-xl font-medium my-2">
                    <p className="font-semibold text-slate-800">{line}</p>
                  </div>
                );
              }
              if (line.startsWith('*"')) {
                return (
                  <blockquote key={index} className="p-4 bg-brand-navy-800 text-white rounded-2xl border-l-4 border-brand-red-600 italic font-medium my-3.5 text-center">
                    {line}
                  </blockquote>
                );
              }

              // Simple strong emphasis highlights inside paragraphs
              return (
                <p key={index} className="leading-relaxed font-normal">
                  {line.split('**').map((item, i) => i % 2 === 1 ? <strong key={i} className="text-brand-navy-950 font-black">{item}</strong> : item)}
                </p>
              );
            })}
          </div>

          {/* Interactive CTA to practice what they just read */}
          <div className="bg-brand-navy-900 text-white rounded-3xl p-5 border-2 border-brand-red-550 space-y-4 mt-8 shadow-md">
            <div className="flex items-start space-x-3.5">
              <div className="bg-[#ffffff]/10 p-2 rounded-xl mt-0.5">
                <Mascot expression="talking" size="md" onDark={true} />
              </div>
              <div>
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-brand-gold-400">Dica Prática do Dia:</h4>
                <p className="text-xs text-slate-100 leading-relaxed mt-1 font-semibold">
                  Gostou desta dica? Pratique agora com o nosso **Tutor de IA**. Faça perguntas sobre "{activePost.category}" e ganhe XP real!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleGoToChat}
                className="bg-brand-red-600 hover:bg-brand-red-700 border border-transparent hover:border-brand-gold-400 text-white font-extrabold py-3 px-3 rounded-2xl text-xs text-center transition-all cursor-pointer min-h-[44px]"
                id="cta_blog_talk_ia"
              >
                Falar com IA Tutor
              </button>
              <button
                onClick={handleGoToLessons}
                className="bg-transparent hover:bg-white/10 text-white border border-slate-500 hover:border-white font-extrabold py-3 px-3 rounded-2xl text-xs text-center transition-all cursor-pointer min-h-[44px]"
                id="cta_blog_go_lessons"
              >
                Praticar Lições
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Standard Kanimambo message block styled with flag colors */}
      {selectedPostId === null && (
        <div className="text-center py-4 space-y-3">
          <span className="text-base text-brand-red-650 font-extrabold block">Estamos Juntos nesta Caminhada! 🤝</span>
          <button
            onClick={onGoBack}
            className="bg-brand-red-600 hover:bg-brand-red-700 hover:border-brand-gold-400 border border-transparent text-white font-extrabold py-3.5 px-8 rounded-2xl text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer min-h-[48px]"
            id="about_bottom_back_cta"
          >
            Começar a Estudar Agora
          </button>
        </div>
      )}

    </div>
  );
}
