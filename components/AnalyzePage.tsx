import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { FileUpload } from './FileUpload';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { MicrophoneIcon } from './Icons';

interface AnalyzePageProps {
  onAnalyze: (text: string, file: { dataUrl: string | null, name: string | null }) => void;
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({ onAnalyze }) => {
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState<{ dataUrl: string | null, name: string | null }>({ dataUrl: null, name: null });
  const [inputMethod, setInputMethod] = useState<'text' | 'file'>('text');

  const { isRecording, isSupported, startRecording, stopRecording } = useSpeechToText({ 
    onTranscriptChange: setInputText 
  });

  const handleSubmit = () => {
    onAnalyze(inputText, file);
  };
  
  const handleVoiceToggle = () => {
    if (inputMethod !== 'text') {
        setInputMethod('text');
    }
    if (isRecording) {
        stopRecording();
    } else {
        startRecording(inputText);
    }
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
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="text-center">
         <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Analyze Your Document</h2>
         <p className="mt-2 max-w-2xl mx-auto text-lg text-gray-400">
          Paste your text or upload a file. Our AI will provide a simple, clear analysis.
         </p>
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
             <div className="relative">
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={isRecording ? "Listening..." : "Paste your legal document text here..."}
                    className="w-full h-48 p-4 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-gray-200 pr-14"
                    readOnly={isRecording}
                ></textarea>
                {isSupported && (
                    <button 
                        onClick={handleVoiceToggle}
                        title={isRecording ? "Stop recording" : "Record with voice"}
                        aria-label={isRecording ? "Stop recording" : "Record with voice"}
                        className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                            isRecording 
                            ? 'bg-red-600 text-white animate-pulse' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        <MicrophoneIcon className="w-5 h-5" />
                    </button>
                )}
             </div>
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
    </motion.div>
  );
};