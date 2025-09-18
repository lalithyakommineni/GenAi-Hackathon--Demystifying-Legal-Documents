
import React from 'react';
import { motion } from 'framer-motion';
import type { HistoryItem } from '../types';
import { UserIcon } from './Icons';

interface ProfilePageProps {
  history: HistoryItem[];
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ history }) => {
  const totalAnalyzed = history.length;

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full space-y-8"
    >
        <div className="flex items-center">
            <UserIcon className="w-8 h-8 text-indigo-400" />
            <h2 className="ml-4 text-3xl md:text-4xl font-extrabold tracking-tight">Profile & Usage</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* User Card */}
            <div className="md:col-span-1 p-6 bg-gray-800/50 rounded-xl border border-gray-700 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-indigo-500 flex items-center justify-center mb-4">
                    <UserIcon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Alex Ryder</h3>
                <p className="text-gray-400">alex.ryder@example.com</p>
                <button className="mt-4 px-4 py-2 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600">
                    Edit Profile
                </button>
            </div>

            {/* Stats & Subscription */}
            <div className="md:col-span-2 space-y-8">
                 <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                    <h3 className="text-xl font-bold text-indigo-400 mb-4">Usage Statistics</h3>
                    <div className="flex items-center">
                        <p className="text-gray-300">Total Documents Analyzed:</p>
                        <p className="ml-auto text-2xl font-bold text-white">{totalAnalyzed}</p>
                    </div>
                </div>
                 <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                    <h3 className="text-xl font-bold text-indigo-400 mb-4">Subscription Plan</h3>
                     <div className="flex items-center">
                        <p className="text-gray-300">Current Plan:</p>
                        <p className="ml-auto text-2xl font-bold text-white">Free Tier</p>
                    </div>
                     <button className="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
                        Upgrade Plan
                    </button>
                </div>
            </div>
        </div>
    </motion.div>
  );
};
