import React, { useRef } from 'react';
import { Award, CheckCircle2, ShieldCheck, Download, Printer, Calendar, GraduationCap, Share2 } from 'lucide-react';
import { Certificate } from '../types';
import { SabushLogo } from './SabushLogo';

interface CertificateViewProps {
  certificate: Certificate;
  onClose?: () => void;
}

export function CertificateView({ certificate, onClose }: CertificateViewProps) {
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Format the date into highly formal Portuguese style
  const formatDateFormal = (dateObj: any) => {
    if (!dateObj) return '';
    try {
      const date = dateObj.toDate ? dateObj.toDate() : new Date(dateObj);
      const day = date.getDate();
      const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day} de ${month} de ${year}`;
    } catch (e) {
      return '';
    }
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    window.print();
  };

  const shareUrl = `${window.location.origin}/?verify=${certificate.uniqueCode}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meu Certificado do Sabush English Club',
          text: `Concluí o programa completo de inglês do Beginner ao Advanced! Verifique meu certificado oficial com o código ${certificate.uniqueCode}.`,
          url: shareUrl,
        });
      } catch (e) {
        console.warn(e);
      }
    } else {
      // Copy to clipboard fallback
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link de verificação copiado para a área de transferência!');
      } catch (err) {
        console.warn(err);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 animate-fade-in block">
      {/* Stylesheet specifically to optimize print sizes, margins & hide controls */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
            background-color: transparent !important;
          }
          #print-area, #print-area * {
            visibility: visible !important;
          }
          #print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            border: none !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
            visibility: hidden !important;
          }
        }
      `}</style>

      {/* Control Actions (no-print) */}
      <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm no-print gap-3">
        <div>
          <h3 className="font-extrabold text-brand-navy-900 text-sm flex items-center space-x-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Certificado de Fluência Reconhecido 🎖️</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Parabéns pela sua dedicação! O seu diploma está pronto.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors border border-slate-200"
            title="Partilhar ou copiar link"
          >
            <Share2 className="w-4 h-4" />
            <span>Partilhar Link</span>
          </button>
          
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-[#1e3a8a] hover:bg-[#172554] text-white font-extrabold text-xs rounded-xl cursor-pointer transition-colors border border-transparent shadow-sm"
            title="Imprimir ou Salvar em PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / PDF</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors border border-slate-200"
            >
              Voltar
            </button>
          )}
        </div>
      </div>

      {/* Certificate Plate (Container that gets printed) */}
      <div
        id="print-area"
        ref={printAreaRef}
        className="bg-white border-8 border-[#0f172a] rounded-3xl p-6 sm:p-12 shadow-md relative overflow-hidden transition-all select-none mx-auto max-w-4xl"
        style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(248,250,252,0.8) 0%, rgba(255,255,255,1) 100%)' }}
      >
        {/* Mozambique Flag Ribbon top accent inside the certificate border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-600 via-brand-gold-400 to-red-600" />

        {/* Elegant Golden Floral / Geometric Inner Double Border */}
        <div className="border border-brand-gold-400 p-4 sm:p-8 rounded-xl h-full w-full border-dashed" style={{ borderWidth: '2px' }}>
          
          {/* Certificate Content Grid */}
          <div className="text-center space-y-6 md:space-y-8">
            
            {/* 1. Header Logo & Academic Styling */}
            <div className="flex flex-col items-center space-y-3">
              <SabushLogo size="md" onDark={false} className="border-none max-w-[160px]" />
              <span className="text-[10px] text-brand-navy-900 font-black tracking-widest uppercase">
                SABUSH ENGLISH CLUB • ACADEMIC ADVISORY BOARD
              </span>
            </div>

            {/* 2. Certificate Title */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-brand-navy-905 tracking-tight uppercase" style={{ color: '#0f172a', fontFamily: 'Georgia, serif' }}>
                Certificado de Conclusão
              </h1>
              <div className="flex items-center justify-center space-x-2">
                <div className="h-[1px] w-12 bg-brand-gold-500" />
                <span className="text-xs text-brand-gold-700 font-black uppercase tracking-widest">DIPLOMA OF FLUENCY</span>
                <div className="h-[1px] w-12 bg-brand-gold-500" />
              </div>
            </div>

            {/* 3. Certificate Purpose */}
            <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed italic">
                Pelo presente instrumento e autoridade constituída, certificamos que o aluno(a)
              </p>
              
              {/* Recipient Name in majestic script font */}
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-brand-navy-900 border-b border-dashed border-brand-gold-400 pb-3 inline-block px-10 max-w-full truncate" style={{ color: '#1e3a8a' }}>
                {certificate.userName}
              </h2>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
                concluiu de forma exemplar e com aproveitamento total o programa completo de estudos linguísticos de <strong>Língua Inglesa (Beginner → Intermediate → Advanced)</strong> oferecido pelo <strong>Sabush English Club</strong> em Moçambique, abrangendo competências de vocabulário, gramática militar, fluência comercial e conversação natural estruturada.
              </p>
            </div>

            {/* 4. Credentials, Date and Validation Code Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100 max-w-3xl mx-auto text-center">
              
              {/* Column 1: Date */}
              <div className="flex flex-col items-center justify-center space-y-1">
                <Calendar className="w-5 h-5 text-brand-navy-700" />
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Data de Outorga</span>
                <span className="text-[11px] text-brand-navy-950 font-black">{formatDateFormal(certificate.completedAt)}</span>
              </div>

              {/* Column 2: Official Stamp / Emblem seal */}
              <div className="flex flex-col items-center justify-center relative">
                <div className="w-16 h-16 rounded-full bg-brand-navy-900 flex items-center justify-center border-4 border-brand-gold-400 shadow-sm relative">
                  <Award className="w-8 h-8 text-brand-gold-400 stroke-[1.8]" />
                  {/* Miniature concentric lines for gold effect */}
                  <div className="absolute inset-1 border border-brand-gold-500/20 rounded-full pointer-events-none" />
                </div>
                <span className="text-[8px] text-brand-gold-800 font-bold tracking-widest uppercase mt-2">SELO DE VERACIDADE</span>
              </div>

              {/* Column 3: Registration Code */}
              <div className="flex flex-col items-center justify-center space-y-1">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Código de Registo</span>
                <span className="text-[11px] text-brand-navy-950 font-mono font-black uppercase tracking-widest">{certificate.uniqueCode}</span>
              </div>

            </div>

            {/* 5. Signatures and Public Validation Footnote */}
            <div className="pt-6 space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-around gap-6 max-w-2xl mx-auto">
                {/* Signature 1 */}
                <div className="flex flex-col items-center">
                  <div className="text-xs sm:text-sm font-serif italic text-slate-600 font-bold" style={{ fontFamily: '"Great Vibes", cursive, Georgia' }}>
                    S. Sabush Agency
                  </div>
                  <div className="h-[1px] w-36 bg-slate-300 my-1" />
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Diretoria Académica Sabush</span>
                </div>

                {/* Signature 2 */}
                <div className="flex flex-col items-center">
                  <div className="text-xs sm:text-sm font-serif italic text-slate-600 font-semibold" style={{ fontFamily: 'Georgia, serif' }}>
                    Club Mocho-AI Tutor
                  </div>
                  <div className="h-[1px] w-36 bg-slate-300 my-1" />
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Coordenador de Fluência</span>
                </div>
              </div>

              {/* Verify Link footnote */}
              <div className="text-[9.5px] text-slate-400 font-semibold pt-4 italic">
                Certificado registado com autenticidade eletrónica. Verificável a qualquer momento por entidades empregadoras e académicas 
                em <span className="font-mono text-brand-navy-800 font-extrabold not-italic">{window.location.host}/?verify={certificate.uniqueCode}</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
