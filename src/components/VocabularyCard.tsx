import React, { useState } from 'react';
import { Volume2, Download, Check, Sparkles, RefreshCw } from 'lucide-react';

export const CATEGORY_BACKGROUNDS: Record<string, string[]> = {
  Viagem: [
    'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=600&auto=format&fit=crop', // fantasy airplane cloud watercolor
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=600&auto=format&fit=crop', // scenic travel painting
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600&auto=format&fit=crop', // boat landscape travel painting
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop', // travel map explorer aesthetics
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop', // warm roadtrip illustration vibe
    'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=600&auto=format&fit=crop', // outdoor traveler illustration feel
    'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=600&auto=format&fit=crop', // surreal sunset traveler landscape
    'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=600&auto=format&fit=crop', // abstract moody red/gold landscape
    'https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=600&auto=format&fit=crop', // warm traditional travel painting
    'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=600&auto=format&fit=crop'  // starry night journey
  ],
  'Negócios': [
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600&auto=format&fit=crop', // abstract warm workspace meeting
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop', // dynamic collaboration painting
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop', // creative office group layout
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop', // architectural city skyline gold reflections
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop', // stylized business silhouettes
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop', // high-contrast workspace digital art
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop', // modern team desk design
    'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop', // minimal design studio meeting
    'https://images.unsplash.com/photo-1618005198143-d3667c344a0e?q=80&w=600&auto=format&fit=crop', // sleek team abstract architecture
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop'  // premium gold and charcoal geometry
  ],
  'Natureza': [
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=600&auto=format&fit=crop', // abstract sun and native leaves painting
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop', // premium vintage botanical illustration
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop', // colorful tropical gouache art
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=600&auto=format&fit=crop', // gorgeous green forest digital scale
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600&auto=format&fit=crop', // majestic sunbeams through trees
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=600&auto=format&fit=crop', // close-up botanical illustration glow
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600&auto=format&fit=crop', // mountain painting atmosphere
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=600&auto=format&fit=crop', // golden beach sunset fluid art
    'https://images.unsplash.com/photo-1500627869374-13cd993b1115?q=80&w=600&auto=format&fit=crop', // scenic valley and hills painting
    'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=600&auto=format&fit=crop'  // stylized golden leaf painting
  ],
  'Culinária': [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop', // rustic spices oil painting vibe
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600&auto=format&fit=crop', // chef table organic textures
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=600&auto=format&fit=crop', // fresh baking bread illustration
    'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=600&auto=format&fit=crop', // sweet colorful dessert plating
    'https://images.unsplash.com/photo-1490815685121-0b05e29a0ee3?q=80&w=600&auto=format&fit=crop', // healthy culinary design layout
    'https://images.unsplash.com/photo-1515003318289-4b4a56a5edd1?q=80&w=600&auto=format&fit=crop', // gourmet abstract dish painting
    'https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=600&auto=format&fit=crop', // food prep and cooking digital paint
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop', // organic market fresh food bowl
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop', // sizzling market food grill watercolor
    'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=600&auto=format&fit=crop'  // culinary table top view cozy painting
  ],
  'Tecnologia': [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop', // glowing cyber network circuits
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop', // glowing binary codestream painting
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop', // abstract futuristic geometry
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop', // glowing global fiber connectivity
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=600&auto=format&fit=crop', // futuristic metallic device glow
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=600&auto=format&fit=crop', // digital workspace tech painting
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop', // abstract servers data network
    'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600&auto=format&fit=crop', // neon-accent cyber landscape
    'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop', // clean abstract tech layers
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop'  // modern tech-accented shapes
  ],
  'Vida Diária': [
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop', // cozy sunlit room illustration vibe
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=600&auto=format&fit=crop', // studying table book illustration vibe
    'https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=600&auto=format&fit=crop', // cozy bedroom interior design
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=600&auto=format&fit=crop', // cozy warm breakfast kitchen
    'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop', // productive daily task planner layout
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop', // community/family friends painting
    'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop', // colorful neighborhood grocery market
    'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=600&auto=format&fit=crop', // relaxing coffee table gouache
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop', // beautiful artistic oil paint backdrop
    'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=600&auto=format&fit=crop'  // daily mood painterly aesthetic
  ]
};

