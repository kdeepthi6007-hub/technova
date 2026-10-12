// Module: AI Farm Assistant Chat Interface (Bilingual English / Tamil with Live Application Grounding & Online Gemini)

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck, 
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { getAiFarmAdvice, AiDataContext } from '../services/aiService';
import { ChatMessage } from '../types';

interface AiAssistantPageProps {
  onNavigate: (page: string) => void;
}

export const AiAssistantPage: React.FC<AiAssistantPageProps> = ({ onNavigate }) => {
  const { 
    currentUser, 
    transactions, 
    budgets, 
    loanOffers, 
    crops, 
    cropOffers, 
    equipment 
  } = useApp();
  
  const { language, setLanguage } = useLanguage();

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUserPrompt, setLastUserPrompt] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const farmerName = currentUser?.name || 'Farmer';
  const initialGreeting = language === 'ta'
    ? `வணக்கம் ${farmerName}! நான் உங்கள் Farm2Pay AI வேளாண் நிதி உதவியாளர்.\n\nஉங்கள் விளைபொருள் விலை வாய்ப்புகள், உழவு இயந்திர வாடகை, பண்ணை வரவு-செலவு மற்றும் வங்கிக் கடன்களை ஒப்பிட்டு எளிய தமிழில் உதவ நான் தயார்.`
    : `Hello ${farmerName}! I am your Farm2Pay AI Assistant.\n\nI analyze your live farm data to compare crop buyer bids, optimize machinery rental expenses, audit seasonal budgets, and uncover hidden loan fees.`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      content: initialGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTamil: language === 'ta',
      isFallback: true,
      fallbackReason: 'Initial system welcome message',
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const suggestedPrompts = language === 'ta' ? [
    'எந்த கடன் மொத்தத்தில் செலவு குறைவு?',
    'என் விளைபொருள் கொள்முதல் விலைகளை ஒப்பிடு',
    'என் நடப்பு பண்ணை லாபம் எவ்வளவு?',
    'முக்கிய கடன் சொற்களை தமிழில் விளக்கு',
    'கடன் வாங்கினால் என் கைக்கு வரும் நிகரத் தொகை எவ்வளவு?',
  ] : [
    'Which loan costs less overall?',
    'Compare my crop buyer offers by net proceeds',
    'What is my current net farm profit?',
    'How much money will I actually receive from the loan?',
    'Explain these loan terms in Tamil',
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    setLastUserPrompt(textToSend);

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    if (!queryText) setInputQuery('');
    setIsLoading(true);

    const dataContext: AiDataContext = {
      transactions,
      budgets,
      loanOffers,
      crops,
      cropOffers,
      equipment,
      userName: currentUser?.name || 'Farmer',
      language: language as any,
    };

    try {
      const response = await getAiFarmAdvice(textToSend, dataContext);

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        content: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: response.suggestedActions,
        isTamil: language === 'ta',
        isOnlineGemini: response.isOnlineGemini,
        modelName: response.modelName,
        isFallback: response.isRuleBasedDemo,
        fallbackReason: response.fallbackReason,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          content: language === 'ta'
            ? 'மன்னிக்கவும், பதிலை உருவாக்குவதில் சிரமம் ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.'
            : 'Sorry, I encountered an issue processing your request. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isFallback: true,
          fallbackReason: 'Network error during request',
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (actionId: string) => {
    if (actionId === 'nav_loans') onNavigate('loan-comparison');
    else if (actionId === 'nav_crops') onNavigate('crop-marketplace');
    else if (actionId === 'nav_expenses') onNavigate('expense-tracker');
    else if (actionId === 'q_cheapest_loan') handleSend('Which loan costs less overall?');
    else if (actionId === 'q_net_profit') handleSend('What is my current net farm profit?');
    else if (actionId === 'q_compare_offers') handleSend('Compare my crop buyer offers by net proceeds');
  };

  return (
    <div className="space-y-4 pb-12 h-[calc(100vh-7rem)] flex flex-col">
      
      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-farm-800 to-farm-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900">
                AI Farm Financial Assistant
              </h1>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Gemini + Data Grounded
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Answers grounded in your live crop prices, loan EMIs, and expenses. Bilingual in EN & TA.
            </p>
          </div>
        </div>

        {/* Quick Language Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              language === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('ta')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              language === 'ta' ? 'bg-white text-farm-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            தமிழ்
          </button>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-6 overflow-y-auto space-y-4 flex flex-col">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs ${
                  isUser
                    ? 'bg-slate-900 text-white'
                    : 'bg-farm-700 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-emerald-200" />}
              </div>

              {/* Message Bubble */}
              <div>
                {/* Provenance Badge for Assistant Messages */}
                {!isUser && (
                  <div className="mb-1.5 flex items-center gap-1.5 flex-wrap">
                    {msg.isOnlineGemini ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        ✨ Powered by Google {msg.modelName || 'Gemini 2.5 Flash'} (Online)
                      </span>
                    ) : (
                      <span 
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs"
                        title={msg.fallbackReason || 'Operating in deterministic offline mode'}
                      >
                        <ShieldCheck className="w-3 h-3 text-amber-600" />
                        ⚡ Grounded Rule-Based Engine (Offline Fallback)
                      </span>
                    )}
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-xs'
                      : 'bg-cream-50/90 text-slate-800 border border-cream-200/80 rounded-tl-xs shadow-2xs'
                  }`}
                >
                  <div className="whitespace-pre-line font-normal">{msg.content}</div>

                  {/* Suggested Actions within Bot Message */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-wrap gap-2">
                      {msg.suggestedActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleActionClick(action.actionId)}
                          className="px-3 py-1.5 bg-white hover:bg-farm-50 text-farm-800 text-xs font-bold rounded-xl border border-farm-300 shadow-2xs transition-colors flex items-center gap-1"
                        >
                          <span>{action.label}</span>
                          <ArrowRight className="w-3 h-3 text-farm-600" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  className={`text-[10px] text-slate-400 mt-1 font-medium ${
                    isUser ? 'text-right' : 'text-left'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 mr-auto items-center">
            <div className="w-8 h-8 rounded-xl bg-farm-700 text-white flex items-center justify-center">
              <Bot className="w-4 h-4 text-emerald-200" />
            </div>
            <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200 text-xs text-slate-600 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-farm-600" />
              <span>Analyzing live farm data & querying Google Gemini...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Suggested:
        </span>
        {suggestedPrompts.map((prompt, i) => (
          <button
            key={i}
            disabled={isLoading}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 bg-white hover:bg-farm-50 disabled:opacity-50 text-slate-700 hover:text-farm-800 rounded-xl text-xs font-semibold border border-slate-200 hover:border-farm-300 transition-colors whitespace-nowrap shadow-2xs shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputQuery}
          disabled={isLoading}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={
            isLoading
              ? 'Waiting for Gemini response...'
              : language === 'ta'
              ? 'விளைபொருள் விலை, டிராக்டர் வாடகை அல்லது கடன் பற்றி கேளுங்கள்...'
              : 'Ask about crop buyer bids, tractor rental costs, farm profit, or loans...'
          }
          className="flex-1 px-3 py-2 bg-transparent text-xs sm:text-sm text-slate-800 focus:outline-none placeholder:text-slate-400 disabled:opacity-50"
        />

        {lastUserPrompt && !isLoading && (
          <button
            type="button"
            title="Retry last query"
            onClick={() => handleSend(lastUserPrompt)}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="p-2.5 bg-farm-700 hover:bg-farm-800 disabled:bg-slate-200 text-white rounded-xl transition-all shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
