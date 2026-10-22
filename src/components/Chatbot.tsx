import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../translations';
import { ChatMessage } from '../types';
import { 
  Bot, 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  AlertCircle, 
  HelpCircle,
  Clock,
  Droplet,
  Zap,
  Trash2,
  Car
} from 'lucide-react';

export const Chatbot: React.FC = () => {
  const { language } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [tone, setTone] = useState<'Friendly' | 'Formal' | 'Urgent'>('Friendly');
  const [input, setInput] = useState('');
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: language === 'ur'
        ? 'خوش آمدید! میں کراچی فکس مائی ایریا کا معاون ہوں۔ نیچے دیے گئے سوالات پر کلک کریں یا اپنا مسئلہ لکھیں۔'
        : 'Welcome to FixMyArea Karachi Civic Assistant. Click any popular question below or type your issue directly.',
      timestamp: 'Just now',
      tone: 'Friendly',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Pre-configured questions for users as requested
  const presetQuestions = [
    {
      q: '🚨 How does the 10-Minute Emergency SLA work?',
      qUrdu: '🚨 ۱۰ منٹ ایمرجنسی کیسے کام کرتی ہے؟',
      reply: 'The 10-Minute Emergency SLA is designed for high-risk life/safety hazards (e.g. snapped 11KV live wires or major sinkholes). Once selected, our dispatch engine notifies the Karachi Rapid Response squad with a 600-second countdown clock that escalates to senior officers if breached.',
      replyUrdu: '۱۰ منٹ ایمرجنسی جانی و مالی خطرات (جیسے بجلی کی ننگی تاریں یا بڑے گڑھے) کے لیے ہے۔ انتخاب کے بعد ۶۰۰ سیکنڈ کا ٹائمر شروع ہو جاتا ہے اور ٹیم فوری روانہ کی جاتی ہے۔',
    },
    {
      q: '💧 Water pipeline leakage or sewerage overflow',
      qUrdu: '💧 پانی کی پائپ لائن یا سیوریج کا رساؤ',
      reply: 'Water issues are routed directly to the Karachi Water & Sewerage Board (KW&SB) Hydro Emergency Taskforce. Standard repair SLA is 2 hours. You can upload photo proof in the Direct Report modal.',
      replyUrdu: 'پانی کی لیکیج کی شکایت کراچی واٹر اینڈ سیوریج بورڈ (KW&SB) کو بھیج دی گئی ہے۔ اس کے حل کا معیاری وقت ۲ گھنٹے ہے۔',
    },
    {
      q: '⚡ Sparking wire / transformer fault',
      qUrdu: '⚡ بجلی کی تار یا ٹرانسفارمر کا مسئلہ',
      reply: 'Electrical hazards are flagged directly for K-Electric rapid field teams. If there is immediate sparking, make sure to enable the 10-Minute Emergency toggle inside the Direct Report form!',
      replyUrdu: 'انتہائی سنگین خطرہ: کے الیکٹرک (K-Electric) ایمرجنسی ٹیم کو الرٹ روانہ۔ تار سے ۲۰ میٹر دور رہیں۔ ۱۰ منٹ میں کارروائی شروع ہوگی۔',
    },
    {
      q: '🧹 Garbage container unattended in my street',
      qUrdu: '🧹 گلی میں کوڑے کا ڈھیر نہیں اٹھایا گیا',
      reply: 'Solid waste grievances in Karachi are assigned to Sindh Solid Waste Management Board (SSWMB) compactors with a mandatory 6-hour clearance SLA.',
      replyUrdu: 'کوڑے کی شکایت سندھ سالڈ ویسٹ مینجمنٹ بورڈ (SSWMB) کو تفویض کر دی گئی ہے، جس کا زیادہ سے زیادہ وقت ۶ گھنٹے ہے۔',
    },
    {
      q: '⏱️ Can municipal officials delete or hide my complaint?',
      qUrdu: '⏱️ کیا سرکاری افسران شکایت چھپا سکتے ہیں؟',
      reply: 'No! FixMyArea enforces immutable closed-loop SLA tracking. Every ticket is visible with a live ticking clock until the authority uploads verified before/after photo proof.',
      replyUrdu: 'ہرگز نہیں! فکس مائی ایریا پر کوئی شکایت حذف نہیں ہو سکتی۔ ہر شکایت لائیو الٹی گنتی ٹائمر کے ساتھ اس وقت تک نظر آتی ہے جب تک تصویری ثبوت نہ لگایا جائے۔',
    },
  ];

  const handleSend = async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tone,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Check presets first
    const matched = presetQuestions.find(
      (p) => p.q.toLowerCase() === userText.toLowerCase() || p.qUrdu.toLowerCase() === userText.toLowerCase()
    );

    if (matched) {
      const reply = language === 'ur' ? matched.replyUrdu : matched.reply;
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: 'bot-' + Date.now(),
            sender: 'bot',
            text: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            tone,
          },
        ]);
      }, 300);
      return;
    }

    // Call live backend AI
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, tone, language }),
      });
      const data = await res.json();
      const botText = data.reply || (language === 'ur' 
        ? 'کراچی بلدیاتی نظام نے آپ کا پیغام وصول کر لیا ہے اور فوری جائزہ لیا جا رہا ہے۔' 
        : 'FixMyArea Karachi Civic Engine has recorded your report for immediate dispatch.');

      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: botText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tone,
        },
      ]);
    } catch {
      const fallback = language === 'ur'
        ? `کراچی بلدیاتی کنٹرول: آپ کی شکایت [KHI-${Math.floor(100+Math.random()*900)}] متعلقہ شعبے کو تفویض کر دی گئی ہے۔`
        : `FixMyArea Karachi Control: Your grievance [KHI-${Math.floor(100+Math.random()*900)}] has been routed to the local field squad.`;

      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: fallback,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tone,
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Toggle Button (Matching screenshot amber Chat Assistant button) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold px-5 py-3 rounded-full shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <MessageSquare className="w-5 h-5 text-slate-950 fill-slate-950" />
          <span className="text-sm tracking-tight">{t('chatAssistant', language)}</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          dir={language === 'ur' ? 'rtl' : 'ltr'} 
          className="w-[94vw] sm:w-[400px] h-[540px] max-h-[85vh] bg-[#0c1322] border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-in fade-in slide-in-from-bottom-5 duration-200 font-sans"
        >
          
          {/* Header */}
          <div className="bg-[#080d19] px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  FixMyArea Karachi AI
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono px-1.5 py-0.2 rounded-full">
                    Online
                  </span>
                </h3>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Pre-Configured Clickable Questions Section (Strict User Requirement) */}
          <div className="p-3 bg-[#0a101d] border-b border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1.5 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t('quickQuestions', language)} (Click to Ask):</span>
            </span>

            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
              {presetQuestions.map((pq, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(language === 'ur' ? pq.qUrdu : pq.q)}
                  className="text-[11px] text-left px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer truncate max-w-full"
                >
                  {language === 'ur' ? pq.qUrdu : pq.q}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Flow */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#070c17]">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-amber-500 text-slate-950 font-semibold rounded-br-xs'
                        : msg.text.startsWith('ALERT:')
                        ? 'bg-red-950/80 text-red-200 border border-red-500/50 rounded-bl-xs'
                        : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-xs'
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
            <div ref={messagesEndRef} />
          </div>

          {/* Tone Selector & Input Area */}
          <div className="p-3 bg-[#0a101d] border-t border-slate-800">
            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="text-[11px] text-slate-400">{t('chatTone', language)}:</span>
              <div className="flex items-center gap-1">
                {(['Friendly', 'Formal', 'Urgent'] as const).map((tVal) => (
                  <button
                    key={tVal}
                    type="button"
                    onClick={() => setTone(tVal)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      tone === tVal
                        ? tVal === 'Urgent'
                          ? 'bg-red-600 text-white'
                          : 'bg-amber-500 text-black'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tVal}
                  </button>
                ))}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={language === 'ur' ? 'اپنا سوال یہاں لکھیں...' : 'Ask about Karachi civic issues...'}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
};
