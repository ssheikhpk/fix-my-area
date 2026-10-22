import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../translations';
import { Lightbulb, X, Send, Sparkles, CheckCircle2 } from 'lucide-react';

export const FeedbackModal: React.FC = () => {
  const { isFeedbackModalOpen, setIsFeedbackModalOpen, submitFeedback, language } = useApp();
  const [feedbackText, setFeedbackText] = useState('');
  const [category, setCategory] = useState('Service Quality');
  const [showLocalSuccessAlert, setShowLocalSuccessAlert] = useState(false);

  if (!isFeedbackModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    submitFeedback(`[${category}] ${feedbackText}`);
    setShowLocalSuccessAlert(true);

    setTimeout(() => {
      setShowLocalSuccessAlert(false);
      setIsFeedbackModalOpen(false);
      setFeedbackText('');
    }, 1500);
  };

  return (
    <div 
      dir={language === 'ur' ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white fill-white/60" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                {t('feedbackTitle', language)}
              </h2>
              <p className="text-xs text-amber-100">
                {language === 'ur' ? 'شہر کو بہتر بنانے کے لیے اپنی تجویز پیش کریں' : 'Civic suggestion & citizen improvement box'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFeedbackModalOpen(false)}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {showLocalSuccessAlert ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              {language === 'ur' ? 'رائے موصول ہو گئی!' : 'Feedback Submitted!'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('feedbackSuccess', language)}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('feedbackDesc', language)}
            </p>

            {/* Quick topics */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'Speed', label: language === 'ur' ? 'کارروائی کی رفتار' : 'Speed of Response' },
                { id: 'Sanitation', label: language === 'ur' ? 'صفائی کا معیار' : 'Sanitation Quality' },
                { id: 'App', label: language === 'ur' ? 'ایپ کا تجربہ' : 'Mobile Experience' },
                { id: 'Other', label: language === 'ur' ? 'دیگر تجاویز' : 'Other' },
              ].map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setCategory(topic.label)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                    category === topic.label
                      ? 'bg-amber-100 border-amber-300 text-amber-800 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {topic.label}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <div>
              <textarea
                rows={4}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={t('feedbackPlaceholder', language)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50 resize-none transition-all"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsFeedbackModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                {t('cancel', language)}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('submit', language)}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
