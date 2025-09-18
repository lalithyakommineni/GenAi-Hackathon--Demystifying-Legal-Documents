import React from 'react';
import { motion } from 'framer-motion';
import type { HistoryItem } from '../types';
import { DocumentTextIcon } from './Icons';

interface HistoryListProps {
  history: HistoryItem[];
  onViewItem: (item: HistoryItem) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onViewItem }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 shadow-2xl border border-gray-700">
      <h3 className="text-2xl font-bold text-white mb-4">Document History</h3>
      <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
        {history.map((item) => (
          <motion.div
            key={item.id}
            onClick={() => onViewItem(item)}
            className="flex items-center p-3 bg-gray-900/50 rounded-lg cursor-pointer border border-transparent hover:border-indigo-500 transition-all"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <DocumentTextIcon className="w-6 h-6 text-indigo-400 flex-shrink-0" />
            <div className="ml-4 flex-grow overflow-hidden">
              <p className="font-semibold text-white truncate">{item.title}</p>
              <p className="text-sm text-gray-400">{formatDate(item.date)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
