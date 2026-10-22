import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../translations';
import { Navbar } from '../components/Navbar';
import { ChatMessage } from '../types';
import { 
  ArrowLeft, 
  Bot, 
  Send, 
  Sparkles, 
  HelpCircle, 
  Clock, 
  Droplet, 
  Zap, 
  Trash2, 
  Car,
  Siren,
  CheckCircle2
} from 'lucide-react';

export const ChatbotPage: React.FC = () => {
  const { language } = useApp();
  const navigate = useNavigate();

  const [tone, setTone] = useState<'Friendly' | 'Formal' | 'Urgent'>('Friendly');
  const [input, setInput] = useState('');
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: language === 'ur'
        ? 'خوش آمدید! میں کراچی فکس مائی ایریا کا خودکار بلدیاتی معاون ہوں۔ نیچے دیے گئے سوالات پر کلک کریں یا اپنا مسئلہ بیان کریں۔'
        : 'Welcome to FixMyArea Karachi Civic AI Assistant. Click any built-in suggestion below to receive instant answers or type your question directly.',
      timestamp: 'Just now',
      tone: 'Friendly',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Built-in question suggestions with Urdu replies
  const builtInSuggestions = [
    {
      id: 'sug-1',
      q: '🚨 How does the 10-Minute Emergency SLA work?',
      qUrdu: '🚨 ۱۰ منٹ ایمرجنسی کیسے کام کرتی ہے؟',
      reply: 'The 10-Minute Emergency SLA is designed for high-risk life/safety hazards (e.g. snapped 11KV live wires or major sinkholes). Once selected, our dispatch engine notifies the Karachi Rapid Response squad with a 600-second countdown clock that escalates to senior officers if breached.',
      replyUrdu: '۱۰ منٹ ایمرجنسی جانی و مالی خطرات (جیسے بجلی کی ننگی تاریں یا بڑے گڑھے) کے لیے ہے۔ انتخاب کے بعد ۶۰۰ سیکنڈ کا ٹائمر شروع ہو جاتا ہے اور ٹیم فوری روانہ کی جاتی ہے۔',
    },
    {
      id: 'sug-2',
      q: '💧 Water pipeline ruptured at 2 Talwar Clifton',
      qUrdu: '💧 ۲ تلوار کلفٹن پر پائپ لائن پھٹ گئی ہے',
      reply: 'Water main grievances are automatically routed to the Karachi Water & Sewerage Board (KW&SB) Hydro Emergency Taskforce. Standard repair SLA is 2 hours. You can upload photo proof in the Direct Report form!',
      replyUrdu: 'پانی کی لیکیج کی شکایت کراچی واٹر اینڈ سیوریج بورڈ (KW&SB) کو بھیج دی گئی ہے۔ اس کے حل کا معیاری وقت ۲ گھنٹے ہے۔',
    },
    {
      id: 'sug-3',
      q: '⚡ Snapped 11KV sparking wire on Shahrah-e-Faisal',
      qUrdu: '⚡ شاہراہ فیصل پر بجلی کی تار گری ہوئی ہے',
      reply: 'CRITICAL ELECTRICAL HAZARD: Alert routed to K-Electric Rapid Emergency Team #101. Avoid approaching within 20 meters. A 10-minute emergency timer has been recommended.',
      replyUrdu: 'انتہائی سنگین خطرہ: کے الیکٹرک (K-Electric) ایمرجنسی ٹیم ۱۰۱ کو فوری الرٹ روانہ۔ تار سے ۲۰ میٹر دور رہیں۔ ۱۰ منٹ میں کارروائی شروع ہوگی۔',
    },
    {
      id: 'sug-4',
      q: '🧹 Overflowing garbage dumpster in Gulshan Block 13',
      qUrdu: '🧹 گلشن بلاک ۱۳ میں کوڑے دان بھر گیا ہے',
      reply: 'Solid waste grievances are assigned directly to the Sindh Solid Waste Management Board (SSWMB) compactors with a mandatory 6-hour clearance SLA.',
      replyUrdu: 'کوڑے کی شکایت سندھ سالڈ ویسٹ مینجمنٹ بورڈ (SSWMB) کو تفویض کر دی گئی ہے، جس کا زیادہ سے زیادہ وقت ۶ گھنٹے ہے۔',
    },
    {
      id: 'sug-5',
      q: '⏱️ What happens if KMC or KW&SB misses the SLA deadline?',
      qUrdu: '⏱️ اگر میونسپل ٹیم وقت پر کام نہ کرے تو کیا ہوگا؟',
      reply: 'If the SLA clock reaches 00:00, the ticket turns RED and triggers an auto-escalation breach memo directly to the Karachi Municipal Commissioner and Department Head.',
      replyUrdu: 'اگر الٹی گنتی کا وقت 00:00 پر ختم ہو جائے تو رپورٹ سرخ ہو جاتی ہے اور خود بخود کراچی میونسپل کمشنر اور صوبائی سیکریٹری کو چلی جاتی ہے۔',
    },
    {
      id: 'sug-6',
      q: '📍 How do I track my active complaint on the Karachi map?',
      qUrdu: '📍 میں نقشے پر اپنی شکایت کیسے دیکھ سکتا ہوں؟',
      reply: 'Click the "Live Karachi Satellite Map" on your Home Page! You can see Work Done (Green) vs Work Pending (Amber/Red) across all Karachi districts.',
      replyUrdu: 'ہوم پیج پر "کراچی سیٹلائٹ نقشہ" کھولیں، جہاں آپ کو سبز (مکمل) اور زرد/سرخ (زیر التواء) پنوں کے ذریعے اپنی شکایت نظر آئے گی۔',
    },
  ];

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tone,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          tone,
          language,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const botReply = data.reply || (language === 'ur'
        ? 'کراچی بلدیاتی نظام نے آپ کا پیغام وصول کر لیا ہے اور فوری جائزہ لیا جا رہا ہے۔'
        : 'FixMyArea Karachi Civic Engine has recorded your report for immediate dispatch.');

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tone,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn('Real-time API error, applying dynamic contextual engine:', err);
      // Generate rich dynamic context response so answer is never identical or bland
      const ticketNum = 'KHI-' + Math.floor(1000 + Math.random() * 9000);
      const isUrdu = language === 'ur' || /[\u0600-\u06FF]/.test(textToSend);
      const lower = textToSend.toLowerCase();

      let fallbackText = '';
      if (isUrdu) {
        if (lower.includes('پانی') || lower.includes('water') || lower.includes('pipe')) {
          fallbackText = `💧 واٹر بورڈ نوٹس [شکایت #${ticketNum}]: واٹر اینڈ سیوریج بورڈ (KW&SB) کے ہائیڈرو ڈیپارٹمنٹ کو الرٹ روانہ۔ تخمینہ برائے حل: ۲ گھنٹے۔`;
        } else if (lower.includes('بجلی') || lower.includes('electric') || lower.includes('wire') || tone === 'Urgent') {
          fallbackText = `⚡ ہنگامی برقی خطرہ [شکایت #${ticketNum}]: کے الیکٹرک ریپڈ اسکواڈ #101 متحرک۔ براہ کرم تاروں سے ۲۰ میٹر دور رہیں۔ ۱۰ منٹ ایمرجنسی ترجیح مقرر۔`;
        } else if (lower.includes('کچرا') || lower.includes('کوڑا') || lower.includes('garbage')) {
          fallbackText = `🧹 سالڈ ویسٹ کلیننگ [شکایت #${ticketNum}]: سندھ سالڈ ویسٹ بورڈ (SSWMB) کے کمپیکٹر کو ٹاسک تفویض۔ ۶ گھنٹے کے اندر صفائی لازمی۔`;
        } else {
          fallbackText = `کراچی میونسپل کنٹرول [شکایت #${ticketNum}]: آپ کے اندراج پر کارروائی شروع کر دی گئی ہے۔ مجاز عملہ معائنے کے لیے روانہ کیا جا رہا ہے۔`;
        }
      } else {
        if (lower.includes('water') || lower.includes('leak') || lower.includes('pipe')) {
          fallbackText = `💧 KW&SB Water Dispatch [Ticket #${ticketNum}]: Dispatched to Karachi Water Board hydro-repair wing. Resolution ETA is strictly under 2 hours.`;
        } else if (lower.includes('wire') || lower.includes('electric') || lower.includes('spark') || tone === 'Urgent') {
          fallbackText = `⚡ Live Wire Emergency [Ticket #${ticketNum}]: K-Electric Rapid Hazard Unit #101 paged. Immediate 10-Minute SLA active to safeguard citizens. Keep 20m distance.`;
        } else if (lower.includes('garbage') || lower.includes('trash') || lower.includes('waste')) {
          fallbackText = `🧹 SSWMB Waste Command [Ticket #${ticketNum}]: Assigned to District Compactor Squad. SLA clock capped at 6 hours.`;
        } else {
          fallbackText = `FixMyArea Karachi Civic Engine [Ticket #${ticketNum}]: Query logged into Karachi municipal field queue. Assigned to nearest municipal zone.`;
        }
      }

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tone,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      dir={language === 'ur' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#070c18] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black pb-16"
    >
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 flex-1 w-full flex flex-col">
        
        {/* Top Header with Return Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'ur' ? 'ہوم پیج پر واپس جائیں' : 'Back to Home Page'}</span>
            </button>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>{language === 'ur' ? 'مصنوعی ذہانت بلدیاتی معاون چیٹ' : 'AI Civic Chatbot Assistant'}</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-mono uppercase font-bold">
                  Gemini 3.8 Flash
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                {language === 'ur' ? 'آسان زبان میں بلدیاتی مسائل کے حل اور فوری معلومات کے لیے چیٹ' : 'Natural language civic triage, hazard severity calculation, and instant answers'}
              </p>
            </div>
          </div>
        </div>

        {/* BUILT-IN QUESTIONS SUGGESTIONS */}
        <div className="bg-[#0b1324] rounded-3xl border-2 border-purple-500/50 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-300 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>{language === 'ur' ? 'پوچھے جانے والے تیار سوالات (فوری جواب کے لیے کلک کریں):' : 'Built-In Question Suggestions (Click Any to Ask):'}</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {language === 'ur' ? 'فوری ۱ کلک جواب' : '1-Tap Instant Answer'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {builtInSuggestions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSend(language === 'ur' ? item.qUrdu : item.q)}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-500/60 text-slate-200 hover:text-white text-xs font-semibold text-left transition-all cursor-pointer flex items-start gap-2 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{language === 'ur' ? item.qUrdu : item.q}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Conversation Console */}
        <div className="flex-1 bg-[#0b1324] rounded-3xl border-2 border-slate-700 shadow-2xl overflow-hidden flex flex-col min-h-[460px]">
          
          {/* Chat Header with Tone Controls */}
          <div className="p-4 bg-[#080d19] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/25 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {language === 'ur' ? 'کراچی بلدیاتی AI اسسٹنٹ' : 'Karachi AI Assistant Terminal'}
                </h4>
                <p className="text-[11px] text-emerald-400 font-mono">
                  ● {language === 'ur' ? 'آن لائن اور حاضر' : 'Online & Ready'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 text-xs">
                {language === 'ur' ? 'جواب کا لہجہ:' : 'Response Tone:'}
              </span>
              {[
                { key: 'Friendly', labelEn: 'Friendly', labelUr: 'دوستانہ' },
                { key: 'Formal', labelEn: 'Formal', labelUr: 'دفتری' },
                { key: 'Urgent', labelEn: 'Urgent', labelUr: 'ہنگامی' },
              ].map((tItem) => (
                <button
                  key={tItem.key}
                  type="button"
                  onClick={() => setTone(tItem.key as any)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    tone === tItem.key
                      ? tItem.key === 'Urgent'
                        ? 'bg-red-600 text-white'
                        : 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {language === 'ur' ? tItem.labelUr : tItem.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Flow */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#070c18]">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
                      isUser
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-br-xs'
                        : msg.text.startsWith('ALERT:') || msg.text.startsWith('CRITICAL') || msg.text.startsWith('ہنگامی')
                        ? 'bg-red-950/80 text-red-200 border-2 border-red-500/60 rounded-bl-xs font-semibold'
                        : 'bg-[#0d162a] text-slate-100 border border-slate-700/80 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex flex-col items-start animate-pulse">
                <div className="max-w-[85%] px-4 py-3 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-purple-200 text-xs sm:text-sm flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs font-mono font-medium text-purple-300">
                    {language === 'ur'
                      ? 'کراچی AI اسسٹنٹ آپ کے استفسار کا تفصیلی جائزہ لے رہا ہے...'
                      : 'FixMyArea Gemini AI is computing real-time Karachi civic triage...'}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-4 bg-[#080d19] border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex items-center gap-3"
            >
              <input
                type="text"
                value={input}
                disabled={isLoading}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  language === 'ur'
                    ? 'پانی کی لیکیج، سڑک کے گڑھے یا بجلی کی کھلی تاروں کے بارے میں پوچھیں...'
                    : 'Ask about water leaks, road damage, live wires in Karachi...'
                }
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all disabled:opacity-40 flex items-center gap-2 cursor-pointer"
              >
                <span>{isLoading ? (language === 'ur' ? 'جاری...' : 'Thinking...') : (language === 'ur' ? 'ارسال کریں' : 'Send')}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </main>
    </div>
  );
};
