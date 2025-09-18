
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LandingPage } from './components/LandingPage';
import { AnalyzePage } from './components/AnalyzePage';
import { AnalysisView } from './components/AnalysisView';
import { HistoryPage } from './components/HistoryPage';
import { ProfilePage } from './components/ProfilePage';
import { Loader } from './components/Loader';
import Header from './components/Header';
import { Sidebar } from './components/Sidebar';
import { analyzeDocument } from './services/geminiService';
import { getHistory, saveToHistory } from './services/historyService';
import type { AnalysisResult, HistoryItem } from './types';

type View = 'home' | 'loading' | 'result' | 'error';
type DocumentContext = { text: string; file: { dataUrl: string | null; name: string | null } };

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
};


const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [documentContext, setDocumentContext] = useState<DocumentContext | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [route, setRoute] = useState(window.location.hash || '#/');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setHistory(getHistory());
    
    const handleHashChange = () => {
      const newHash = window.location.hash || '#/';
      setRoute(newHash);
      setMobileSidebarOpen(false); // Close sidebar on route change
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  useEffect(() => {
    if (route === '#/analyze' && view !== 'result' && view !== 'loading') {
      setView('home');
      setAnalysisResult(null);
      setErrorMessage('');
      setDocumentContext(null);
    }
  }, [route, view]);

  useEffect(() => {
    if (!isMobile) {
        setMobileSidebarOpen(false);
    }
  }, [isMobile]);

  const handleAnalyze = useCallback(async (text: string, file: { dataUrl: string | null, name: string | null }) => {
    if (!text && !file.dataUrl) {
      setErrorMessage('Please provide a document text or upload a file to analyze.');
      setView('error');
      return;
    }
    
    setView('loading');
    setErrorMessage('');
    setAnalysisResult(null);
    setDocumentContext({ text, file });

    try {
      const result = await analyzeDocument(text, file.dataUrl);
      
      const title = file.name || `Text Analysis - ${new Date().toLocaleDateString()}`;
      const now = new Date().toISOString();
      const newHistoryItem: HistoryItem = {
          id: now,
          title: title,
          date: now,
          analysis: result,
          originalText: text,
          originalFile: file.dataUrl ? { dataUrl: file.dataUrl, name: file.name! } : undefined,
      };
      const updatedHistory = saveToHistory(newHistoryItem);
      setHistory(updatedHistory);

      setAnalysisResult(result);
      setView('result');
    } catch (error) {
      console.error('Analysis failed:', error);
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      setErrorMessage(`Failed to analyze the document. ${message}. Please check your API key and try again.`);
      setView('error');
    }
  }, []);

  const handleAnalyzeAnother = useCallback(() => {
    window.location.hash = '#/analyze';
    setView('home');
    setAnalysisResult(null);
    setErrorMessage('');
    setDocumentContext(null);
  }, []);

  const handleViewHistoryItem = useCallback((item: HistoryItem) => {
    setAnalysisResult(item.analysis);
    setDocumentContext({
        text: item.originalText || '',
        file: item.originalFile ? { dataUrl: item.originalFile.dataUrl, name: item.originalFile.name } : { dataUrl: null, name: null }
    });
    setView('result');
    window.location.hash = '#/analyze';
  }, []);
  
  const handleMenuClick = () => {
    if (isMobile) {
        setMobileSidebarOpen(prev => !prev);
    } else {
        setSidebarCollapsed(prev => !prev);
    }
  };

  const renderContent = () => {
    switch(route) {
        case '#/analyze':
            switch (view) {
            case 'loading':
                return <Loader />;
            case 'result':
                return analysisResult && <AnalysisView result={analysisResult} documentContext={documentContext} onAnalyzeAnother={handleAnalyzeAnother} />;
            case 'error':
                return (
                <div className="text-center p-8">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Analysis Failed</h2>
                    <p className="text-gray-300 mb-6">{errorMessage}</p>
                    <button
                    onClick={handleAnalyzeAnother}
                    className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                    Try Again
                    </button>
                </div>
                );
            case 'home':
            default:
                return <AnalyzePage onAnalyze={handleAnalyze} />;
            }
        case '#/history':
            return <HistoryPage history={history} onViewHistoryItem={handleViewHistoryItem} />;
        case '#/profile':
            return <ProfilePage history={history} />;
        case '#/':
        default:
            return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        currentRoute={route} 
        isMobile={isMobile}
        isOpen={isMobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${!isMobile ? (isSidebarCollapsed ? 'ml-20' : 'ml-72') : 'ml-0'}`}>
        <Header onMenuClick={handleMenuClick} />
        <main className="flex-grow flex flex-col items-center justify-start p-4 md:p-8">
            <AnimatePresence mode="wait">
            <motion.div
                key={route + view}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-5xl"
            >
                {renderContent()}
            </motion.div>
            </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default App;
