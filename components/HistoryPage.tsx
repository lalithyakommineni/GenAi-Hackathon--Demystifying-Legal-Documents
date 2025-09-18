import React from 'react';
import { motion } from 'framer-motion';
import { HistoryList } from './HistoryList';
import type { HistoryItem } from '../types';
import { HistoryIcon } from './Icons';

interface HistoryPageProps {
  history: HistoryItem[];
  onViewHistoryItem: (item: HistoryItem) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ history, onViewHistoryItem }) => {
  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
    >
        <div className="flex items-center mb-8">
            <HistoryIcon className="w-8 h-8 text-indigo-400" />
            <h2 className="ml-4 text-3xl md:text-4xl font-extrabold tracking-tight">Document History</h2>
        </div>
        
        {history.length > 0 ? (
            <HistoryList history={history} onViewItem={onViewHistoryItem} />
        ) : (
            <div className="text-center py-16 px-6 bg-gray-800/50 rounded-xl border border-gray-700">
                <HistoryIcon className="w-16 h-16 text-gray-600 mx-auto" />
                <h3 className="mt-4 text-xl font-semibold text-white">No Documents Analyzed Yet</h3>
                <p className="mt-2 text-gray-400">Your analyzed documents will appear here.</p>
                 <button
                    onClick={() => window.location.hash = '#/analyze'}
                    className="mt-6 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Analyze Your First Document
                </button>
            </div>
        )}
    </motion.div>
  );
};
