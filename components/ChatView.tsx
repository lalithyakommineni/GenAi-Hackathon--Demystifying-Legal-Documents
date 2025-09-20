import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Chat } from '@google/genai';
import type { AnalysisResult, ChatMessage } from '../types';
import { BackArrowIcon, SendIcon } from './Icons';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

type DocumentContext = { text: string; file: { dataUrl: string | null; name: string | null } } | null;

interface ChatViewProps {
  analysis: AnalysisResult;
  documentContext: DocumentContext;
  onBack: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ analysis, documentContext, onBack }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = () => {
        const systemInstruction = `You are LexiGuard AI, a helpful legal assistant. You are now in a chat with a user about a document you just analyzed for them.
        Here is the full content of the document for your reference:
        ${documentContext?.text ? `--- START OF PASTED TEXT ---\n${documentContext.text}\n--- END OF PASTED TEXT ---` : ''}
        ${documentContext?.file?.name ? `The user also uploaded a file named: ${documentContext.file.name}` : ''}
        
        Your previous analysis summary was: "${analysis.summary}".
        Answer their questions clearly and concisely based on the full document's context provided above. Do not provide legal advice, but help them understand the document better by referencing specifics from the content.`;

        const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
            },
        });
        setChat(newChat);
        setMessages([
            { role: 'model', content: "Hello! I've reviewed your document. What specific questions do you have about it?" }
        ]);
    };
    initChat();
  }, [analysis.summary, documentContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chat || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chat.sendMessage({ message: input });
      const modelMessage: ChatMessage = { role: 'model', content: result.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = { role: 'model', content: "Sorry, I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="flex flex-col h-[70vh] max-h-[700px] w-full bg-gray-800/50 rounded-xl border border-gray-700 shadow-xl overflow-hidden"
    >
        <div className="flex items-center p-4 border-b border-gray-700">
            <button onClick={onBack} className="text-indigo-400 hover:text-indigo-300">
                <BackArrowIcon />
            </button>
            <h3 className="ml-4 text-xl font-bold text-white">Chat About Your Document</h3>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
            <AnimatePresence>
                {messages.map((msg, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                           <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
             {isLoading && (
                 <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-end gap-2 justify-start"
                 >
                    <div className="px-4 py-3 rounded-2xl bg-gray-700 rounded-bl-none">
                        <div className="flex items-center space-x-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                        </div>
                    </div>
                </motion.div>
             )}
            <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-700">
            <div className="flex items-center bg-gray-900 rounded-lg">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    placeholder="Ask a question about the document..."
                    className="w-full bg-transparent p-3 text-gray-200 focus:outline-none"
                    disabled={isLoading}
                />
                <button onClick={handleSend} disabled={!input.trim() || isLoading} className="p-3 text-indigo-400 disabled:text-gray-500 hover:text-indigo-300 disabled:cursor-not-allowed">
                    <SendIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    </motion.div>
  );
};
