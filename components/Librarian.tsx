import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, ChatRole } from '../types';
import { sendMessageToLibrarian, initializeChat } from '../services/geminiService';
import { Sparkles, Send, Book, X } from 'lucide-react';

const Librarian: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: ChatRole.MODEL, text: "Greetings. I am the Librarian. Ask me of Uthvah's works.", timestamp: Date.now() }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      initializeChat();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: ChatRole.USER, text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendMessageToLibrarian(userMsg.text);
    
    setMessages(prev => [
      ...prev, 
      { role: ChatRole.MODEL, text: responseText, timestamp: Date.now() }
    ]);
    setIsLoading(false);
  };

  return (
    <div id="librarian" className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 bg-academy-ink border border-stone-700 px-6 py-4 rounded-full shadow-2xl hover:border-academy-gold transition-all hover:shadow-academy-gold/10"
        >
          <span className="font-serif text-academy-gold italic group-hover:text-academy-paper transition-colors">Consult the Librarian</span>
          <Sparkles className="w-5 h-5 text-academy-gold animate-pulse" />
        </button>
      )}

      {isOpen && (
        <div className="w-[350px] h-[500px] bg-academy-ink border border-stone-700 rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-stone-900/50 p-4 border-b border-stone-800 flex justify-between items-center backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Book className="w-4 h-4 text-academy-gold" />
              <span className="font-display text-academy-paper text-sm tracking-widest">THE ARCHIVES</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-stone-500 hover:text-stone-300 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-noise">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === ChatRole.USER ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-3 text-sm font-serif leading-relaxed rounded-sm ${
                    msg.role === ChatRole.USER 
                      ? 'bg-stone-800 text-stone-200 border border-stone-700' 
                      : 'bg-stone-900/50 text-academy-gold border-l-2 border-academy-gold'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="text-xs font-serif text-stone-600 italic animate-pulse">
                  Consulting the tomes...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-stone-900/80 border-t border-stone-800">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about my projects..."
                className="w-full bg-stone-950 border border-stone-800 text-academy-paper font-serif text-sm p-3 pr-10 focus:outline-none focus:border-academy-gold placeholder:text-stone-700 transition-colors"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-academy-gold disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Librarian;