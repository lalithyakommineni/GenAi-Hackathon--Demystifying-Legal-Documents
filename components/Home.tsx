import React, { useState } from 'react';
// FIX: import Variants from framer-motion to correctly type animation variants.
import { motion, Variants } from 'framer-motion';
import { FeatureCard } from './FeatureCard';
import { FileUpload } from './FileUpload';
import { HistoryList } from './HistoryList';
import { DocumentTextIcon, UploadIcon, WandIcon } from './Icons';
import type { HistoryItem } from '../types';

interface HomeProps {
  onAnalyze: (text: string, file: { dataUrl: string | null, name: string | null }) => void;
  history: HistoryItem[];
  onViewHistoryItem: (item: HistoryItem) => void;
}

export const Home: React.FC<HomeProps> = ({ onAnalyze, history, onViewHistoryItem }) => {
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState<{ dataUrl: string | null, name: string | null }>({ dataUrl: null, name: null });
  const [inputMethod, setInputMethod] = useState<'text' | 'file'>('text');

  const handleSubmit = () => {
    onAnalyze(inputText, file);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // FIX: Explicitly type `itemVariants` with the `Variants` type to fix assignment errors.
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className="space-y-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          Demystify Legal Jargon Instantly
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
          Upload your contracts, agreements, or terms of service. Our AI will break it down into simple, understandable terms so you can sign with confidence.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          icon={<WandIcon />}
          title="Instant Simplification"
          description="Transforms dense legal text into plain English summaries in seconds."
        />
        <FeatureCard
          icon={<DocumentTextIcon />}
          title="Clause-by-Clause Analysis"
          description="Highlights key clauses, explaining their meaning and potential impact on you."
        />
        <FeatureCard
          icon={<UploadIcon />}
          title="Supports Various Formats"
          description="Paste text or upload PDF, Word, Excel, and image files for comprehensive analysis."
        />
      </motion.div>

      <motion.div variants={itemVariants} className="bg-gray-800/50 rounded-xl p-6 shadow-2xl border border-gray-700">
        <div className="flex border-b border-gray-600 mb-4">
            <button 
                onClick={() => setInputMethod('text')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${inputMethod === 'text' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
            >
                Paste Text
            </button>
            <button 
                onClick={() => setInputMethod('file')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${inputMethod === 'file' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
            >
                Upload File
            </button>
        </div>

        {inputMethod === 'text' ? (
             <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your legal document text here..."
                className="w-full h-48 p-4 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-gray-200"
             ></textarea>
        ) : (
            <FileUpload onFileChange={setFile} />
        )}
       
        <div className="mt-6 text-center">
          <motion.button
            onClick={handleSubmit}
            disabled={!inputText && !file.dataUrl}
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Analyze Document
          </motion.button>
        </div>
      </motion.div>

      {history.length > 0 && (
        <motion.div variants={itemVariants}>
            <HistoryList history={history} onViewItem={onViewHistoryItem} />
        </motion.div>
      )}
    </motion.div>
  );
};
