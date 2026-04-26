import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, ExternalLink, Play } from 'lucide-react';
import { useReminders } from '../context/ReminderContext';

const ReminderBanner = () => {
    const { reminders, isBannerDismissed, dismissBanner, openValidation } = useReminders();

    // Show only the first pending reminder for now to keep it clean
    const activeReminder = reminders[0];

    if (!activeReminder || isBannerDismissed) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] w-[95%] max-w-2xl"
            >
                <div className="relative group">
                    {/* Background Glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent/50 to-blue-500/50 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    
                    <div className="relative glass-panel p-4 sm:p-6 border-accent/30 bg-background/80 backdrop-blur-xl flex flex-col sm:flex-row items-center gap-6">
                        {/* Icon/Avatar Section */}
                        <div className="flex-shrink-0 relative">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent/10 rounded-full flex items-center justify-center border border-accent/20 animate-pulse">
                                <Clock size={24} className="text-accent" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-background animate-bounce" />
                        </div>

                        {/* Content Section */}
                        <div className="flex-grow text-center sm:text-left">
                            <h3 className="text-lg font-display font-black text-white uppercase tracking-tight mb-1">
                                Time for a quick refresh! ⚡
                            </h3>
                            <p className="text-xs font-mono text-white/60 uppercase tracking-widest leading-relaxed">
                                You solved <span className="text-accent font-bold">"{activeReminder.slug}"</span> a while ago. 
                                Ready to cement that knowledge?
                            </p>
                            
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4">
                                <a 
                                    href={`https://leetcode.com/problems/${activeReminder.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-[10px] font-mono text-accent/80 hover:text-accent transition-colors uppercase font-bold"
                                >
                                    <ExternalLink size={12} /> View on LeetCode
                                </a>
                            </div>
                        </div>

                        {/* Actions Section */}
                        <div className="flex flex-col gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => openValidation(activeReminder.slug)}
                                className="px-8 py-3 bg-accent text-background font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,157,0.3)] flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                <Play size={12} fill="currentColor" /> Start Revisit
                            </button>
                            <button
                                onClick={dismissBanner}
                                className="px-8 py-2 text-white/40 hover:text-white font-mono text-[9px] uppercase tracking-widest transition-all border border-white/5 hover:border-white/10 hover:bg-white/5"
                            >
                                Maybe later
                            </button>
                        </div>

                        {/* Close button (top right) */}
                        <button 
                            onClick={dismissBanner}
                            className="absolute top-3 right-3 text-white/20 hover:text-white transition-colors p-1"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ReminderBanner;
