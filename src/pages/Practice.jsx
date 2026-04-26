import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useReminders } from '../context/ReminderContext';
import { 
    getCurriculum, getExtraPractice, logExtraPractice, verifyAndComplete,
    getUserProfile
} from '../services/api';
import { Zap, Plus, Layers, Calendar } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import ValidationModal from '../components/ValidationModal';
import { motion, AnimatePresence } from 'framer-motion';

const SessionSelector = ({ availableSeasons, currentSession, onSessionChange, compact }) => {
    return (
        <div className={`flex flex-wrap items-center gap-2 ${compact ? 'bg-white/5 p-1 rounded-sm border border-white/10' : ''}`}>
            {availableSeasons.map(s => (
                <div key={s.season} className="flex items-center gap-1">
                    {s.levels.map(l => (
                        <button
                            key={l}
                            onClick={() => onSessionChange({ season: s.season, level: l })}
                            className={`px-3 py-1 text-[10px] font-mono border transition-all uppercase tracking-widest ${
                                currentSession.season === s.season && currentSession.level === l
                                    ? 'bg-accent text-background border-accent font-bold'
                                    : 'bg-transparent text-white/40 border-white/10 hover:border-white/30 hover:text-white'
                            }`}
                        >
                            {s.season}_{l}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
};

const Practice = () => {
    const { user, loading: authLoading } = useAuth();
    const { reminders, refreshReminders } = useReminders();
    
    const [profile, setProfile] = useState(null);
    const [curriculum, setCurriculum] = useState([]);
    const [extraPractice, setExtraPractice] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSession, setCurrentSession] = useState({
        season: import.meta.env.VITE_CURRENT_SEASON || 'Season_1',
        level: import.meta.env.VITE_CURRENT_LEVEL || 'Level_1'
    });
    
    const [extraSlugInput, setExtraSlugInput] = useState('');
    const [isLoggingExtra, setIsLoggingExtra] = useState(false);
    const [showValidation, setShowValidation] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.rollNo) return;
            setLoading(true);
            try {
                const [profileRes, currRes, extraRes] = await Promise.all([
                    getUserProfile(currentSession),
                    getCurriculum(currentSession),
                    getExtraPractice(user.rollNo)
                ]);

                const dbProfile = profileRes.data.data || profileRes.data;
                setProfile(dbProfile);
                setCurriculum(currRes.data || []);
                setExtraPractice(extraRes.data || []);
            } catch (error) {
                console.error('Error fetching practice data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchData();
        }
    }, [user, authLoading, currentSession]);

    const handleVerifyCompletion = async (responses) => {
        const data = {
            rollNo: user.rollNo,
            ...responses
        };
        const res = await verifyAndComplete(data);
        setProfile(prev => ({
            ...prev,
            completed_slugs: [...(prev.completed_slugs || []), responses.slug]
        }));
        await refreshReminders();
        return res;
    };

    const handleAddExtra = async () => {
        if (!extraSlugInput.trim()) return;
        setIsLoggingExtra(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            await logExtraPractice(user.rollNo, today, extraSlugInput.trim());
            const extraRes = await getExtraPractice(user.rollNo);
            setExtraPractice(extraRes.data || []);
            setExtraSlugInput('');
        } catch (err) {
            console.error("Failed to log extra practice:", err);
        } finally {
            setIsLoggingExtra(false);
        }
    };

    if (loading || authLoading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <div className="w-16 h-1 w-32 bg-accent/20 relative overflow-hidden mb-4">
                <div className="absolute top-0 left-0 h-full bg-accent animate-progress w-full" />
            </div>
            <p className="text-accent font-mono text-sm tracking-[0.5em] animate-pulse">LOADING_PRACTICE_HUB...</p>
        </div>
    );

    return (
        <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <Zap className="text-accent" size={18} />
                    <span className="text-accent font-mono text-xs font-bold tracking-[0.3em] uppercase">Status: Training_Active</span>
                </div>
                <h1 className="text-5xl font-display font-bold tracking-tighter mb-4 text-white uppercase">PRACTICE_HUB</h1>
                <p className="text-white/40 font-mono text-sm tracking-tight max-w-2xl">
                    Master the curriculum, track your self-practice, and cement your knowledge through spaced repetition.
                </p>
            </div>

            {/* Session Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 p-4 bg-white/5 border border-white/10 rounded-sm">
                <div className="flex flex-col">
                    <span className="text-accent font-mono text-[10px] font-bold tracking-[0.3em] uppercase mb-1">Target Matrix</span>
                    <span className="text-white font-display font-bold uppercase tracking-tight">{currentSession.season} : {currentSession.level}</span>
                </div>
                <SessionSelector 
                    availableSeasons={[{ season: import.meta.env.VITE_CURRENT_SEASON, levels: [import.meta.env.VITE_CURRENT_LEVEL] }]} 
                    currentSession={currentSession}
                    onSessionChange={setCurrentSession}
                    compact
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Class Questions */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-1">Lectures</span>
                            <span className="text-xl font-display font-bold text-white uppercase tracking-tight">Class Questions</span>
                        </div>
                        <div className="w-8 h-8 bg-accent/10 border border-accent/20 flex items-center justify-center rounded-full">
                            <Layers size={14} className="text-accent" />
                        </div>
                    </div>
                    {curriculum.length > 0 ? (
                        curriculum.map((day, dIdx) => (
                            <div key={dIdx} className="space-y-2">
                                <div className="text-[10px] font-mono text-white/20 uppercase px-2 mb-1 flex items-center gap-2">
                                    <Calendar size={10} /> {day.date}
                                </div>
                                {day.class_questions?.map((slug, qIdx) => (
                                    <QuestionCard 
                                        key={`${dIdx}-${qIdx}`} 
                                        question={slug} 
                                        type="class" 
                                        onComplete={(s) => {
                                            setSelectedQuestion({ slug: s });
                                            setShowValidation(true);
                                        }}
                                        status={profile?.completed_slugs?.includes(slug) ? 'done' : reminders.find(r => r.slug === slug)?.status}
                                    />
                                ))}
                            </div>
                        ))
                    ) : (
                        <div className="p-20 border border-white/5 border-dashed rounded-sm text-center text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">
                            No Class Data Found
                        </div>
                    )}
                </div>

                {/* Assigned Questions */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-1">Assignments</span>
                            <span className="text-xl font-display font-bold text-white uppercase tracking-tight">Assigned Tasks</span>
                        </div>
                        <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center rounded-full">
                            <Zap size={14} className="text-blue-400" />
                        </div>
                    </div>
                    {curriculum.length > 0 ? (
                        curriculum.map((day, dIdx) => (
                            <div key={dIdx} className="space-y-2">
                                <div className="text-[10px] font-mono text-white/20 uppercase px-2 mb-1 flex items-center gap-2">
                                    <Calendar size={10} /> {day.date}
                                </div>
                                {day.assigned_questions?.map((slug, qIdx) => (
                                    <QuestionCard 
                                        key={`${dIdx}-${qIdx}`} 
                                        question={slug} 
                                        type="assigned" 
                                        onComplete={(s) => {
                                            setSelectedQuestion({ slug: s });
                                            setShowValidation(true);
                                        }}
                                        status={profile?.completed_slugs?.includes(slug) ? 'done' : reminders.find(r => r.slug === slug)?.status}
                                    />
                                ))}
                            </div>
                        ))
                    ) : (
                        <div className="p-20 border border-white/5 border-dashed rounded-sm text-center text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">
                            No Assignments Found
                        </div>
                    )}
                </div>

                {/* Extra Practice */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-1">Self_Directed</span>
                            <span className="text-xl font-display font-bold text-white uppercase tracking-tight">Extra Practice</span>
                        </div>
                        <Plus 
                            size={14} 
                            className="text-accent cursor-pointer hover:scale-125 transition-transform" 
                            onClick={() => setSelectedQuestion({ type: 'extra_input' })}
                        />
                    </div>
                    
                    <div className="p-4 bg-white/5 border border-white/10 rounded-sm mb-6">
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="LEETCODE_SLUG"
                                value={extraSlugInput}
                                onChange={(e) => setExtraSlugInput(e.target.value)}
                                className="flex-1 bg-black/40 border border-white/10 rounded-sm px-3 py-2 text-[10px] font-mono text-white focus:outline-none focus:border-accent"
                            />
                            <button 
                                onClick={handleAddExtra}
                                disabled={isLoggingExtra}
                                className="px-6 py-2 bg-accent text-background font-black text-[10px] uppercase rounded-sm hover:bg-white transition-all shadow-[0_0_15px_rgba(0,255,157,0.2)]"
                            >
                                {isLoggingExtra ? '...' : 'ADD'}
                            </button>
                        </div>
                    </div>

                    {extraPractice.length > 0 ? (
                        extraPractice.map((day, dIdx) => (
                            <div key={dIdx} className="space-y-2">
                                <div className="text-[10px] font-mono text-white/20 uppercase px-2 mb-1 flex items-center gap-2">
                                    <Calendar size={10} /> {day.date}
                                </div>
                                {day.slugs?.map((slug, qIdx) => (
                                    <QuestionCard key={`${dIdx}-${qIdx}`} question={slug} type="extra" />
                                ))}
                            </div>
                        ))
                    ) : (
                        <div className="p-20 border border-white/5 border-dashed rounded-sm text-center text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">
                            Start Your Own Journey
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {showValidation && (
                    <ValidationModal 
                        question={selectedQuestion} 
                        onClose={() => setShowValidation(false)} 
                        onVerify={handleVerifyCompletion}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Practice;
