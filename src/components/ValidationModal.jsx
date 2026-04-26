import React, { useState } from 'react';
import { X, CheckCircle, ExternalLink, HelpCircle, Eye, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ValidationModal = ({ question, onClose, onVerify }) => {
    const [step, setStep] = useState(1);
    const [responses, setResponses] = useState({
        hint_used: false,
        solution_seen: false,
        self_solved: true,
        time_taken_mins: 30
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleVerify = async () => {
        setLoading(true);
        setError(null);
        try {
            await onVerify({
                slug: question.slug,
                ...responses
            });
            onClose();
        } catch (err) {
            setError(err.response?.data?.detail || "Verification failed. Please check LeetCode and try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!question) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-background/90">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-full max-w-md glass-panel p-8 border-accent/20"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white">
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-display font-black text-white uppercase mb-1 tracking-tighter">
                    VERIFY_COMPLETION
                </h2>
                <p className="text-[10px] font-mono text-accent uppercase tracking-widest mb-8">
                    Target: {question.slug}
                </p>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono uppercase">
                        ERROR: {error}
                    </div>
                )}

                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-sm hover:border-accent/40 transition-colors">
                        <div className="flex items-center gap-3">
                            <HelpCircle size={14} className="text-accent" />
                            <span className="text-xs font-mono text-white/80 uppercase">Used Hints?</span>
                        </div>
                        <input 
                            type="checkbox" 
                            checked={responses.hint_used}
                            onChange={(e) => setResponses({...responses, hint_used: e.target.checked})}
                            className="w-4 h-4 accent-accent"
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-sm hover:border-accent/40 transition-colors">
                        <div className="flex items-center gap-3">
                            <Eye size={14} className="text-accent" />
                            <span className="text-xs font-mono text-white/80 uppercase">Viewed Solution?</span>
                        </div>
                        <input 
                            type="checkbox" 
                            checked={responses.solution_seen}
                            onChange={(e) => setResponses({...responses, solution_seen: e.target.checked})}
                            className="w-4 h-4 accent-accent"
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-sm hover:border-accent/40 transition-colors">
                        <div className="flex items-center gap-3">
                            <Zap size={14} className="text-accent" />
                            <span className="text-xs font-mono text-white/80 uppercase">Solved Independently?</span>
                        </div>
                        <input 
                            type="checkbox" 
                            checked={responses.self_solved}
                            onChange={(e) => setResponses({...responses, self_solved: e.target.checked})}
                            className="w-4 h-4 accent-accent"
                        />
                    </div>

                    <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <Clock size={14} className="text-accent" />
                            <span className="text-xs font-mono text-white/80 uppercase">Time Invested (Mins)</span>
                        </div>
                        <input 
                            type="range" 
                            min="5" 
                            max="60" 
                            step="5"
                            value={responses.time_taken_mins}
                            onChange={(e) => setResponses({...responses, time_taken_mins: parseInt(e.target.value)})}
                            className="w-full h-1 bg-white/10 accent-accent appearance-none rounded-full"
                        />
                        <div className="flex justify-between mt-2 text-[10px] font-mono text-white/40">
                            <span>5M</span>
                            <span className="text-accent">{responses.time_taken_mins}M</span>
                            <span>60M</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleVerify}
                    disabled={loading}
                    className={`mt-10 w-full py-4 font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 ${loading ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-accent text-background hover:bg-white shadow-[0_0_20px_rgba(0,255,157,0.2)]'}`}
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            VERIFYING_LC_API...
                        </>
                    ) : (
                        <>
                            <CheckCircle size={16} />
                            SUBMIT_FOR_VALIDATION
                        </>
                    )}
                </button>
                <p className="mt-4 text-[9px] font-mono text-white/20 text-center leading-relaxed">
                    By submitting, you confirm that your solution is accepted on LeetCode. Verification is a one-time protocol.
                </p>
            </motion.div>
        </div>
    );
};

export default ValidationModal;