interface VocabularyCardProps {
  word: string;
  pronunciation: string;
  translation: string;
  topic: 'Viagem' | 'Negócios' | 'Natureza' | 'Culinária' | 'Tecnologia' | 'Vida Diária';
  onPlayAudio: (word: string) => void;
  isFlipped: boolean;
  onFlip: () => void;
  onSelfAssess?: (correct: boolean) => void;
  cardIndex?: number;
}

export function VocabularyCard({
  word,
  pronunciation,
  translation,
  topic,
  onPlayAudio,
  isFlipped,
  onFlip,
  onSelfAssess,
  cardIndex = 0
}: VocabularyCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [audioActive, setAudioActive] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);

  // Deterministic background selection using a hash of the word
  const backgrounds = CATEGORY_BACKGROUNDS[topic] || CATEGORY_BACKGROUNDS['Vida Diária'];
  let hash = cardIndex;
  if (!hash) {
    for (let i = 0; i < word.length; i++) {
      hash += word.charCodeAt(i);
    }
  }
  const bgIndex = hash % backgrounds.length;
  const bgUrl = backgrounds[bgIndex];

  const triggerAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAudioActive(true);
    onPlayAudio(word);
    setTimeout(() => setAudioActive(false), 800);
  };

  const downloadCardPNG = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadStatus('A preparar...');

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Falha ao obter contexto Canvas 2D');

      // 1. Solid premium background fill (Sabush Navy #0B1628)
      ctx.fillStyle = '#0B1628';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Load the background image with CORS enabled
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = bgUrl;

      await new Promise<void>((resolve) => {
        img.onload = () => {
          // Centered aspect-fill calculation
          const imgRatio = img.width / img.height;
          const canvasRatio = canvas.width / canvas.height;
          let dWidth, dHeight, dx, dy;

          if (imgRatio > canvasRatio) {
            dHeight = canvas.height;
            dWidth = canvas.height * imgRatio;
            dx = (canvas.width - dWidth) / 2;
            dy = 0;
          } else {
            dWidth = canvas.width;
            dHeight = canvas.width / imgRatio;
            dx = 0;
            dy = (canvas.height - dHeight) / 2;
          }
          ctx.drawImage(img, dx, dy, dWidth, dHeight);
          resolve();
        };

        img.onerror = () => {
          console.warn('Image block or CORS error, falling back to a premium geometric pattern.');
          // Generate a premium gradient overlay
          const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          grad.addColorStop(0, '#0F204C');
          grad.addColorStop(0.5, '#0B1628');
          grad.addColorStop(1, '#00C9B1');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw some decorative abstract shapes to make the fallback look extremely cool
          ctx.fillStyle = 'rgba(245, 166, 35, 0.1)'; // gold tint
          ctx.beginPath();
          ctx.arc(100, 100, 300, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = 'rgba(0, 201, 177, 0.1)'; // teal tint
          ctx.beginPath();
          ctx.arc(canvas.width - 100, canvas.height - 100, 400, 0, Math.PI * 2);
          ctx.fill();

          resolve();
        };
      });

      // 3. Dark gradient bottom overlay for massive contrast on text
      const gradBottom = ctx.createLinearGradient(0, canvas.height * 0.4, 0, canvas.height);
      gradBottom.addColorStop(0, 'rgba(11, 22, 40, 0)');
      gradBottom.addColorStop(0.3, 'rgba(11, 22, 40, 0.45)');
      gradBottom.addColorStop(0.7, 'rgba(11, 22, 40, 0.92)');
      gradBottom.addColorStop(1, 'rgba(11, 22, 40, 1)');
      ctx.fillStyle = gradBottom;
      ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.6);

      // Dark gradient top overlay for badge legibility
      const gradTop = ctx.createLinearGradient(0, 0, 0, 260);
      gradTop.addColorStop(0, 'rgba(11, 22, 40, 0.75)');
      gradTop.addColorStop(1, 'rgba(11, 22, 40, 0)');
      ctx.fillStyle = gradTop;
      ctx.fillRect(0, 0, canvas.width, 260);

      // 4. Draw gold card frame accents (Editorial brand touch)
      ctx.strokeStyle = '#F5A623';
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

      // 5. Draw Top Header Badges (Plus Jakarta Sans & JetBrains Mono inspired)
      // Category Badge left
      ctx.fillStyle = 'rgba(11, 22, 40, 0.8)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      
      const badgeX = 80;
      const badgeY = 80;
      const badgeW = 280;
      const badgeH = 50;
      const r = 12;

      // Draw rounded rectangle
      ctx.beginPath();
      ctx.moveTo(badgeX + r, badgeY);
      ctx.lineTo(badgeX + badgeW - r, badgeY);
      ctx.quadraticCurveTo(badgeX + badgeW, badgeY, badgeX + badgeW, badgeY + r);
      ctx.lineTo(badgeX + badgeW, badgeY + badgeH - r);
      ctx.quadraticCurveTo(badgeX + badgeW, badgeY + badgeH, badgeX + badgeW - r, badgeY + badgeH);
      ctx.lineTo(badgeX + r, badgeY + badgeH);
      ctx.quadraticCurveTo(badgeX, badgeY + badgeH, badgeX, badgeY + badgeH - r);
      ctx.lineTo(badgeX, badgeY + r);
      ctx.quadraticCurveTo(badgeX, badgeY, badgeX + r, badgeY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Text in badge
      ctx.fillStyle = '#F5A623'; // Gold Accent
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`VOCABULÁRIO • ${topic.toUpperCase()}`, badgeX + badgeW / 2, badgeY + badgeH / 2);

      // 6. Main English Word (Massive bold display font)
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 94px "Plus Jakarta Sans", "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(word, canvas.width / 2, canvas.height * 0.65);

      // 7. IPA Pronunciation (Teal color, JetBrains Mono look)
      ctx.fillStyle = '#00C9B1'; // Teal Accent
      ctx.font = 'italic 38px "JetBrains Mono", monospace, sans-serif';
      ctx.fillText(pronunciation, canvas.width / 2, canvas.height * 0.74);

      // 8. Translation Panel (Gold border, premium text)
      const transY = canvas.height * 0.84;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.strokeStyle = '#00C9B1';
      ctx.lineWidth = 2;
      
      const transW = 680;
      const transH = 80;
      const transX = (canvas.width - transW) / 2;
      
      ctx.beginPath();
      ctx.moveTo(transX + 16, transY);
      ctx.lineTo(transX + transW - 16, transY);
      ctx.quadraticCurveTo(transX + transW, transY, transX + transW, transY + 16);
      ctx.lineTo(transX + transW, transY + transH - 16);
      ctx.quadraticCurveTo(transX + transW, transY + transH, transX + transW - 16, transY + transH);
      ctx.lineTo(transX + 16, transY + transH);
      ctx.quadraticCurveTo(transX, transY + transH, transX, transY + transH - 16);
      ctx.lineTo(transX, transY + 16);
      ctx.quadraticCurveTo(transX, transY, transX + 16, transY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FAF9F5';
      ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`TRADUÇÃO: ${translation}`, canvas.width / 2, transY + transH / 2);

      // 9. Watermark footer
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.font = 'bold 22px monospace';
      ctx.fillText('SABUSH ENGLISH CLUB', canvas.width / 2, canvas.height - 130);

      ctx.fillStyle = '#F5A623'; // Gold
      ctx.font = 'italic 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Aprenda Inglês Prático para Negócios & Viagens • sabush.club', canvas.width / 2, canvas.height - 95);

      // 10. Generate download trigger
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `sabush_vocab_${word.toLowerCase().replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadStatus('Baixado!');
      setTimeout(() => setDownloadStatus(null), 2500);
    } catch (err) {
      console.error('Error compiling flashcard PNG:', err);
      setDownloadStatus('Erro ao baixar');
      setTimeout(() => setDownloadStatus(null), 3000);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div 
      onClick={onFlip}
      className="relative h-96 md:h-[420px] w-full cursor-pointer [perspective:1000px] group focus:outline-none select-none font-sans"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onFlip();
        }
      }}
    >
      <div 
        className={`absolute h-full w-full rounded-3xl transition-transform duration-500 shadow-xl border-2 ${
          isFlipped 
            ? 'border-[#00C9B1] bg-[#0B1628]' 
            : 'border-[#F5A623]/45 bg-[#0B1628]'
        } [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/******************** CARD FRONT ********************/}
        <div className="absolute inset-0 h-full w-full rounded-3xl flex flex-col justify-between overflow-hidden [backface-visibility:hidden]">
          
          {/* Full bleed background illustration with lazy loading */}
          <div className="absolute inset-0 z-0">
            <img 
              src={bgUrl} 
              alt={topic} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Ambient gradients for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1628] via-[#0B1628]/35 to-[#0B1628]/60 z-10" />
          </div>

          {/* Card Controls Overlay */}
          <div className="relative z-20 flex flex-col justify-between h-full p-5.5 md:p-7">
            
            {/* Header section */}
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] font-mono font-bold text-[#F5A623] bg-[#0B1628]/85 border border-[#F5A623]/30 px-3 py-1.5 rounded-xl uppercase tracking-widest flex items-center gap-1.5 select-none">
                <Sparkles className="w-3 h-3 text-[#F5A623]" />
                <span>VOCABULÁRIO • {topic}</span>
              </span>

              {/* Speaker / Audio Trigger Button */}
              <button
                type="button"
                onClick={triggerAudio}
                className={`p-2.5 rounded-full transition-all duration-300 border shadow-md cursor-pointer ${
                  audioActive 
                    ? 'bg-[#00C9B1] text-[#0B1628] border-[#00C9B1] scale-110' 
                    : 'bg-[#0B1628]/85 text-[#FAF9F5] border-white/10 hover:bg-[#F5A623] hover:text-[#0B1628] hover:border-[#F5A623]'
                }`}
                title="Ouvir som de pronúncia"
              >
                {audioActive ? (
                  <div className="flex items-end space-x-[1.5px] h-4 w-4 pb-[1px] justify-center shrink-0">
                    <div className="w-[1.5px] bg-[#0B1628] rounded-full animate-bounce h-2" style={{ animationDuration: '0.6s' }} />
                    <div className="w-[1.5px] bg-[#0B1628] rounded-full animate-bounce h-3.5" style={{ animationDuration: '0.4s', animationDelay: '0.15s' }} />
                    <div className="w-[1.5px] bg-[#0B1628] rounded-full animate-bounce h-2" style={{ animationDuration: '0.5s', animationDelay: '0.3s' }} />
                  </div>
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Bottom Section containing English Word, IPA guide and Revelar Tradução */}
            <div className="space-y-4 text-center mt-auto">
              
              <div className="space-y-1.5">
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none drop-shadow-md font-sans">
                  {word}
                </h2>
                
                <p className="text-[11.5px] font-mono tracking-wide text-[#00C9B1] font-semibold bg-[#0B1628]/60 px-3 py-0.5 rounded-full w-max mx-auto border border-[#00C9B1]/20">
                  {pronunciation}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-2.5 pt-1" onClick={(e) => e.stopPropagation()}>
                {/* Reveal button */}
                <button
                  type="button"
                  onClick={onFlip}
                  className="bg-[#00C9B1] hover:bg-[#00b09b] active:scale-95 text-[#0B1628] font-black text-[11px] px-5 py-2.5 rounded-full uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                  <span>Revelar Tradução</span>
                </button>

                {/* Download button */}
                <button
                  type="button"
                  onClick={downloadCardPNG}
                  disabled={isDownloading}
                  className={`border font-black text-[11px] px-4 py-2.5 rounded-full uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    downloadStatus === 'Baixado!'
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-[#0B1628]/80 text-[#FAF9F5] border-white/10 hover:border-[#F5A623] hover:text-[#F5A623]'
                  }`}
                  title="Baixar imagem de estudo para partilhar"
                >
                  {isDownloading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : downloadStatus === 'Baixado!' ? (
                    <Check className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>{downloadStatus || 'Baixar'}</span>
                </button>
              </div>

            </div>

          </div>

        </div>

        {/******************** CARD BACK ********************/}
        <div className="absolute inset-0 h-full w-full rounded-3xl overflow-hidden bg-gradient-to-br from-[#0B1628] via-[#0E1B31] to-[#081324] flex flex-col justify-between p-6 md:p-8 [backface-visibility:hidden] [transform:rotateY(180deg)] border-2 border-[#00C9B1]/30">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] bg-[#00C9B1] text-[#0B1628] font-extrabold px-3 py-1.5 rounded-xl uppercase tracking-wider select-none">
              Tradução
            </span>
            <span className="text-[10px] font-bold text-slate-400 select-none">
              {topic}
            </span>
          </div>

          {/* Center text / Portuguese translation */}
          <div className="text-center space-y-5 my-auto">
            
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 uppercase tracking-widest font-mono font-bold select-none">Em Português:</span>
              <h2 className="text-2xl md:text-3xl font-black text-[#FAF9F5] tracking-tight leading-snug drop-shadow-sm font-sans">
                {translation}
              </h2>
            </div>

            {/* Leitner Self-Assessment Prompt */}
            {onSelfAssess && (
              <div className="pt-4 border-t border-white/5 space-y-2.5" onClick={(e) => e.stopPropagation()}>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider select-none">
                  Lembrou-se da tradução sem olhar?
                </p>
                <div className="flex gap-2.5 justify-center max-w-[320px] mx-auto">
                  <button
                    type="button"
                    onClick={() => onSelfAssess(false)}
                    className="flex-1 py-2 px-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/30 text-rose-300 hover:bg-rose-900/60 active:scale-95 font-extrabold text-[10.5px] uppercase transition-all cursor-pointer text-center"
                  >
                    Não ❌
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelfAssess(true)}
                    className="flex-1 py-2 px-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/30 text-emerald-300 hover:bg-emerald-900/60 active:scale-95 font-extrabold text-[10.5px] uppercase transition-all cursor-pointer text-center"
                  >
                    Sim ✅
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer view-turn feedback */}
          <div className="flex justify-between items-center text-[10.5px] text-slate-400 font-bold uppercase tracking-wider pt-2 border-t border-white/5">
            <span className="text-[#00C9B1]">{word}</span>
            <span className="text-[#F5A623] hover:underline cursor-pointer flex items-center gap-1">
              Voltar ↺
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}

export function getWordTopic(en: string, pt: string, lessonTitle?: string): 'Viagem' | 'Negócios' | 'Natureza' | 'Culinária' | 'Tecnologia' | 'Vida Diária' {
  const text = `${en} ${pt} ${lessonTitle || ''}`.toLowerCase();
  
  if (
    text.includes('airport') || text.includes('aeroporto') || 
    text.includes('flight') || text.includes('voo') || 
    text.includes('travel') || text.includes('viagem') || 
    text.includes('ticket') || text.includes('bilhete') || 
    text.includes('passport') || text.includes('passaporte') || 
    text.includes('destination') || text.includes('destino') || 
    text.includes('hotel') || text.includes('luggage') || text.includes('bagagem') ||
    text.includes('map') || text.includes('road') || text.includes('highway') ||
    text.includes('transit') || text.includes('subway') || text.includes('metro') ||
    text.includes('lugares') || text.includes('transport')
  ) {
    return 'Viagem';
  }
  
  if (
    text.includes('business') || text.includes('negócio') || 
    text.includes('office') || text.includes('escritório') || 
    text.includes('meeting') || text.includes('reunião') || 
    text.includes('deal') || text.includes('acordo') || 
    text.includes('client') || text.includes('cliente') || 
    text.includes('contract') || text.includes('contrato') || 
    text.includes('manager') || text.includes('gerente') || 
    text.includes('boss') || text.includes('marketing') || 
    text.includes('sales') || text.includes('vendas') || 
    text.includes('negotiation') || text.includes('negociação') || 
    text.includes('work') || text.includes('trabalho') || 
    text.includes('salary') || text.includes('salário') || 
    text.includes('project') || text.includes('projeto') ||
    text.includes('corporate') || text.includes('empresa') ||
    text.includes('entrepreneur') || text.includes('empreendedor')
  ) {
    return 'Negócios';
  }
  
  if (
    text.includes('nature') || text.includes('natureza') || 
    text.includes('tree') || text.includes('árvore') || 
    text.includes('plant') || text.includes('planta') || 
    text.includes('weather') || text.includes('tempo') || 
    text.includes('rain') || text.includes('chuva') || 
    text.includes('sun') || text.includes('sol') || 
    text.includes('wildlife') || text.includes('animal') || 
    text.includes('river') || text.includes('rio') || 
    text.includes('forest') || text.includes('floresta') || 
    text.includes('mountain') || text.includes('montanha') || 
    text.includes('sea') || text.includes('mar') || 
    text.includes('ocean') || text.includes('oceano') || 
    text.includes('green') || text.includes('verde') ||
    text.includes('landscape') || text.includes('paisagem') ||
    text.includes('climate') || text.includes('clima')
  ) {
    return 'Natureza';
  }
  
  if (
    text.includes('food') || text.includes('comida') || 
    text.includes('dish') || text.includes('prato') || 
    text.includes('cook') || text.includes('cozinhar') || 
    text.includes('recipe') || text.includes('receita') || 
    text.includes('kitchen') || text.includes('cozinha') || 
    text.includes('chef') || text.includes('restaurant') || text.includes('restaurante') || 
    text.includes('menu') || text.includes('delicious') || text.includes('delicioso') || 
    text.includes('dinner') || text.includes('jantar') || 
    text.includes('lunch') || text.includes('almoço') || 
    text.includes('breakfast') || text.includes('pequeno-almoço') || 
    text.includes('eat') || text.includes('comer') || 
    text.includes('drink') || text.includes('beber') || 
    text.includes('spice') || text.includes('tempero') ||
    text.includes('ingredient') || text.includes('ingrediente')
  ) {
    return 'Culinária';
  }
  
  if (
    text.includes('technology') || text.includes('tecnologia') || 
    text.includes('device') || text.includes('dispositivo') || 
    text.includes('app') || text.includes('aplicativo') || 
    text.includes('internet') || text.includes('computer') || text.includes('computador') || 
    text.includes('phone') || text.includes('telemóvel') || text.includes('celular') || 
    text.includes('software') || text.includes('hardware') || 
    text.includes('online') || text.includes('digital') || 
    text.includes('code') || text.includes('código') || 
    text.includes('network') || text.includes('rede') || 
    text.includes('connection') || text.includes('conexão') ||
    text.includes('system') || text.includes('sistema') ||
    text.includes('screen') || text.includes('ecrã')
  ) {
    return 'Tecnologia';
  }
  
  return 'Vida Diária';
}
