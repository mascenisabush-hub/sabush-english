/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CreditCard, 
  Send, 
  CheckCircle2, 
  Clock, 
  Landmark, 
  AlertCircle, 
  HelpCircle,
  Loader2,
  Calendar
} from 'lucide-react';
import { Mascot } from './Mascot';
import { SabushLogo } from './SabushLogo';
import { auth, submitPaymentSubmission, getPaymentSubmission, PaymentSubmission, FirebaseUserProfile } from '../firebase';

interface TorneSeMembroProps {
  userProfile: FirebaseUserProfile | null;
  onStatusUpdate: () => void;
  onNavigateHome: () => void;
}

export function TorneSeMembro({ userProfile, onStatusUpdate, onNavigateHome }: TorneSeMembroProps) {
  const [paymentMethod, setPaymentMethod] = useState<'M-Pesa' | 'E-Mola' | 'BIM'>('M-Pesa');
  const [reference, setReference] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingSubmission, setLoadingSubmission] = useState(true);
  const [activeSubmission, setActiveSubmission] = useState<PaymentSubmission | null>(null);
  const [errorText, setErrorText] = useState('');
  const [success, setSuccess] = useState(false);

  // Q&A states
  const [qaInput, setQaInput] = useState('');
  const [qaLoading, setQaLoading] = useState(false);
  const [qaHistory, setQaHistory] = useState<Array<{ role: 'user' | 'model'; text: string }>>([]);

  const subscriptionFaqs = [
    {
      id: 'price',
      category: 'Preços & Renovação',
      question: 'Qual é o valor da mensalidade e quando é cobrada?',
      shortLabel: 'Valor & Renovação'
    },
    {
      id: 'fidelizacao',
      category: 'Fidelização',
      question: 'Existe algum contrato de fidelização ou posso cancelar quando quiser?',
      shortLabel: 'Cancelar quando quiser?'
    },
    {
      id: 'recibo',
      category: 'Renovação Mensal',
      question: 'Preciso de enviar um novo comprovativo todos os meses?',
      shortLabel: 'Comprovativo todos os meses?'
    },
    {
      id: 'reembolso',
      category: 'Garantia',
      question: 'Como funciona a garantia de reembolso de 7 dias?',
      shortLabel: 'Garantia de Reembolso'
    },
    {
      id: 'progresso',
      category: 'Segurança',
      question: 'Perco o meu progresso de estudos se a assinatura expirar?',
      shortLabel: 'Perco o meu progresso?'
    },
    {
      id: 'tempo',
      category: 'Ativação',
      question: 'Quanto tempo demora a ativação do plano após enviar o ID?',
      shortLabel: 'Tempo de Ativação'
    }
  ];

  const handleQaSubmit = async (questionText: string) => {
    if (!questionText.trim() || qaLoading) return;
    
    const userMsg = questionText.trim();
    const updatedHistory = [...qaHistory, { role: 'user' as const, text: userMsg }];
    
    setQaHistory(updatedHistory);
    setQaInput('');
    setQaLoading(true);

    try {
      const res = await fetch('/api/subscription-qa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMsg,
          history: qaHistory
        })
      });

      if (!res.ok) {
        throw new Error('Falha no servidor');
      }

      const data = await res.json();
      setQaHistory([...updatedHistory, { role: 'model' as const, text: data.text }]);
    } catch (err) {
      console.error(err);
      setQaHistory([...updatedHistory, { 
        role: 'model' as const, 
        text: 'Desculpe, ocorreu um erro ao obter resposta. Verifique a sua ligação à Internet ou tente novamente.' 
      }]);
    } finally {
      setQaLoading(false);
    }
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <div key={i} className="h-2" />;
      
      let formatted = line;
      
      // Bold **text**
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;
      
      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-extrabold text-slate-900">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }
      
      const renderContent = parts.length > 0 ? parts : line;

      if (line.trim().startsWith('👉') || line.trim().startsWith('•') || line.trim().startsWith('*') || line.trim().startsWith('-')) {
        const cleanLine = line.replace(/^[👉•\*\-]\s*/, '');
        return (
          <div key={i} className="pl-3 py-0.5 flex items-start space-x-1.5 text-xs text-slate-700 font-semibold">
            <span className="text-brand-red-600 shrink-0 select-none">👉</span>
            <span className="flex-1">
              {parts.length > 0 ? parts : cleanLine}
            </span>
          </div>
        );
      }
      
      return (
        <p key={i} className="text-xs text-slate-700 leading-relaxed font-semibold">
          {renderContent}
        </p>
      );
    });
  };

  // Load existing submission if any
  useEffect(() => {
    async function loadSubmission() {
      if (userProfile?.userId) {
        setLoadingSubmission(true);
        try {
          const sub = await getPaymentSubmission(userProfile.userId);
          setActiveSubmission(sub);
        } catch (e) {
          console.warn('Error loading payment submission:', e);
        } finally {
          setLoadingSubmission(false);
        }
      } else {
        setLoadingSubmission(false);
      }
    }
    loadSubmission();
  }, [userProfile, success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) {
      setErrorText('Por favor, introduza a referência ou ID de transação.');
      return;
    }
    if (!userProfile?.userId) return;

    setSubmitting(true);
    setErrorText('');

    try {
      const contactInfo = userProfile.email || userProfile.phoneNumber || 'Sem contacto';
      
      const payload = {
        userId: userProfile.userId,
        userName: userProfile.name || 'Estudante Sabush',
        userContact: contactInfo,
        paymentMethod,
        reference: reference.trim(),
        note: note.trim() || undefined,
        status: 'Pendente' as const
      };

      await submitPaymentSubmission(userProfile.userId, payload);
      setSuccess(true);
      onStatusUpdate(); // Let App know to re-fetch the profile status
    } catch (err: any) {
      console.error(err);
      setErrorText('Erro ao enviar comprovativo. Por favor tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingSubmission) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-navy-900" />
        <p className="text-xs text-slate-500 font-bold mt-2 uppercase tracking-wider">A carregar detalhes do plano...</p>
      </div>
    );
  }

  // 1. Render SUCCESS or PENDING validation flow
  const currentStatus = userProfile?.subscriptionStatus || activeSubmission?.status || 'Inactivo';

  if (currentStatus === 'Pendente') {
    return (
      <div className="bg-white rounded-3xl p-6 border-2 border-brand-red-600 shadow-xl space-y-6 text-center animate-fade-in max-w-lg mx-auto">
        <div className="flex justify-center">
          <Mascot expression="talking" size="lg" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 bg-brand-gold-100 hover:bg-brand-gold-200 border border-brand-gold-400 px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-brand-gold-900 uppercase">
            <Clock className="w-3.5 h-3.5 text-brand-gold-800 animate-spin" />
            <span>Verificação Pendente</span>
          </div>
          <h2 className="text-2xl font-black text-brand-navy-900 tracking-tight">O seu pagamento está a ser verificado! 🇲🇿</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Damos as boas-vindas à sua dedicação! O nosso administrador já recebeu os detalhes do seu comprovante de pagamento e está a validá-lo manualmente. O seu acesso será libertado em breve (geralmente dentro de 24 horas)!
          </p>
        </div>

        {/* Display details of submitted proof */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 text-left space-y-2.5 max-w-sm mx-auto text-xs">
          <span className="text-[10px] text-brand-navy-400 font-black uppercase tracking-wider">Dados Enviados:</span>
          <div className="grid grid-cols-2 gap-y-1.5 font-semibold text-slate-700">
            <span className="text-slate-400">Método Usado:</span>
            <span className="text-right text-brand-navy-900 font-bold">{activeSubmission?.paymentMethod}</span>
            <span className="text-slate-400">Id Transação/Ref:</span>
            <span className="text-right text-brand-red-650 font-mono font-bold truncate">{activeSubmission?.reference}</span>
            {activeSubmission?.note && (
              <>
                <span className="text-slate-400">Nota:</span>
                <span className="text-right text-slate-600 italic truncate">{activeSubmission.note}</span>
              </>
            )}
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onNavigateHome}
            className="bg-brand-navy-800 hover:bg-brand-navy-900 text-white font-extrabold py-3.5 px-8 rounded-xl text-xs uppercase tracking-wider transition-all min-h-[44px]"
          >
            Voltar ao Início gratuitamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
      
      {/* Premium Header Promo Card */}
      <div className="bg-brand-navy-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg border-2 border-brand-red-650 text-center">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red-500/5 rounded-full blur-3xl animate-pulse" />
        
        <div className="flex justify-center mb-3">
          <SabushLogo size="md" onDark={true} />
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-1 border border-brand-gold-500/60 bg-brand-red-650 px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-[#ffffff] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold-400 fill-brand-gold-400" />
            <span>Adquirir Plano Club</span>
          </div>
          <h2 className="text-xl font-black text-[#ffffff] tracking-tight leading-none mt-1">
            Liberte Todo o Poder do Seu Inglês! 🌍
          </h2>
          <p className="text-xs text-slate-200 mt-2 max-w-sm mx-auto leading-relaxed font-semibold">
            Tenha acesso ilimitado a todas as lições Intermédias, lições Avançadas de conversação de negócios, e pratique conversação 24/7 com o nosso Tutor de IA Inteligente.
          </p>
        </div>

        {/* Dynamic Price Highlight */}
        <div className="mt-5 inline-block bg-brand-navy-800/80 border border-brand-red-500/40 rounded-2xl p-4 text-center relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-brand-navy-950 text-[8px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm">
            Oferta Temporária!
          </span>
          <div className="flex flex-col items-center justify-center space-y-1 mt-1">
            <span className="text-[10px] text-slate-300 line-through font-bold">Antes: 999 MT/mês</span>
            <span className="text-3xl font-black text-brand-gold-400">299 MT<span className="text-xs text-slate-300 font-bold">/mês</span></span>
            <span className="text-[9px] text-[#ffdddd] font-black tracking-wider uppercase">Poupe 70% por tempo limitado!</span>
          </div>
        </div>
      </div>

      {/* REJECTION ALERT IF APPLICABLE */}
      {currentStatus === 'Rejeitado' && (
        <div className="bg-rose-50 border-2 border-rose-250 p-4 rounded-2xl text-rose-900 flex items-start space-x-3 text-xs shadow-inner">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-rose-950 uppercase">Comprovativo Anterior Rejeitado</h4>
            <p className="font-semibold">
              O administrador analisou a referência anterior e rejeitou a transação devido ao seguinte motivo:
            </p>
            <p className="bg-white/80 p-2.5 rounded-lg border border-rose-200 italic font-bold text-rose-800 mt-1">
              "{activeSubmission?.rejectionReason || 'Dados de pagamento não conferem.'}"
            </p>
            <p className="pt-1 font-semibold text-rose-800">
              Por favor, reveja as instruções de depósito abaixo e submeta um novo comprovante correto.
            </p>
          </div>
        </div>
      )}

      {/* Step 1: Payment instructions with details */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-brand-navy-900 tracking-tight flex items-center space-x-2">
          <Landmark className="w-5 h-5 text-brand-red-500" />
          <span>Passo 1: Efetuar pagamento</span>
        </h3>
        
        <p className="text-xs text-slate-600 leading-relaxed font-semibold">
          Faça a transferência ou depósito no valor correspondente para uma das contas oficiais do <strong>Sabush English Club</strong> listadas abaixo:
        </p>

        {/* Banking and Mobile Wallets Detail List */}
        <div className="grid grid-cols-1 gap-2.5">
          {/* M-Pesa */}
          <div className="flex items-center justify-between p-3.5 bg-[#e11d48]/5 hover:bg-[#e11d48]/10 border border-[#e11d48]/20 rounded-xl transition-all">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 bg-brand-red-600 rounded-full" />
              <div>
                <h4 className="font-extrabold text-xs text-brand-navy-900 uppercase">💥 M-PESA</h4>
                <p className="text-[11px] font-bold text-slate-600">Celular: <strong className="text-brand-red-600 select-all">858624086</strong></p>
              </div>
            </div>
            <span className="text-[9px] font-black tracking-widest text-[#ffffff] bg-brand-red-650 px-2 py-0.5 rounded-md border border-brand-red-500">M-PESA</span>
          </div>

          {/* E-Mola */}
          <div className="flex items-center justify-between p-3.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
              <div>
                <h4 className="font-extrabold text-xs text-brand-navy-900 uppercase">⚡ E-MOLA</h4>
                <p className="text-[11px] font-bold text-slate-600">Celular: <strong className="text-amber-800 select-all">870242114</strong></p>
              </div>
            </div>
            <span className="text-[9px] font-black tracking-widest text-white bg-amber-600 px-2 py-0.5 rounded-md border border-amber-500">E-MOLA</span>
          </div>

          {/* BIM */}
          <div className="p-3.5 bg-blue-50/50 hover:bg-blue-50 border border-blue-200 rounded-xl space-y-1 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse" />
                <h4 className="font-extrabold text-xs text-brand-navy-900 uppercase">🏦 BANCO BIM (Transferência)</h4>
              </div>
              <span className="text-[9px] font-black tracking-widest text-white bg-blue-600 px-2 py-0.5 rounded-md border border-blue-500">BANCO</span>
            </div>
            <div className="text-[11px] space-y-0.5 pl-5 list-none font-semibold text-slate-600 leading-relaxed">
              <p>NIB / Conta: <strong className="text-brand-navy-800 select-all font-bold">1176885675</strong></p>
              <p>Titular: <strong className="text-slate-800 text-brand-navy-850">SABUSHIMIKE MASCENI DIEUDONNE</strong></p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Form to submit details */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-brand-navy-900 tracking-tight flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-brand-red-500" />
          <span>Passo 2: Submeter Comprovativo</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Payment Method Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-brand-navy-500 font-black uppercase tracking-widest block pl-1">
              Método de Pagamento Utilizado:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['M-Pesa', 'E-Mola', 'BIM'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`py-3 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                    paymentMethod === method
                      ? 'bg-brand-navy-800 border-brand-navy-900 text-white shadow-md'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-350 text-slate-700'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Reference / Transaction ID ID */}
          <div className="space-y-1.5">
            <label htmlFor="ref_id" className="text-[10px] text-brand-navy-500 font-black uppercase tracking-widest block pl-1">
              ID de Transação ou Referência:
            </label>
            <input
              id="ref_id"
              type="text"
              required
              placeholder="Ex: PP260613.1234.AB789CD"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full text-xs px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-brand-navy-800 bg-white placeholder-slate-405 text-slate-800 transition-all font-mono min-h-[44px]"
            />
          </div>

          {/* Optional Note */}
          <div className="space-y-1.5">
            <label htmlFor="ref_note" className="text-[10px] text-brand-navy-500 font-black uppercase tracking-widest block pl-1">
              Nota Opcional (Ex: Nome do depositante):
            </label>
            <textarea
              id="ref_note"
              rows={2}
              placeholder="Ex: Fiz o envio a partir do número da minha esposa..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-brand-navy-800 bg-white placeholder-slate-405 text-slate-800 transition-all font-sans"
            />
          </div>

          {/* Error display */}
          {errorText && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-600 flex items-center space-x-2">
              <AlertCircle className="w-4.5 h-4.5" />
              <span>{errorText}</span>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-red-600 hover:bg-brand-red-700 hover:border-brand-gold-400 border border-transparent text-[#ffffff] font-extrabold py-3.5 px-4 rounded-xl text-xs text-center flex items-center justify-center space-x-2 transition-all shadow-sm min-h-[44px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#ffffff]" />
                <span>A Enviar Comprovativo...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-brand-gold-400 fill-brand-gold-400" />
                <span>Submeter Comprovativo de Verificação</span>
              </>
            )}
          </button>

        </form>
      </div>

      {/* Q&A Section with automated support */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-brand-navy-900 tracking-tight flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-indigo-600 fill-indigo-200 stroke-[2.2]" />
          <span>Esclarecer Dúvidas de Pagamento</span>
        </h3>
        
        <p className="text-xs text-slate-600 leading-relaxed font-semibold">
          Tem alguma dúvida sobre os preços, a transferência bancária, o processo de ativação ou como funciona o M-Pesa? Pergunte aqui e receba uma resposta imediata:
        </p>

        {/* Conversation Box */}
        {qaHistory.length > 0 ? (
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150 space-y-3.5 max-h-64 overflow-y-auto">
            {qaHistory.map((msg, index) => (
              <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-1`}>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  {msg.role === 'user' ? 'Você' : 'Assistente Sabush'}
                </span>
                <div className={`p-3 rounded-2xl max-w-[90%] text-xs font-semibold leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-brand-navy-800 text-[#ffffff] rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none space-y-1.5 shadow-sm'
                }`}>
                  {msg.role === 'user' ? msg.text : formatText(msg.text)}
                </div>
              </div>
            ))}
            {qaLoading && (
              <div className="flex items-center space-x-2 text-xs text-slate-400 font-bold italic animate-pulse py-1">
                <Loader2 className="w-4 h-4 animate-spin text-brand-navy-500" />
                <span>O assistente está a responder...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/30">
              <HelpCircle className="w-5 h-5 text-blue-600 fill-blue-150 stroke-[2.2]" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-xs text-brand-navy-900 uppercase">Respostas por Inteligência Artificial</h4>
              <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
                Escreva a sua questão no campo abaixo ou clique numa das dúvidas rápidas abaixo para receber suporte em tempo real sobre a sua subscrição.
              </p>
            </div>
          </div>
        )}

        {/* Subscription Terms FAQs Grid */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between pl-0.5">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">
              Dúvidas frequentes (Termos de Assinatura):
            </span>
            <span className="text-[9px] text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-md">
              Toque para resposta instantânea
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {subscriptionFaqs.map((faq) => (
              <button
                key={faq.id}
                type="button"
                onClick={() => handleQaSubmit(faq.question)}
                disabled={qaLoading}
                className="group flex flex-col items-start p-3 bg-slate-50/75 hover:bg-indigo-50/45 border border-slate-150 hover:border-indigo-200/60 rounded-2xl text-left transition-all disabled:opacity-50 cursor-pointer shadow-sm active:scale-[0.98]"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 group-hover:bg-indigo-100/60 px-1.5 py-0.5 rounded-md transition-colors">
                    {faq.category}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 group-hover:text-indigo-500 transition-colors">
                    Perguntar ➔
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors leading-snug">
                  {faq.question}
                </h4>
              </button>
            ))}
          </div>
        </div>

        {/* Question Submission Input Form */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleQaSubmit(qaInput);
          }}
          className="flex items-center space-x-2 pt-2"
        >
          <input
            type="text"
            value={qaInput}
            onChange={(e) => setQaInput(e.target.value)}
            disabled={qaLoading}
            placeholder="Escreva a sua dúvida aqui... (ex: Qual o NIB do BIM?)"
            className="flex-1 text-xs px-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-brand-navy-800 bg-white placeholder-slate-405 text-slate-800 transition-all min-h-[44px]"
          />
          <button
            type="submit"
            disabled={qaLoading || !qaInput.trim()}
            className="bg-brand-navy-800 hover:bg-brand-navy-900 text-[#ffffff] px-4 rounded-xl min-h-[44px] flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer shrink-0"
          >
            {qaLoading ? (
              <Loader2 className="w-4.5 h-4.5 animate-spin text-white" />
            ) : (
              <Send className="w-4.5 h-4.5 text-white" />
            )}
          </button>
        </form>
      </div>

      {/* Mozambique Friendly Support Info */}
      <div className="bg-brand-red-50/50 p-4 rounded-2xl border border-brand-red-200/45 text-center">
        <p className="text-xs text-brand-red-800 font-bold leading-relaxed flex items-center justify-center space-x-1.5">
          <HelpCircle className="w-4 h-4" />
          <span>Dúvidas ou problemas com o envio? Contacte-nos directamente no WhatsApp clicando no rodapé.</span>
        </p>
      </div>

    </div>
  );
}
