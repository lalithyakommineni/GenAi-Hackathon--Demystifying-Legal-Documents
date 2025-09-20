import React from 'react';
import { motion, Variants } from 'framer-motion';
import { FeatureCard } from './FeatureCard';
import { 
    WandIcon, ShieldCheckIcon, ClockIcon, DollarSignIcon,
    TwitterIcon, LinkedInIcon, GitHubIcon
} from './Icons';

export const LandingPage: React.FC = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
    };

    return (
        <motion.div
            className="w-full space-y-16 md:space-y-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Hero Section */}
            <motion.section variants={itemVariants} className="text-center pt-8 md:pt-16">
                 <div className="absolute top-0 left-0 -z-10 h-full w-full bg-gray-900 bg-[radial-gradient(#3730a3_1px,transparent_1px)] [background-size:32px_32px]"></div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">
                    Legal Documents, Demystified.
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-gray-300">
                    Stop drowning in confusing jargon. LexiGuard AI translates complex legal contracts into simple, actionable insights, so you can sign with absolute confidence.
                </p>
                <motion.button
                    onClick={() => window.location.hash = '#/analyze'}
                    className="mt-8 inline-block px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg shadow-lg"
                    whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(99, 102, 241, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                >
                    Analyze Your Document Free
                </motion.button>
            </motion.section>

            {/* Features Section */}
            <motion.section variants={itemVariants} className="space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold text-center">How LexiGuard AI Empowers You</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FeatureCard
                        icon={<WandIcon />}
                        title="Instant Simplification"
                        description="Transforms dense legal text into plain English summaries in seconds."
                    />
                    <FeatureCard
                        icon={<ShieldCheckIcon />}
                        title="Secure & Private"
                        description="Your documents are encrypted and analyzed without being stored."
                    />
                    <FeatureCard
                        icon={<ClockIcon />}
                        title="Save Time & Effort"
                        description="Cut down on hours of reading and get to the crucial points immediately."
                    />
                    <FeatureCard
                        icon={<DollarSignIcon />}
                        title="Avoid Costly Mistakes"
                        description="Identify potential risks and hidden clauses before they become problems."
                    />
                </div>
            </motion.section>

             {/* Why Choose Us Section */}
             <motion.section variants={itemVariants} className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold">A Smarter Way to Handle Legal Docs</h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-400">
                    We're more than just a summarizer. We're your personal legal assistant, designed for clarity and peace of mind.
                </p>
             </motion.section>

            {/* Testimonial Section */}
            <motion.section variants={itemVariants} className="max-w-3xl mx-auto">
                <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 text-center">
                    <p className="text-xl italic text-gray-300">
                        "LexiGuard AI saved me from signing a contract with a hidden auto-renewal clause. It took two minutes to analyze and potentially saved me thousands. I'm never signing anything without it again."
                    </p>
                    <p className="mt-4 font-semibold text-indigo-400">- Alex R., Freelance Developer</p>
                </div>
            </motion.section>

            {/* Footer */}
            <motion.footer variants={itemVariants} className="w-full border-t border-gray-700 pt-8">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <h3 className="text-lg font-semibold text-white">LexiGuard AI</h3>
                        <p className="mt-2 text-gray-400">Clarity in every clause.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Quick Links</h3>
                        <ul className="mt-2 space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-indigo-400">About Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-400">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-indigo-400">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                         <h3 className="text-lg font-semibold text-white">Connect</h3>
                         <div className="mt-2 flex justify-center md:justify-start space-x-4">
                            <a href="#" className="text-gray-400 hover:text-indigo-400"><TwitterIcon className="w-6 h-6" /></a>
                            <a href="#" className="text-gray-400 hover:text-indigo-400"><LinkedInIcon className="w-6 h-6" /></a>
                            <a href="#" className="text-gray-400 hover:text-indigo-400"><GitHubIcon className="w-6 h-6" /></a>
                         </div>
                    </div>
                </div>
                <div className="text-center mt-8 pt-8 border-t border-gray-800 text-gray-500">
                    <p>&copy; 2024 LexiGuard AI. All Rights Reserved.</p>
                </div>
            </motion.footer>
        </motion.div>
    );
};