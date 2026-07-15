import React, { useState, useEffect } from 'react';
import { ShieldCheck, XCircle, Search, Award, CheckCircle2, Loader2, ArrowLeft, ExternalLink } from 'lucide-react';
import { verifyCertificateByCode } from '../firebase';
import { Certificate } from '../types';
import { CertificateView } from './CertificateView';
import { SabushLogo } from './SabushLogo';

interface CertificateVerificationProps {
  initialCode?: string;
  onGoBack?: () => void;
}

export function CertificateVerification({ initialCode = '', onGoBack }: CertificateVerificationProps) {
  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setSearched(true);
    setCertificate(null);

    try {
      const result = await verifyCertificateByCode(code.trim());
      if (result) {
        setCertificate(result);
      } else {
        setErrorMsg('Nenhum certificado ativo foi encontrado com este código de verificação. Certifique-se de que digitou o código exatamente como consta no diploma.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Ocorreu um erro ao aceder aos servidores de autenticação do Sabush English Club. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Eager verify if initialCode is provided in URL/props
  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
      // Wait a fraction of a second for a cleaner loader UX hook up
      const timer = setTimeout(() => {
        handleVerify();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [initialCode]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 sm:p-6 md:p-10 flex flex-col items-center">
      
      {/* 1. Header Area with logo */}
      <header className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-200">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onGoBack}>
          <SabushLogo size="sm" onDark={false} className="border-none" />
          <div className="text-left">
            <h1 className="text-base font-black text-brand-navy-950 uppercase tracking-tight">Sabush English Club</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Académico & Registo Eletrónico</p>
          </div>
        </div>

        {onGoBack && (
          <button
            onClick={onGoBack}
            className="inline-flex items-center space-x-1.5 px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer transition-all border border-slate-200 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Voltar ao Portal</span>
          </button>
        )}
      </header>

      {/* 2. Search / Verification Input Area (Hidden once certificate is verified visually to focus print/PDF) */}
      {!certificate && (
        <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-center my-6">
          <div className="w-16 h-16 rounded-full bg-brand-navy-50 text-brand-navy-900 flex items-center justify-center mx-auto mb-4 border border-brand-navy-200 shadow-inner">
            <ShieldCheck className="w-8 h-8 text-brand-navy-900 stroke-[1.8]" />
          </div>
          
          <h2 className="text-xl sm:text-2xl font-black text-brand-navy-950 tracking-tight">Portal Público de Veracidade</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
            Escreva o código alfanumérico do certificado do Sabush English Club para validar de forma instantânea a sua autenticidade nacional e internacional.
          </p>

          <form onSubmit={handleVerify} className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 stroke-[2]" />
              <input
                type="text"
                placeholder="Exemplo: SABUSH-SAMPLE-2026"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={loading}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white text-slate-900 font-extrabold text-sm rounded-2xl border border-slate-200 placeholder-slate-400 outline-none focus:ring-2 focus:ring-brand-navy-700 transition-all uppercase tracking-widest min-h-[44px]"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full sm:w-auto px-6 py-3.5 bg-brand-navy-850 hover:bg-brand-navy-900 text-white font-black text-sm rounded-2xl cursor-pointer shadow-sm transition-all flex items-center justify-center gap-2 border border-transparent disabled:opacity-55 disabled:cursor-not-allowed min-h-[44px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>A pesquisar...</span>
                </>
              ) : (
                <span>Validar Diploma</span>
              )}
            </button>
          </form>

          <p className="text-[10.5px] text-slate-450 mt-3.5 text-left font-bold flex items-center gap-1.5 bg-slate-50/50 p-2.5 rounded-xl border border-slate-105">
            💡 <span className="text-slate-500">Dica de Teste:</span> Podes usar o código de certificado de teste oficial <strong className="text-brand-navy-800 font-extrabold selection:bg-brand-navy-100 cursor-pointer hover:underline" onClick={() => setCode('SABUSH-SAMPLE-2026')}>SABUSH-SAMPLE-2026</strong> para verificar instantaneamente o portal público.
          </p>

          {/* Validation Feedback Messages */}
          {searched && errorMsg && (
            <div className="mt-6 p-4 rounded-2xl border border-rose-100 bg-rose-50/50 text-rose-800 text-left flex items-start gap-3 animate-fade-in">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-bold">Autenticação Falhou</p>
                <p className="text-xs text-rose-700/90 leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Certificate View Frame if loaded successfully */}
      {certificate && (
        <div className="w-full max-w-4xl space-y-6">
          
          {/* Certificate Valid Top Bar (No-print) */}
          <div className="no-print w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-4.5 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-sm text-emerald-900 animate-fade-in">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-left">
                <span className="inline-flex items-center px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full border border-emerald-200 uppercase tracking-wider mb-1">
                  Certificado Autêntico
                </span>
                <p className="text-sm font-black">Este documento foi validado e assinado eletronicamente.</p>
                <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                  Confirmamos que <strong>{certificate.userName}</strong> completou o percurso curricular inteiro do Sabush English Club de Moçambique.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setCertificate(null);
                setSearched(false);
                setCode('');
              }}
              className="text-xs font-bold text-center border border-emerald-200 bg-white hover:bg-emerald-100/50 px-4 py-2.5 rounded-xl cursor-pointer text-emerald-900 transition-colors shrink-0"
            >
              Pesquisar Outro Código
            </button>
          </div>

          <CertificateView certificate={certificate} />
        </div>
      )}

      {/* Footer metadata */}
      <footer className="mt-14 pb-10 text-center text-slate-400 text-xs font-semibold max-w-md space-y-2.5">
        <p className="text-[10px] tracking-widest uppercase font-black text-slate-350">Sabush English Club Moçambique</p>
        <p className="leading-relaxed">
          O portal público de veracidade enquadra-se nas diretivas de transparência de aprendizagem. 
          Para suporte académico, envie um correio para <a href="mailto:sabushagency@gmail.com" className="text-brand-navy-700 font-black decoration-dotted hover:underline">sabushagency@gmail.com</a>.
        </p>
      </footer>
    </div>
  );
}
