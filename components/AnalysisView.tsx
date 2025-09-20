
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AnalysisResult } from '../types';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { ChatView } from './ChatView';
import { 
    BackArrowIcon, ExclamationIcon, SpeakerIcon, SpeakerOffIcon, CopyIcon, CheckIcon, 
    DocumentTextIcon, CalendarIcon, ChecklistIcon, GavelIcon, LightbulbIcon, ChatIcon 
} from './Icons';

type DocumentContext = { text: string; file: { dataUrl: string | null; name: string | null } } | null;

interface AnalysisViewProps {
  result: AnalysisResult;
  documentContext: DocumentContext;
  onAnalyzeAnother: () => void;
}

interface AnalysisSectionProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    delay?: number;
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({ icon, title, children, delay = 0.1 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 shadow-xl"
    >
        <div className="flex items-center mb-4">
            <div className="text-indigo-400">{icon}</div>
            <h3 className="ml-3 text-2xl font-bold text-indigo-400">{title}</h3>
        </div>
        {children}
    </motion.div>
);

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <button onClick={handleCopy} title="Copy" className="text-gray-400 hover:text-white transition-colors">
            {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
        </button>
    );
};

const SpeechButton: React.FC<{ text: string }> = ({ text }) => {
    const { isSpeaking, play, stop } = useTextToSpeech();
    const handleSpeech = () => {
        isSpeaking ? stop() : play(text);
    };
    return (
        <button onClick={handleSpeech} title={isSpeaking ? 'Stop' : 'Read aloud'} className="text-gray-400 hover:text-white transition-colors">
            {isSpeaking ? <SpeakerOffIcon className="w-5 h-5" /> : <SpeakerIcon className="w-5 h-5" />}
        </button>
    );
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ result, documentContext, onAnalyzeAnother }) => {
    const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
    const [isChatting, setIsChatting] = useState(false);

    const handleCheckChange = (index: number) => {
        setCheckedItems(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const hasContent = (arr: any[] | undefined) => arr && arr.length > 0;

    const analysisContent = (
        <motion.div
            key="analysis"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            <div className="flex justify-between items-center">
                <motion.button
                    onClick={onAnalyzeAnother}
                    className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
                    whileHover={{ x: -5 }}
                >
                    <BackArrowIcon />
                    <span className="ml-2 font-semibold">Analyze Another Document</span>
                </motion.button>
                <motion.button
                    onClick={() => setIsChatting(true)}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ChatIcon className="w-5 h-5" />
                    <span className="ml-2">Chat About This Document</span>
                </motion.button>
            </div>
            
            {hasContent(result.criticalAlerts) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0 }}
                    className="p-6 bg-red-900/30 rounded-xl border border-red-500/50 shadow-xl"
                >
                    <div className="flex items-center mb-3">
                        <ExclamationIcon className="w-6 h-6 text-red-400" />
                        <h3 className="ml-3 text-2xl font-bold text-red-400">Critical Alerts</h3>
                    </div>
                    <ul className="space-y-2 list-disc list-inside text-red-200">
                        {result.criticalAlerts.map((alert, index) => <li key={index}>{alert}</li>)}
                    </ul>
                </motion.div>
            )}

            <AnalysisSection icon={<DocumentTextIcon className="w-6 h-6" />} title="Summary">
                <div className="flex justify-between items-start">
                    <p className="text-gray-200 leading-relaxed pr-4">{result.summary}</p>
                    <div className="flex items-center space-x-3 flex-shrink-0">
                        <CopyButton text={result.summary} />
                        <SpeechButton text={result.summary} />
                    </div>
                </div>
            </AnalysisSection>

            {hasContent(result.deadlines) && (
                <AnalysisSection icon={<CalendarIcon className="w-6 h-6" />} title="Key Deadlines" delay={0.2}>
                    <div className="space-y-3">
                        {result.deadlines.map((deadline, index) => (
                            <div key={index} className="flex items-start p-3 bg-gray-900/50 rounded-md">
                                <span className="font-bold text-indigo-300 w-1/3">{deadline.date}</span>
                                <p className="text-gray-300 w-2/3">{deadline.description}</p>
                            </div>
                        ))}
                    </div>
                </AnalysisSection>
            )}

            {hasContent(result.actionChecklist) && (
                <AnalysisSection icon={<ChecklistIcon className="w-6 h-6" />} title="Your Action Checklist" delay={0.3}>
                    <div className="space-y-3">
                        {result.actionChecklist.map((item, index) => (
                            <label key={index} className="flex items-center p-3 bg-gray-900/50 rounded-md cursor-pointer hover:bg-gray-700/50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={!!checkedItems[index]}
                                    onChange={() => handleCheckChange(index)}
                                    className="w-5 h-5 bg-gray-700 border-gray-600 rounded text-indigo-500 focus:ring-indigo-600 ring-offset-gray-800 focus:ring-2"
                                />
                                <span className={`ml-3 text-gray-200 ${checkedItems[index] ? 'line-through text-gray-500' : ''}`}>
                                    {item}
                                </span>
                            </label>
                        ))}
                    </div>
                </AnalysisSection>
            )}

            {hasContent(result.relevantAuthorities) && (
                <AnalysisSection icon={<GavelIcon className="w-6 h-6" />} title="Relevant Authorities" delay={0.4}>
                    <div className="space-y-3">
                        {result.relevantAuthorities.map((auth, index) => (
                            <div key={index} className="p-3 bg-gray-900/50 rounded-md">
                                <h4 className="font-semibold text-indigo-300">{auth.name}</h4>
                                <p className="text-sm text-gray-400 mt-1">{auth.reason}</p>
                            </div>
                        ))}
                    </div>
                </AnalysisSection>
            )}

            {hasContent(result.suggestions) && (
                <AnalysisSection icon={<LightbulbIcon className="w-6 h-6" />} title="Suggestions" delay={0.5}>
                    <ul className="space-y-2 list-disc list-inside text-gray-300">
                        {result.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                        ))}
                    </ul>
                </AnalysisSection>
            )}
        </motion.div>
    );

    const chatContent = (
        <motion.div
            key="chat"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
        >
            <ChatView analysis={result} documentContext={documentContext} onBack={() => setIsChatting(false)} />
        </motion.div>
    );

    return (
        <AnimatePresence mode="wait">
            {isChatting ? chatContent : analysisContent}
        </AnimatePresence>
    );
};
