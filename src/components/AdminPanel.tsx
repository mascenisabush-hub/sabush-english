/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Calendar, 
  FileText, 
  User, 
  Clock, 
  Loader2, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Edit, 
  Sparkles, 
  Upload, 
  Image as ImageIcon,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { Mascot } from './Mascot';
import { SabushLogo } from './SabushLogo';
import { doc, onSnapshot } from 'firebase/firestore';
import { 
  PaymentSubmission, 
  getPendingPaymentSubmissions, 
  approvePaymentSubmission, 
  rejectPaymentSubmission,
  getInspirationCards,
  createInspirationCard,
  updateInspirationCard,
  deleteInspirationCard,
  uploadCardImage,
  uploadClubLogo,
  saveClubLogo,
  uploadMascotImage,
  saveMascotImage,
  db,
  uploadLessonImage,
  saveLessonImage
} from '../firebase';
import { InspirationCard } from '../types';
import { DEFAULT_INSPIRATION_CARDS } from './InspirationCardsGallery';
import { LESSONS } from '../data';

export function AdminPanel() {
  const [activeSubTab, setActiveSubTab] = useState<'payments' | 'cards' | 'branding'>('payments');
  const [successInfo, setSuccessInfo] = useState('');
  const [errorInfo, setErrorInfo] = useState('');

  // 1. PAYMENT SUBMISSIONS STATES
  const [submissions, setSubmissions] = useState<PaymentSubmission[]>([]);
  const [loadingPay, setLoadingPay] = useState(true);
  const [rejectionReasons, setRejectionReasons] = useState<{ [userId: string]: string }>({});
  const [processingUser, setProcessingUser] = useState<string | null>(null);
  const [activeRejectionInput, setActiveRejectionInput] = useState<string | null>(null);

  // 2. INSPIRATION CARDS STATES
  const [cards, setCards] = useState<InspirationCard[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // 3. BRANDING LOGO STATES & HANDLERS
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await performLogoUpload(file);
    }
  };

  const handleLogoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await performLogoUpload(file);
    }
  };

  const performLogoUpload = async (file: File) => {
    if (!file.type.match('image.*')) {
      setErrorInfo('O ficheiro selecionado não é uma imagem válida.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setErrorInfo('Por favor, carregue uma imagem com tamanho inferior a 4MB para otimização de dados móveis.');
      return;
    }

    setUploadingLogo(true);
    setSuccessInfo('');
    setErrorInfo('');

    try {
      const uploadedUrl = await uploadClubLogo(file);
      await saveClubLogo(uploadedUrl);
      setSuccessInfo('Logótipo oficial atualizado com sucesso! Todos os ecrãs do Club refletirão a alteração em tempo real.');
    } catch (err: any) {
      console.error(err);
      setErrorInfo('Erro ao atualizar o logótipo oficial do Sabush English Club.');
    } finally {
      setUploadingLogo(false);
    }
  };

  // 4. BRANDING MASCOT STATES & HANDLERS
  const [uploadingMascot, setUploadingMascot] = useState<Record<string, boolean>>({
    standard: false,
    happy: false,
    thinking: false,
    talking: false
  });
  const [dragMascotActive, setDragMascotActive] = useState<Record<string, boolean>>({
    standard: false,
    happy: false,
    thinking: false,
    talking: false
  });

  const handleMascotDrag = (e: React.DragEvent, expr: 'standard' | 'happy' | 'thinking' | 'talking') => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragMascotActive(prev => ({ ...prev, [expr]: true }));
    } else if (e.type === "dragleave") {
      setDragMascotActive(prev => ({ ...prev, [expr]: false }));
    }
  };

  const handleMascotDrop = async (e: React.DragEvent, expr: 'standard' | 'happy' | 'thinking' | 'talking') => {
    e.preventDefault();
    e.stopPropagation();
    setDragMascotActive(prev => ({ ...prev, [expr]: false }));

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await performMascotUpload(file, expr);
    }
  };

  const handleMascotFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, expr: 'standard' | 'happy' | 'thinking' | 'talking') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await performMascotUpload(file, expr);
    }
  };

  const performMascotUpload = async (file: File, expr: 'standard' | 'happy' | 'thinking' | 'talking') => {
    if (!file.type.match('image.*')) {
      setErrorInfo('O ficheiro selecionado não é uma imagem válida.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setErrorInfo('Por favor, carregue uma imagem com tamanho inferior a 4MB para otimização de dados móveis.');
      return;
    }

    setUploadingMascot(prev => ({ ...prev, [expr]: true }));
    setSuccessInfo('');
    setErrorInfo('');

    try {
      const uploadedUrl = await uploadMascotImage(file);
      await saveMascotImage(expr, uploadedUrl);
      setSuccessInfo(`Mascote (${expr}) do Club atualizado com sucesso! Todos os ecrãs do Club refletirão a alteração em tempo real.`);
    } catch (err: any) {
      console.error(err);
      setErrorInfo(`Erro ao atualizar o mascote (${expr}) oficial do Sabush English Club.`);
    } finally {
      setUploadingMascot(prev => ({ ...prev, [expr]: false }));
    }
  };

  // 5. BRANDING LESSON IMAGES STATES & HANDLERS
  const [lessonImages, setLessonImages] = useState<Record<string, string>>({});
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [lessonUrlInput, setLessonUrlInput] = useState<string>('');
  const [uploadingLessonImg, setUploadingLessonImg] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'clubSettings', 'branding'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data?.lessonImages) {
          setLessonImages(data.lessonImages);
        } else {
          setLessonImages({});
        }
      }
    }, (err) => {
      console.debug("Error listening to lesson images in AdminPanel:", err);
    });
    return () => unsubscribe();
  }, []);

  const handleLessonImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedLessonId) {
      setErrorInfo('Por favor, selecione primeiro uma lição.');
      return;
    }
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.match('image.*')) {
        setErrorInfo('O ficheiro selecionado não é uma imagem válida.');
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        setErrorInfo('Por favor, carregue uma imagem inferior a 4MB.');
        return;
      }

      setUploadingLessonImg(true);
      setSuccessInfo('');
      setErrorInfo('');
      try {
        const uploadedUrl = await uploadLessonImage(file, selectedLessonId);
        await saveLessonImage(selectedLessonId, uploadedUrl);
        setSuccessInfo(`Imagem de fundo da lição ${selectedLessonId} atualizada com sucesso!`);
        setLessonUrlInput(uploadedUrl);
      } catch (err) {
        setErrorInfo('Erro ao carregar imagem para a lição.');
      } finally {
        setUploadingLessonImg(false);
      }
    }
  };

  const handleSaveLessonUrl = async () => {
    if (!selectedLessonId) {
      setErrorInfo('Por favor, selecione primeiro uma lição.');
      return;
    }
    setUploadingLessonImg(true);
    setSuccessInfo('');
    setErrorInfo('');
    try {
      await saveLessonImage(selectedLessonId, lessonUrlInput);
      setSuccessInfo(`Imagem de fundo da lição ${selectedLessonId} atualizada com sucesso!`);
    } catch (err) {
      setErrorInfo('Erro ao atualizar URL da lição.');
    } finally {
      setUploadingLessonImg(false);
    }
  };

  const handleResetLessonImage = async (lessonId: string) => {
    if (window.confirm(`Deseja repor a imagem de fundo da lição ${lessonId}?`)) {
      setUploadingLessonImg(true);
      setSuccessInfo('');
      setErrorInfo('');
      try {
        await saveLessonImage(lessonId, '');
        setSuccessInfo(`Imagem de fundo da lição ${lessonId} reposta para o padrão.`);
        if (selectedLessonId === lessonId) {
          setLessonUrlInput('');
        }
      } catch (err) {
        setErrorInfo('Erro ao repor imagem da lição.');
      } finally {
        setUploadingLessonImg(false);
      }
    }
  };

  // New/Edit card form state
  const [cardCategory, setCardCategory] = useState<'Vocabulário' | 'Erro Comum' | 'Dica de Inglês'>('Vocabulário');
  const [cardEnglishContent, setCardEnglishContent] = useState('');
  const [cardPortugueseTranslation, setCardPortugueseTranslation] = useState('');
  const [cardPronunciation, setCardPronunciation] = useState('');
  const [cardImageUrl, setCardImageUrl] = useState('');

  // Beautiful scenic image presets for quick choice
  const SCENIC_PRESETS = [
    { label: 'Praia Coral', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800' },
    { label: 'Cidade Sunset', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=800' },
    { label: 'Montanhas', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800' },
    { label: 'Floresta Verde', url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=800' },
    { label: 'Cascata', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800' },
    { label: 'Estrada Costeira', url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=800' },
  ];

  const loadSubmissions = async () => {
    setLoadingPay(true);
    setSuccessInfo('');
    setErrorInfo('');
    try {
      const data = await getPendingPaymentSubmissions();
      setSubmissions(data);
    } catch (e) {
      console.error('Error fetching submissions:', e);
      setErrorInfo('Erro ao carregar comprovativos.');
    } finally {
      setLoadingPay(false);
    }
  };

  const loadCards = async () => {
    setLoadingCards(true);
    setSuccessInfo('');
    setErrorInfo('');
    try {
      const data = await getInspirationCards();
      setCards(data);
    } catch (e) {
      console.error('Error fetching inspiration cards:', e);
      setErrorInfo('Erro ao carregar cartões de inspiração.');
    } finally {
      setLoadingCards(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'payments') {
      loadSubmissions();
    } else if (activeSubTab === 'cards') {
      loadCards();
    }
  }, [activeSubTab]);

  // Handle manual payment approval
  const handleApprove = async (userId: string) => {
    if (window.confirm('Tem a certeza de que deseja APROVAR este pagamento? A subscrição do utilizador será imediatamente ativada.')) {
      setProcessingUser(userId);
      setSuccessInfo('');
      setErrorInfo('');
      try {
        await approvePaymentSubmission(userId);
        setSuccessInfo('Pagamento aprovado com sucesso! Acesso liberado.');
        await loadSubmissions();
      } catch (err) {
        console.error(err);
        setErrorInfo('Erro ao aprovar comprovativo de pagamento.');
      } finally {
        setProcessingUser(null);
      }
    }
  };

  // Handle manual payment rejection
  const handleReject = async (userId: string) => {
    const reason = rejectionReasons[userId]?.trim() || '';
    if (!reason) {
      alert('Por favor, indique um motivo explicativo antes de clicar em Rejeitar.');
      return;
    }

    if (window.confirm('Tem a certeza de que deseja REJEITAR este pagamento?')) {
      setProcessingUser(userId);
      setSuccessInfo('');
      setErrorInfo('');
      try {
        await rejectPaymentSubmission(userId, reason);
        setSuccessInfo('Comprovativo rejeitado com sucesso.');
        setActiveRejectionInput(null);
        await loadSubmissions();
      } catch (err) {
        console.error(err);
        setErrorInfo('Erro ao rejeitar comprovativo.');
      } finally {
        setProcessingUser(null);
      }
    }
  };

  // Inspiration Card creation or updates
  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardEnglishContent.trim() || !cardPortugueseTranslation.trim()) {
      alert('Por favor, preencha o conteúdo em inglês e a tradução correspondente.');
      return;
    }

    const finalImage = cardImageUrl.trim() || SCENIC_PRESETS[0].url;

    setSuccessInfo('');
    setErrorInfo('');

    try {
      if (editingCardId) {
        // Update Card
        await updateInspirationCard(editingCardId, {
          category: cardCategory,
          englishContent: cardEnglishContent.trim(),
          portugueseTranslation: cardPortugueseTranslation.trim(),
          pronunciation: cardPronunciation.trim() || undefined,
          imageUrl: finalImage
        });
        setSuccessInfo('Cartão de inspiração atualizado com sucesso no Firestore!');
      } else {
        // Create Card
        await createInspirationCard({
          category: cardCategory,
          englishContent: cardEnglishContent.trim(),
          portugueseTranslation: cardPortugueseTranslation.trim(),
          pronunciation: cardPronunciation.trim() || undefined,
          imageUrl: finalImage
        });
        setSuccessInfo('Novo cartão de inspiração criado e disponibilizado no Firestore!');
      }

      // Reset form states
      resetForm();
      await loadCards();
    } catch (err: any) {
      console.error(err);
      setErrorInfo('Erro ao salvar o cartão no base de dados.');
    }
  };

  const handleEditInitiate = (card: InspirationCard) => {
    setEditingCardId(card.cardId);
    setCardCategory(card.category);
    setCardEnglishContent(card.englishContent);
    setCardPortugueseTranslation(card.portugueseTranslation);
    setCardPronunciation(card.pronunciation || '');
    setCardImageUrl(card.imageUrl);
    window.scrollTo({ top: 350, behavior: 'smooth' }); // Scroll smoothly to form
  };

  const handleDeleteCard = async (cardId: string) => {
    if (window.confirm('Deseja eliminar permanentemente este cartão de inspiração? Esta ação não pode ser desfeita.')) {
      setSuccessInfo('');
      setErrorInfo('');
      try {
        await deleteInspirationCard(cardId);
        setSuccessInfo('Cartão de inspiração eliminado com sucesso.');
        await loadCards();
      } catch (e) {
        console.error(e);
        setErrorInfo('Erro ao eliminar o cartão.');
      }
    }
  };

  const resetForm = () => {
    setEditingCardId(null);
    setCardCategory('Vocabulário');
    setCardEnglishContent('');
    setCardPortugueseTranslation('');
    setCardPronunciation('');
    setCardImageUrl('');
  };

  // Pre-fill / Seed firestore with standard sample collection
  const handleSeedCollection = async () => {
    if (window.confirm('Deseja carregar as 6 predefinições oficiais da Sabush no Firestore? Isso preencherá a galeria instantaneamente.')) {
      setLoadingCards(true);
      setErrorInfo('');
      setSuccessInfo('');
      try {
        let inserted = 0;
        for (const card of DEFAULT_INSPIRATION_CARDS) {
          await createInspirationCard({
            category: card.category,
            englishContent: card.englishContent,
            portugueseTranslation: card.portugueseTranslation,
            pronunciation: card.pronunciation || '',
            imageUrl: card.imageUrl
          });
          inserted++;
        }
        setSuccessInfo(`${inserted} cartões padrão criados com sucesso no Firestore!`);
        await loadCards();
      } catch (e: any) {
        console.error(e);
        setErrorInfo('Erro ao carregar predefinições.');
      } finally {
        setLoadingCards(false);
      }
    }
  };

  // Image Upload handler for file selection
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Fast local size validation (limit to 4MB for responsive performance)
    if (file.size > 4 * 1024 * 1024) {
      alert('Por favor, carregue uma imagem com tamanho inferior a 4MB para otimização de dados móveis.');
      return;
    }

    setUploadingImage(true);
    setSuccessInfo('');
    setErrorInfo('');

    try {
      const downloadUrl = await uploadCardImage(file);
      setCardImageUrl(downloadUrl);
      setSuccessInfo('Ficheiro de imagem carregado para o Firebase Storage com sucesso!');
    } catch (error: any) {
      console.error(error);
      setErrorInfo('Erro ao enviar imagem.');
    } finally {
      setUploadingImage(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Sem data';
    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString('pt-MZ');
      }
      return new Date(timestamp).toLocaleDateString('pt-MZ');
    } catch (e) {
      return 'Format incorreto';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Admin Title Card */}
      <div className="bg-brand-navy-900 rounded-3xl p-6 text-white border-2 border-brand-red-650 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center md:justify-between gap-4">
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-red-500/10 rounded-full blur-2xl" />
        
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-brand-navy-800 rounded-2xl border border-brand-red-500 flex items-center justify-center text-brand-gold-400">
            <ShieldCheck className="w-8 h-8 font-black" />
          </div>
          <div className="flex-1 min-w-0 text-center md:text-left">
            <span className="text-[10px] text-brand-gold-400 uppercase font-black tracking-widest block">Painel Sabush English Club</span>
            <h2 className="text-xl font-black mt-0.5 leading-tight text-[#ffffff]">Administração Geral 🇲🇿</h2>
            <p className="text-xs text-slate-300 font-semibold">Gira comprovativos, libere subscrições e adicione pílulas de inspiração diária para estudantes.</p>
          </div>
        </div>
      </div>

      {/* Tabs Selector Navigation Bar with Red/Gold Premium elements */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => {
            setActiveSubTab('payments');
            setSuccessInfo('');
            setErrorInfo('');
          }}
          className={`flex-1 py-3 text-center text-xs font-black tracking-wider uppercase border-b-2 cursor-pointer transition-all ${
            activeSubTab === 'payments'
              ? 'border-brand-red-600 text-brand-navy-900 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          💳 Validar Pagamentos ({submissions.length})
        </button>
        <button
          onClick={() => {
            setActiveSubTab('cards');
            setSuccessInfo('');
            setErrorInfo('');
          }}
          className={`flex-1 py-3 text-center text-xs font-black tracking-wider uppercase border-b-2 cursor-pointer transition-all ${
            activeSubTab === 'cards'
              ? 'border-brand-red-600 text-brand-navy-900 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🌅 Cartões de Inspiração ({cards.length})
        </button>
        <button
          onClick={() => {
            setActiveSubTab('branding');
            setSuccessInfo('');
            setErrorInfo('');
          }}
          className={`flex-1 py-3 text-center text-xs font-black tracking-wider uppercase border-b-2 cursor-pointer transition-all ${
            activeSubTab === 'branding'
              ? 'border-brand-red-600 text-brand-navy-900 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🎨 Logótipo & Design
        </button>
      </div>

      {successInfo && (
        <div className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center space-x-2 shadow-sm">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successInfo}</span>
        </div>
      )}

      {errorInfo && (
        <div className="p-4 bg-rose-50 border border-rose-250 text-rose-800 rounded-2xl text-xs font-semibold flex items-center space-x-2 shadow-sm">
          <X className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorInfo}</span>
        </div>
      )}

      {/* RENDER ACTIVE TAB: PAYMENTS WORKSPACE */}
      {activeSubTab === 'payments' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-4 border-slate-100">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-brand-navy-900 flex items-center space-x-1.5">
              <Clock className="w-5 h-5 text-brand-red-500" />
              <span>Comprovativos Pendentes ({submissions.length})</span>
            </h3>
            <button
              onClick={loadSubmissions}
              disabled={loadingPay}
              className="p-2 text-slate-500 hover:text-brand-navy-900 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors border border-slate-200 min-h-[40px] min-w-[40px]"
              title="Recarregar"
            >
              <RefreshCw className={`w-4 h-4 ${loadingPay ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loadingPay ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-navy-800" />
              <p className="text-xs text-slate-400 font-bold mt-2 uppercase tracking-wide">A carregar registos...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="flex justify-center">
                <Mascot expression="happy" size="md" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-brand-navy-900 text-sm">Bom trabalho! Não há pendentes</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Todos os comprovativos manuais de pagamentos foram verificados por si de forma sistemática.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {submissions.map((sub) => {
                const showRejectionForm = activeRejectionInput === sub.userId;
                const isProcessing = processingUser === sub.userId;

                return (
                  <div 
                    key={sub.userId}
                    className="bg-slate-50 border border-slate-200 hover:border-brand-navy-500 hover:shadow-md rounded-2xl p-4.5 transition-all space-y-4 shadow-inner"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 border-b border-slate-200">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-brand-navy-100 text-brand-navy-850 rounded-xl">
                          <User className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-brand-navy-900">{sub.userName}</h4>
                          <p className="text-xs text-slate-500 font-semibold">{sub.userContact}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-semibold">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(sub.createdAt)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-3.5 rounded-xl border border-slate-150">
                      <div>
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Método de Envio</span>
                        <span className="text-xs font-black text-brand-navy-900 flex items-center space-x-1.5 mt-0.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-brand-red-600 inline-block" />
                          <span>{sub.paymentMethod}</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">ID Transação / Referência</span>
                        <span className="text-xs font-black text-brand-red-650 font-mono select-all mt-0.5 block truncate">{sub.reference}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Nota do Aluno</span>
                        <span className="text-xs font-semibold text-slate-600 mt-0.5 block italic truncate">{sub.note || '(Sem observação)'}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
                      <button
                        onClick={() => handleApprove(sub.userId)}
                        disabled={isProcessing}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4.5 py-2.5 rounded-xl text-xs flex items-center space-x-1 transition-all min-h-[40px] cursor-pointer"
                      >
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span>Aprovar Subscrição</span>
                      </button>

                      {!showRejectionForm ? (
                        <button
                          onClick={() => {
                            setActiveRejectionInput(sub.userId);
                            setRejectionReasons({ ...rejectionReasons, [sub.userId]: '' });
                          }}
                          disabled={isProcessing}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold px-4.5 py-2.5 rounded-xl text-xs flex items-center space-x-1 transition-all min-h-[40px] cursor-pointer"
                        >
                          <X className="w-4 h-4 stroke-[2.5]" />
                          <span>Rejeitar</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveRejectionInput(null)}
                          disabled={isProcessing}
                          className="bg-slate-200 hover:bg-slate-350 text-slate-700 font-bold px-4.5 py-2.5 rounded-xl text-xs min-h-[40px] cursor-pointer"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>

                    {showRejectionForm && (
                      <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 space-y-3">
                        <div className="space-y-1">
                          <label htmlFor={`reject-reason-${sub.userId}`} className="text-[10px] text-rose-800 font-black uppercase tracking-widest pl-0.5 block">
                            Motivo explicativo para Rejeitar:
                          </label>
                          <input
                            id={`reject-reason-${sub.userId}`}
                            type="text"
                            placeholder="Ex: Referência incorreta..."
                            value={rejectionReasons[sub.userId] || ''}
                            onChange={(e) => setRejectionReasons({
                              ...rejectionReasons,
                              [sub.userId]: e.target.value
                            })}
                            className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-rose-250 outline-none focus:border-rose-600 bg-white text-slate-800 font-semibold min-h-[40px]"
                          />
                        </div>
                        <button
                          disabled={isProcessing || !rejectionReasons[sub.userId]?.trim()}
                          onClick={() => handleReject(sub.userId)}
                          className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-4 py-2 rounded-lg text-xs flex items-center space-x-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Confirmar Rejeição</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* RENDER ACTIVE TAB: CARDS MANAGER WORKSPACE */}
      {activeSubTab === 'cards' && (
        <div className="space-y-6">
          {/* Card creation and edit Form Section */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-4 border-slate-100">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-brand-navy-900 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-brand-red-500 animate-pulse" />
                <span>{editingCardId ? '✏️ Editar Cartão de Inspiração' : '🌅 Criar Novo Cartão de Inspiração'}</span>
              </h3>
              {editingCardId && (
                <button
                  onClick={resetForm}
                  className="text-[10px] bg-slate-100 font-black uppercase tracking-wider px-3 py-1.5 border border-slate-200 rounded-full hover:bg-slate-200 text-slate-600 cursor-pointer min-h-[30px]"
                >
                  Cancelar Edição
                </button>
              )}
            </div>

            <form onSubmit={handleSaveCard} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Category selector */}
                <div className="space-y-1">
                  <label htmlFor="card-category" className="text-[10px] text-brand-navy-900 font-black uppercase tracking-widest pl-0.5 block">
                    Categoria do Cartão
                  </label>
                  <select
                    id="card-category"
                    value={cardCategory}
                    onChange={(e) => setCardCategory(e.target.value as any)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-brand-navy-800 bg-white font-bold min-h-[44px]"
                  >
                    <option value="Vocabulário">Vocabulário</option>
                    <option value="Erro Comum">Erro Comum (Wrong vs Right)</option>
                    <option value="Dica de Inglês">Dica de Inglês (Gramática/Frase)</option>
                  </select>
                </div>

                {/* 2. English words/Phrase input */}
                <div className="space-y-1">
                  <label htmlFor="card-en" className="text-[10px] text-brand-navy-900 font-black uppercase tracking-widest pl-0.5 block">
                    Conteúdo em Inglês
                  </label>
                  <input
                    id="card-en"
                    type="text"
                    required
                    placeholder="Ex: Stunning  OU  I have 20 years ❌ ➔ I am 20 years"
                    value={cardEnglishContent}
                    onChange={(e) => setCardEnglishContent(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-brand-navy-800 font-semibold min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 3. Translation/Explanation */}
                <div className="space-y-1">
                  <label htmlFor="card-pt" className="text-[10px] text-brand-navy-900 font-black uppercase tracking-widest pl-0.5 block">
                    Significado / Explicação (Português)
                  </label>
                  <input
                    id="card-pt"
                    type="text"
                    required
                    placeholder="Ex: Significa maravilhoso ou deslumbrante..."
                    value={cardPortugueseTranslation}
                    onChange={(e) => setCardPortugueseTranslation(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-brand-navy-800 font-semibold min-h-[44px]"
                  />
                </div>

                {/* 4. Phonetics pronunciation (optional helper) */}
                <div className="space-y-1">
                  <label htmlFor="card-phonetic" className="text-[10px] text-brand-navy-900 font-black uppercase tracking-widest pl-0.5 block">
                    Guia de Pronúncia Simples (Opcional)
                  </label>
                  <input
                    id="card-phonetic"
                    type="text"
                    placeholder="Ex: stâ-nin  OU  ai em tuenti i-ârz old"
                    value={cardPronunciation}
                    onChange={(e) => setCardPronunciation(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-brand-navy-800 font-semibold min-h-[44px]"
                  />
                </div>
              </div>

              {/* 5. Scenic Background Image selector */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[10px] text-brand-navy-900 font-black uppercase tracking-widest pl-0.5 block">
                  Selecione a Imagem de Fundo Cénica
                </span>

                {/* File Upload action */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="md:col-span-2 space-y-1">
                    <label className="flex items-center justify-center space-x-2 border-2 border-dashed border-slate-200 hover:border-brand-red-500 rounded-2xl p-4 bg-slate-50 hover:bg-slate-100/60 cursor-pointer min-h-[85px] transition-all">
                      {uploadingImage ? (
                        <div className="flex flex-col items-center justify-center space-y-1 text-xs font-bold text-slate-500">
                          <Loader2 className="w-5 h-5 animate-spin text-brand-red-500" />
                          <span>Enviando imagem para Cloud Storage...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center space-y-1 text-center text-xs font-semibold text-slate-600">
                          <Upload className="w-5 h-5 text-brand-red-500" />
                          <p>Carregar imagem do meu Computador/Móvel</p>
                          <p className="text-[10px] text-slate-400">Suporta JPG/PNG, máx 4MB (otimizado)</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Image Custom URL or preview thumbnail */}
                  <div className="space-y-1">
                    <label htmlFor="card-image-url" className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">
                      Ou introduza URL personalizado da Imagem:
                    </label>
                    <input
                      id="card-image-url"
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={cardImageUrl}
                      onChange={(e) => setCardImageUrl(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-brand-navy-800 font-semibold min-h-[44px]"
                    />
                    {cardImageUrl && (
                      <div className="flex items-center space-x-1 pl-1 mt-1 text-[10px] text-brand-red-650 font-bold">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Link de imagem configurado!</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Presets Grid */}
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider pl-0.5 block">
                    Ou selecione um Preset de Belezas Cénicas de alta qualidade:
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {SCENIC_PRESETS.map((preset) => {
                      const isSelected = cardImageUrl === preset.url;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setCardImageUrl(preset.url)}
                          className={`relative aspect-[16/10] rounded-xl overflow-hidden cursor-pointer border-2 transition-all shadow-sm ${
                            isSelected ? 'border-brand-red-500 scale-102 ring-2 ring-brand-red-100' : 'border-transparent opacity-75 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-end p-1">
                            <span className="text-[7.5px] font-black text-white leading-none tracking-tighter truncate w-full">{preset.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Save button with loader */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="bg-brand-navy-850 hover:bg-brand-navy-950 text-brand-gold-400 hover:border-brand-gold-400 border border-transparent font-black text-xs tracking-wider uppercase py-3.5 px-6 rounded-2xl transition-all cursor-pointer shadow-md min-h-[44px] flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4 stroke-[2.5px] text-brand-red-500" />
                  <span>{editingCardId ? 'Salvar Alterações' : 'Adicionar Cartão ao Club'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Seed falldowns if empty database */}
          {cards.length === 0 && !loadingCards && (
            <div className="bg-brand-red-50/60 border border-brand-red-250 p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-extrabold text-sm text-brand-red-900">A sua coleção Firestore está vazia!</h4>
                <p className="text-xs text-brand-red-800 leading-relaxed max-w-lg">
                  Deseja acelerar o seu English Club carregando os 6 cartões de alta qualidade com belas imagens de praias, montanhas e florestas e dicas fantásticas?
                </p>
              </div>
              <button
                onClick={handleSeedCollection}
                className="bg-brand-red-600 hover:bg-brand-red-700 text-[#ffffff] font-extrabold border border-transparent py-2.5 px-5 rounded-2xl text-xs transition-all flex items-center space-x-1 shrink-0"
              >
                <Sparkles className="w-4 h-4 text-brand-gold-300" />
                <span>Instalar 6 Cartões Padrão</span>
              </button>
            </div>
          )}

          {/* Cards List for editing or deleting */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-4 border-slate-100">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-brand-navy-900 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-brand-navy-750" />
                <span>Lista de Cartões Publicados ({cards.length})</span>
              </h3>
              <button
                onClick={loadCards}
                disabled={loadingCards}
                className="p-1.5 text-slate-500 hover:text-brand-navy-900 rounded-lg flex items-center justify-center border border-slate-150"
                title="Recarregar cartões"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingCards ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {loadingCards ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-brand-navy-800" />
                <p className="text-xs text-slate-450 mt-2">Carregando cartões de inspiração...</p>
              </div>
            ) : cards.length === 0 ? (
              <p className="text-xs text-center text-slate-450 py-8 italic font-semibold">Tabela vazia. Adicione os primeiros cartões cénicos acima ou ative as predefinições!</p>
            ) : (
              <div className="overflow-x-auto scrollbar-none rounded-2xl border border-slate-200 bg-slate-50">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-200/80 text-[10px] text-brand-navy-950 font-black uppercase border-b border-slate-220">
                      <th className="p-3">Miniatura</th>
                      <th className="p-3">Categoria</th>
                      <th className="p-3">Conteúdo Inglês / Guia</th>
                      <th className="p-3">Tradução Português</th>
                      <th className="p-3">Data</th>
                      <th className="p-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {cards.map((card) => {
                      const isPreset = card.cardId.startsWith('preset_');
                      return (
                        <tr key={card.cardId} className="hover:bg-white transition-colors">
                          <td className="p-3">
                            <div className="w-12 h-16 rounded-lg overflow-hidden border border-slate-300 shadow-sm relative">
                              <img
                                src={card.imageUrl}
                                alt="preview"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800';
                                }}
                              />
                            </div>
                          </td>
                          <td className="p-3 font-extrabold uppercase text-[9px] tracking-wide text-brand-navy-800">
                            {card.category}
                          </td>
                          <td className="p-3 font-black space-y-0.5 max-w-xs truncate">
                            <p className="text-slate-900 truncate">{card.englishContent}</p>
                            {card.pronunciation && (
                              <p className="text-[10px] text-brand-gold-600 font-mono italic">Pronúncia: &ldquo;{card.pronunciation}&rdquo;</p>
                            )}
                          </td>
                          <td className="p-3 text-[#334155] font-semibold max-w-xs truncate">
                            {card.portugueseTranslation}
                          </td>
                          <td className="p-3 text-slate-400 font-semibold">
                            {isPreset ? 'Padrão' : formatDate(card.createdAt)}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              {/* Edit triggers loading card values to form */}
                              <button
                                onClick={() => handleEditInitiate(card)}
                                className="p-2 text-brand-navy-800 hover:text-brand-navy-950 hover:bg-slate-205 rounded-xl border border-slate-200 flex items-center justify-center cursor-pointer bg-white"
                                title="Editar"
                              >
                                <Edit className="w-3.5 h-3.5 text-brand-navy-700" />
                              </button>

                              {/* Delete trigger */}
                              <button
                                onClick={() => handleDeleteCard(card.cardId)}
                                className="p-2 text-rose-50 border border-slate-200 hover:border-rose-350 bg-white hover:bg-rose-50 rounded-xl flex items-center justify-center cursor-pointer"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RENDER ACTIVE TAB: BRANDING WORKSPACE */}
      {activeSubTab === 'branding' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b pb-4 border-slate-100">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-brand-navy-900 flex items-center space-x-2">
              <ImageIcon className="w-5 h-5 text-brand-red-500" />
              <span>Logótipo Oficial do Sabush English Club</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">Carregue ou atualize a identidade visual oficial da escola. Todos os ecrãs sincronizarão em tempo real.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Live Visualizer Board */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center space-y-4">
              <span className="text-[10px] text-brand-navy-900 font-black uppercase tracking-widest block">Pré-visualização em Tempo Real</span>
              
              <div className="bg-brand-navy-900 p-6 rounded-2xl border-2 border-brand-red-650 flex items-center justify-center shadow-lg w-full max-w-[280px]">
                <SabushLogo size="md" onDark={true} />
              </div>
              
              <p className="text-[10px] text-slate-400 font-bold text-center max-w-xs">
                Esta é a aparência real do logótipo na barra de navegação superior, no ecrã de onboarding e nos certificados académicos.
              </p>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div className="space-y-4">
              <span className="text-[10px] text-brand-navy-900 font-black uppercase tracking-widest block">Carregamento do Novo Ficheiro</span>

              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all min-h-[220px] ${
                  dragActive 
                    ? 'border-brand-red-500 bg-brand-red-50/20 scale-[1.01]' 
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-brand-navy-500'
                }`}
              >
                {uploadingLogo ? (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-red-500" />
                    <div className="space-y-1">
                      <p className="text-xs font-black text-brand-navy-900">Enviando novo logótipo...</p>
                      <p className="text-[10px] text-slate-450">Processando e publicando no Cloud Storage</p>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center space-y-3 h-full w-full justify-center">
                    <div className="p-3 bg-red-50 text-brand-red-500 rounded-full">
                      <Upload className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-brand-navy-900">
                        {dragActive ? 'Largue a imagem aqui' : 'Arraste e solte o logótipo aqui'}
                      </p>
                      <p className="text-[11px] text-slate-500 font-semibold flex items-center space-x-1">
                        <span>ou clique para procurar no seu dispositivo</span>
                      </p>
                      <p className="text-[10px] text-slate-400 pt-1">
                        Recomendado: Banner retangular (JPG/PNG, máx 4MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileSelect}
                      disabled={uploadingLogo}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Reset to standard default logo action */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm('Deseja repor o logótipo padrão de fábrica da Sabush?')) {
                      setUploadingLogo(true);
                      setSuccessInfo('');
                      setErrorInfo('');
                      try {
                        await saveClubLogo('');
                        setSuccessInfo('Logótipo reposto com sucesso para o padrão do Club.');
                      } catch (e) {
                        setErrorInfo('Erro ao repor o logótipo original.');
                      } finally {
                        setUploadingLogo(false);
                      }
                    }
                  }}
                  disabled={uploadingLogo}
                  className="text-xs font-extrabold text-slate-500 hover:text-brand-red-600 transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <span>Restaurar Padrão de Fábrica</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mascot Section */}
          <div className="border-t border-slate-100 pt-6 mt-6">
            <div className="border-b pb-4 border-slate-100 mb-6">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-brand-navy-900 flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-brand-red-500" />
                <span>Mascotes do Club por Expressão / Club Mascot Expressions</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">Carregue ou atualize as imagens da mascote para cada estado/expressão. Todos os ecrãs sincronizarão em tempo real.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(['standard', 'happy', 'thinking', 'talking'] as const).map((expr) => {
                const labelMap = {
                  standard: { title: 'Padrão / Standard', desc: 'Postura neutra amigável' },
                  happy: { title: 'Feliz / Happy', desc: 'Finais de aula e conquistas' },
                  thinking: { title: 'Pensativo / Thinking', desc: 'Explicações e dicas úteis' },
                  talking: { title: 'Falando / Talking', desc: 'Tutor de Voz e Diálogos' }
                };
                const info = labelMap[expr];
                const isUploading = uploadingMascot[expr];
                const isActive = dragMascotActive[expr];

                return (
                  <div key={expr} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between space-y-4">
                    {/* Header */}
                    <div>
                      <h4 className="font-bold text-xs text-brand-navy-900 uppercase tracking-wide">{info.title}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{info.desc}</p>
                    </div>

                    {/* Preview Area */}
                    <div className="bg-white p-3 rounded-xl border border-slate-150 flex items-center justify-center shadow-inner h-28">
                      <Mascot expression={expr} size="lg" />
                    </div>

                    {/* Upload Drag & Drop Slot */}
                    <div
                      onDragEnter={(e) => handleMascotDrag(e, expr)}
                      onDragOver={(e) => handleMascotDrag(e, expr)}
                      onDragLeave={(e) => handleMascotDrag(e, expr)}
                      onDrop={(e) => handleMascotDrop(e, expr)}
                      className={`relative border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all min-h-[110px] ${
                        isActive 
                          ? 'border-brand-red-500 bg-brand-red-50/20 scale-[1.01]' 
                          : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-brand-navy-500'
                      }`}
                    >
                      {isUploading ? (
                        <div className="flex flex-col items-center justify-center space-y-1.5">
                          <Loader2 className="w-5 h-5 animate-spin text-brand-red-500" />
                          <p className="text-[9px] font-black text-brand-navy-900">Enviando...</p>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center space-y-1 h-full w-full justify-center">
                          <div className="p-1.5 bg-red-50 text-brand-red-500 rounded-full">
                            <Upload className="w-4 h-4 stroke-[2.5]" />
                          </div>
                          <p className="text-[9px] font-black text-brand-navy-900">
                            {isActive ? 'Largue a imagem' : 'Arraste ou clique'}
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleMascotFileSelect(e, expr)}
                            disabled={isUploading}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* Action button */}
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={async () => {
                          if (window.confirm(`Deseja repor a mascote "${info.title}" para o padrão?`)) {
                            setUploadingMascot(prev => ({ ...prev, [expr]: true }));
                            setSuccessInfo('');
                            setErrorInfo('');
                            try {
                              await saveMascotImage(expr, '');
                              setSuccessInfo(`Mascote (${expr}) reposta com sucesso para o padrão do Club.`);
                            } catch (e) {
                              setErrorInfo(`Erro ao repor a mascote (${expr}).`);
                            } finally {
                              setUploadingMascot(prev => ({ ...prev, [expr]: false }));
                            }
                          }
                        }}
                        disabled={isUploading}
                        className="text-[10px] font-bold text-slate-400 hover:text-brand-red-600 transition-colors flex items-center space-x-1"
                      >
                        <span>Repor Padrão</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Lesson Background Images Section */}
          <div className="border-t border-slate-100 pt-6 mt-6">
            <div className="border-b pb-4 border-slate-100 mb-6">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-brand-navy-900 flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-brand-red-500" />
                <span>Imagens de Fundo das Lições / Lesson Background Images</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">Carregue ou atualize imagens de fundo (Hero Header) personalizadas para lições específicas do Sabush English Club.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left Column: Selector & Action Panel */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                <span className="text-[10px] text-brand-navy-900 font-black uppercase tracking-widest block">Configurar Imagem</span>
                
                {/* Lesson Selection dropdown */}
                <div className="space-y-1.5">
                  <label htmlFor="lesson_select" className="text-xs font-bold text-slate-700">Selecione a Lição:</label>
                  <select
                    id="lesson_select"
                    value={selectedLessonId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedLessonId(id);
                      setLessonUrlInput(lessonImages[id] || '');
                    }}
                    className="w-full text-xs rounded-xl border border-slate-300 bg-white p-2.5 font-semibold text-slate-800 outline-none focus:border-brand-navy-500 cursor-pointer"
                  >
                    <option value="">-- Selecione uma Lição --</option>
                    {LESSONS.map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>
                        {lesson.id.toUpperCase()} - {lesson.titlePt} ({lesson.title})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedLessonId && (
                  <div className="space-y-4 pt-2 border-t border-slate-200 animate-fade-in">
                    {/* Method 1: File Upload */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-brand-navy-900 font-black uppercase tracking-widest block">Opção A: Carregar Ficheiro</span>
                      
                      <div className="relative border border-dashed rounded-xl p-4 bg-white hover:bg-slate-50 transition-all flex flex-col items-center justify-center text-center">
                        {uploadingLessonImg ? (
                          <div className="flex flex-col items-center justify-center space-y-1">
                            <Loader2 className="w-5 h-5 animate-spin text-brand-red-500" />
                            <p className="text-[9px] font-black text-brand-navy-900">A carregar...</p>
                          </div>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center space-y-1 h-full w-full justify-center">
                            <Upload className="w-5 h-5 text-brand-red-500 stroke-[2.5]" />
                            <p className="text-[10px] font-black text-brand-navy-900">Clique para carregar</p>
                            <p className="text-[8px] text-slate-400">JPG/PNG, máx 4MB</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLessonImageUpload}
                              disabled={uploadingLessonImg}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Method 2: Custom URL Input */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-brand-navy-900 font-black uppercase tracking-widest block">Opção B: URL da Imagem (ex: Unsplash)</span>
                      
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Insira o URL da imagem..."
                          value={lessonUrlInput}
                          onChange={(e) => setLessonUrlInput(e.target.value)}
                          className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white outline-none focus:border-brand-navy-500 text-slate-800 font-semibold"
                        />
                        <button
                          type="button"
                          onClick={handleSaveLessonUrl}
                          disabled={uploadingLessonImg}
                          className="bg-brand-navy-900 text-white px-3 py-2 rounded-xl text-xs font-black hover:bg-brand-navy-950 transition-all cursor-pointer"
                        >
                          Salvar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Columns: Active Custom Images List */}
              <div className="lg:col-span-2 bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                <span className="text-[10px] text-brand-navy-900 font-black uppercase tracking-widest block">Imagens Personalizadas Ativas ({Object.keys(lessonImages).filter(k => lessonImages[k]).length})</span>
                
                <div className="max-h-[340px] overflow-y-auto space-y-3 pr-1">
                  {Object.keys(lessonImages).filter(k => lessonImages[k]).length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs font-semibold">
                      Nenhuma imagem personalizada configurada. Todas as lições estão a usar o padrão geométrico ou Unsplash estático.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.keys(lessonImages).filter(k => lessonImages[k]).map((lessonId) => {
                        const lessonObj = LESSONS.find(l => l.id === lessonId);
                        const imgUrl = lessonImages[lessonId];
                        return (
                          <div key={lessonId} className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between space-y-2 relative overflow-hidden group shadow-sm">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-[9px] font-black uppercase tracking-wider bg-slate-100 text-brand-navy-900 px-2 py-0.5 rounded-md border border-slate-200">{lessonId.toUpperCase()}</span>
                                <h4 className="font-bold text-xs text-brand-navy-900 truncate max-w-[150px] mt-1">{lessonObj?.titlePt || 'Lição Desconhecida'}</h4>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleResetLessonImage(lessonId)}
                                className="text-slate-400 hover:text-brand-red-600 transition-colors p-1 rounded-lg hover:bg-red-50"
                                title="Repor Padrão"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="h-20 rounded-lg overflow-hidden border border-slate-150 relative">
                              <img src={imgUrl} alt={lessonId} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
