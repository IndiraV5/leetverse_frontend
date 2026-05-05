import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, Calendar, Award, User, Users, Eye, X, Shield, ChevronRight, Hash, Layers, History, Activity, CheckCircle, Clock, AlertTriangle, Plus, ExternalLink, Zap } from 'lucide-react';
import UserAvatar from '../components/UserAvatar';
import QuestionCard from '../components/QuestionCard';
import ValidationModal from '../components/ValidationModal';
import {
    getUserHistory, getUserProfile, getMyProfile, getUserRank,
    getAvailableSeasons,
    updateProfile, checkLeetcodeUsername
} from '../services/api';
import { useReminders } from '../context/ReminderContext';
import { motion, AnimatePresence } from 'framer-motion';

const HistoricalRecordModal = ({ record, onClose }) => {
    if (!record) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg glass-panel overflow-hidden border-accent/20 shadow-[0_0_50px_rgba(0,255,157,0.15)]"
            >
                <div className="h-2 bg-accent shadow-[0_0_20px_rgba(0,255,157,0.5)]" />

                <div className="p-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-display font-black text-white tracking-tighter uppercase mb-1 flex items-center gap-3">
                                <History size={28} className="text-accent" /> SESSION_ARCHIVE
                            </h2>
                            <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">Snapshot : {record.season} / {record.level}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 text-white/40 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-sm">
                            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-3">Final Rank</div>
                            <div className="text-4xl font-display font-black text-accent drop-shadow-[0_0_10px_rgba(0,255,157,0.3)]">
                                #{record.rank || 'N/A'}
                            </div>
                        </div>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-sm">
                            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-3">Total Score</div>
                            <div className="text-4xl font-display font-black text-white">
                                {record.points || 0}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-white/5 rounded-sm">
                            <div className="flex items-center gap-3">
                                <Activity size={14} className="text-white/40" />
                                <span className="text-[10px] font-mono text-white/60 uppercase">Protocol Status</span>
                            </div>
                            <span className="text-[10px] font-mono text-accent font-bold uppercase">READ_ONLY</span>
                        </div>
                        <p className="text-[10px] font-mono text-white/20 text-center leading-relaxed px-4 italic">
                            This data represents your finalized performance metrics for the selected session. Record modifications are restricted.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="mt-10 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-black uppercase tracking-[0.3em] transition-all"
                    >
                        Close Summary
                    </button>
                </div>
            </motion.div>
        </div>
    );
};


const SessionSelector = ({ availableSeasons, currentSession, onSessionChange, compact = false }) => {
    const selectedSeasonData = availableSeasons.find(s => s.season === currentSession.season) || (availableSeasons.length > 0 ? availableSeasons[0] : null);
    const availableLevels = selectedSeasonData ? selectedSeasonData.levels : [];

    return (
        <div className={`flex flex-wrap items-center gap-4 ${compact ? '' : 'mb-8'}`}>
            {!compact && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-sm">
                    <Layers size={14} className="text-accent" />
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold">Protocol Configuration:</span>
                </div>
            )}
            <div className="flex items-center gap-3">
                {/* Season Dropdown */}
                <div className="relative group">
                    <select
                        value={currentSession.season}
                        onChange={(e) => {
                            const newSeason = e.target.value;
                            const newSeasonData = availableSeasons.find(s => s.season === newSeason);
                            const firstLevel = newSeasonData?.levels[0] || 'level1';
                            onSessionChange({ season: newSeason, level: firstLevel });
                        }}
                        className="appearance-none bg-black/40 border border-white/10 text-white font-mono text-[11px] px-4 py-2 pr-8 rounded-sm hover:border-accent transition-all focus:outline-none focus:ring-1 focus:ring-accent/50 cursor-pointer"
                    >
                        {availableSeasons.map(s => (
                            <option key={s.season} value={s.season}>{s.season.toUpperCase()}</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 group-hover:text-accent transition-colors">
                        <ChevronRight size={10} className="rotate-90" />
                    </div>
                </div>

                {/* Level Dropdown */}
                <div className="relative group">
                    <select
                        value={currentSession.level}
                        onChange={(e) => onSessionChange({ ...currentSession, level: e.target.value })}
                        className="appearance-none bg-black/40 border border-white/10 text-white font-mono text-[11px] px-4 py-2 pr-8 rounded-sm hover:border-accent transition-all focus:outline-none focus:ring-1 focus:ring-accent/50 cursor-pointer"
                    >
                        {availableLevels.map(l => (
                            <option key={l} value={l}>{l.toUpperCase()}</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 group-hover:text-accent transition-colors">
                        <ChevronRight size={10} className="rotate-90" />
                    </div>
                </div>
            </div>
        </div>
    );
};


const UserDetailModal = ({ user, onClose }) => {
    const [rank, setRank] = useState('--');
    const [loadingRank, setLoadingRank] = useState(false);
    const [history, setHistory] = useState([]);
    const [attendancePercent, setAttendancePercent] = useState(null);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        const fetchRank = async () => {
            if (!user) return;
            setLoadingRank(true);
            try {
                const season = import.meta.env.VITE_CURRENT_SEASON;
                const level = import.meta.env.VITE_CURRENT_LEVEL;
                const response = await getUserRank(user.rollNo, { season, level });
                if (response.data && !response.data.error) {
                    setRank(response.data.rank.toString().padStart(2, '0'));
                } else {
                    setRank('NR');
                }
            } catch (error) {
                console.error('Error fetching rank for modal:', error);
                setRank('ERR');
            } finally {
                setLoadingRank(false);
            }
        };

        const fetchHistory = async () => {
            if (!user) return;
            setLoadingHistory(true);
            try {
                const response = await getUserHistory(user.rollNo);
                const historyData = response.data.history || [];
                setHistory(historyData);

                // Calculate percentage from history if backend value seems incorrect or as a fallback
                if (historyData.length > 0) {
                    const presentDays = historyData.filter(h => h.status === 'present').length;
                    const calculatedPercent = Math.round((presentDays / historyData.length) * 100);
                    setAttendancePercent(calculatedPercent);
                } else {
                    setAttendancePercent(response.data.attendancePercentage || 0);
                }
            } catch (error) {
                console.error('Error fetching history for modal:', error);
            } finally {
                setLoadingHistory(false);
            }
        };

        fetchRank();
        fetchHistory();
    }, [user]);

    if (!user) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-background/80">
            <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200 border-accent/20">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                >
                    <X size={24} />
                </button>

                <div className="p-8">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center border border-accent/20">
                            <span className="text-3xl font-bold text-accent">{user.name?.charAt(0)}</span>
                        </div>
                        <div>
                            <h3 className="text-3xl font-display font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{user.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-accent font-mono text-sm uppercase tracking-[0.2em] font-black">{user.rollNo}</span>
                                <span className="w-1 h-1 bg-white/40 rounded-full" />
                                <span className="text-white/70 font-mono text-xs italic tracking-tight">{user.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-6 rounded-sm border border-white/10">
                                <span className="text-[10px] font-mono text-white/70 uppercase block mb-1 tracking-widest font-bold">Total Points</span>
                                <span className="text-3xl font-black text-accent drop-shadow-[0_0_10px_rgba(0,255,157,0.3)]">{user.totalPoints}</span>
                            </div>
                            <div className="bg-white/5 p-6 rounded-sm border border-white/10">
                                <span className="text-[10px] font-mono text-white/70 uppercase block mb-1 tracking-widest font-bold">Global Rank</span>
                                <span className={`text-3xl font-black ${rank !== '--' && rank !== 'NR' && rank !== 'ERR' ? 'text-accent' : 'text-white'}`}>
                                    {loadingRank ? (
                                        <span className="inline-block w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin align-middle" />
                                    ) : rank}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white/5 p-6 rounded-sm border border-white/5">
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Attendance Summary</span>
                                <div className="px-2 py-1 bg-accent/10 border border-accent/20 rounded-[2px]">
                                    <span className="text-[10px] font-mono text-accent uppercase">
                                        {import.meta.env.VITE_CURRENT_SEASON} : {import.meta.env.VITE_CURRENT_LEVEL}
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="flex flex-col">
                                    <span className="text-xs font-mono text-white/70 mb-1 italic font-bold">Days Present</span>
                                    <span className="text-2xl font-black text-accent">{user.attendanceSummary?.daysPresent || 0}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-mono text-white/70 mb-1 italic font-bold">Attendance Rate</span>
                                    <span className="text-2xl font-black text-white">
                                        {attendancePercent !== null ? `${attendancePercent}%` : '--'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 p-6 rounded-sm border border-white/5">
                            <span className="text-[10px] font-mono text-white/40 uppercase block mb-3 tracking-widest">Score History</span>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left font-mono text-[11px]">
                                    <thead className="border-b border-white/5 bg-black/20">
                                        <tr>
                                            <th className="px-4 py-3 text-white/40 uppercase tracking-widest">Date</th>
                                            <th className="px-4 py-3 text-white/40 uppercase tracking-widest">Points</th>
                                            <th className="px-4 py-3 text-white/40 uppercase tracking-widest">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {loadingHistory ? (
                                            <tr>
                                                <td colSpan="3" className="px-4 py-8 text-center">
                                                    <div className="inline-block w-6 h-6 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                                                </td>
                                            </tr>
                                        ) : history.length > 0 ? (
                                            history.map((entry, idx) => (
                                                <tr key={idx} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 text-white">{entry.date}</td>
                                                    <td className="px-4 py-3 text-accent">+{entry.points}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-1.5 py-0.5 rounded-sm border uppercase text-[9px] font-bold ${entry.status === 'present'
                                                            ? 'text-accent border-accent/20 bg-accent/5'
                                                            : 'text-red-400 border-red-500/20 bg-red-500/5'
                                                            }`}>
                                                            {entry.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="px-4 py-8 text-center text-white/20 italic">No history found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-white/5 p-6 rounded-sm border border-white/5">
                            <span className="text-[10px] font-mono text-white/40 uppercase block mb-3 tracking-widest">System Metadata</span>
                            <div className="bg-black/40 rounded-sm p-4 border border-white/5">
                                <pre className="text-[11px] font-mono text-accent/80 overflow-x-auto">
                                    {JSON.stringify(user, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [allAdmins, setAllAdmins] = useState([]);
    const [activeTab, setActiveTab] = useState('participants'); // 'participants' or 'admins'
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [availableSeasons, setAvailableSeasons] = useState([]);
    const [isSessionActive, setIsSessionActive] = useState(true);
    const [historicalRecord, setHistoricalRecord] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [currentSession, setCurrentSession] = useState({
        season: import.meta.env.VITE_CURRENT_SEASON || 'Season_1',
        level: import.meta.env.VITE_CURRENT_LEVEL || 'Level_1'
    });
    const [userRank, setUserRank] = useState(null);

    // Global Reminders
    const { reminders, refreshReminders, openValidation } = useReminders();
    const [showValidationLocal, setShowValidationLocal] = useState(false);
    const [selectedQuestionLocal, setSelectedQuestionLocal] = useState(null);

    // Username setup
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [usernameInput, setUsernameInput] = useState('');
    const [usernameLoading, setUsernameLoading] = useState(false);

    useEffect(() => {
        const fetchAvailable = async () => {
            try {
                const res = await getAvailableSeasons();
                let seasons = res.data;
                const envSeason = import.meta.env.VITE_CURRENT_SEASON;
                const envLevel = import.meta.env.VITE_CURRENT_LEVEL;
                let fs = seasons.find(s => s.season === envSeason);
                if (!fs) seasons = [{ season: envSeason, levels: [envLevel] }, ...seasons];
                else if (!fs.levels.includes(envLevel)) fs.levels = [...fs.levels, envLevel];
                setAvailableSeasons(seasons);
                const sessionExists = seasons.some(s => s.season === currentSession.season && s.levels.includes(currentSession.level));
                if (!sessionExists && seasons.length > 0) {
                    setCurrentSession({ season: seasons[0].season, level: seasons[0].levels[0] });
                }
            } catch (err) {
                console.error("Failed to fetch available sessions:", err);
            }
        };
        fetchAvailable();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isAdmin) {
                    if (isSessionActive) {
                        const response = await getUserProfile(currentSession);
                        setAllUsers(response.data.participants || []);
                        setAllAdmins(response.data.admins || []);
                    }
                    setProfile({ role: 'admin' });
                } else if (user?.rollNo) {
                    const profileRes = await getUserProfile(currentSession);
                    const dbProfile = profileRes.data.data || profileRes.data;

                    setProfile({
                        ...dbProfile,
                    });

                    // Load rank and history in background to speed up initial paint
                    getUserRank(user.rollNo, currentSession).then(res => setUserRank(res.data?.rank || null));
                    getUserHistory(user.rollNo, currentSession).then(res => setHistory(res.data.history || []));
                }

                // Dedicated check for LeetCode username (handles cases where role is overridden)
                if (user) {
                    try {
                        const lcRes = await checkLeetcodeUsername(currentSession);
                        if (lcRes.data?.has_leetcode_username) {
                            setProfile(prev => ({ ...(prev || {}), leetcode_username: lcRes.data.username }));
                        }
                    } catch (err) {
                        console.error('Error checking leetcode username:', err);
                    }
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchData();
        }
    }, [user, isAdmin, authLoading, currentSession, isSessionActive]);

    const handleVerifyCompletion = async (responses) => {
        // Redundant here, moved to Practice page, but keeping simple for global modal if needed
        return null;
    };

    const handleAddExtra = () => { }; // Moved to Practice page

    const handleUpdateUsername = async () => {
        if (!isEditingUsername) {
            setUsernameInput(profile?.leetcode_username || '');
            setIsEditingUsername(true);
            return;
        }
        if (!usernameInput.trim()) return;
        setUsernameLoading(true);
        try {
            await updateProfile({ leetcode_username: usernameInput.trim() }, currentSession);
            setProfile(prev => ({ ...prev, leetcode_username: usernameInput.trim() }));
            setIsEditingUsername(false);
        } catch (err) {
            console.error("Update failed:", err);
        } finally {
            setUsernameLoading(false);
        }
    };

    if (loading || authLoading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <div className="w-16 h-1 w-32 bg-accent/20 relative overflow-hidden mb-4">
                <div className="absolute top-0 left-0 h-full bg-accent animate-progress w-full" />
            </div>
            <p className="text-accent font-mono text-sm tracking-[0.5em] animate-pulse">SYNCHRONIZING_CORE_DATA...</p>
        </div>
    );

    const fetchHistoricalRecord = async (session) => {
        setModalLoading(true);
        try {
            const res = await getUserRank(user.rollNo, { season: session.season, level: session.level });
            setHistoricalRecord({ ...res.data, ...session });
        } catch (err) {
            console.error("Failed to fetch historical record:", err);
        } finally {
            setModalLoading(false);
        }
    };

    // Admin View
    if (isAdmin) {
        return (
            <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="text-accent" size={18} />
                        <span className="text-accent font-mono text-xs font-bold tracking-[0.3em] uppercase">Security Level: Admin</span>
                    </div>
                    <h1 className="text-5xl font-display font-bold tracking-tighter mb-4 text-white uppercase">COMMAND_CENTRE</h1>
                    <p className="text-white/40 font-mono text-sm tracking-tight max-w-2xl">
                        Remote diagnostics interface for session: <span className="text-accent font-bold uppercase">{currentSession.season}_{currentSession.level}</span>.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-4">
                        <Link to="/admin/curriculum" className="flex items-center gap-2 px-6 py-2 bg-accent/10 border border-accent/20 text-accent font-mono text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-background transition-all">
                            <Calendar size={14} /> MANAGE_CURRICULUM
                        </Link>
                        <Link to="/admin/progress" className="flex items-center gap-2 px-6 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-background transition-all">
                            <Activity size={14} /> PRACTICE_PROGRESS
                        </Link>
                        <Link to="/admin" className="flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 text-white/60 font-mono text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">
                            <Plus size={14} /> UPLOAD_SCORES
                        </Link>
                    </div>
                </div>

                {!isSessionActive ? (
                    <div className="glass-panel p-12 flex flex-col items-center justify-center text-center border-accent/20 bg-accent/5 backdrop-blur-xl">
                        <Layers size={48} className="text-accent mb-6 animate-pulse" />
                        <h2 className="text-2xl font-display font-bold text-white mb-4 uppercase tracking-tighter">Initialize Session Protocol</h2>
                        <p className="text-white/40 font-mono text-sm mb-8 max-w-md italic">
                            Select a seasonal matrix and hierarchy level to fetch detailed participant analytics from the secure database.
                        </p>
                        <SessionSelector
                            availableSeasons={availableSeasons}
                            currentSession={currentSession}
                            onSessionChange={(s) => setCurrentSession(s)}
                        />
                        <button
                            onClick={() => setIsSessionActive(true)}
                            className="mt-8 px-10 py-4 bg-accent text-background font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_30px_rgba(0,255,157,0.2)] active:scale-95"
                        >
                            Establish Connection
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 p-4 bg-white/5 border border-white/10 rounded-sm">
                            <SessionSelector
                                compact
                                availableSeasons={availableSeasons}
                                currentSession={currentSession}
                                onSessionChange={(s) => {
                                    setCurrentSession(s);
                                    setIsSessionActive(false);
                                }}
                            />
                            <div className="flex items-center gap-4">
                                <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
                                <span className="text-[10px] font-mono text-accent uppercase font-bold tracking-widest animate-pulse flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                                    Live_Sync: Active
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
                            <div className="glass-panel p-8 flex flex-col justify-center border-accent/20">
                                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Total Participants</span>
                                <span className="text-4xl font-bold text-accent">{allUsers.length}</span>
                            </div>
                            <div className="lg:col-span-3 glass-panel p-8 flex flex-col justify-center border-white/5">
                                <div className="flex items-center gap-8 overflow-x-auto py-2">
                                    <div className="flex flex-col shrink-0">
                                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Avg. Points</span>
                                        <span className="text-2xl font-bold text-white">
                                            {Math.round(allUsers.reduce((acc, u) => acc + (u.totalPoints || 0), 0) / (allUsers.length || 1))}
                                        </span>
                                    </div>
                                    <div className="w-[1px] h-10 bg-white/5" />
                                    <div className="flex flex-col shrink-0">
                                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Total Points</span>
                                        <span className="text-2xl font-bold text-white">
                                            {allUsers.reduce((acc, u) => acc + (u.totalPoints || 0), 0)}
                                        </span>
                                    </div>
                                    <div className="w-[1px] h-10 bg-white/5" />
                                    <div className="flex flex-col shrink-0">
                                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Total Admins</span>
                                        <span className="text-2xl font-bold text-white">
                                            {allAdmins.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mb-8">
                            <button
                                onClick={() => setActiveTab('participants')}
                                className={`px-8 py-3 font-mono text-xs tracking-widest border transition-all flex items-center gap-2 ${activeTab === 'participants' ? 'bg-accent text-background border-accent shadow-[0_0_20px_rgba(0,255,157,0.3)]' : 'bg-transparent text-white/60 border-white/10 hover:border-accent/40 hover:text-white'}`}
                            >
                                <Users size={14} /> PARTICIPANTS ({allUsers.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('admins')}
                                className={`px-8 py-3 font-mono text-xs tracking-widest border transition-all flex items-center gap-2 ${activeTab === 'admins' ? 'bg-accent text-background border-accent shadow-[0_0_20px_rgba(0,255,157,0.3)]' : 'bg-transparent text-white/60 border-white/10 hover:border-accent/40 hover:text-white'}`}
                            >
                                <Shield size={14} /> ADMINISTRATORS ({allAdmins.length})
                            </button>
                        </div>

                        <div className="glass-panel overflow-hidden border-white/5">
                            <div className="bg-white/5 px-8 py-4 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {activeTab === 'participants' ? <Users className="text-accent" size={18} /> : <Shield className="text-accent" size={18} />}
                                    <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase">
                                        {activeTab === 'participants' ? 'Participant Database' : 'System Administrators'}
                                    </span>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left font-mono text-sm">
                                    <thead className="border-b border-white/5 bg-black/20">
                                        {activeTab === 'participants' ? (
                                            <tr>
                                                <th className="px-8 py-6 text-[10px] text-white/40 uppercase tracking-widest">ID / Roll No</th>
                                                <th className="px-8 py-6 text-[10px] text-white/40 uppercase tracking-widest">Full Name</th>
                                                <th className="px-8 py-6 text-[10px] text-white/40 uppercase tracking-widest text-center">Score</th>
                                                <th className="px-8 py-6 text-[10px] text-white/40 uppercase tracking-widest">Attendance</th>
                                                <th className="px-8 py-6 text-right text-[10px] text-white/40 uppercase tracking-widest">Actions</th>
                                            </tr>
                                        ) : (
                                            <tr>
                                                <th className="px-8 py-6 text-[10px] text-white/40 uppercase tracking-widest">Administrator Email</th>
                                                <th className="px-8 py-6 text-[10px] text-white/40 uppercase tracking-widest text-right">Status</th>
                                            </tr>
                                        )}
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {activeTab === 'participants'
                                            ? allUsers.map((u, idx) => (
                                                <tr key={idx} className="hover:bg-accent/5 transition-colors group">
                                                    <td className="px-8 py-6 font-black text-white group-hover:text-accent transition-colors tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{u.rollNo}</td>
                                                    <td className="px-8 py-6 text-white font-bold tracking-tight">{u.name}</td>
                                                    <td className="px-8 py-6 text-center">
                                                        <span className="bg-accent/10 border border-accent/20 px-4 py-1.5 text-accent font-bold rounded-sm shadow-[0_0_15px_rgba(0,255,157,0.1)]">
                                                            {u.totalPoints}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 font-mono text-xs">
                                                        <span className="text-accent font-bold">{u.attendanceSummary?.daysPresent || 0}P</span>
                                                        <span className="mx-2 text-white/20">|</span>
                                                        <span className="text-red-400 font-bold">{u.attendanceSummary?.daysAbsent || 0}A</span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <button
                                                            onClick={() => setSelectedUser(u)}
                                                            className="p-3 bg-white/5 hover:bg-accent text-white group-hover:text-background rounded-sm transition-all border border-white/10"
                                                            title="View Full Profile"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                            : allAdmins.map((adm, idx) => (
                                                <tr key={idx} className="hover:bg-accent/5 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-white group-hover:text-accent transition-colors tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                                                                {adm.name?.toUpperCase() || "SYSTEM_ADMIN"}
                                                            </span>
                                                            <span className="text-[10px] text-white/60 mt-1">{adm.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <span className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold rounded-sm uppercase tracking-widest shadow-[0_0_10px_rgba(0,255,157,0.1)]">
                                                            AUTHORIZED_ADMIN
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
                    </>
                )}
            </div>
        );
    }

    // Participant View
    return (
        <div className="pt-24 pb-12 px-6 max-w-6xl mx-auto">
            {/* Global Reminder Banner is now handled in App.jsx */}

            {!isSessionActive ? (
                <div className="glass-panel p-12 flex flex-col items-center justify-center text-center border-accent/20 bg-accent/5 backdrop-blur-xl">
                    <Layers size={48} className="text-accent mb-6 animate-pulse" />
                    <h2 className="text-2xl font-display font-bold text-white mb-4 uppercase tracking-tighter">Initialize User Protocol</h2>
                    <p className="text-white/40 font-mono text-sm mb-8 max-w-md italic">
                        Select a seasonal matrix and hierarchy level to synchronize your local identity with the global scoring grid.
                    </p>
                    <SessionSelector
                        availableSeasons={availableSeasons}
                        currentSession={currentSession}
                        onSessionChange={(s) => setCurrentSession(s)}
                    />
                    <button
                        onClick={() => setIsSessionActive(true)}
                        className="mt-8 px-10 py-4 bg-accent text-background font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_30px_rgba(0,255,157,0.2)] active:scale-95"
                    >
                        Synchronize Identity
                    </button>
                </div>
            ) : (
                <>
                    <div className="mb-12">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 p-4 bg-white/5 border border-white/10 rounded-sm">
                            <div className="flex flex-col">
                                <span className="text-accent font-mono text-xs font-bold tracking-[0.3em] uppercase">Identity Matrix : {user?.rollNo}</span>
                                <span className="text-[10px] text-white/40 font-mono uppercase mt-1 italic">Status: Live_Linked_{currentSession.season}_{currentSession.level}</span>
                            </div>
                            <SessionSelector
                                compact
                                availableSeasons={availableSeasons}
                                currentSession={currentSession}
                                onSessionChange={(s) => fetchHistoricalRecord(s)}
                            />
                        </div>

                        {/* LeetCode Username Setup Banner */}
                        {!profile?.leetcode_username && !isEditingUsername && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8 p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-sm relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <div className="w-14 h-14 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/30 flex-shrink-0">
                                        <AlertTriangle size={24} className="text-amber-400" />
                                    </div>
                                    <div className="flex-grow text-center sm:text-left">
                                        <h3 className="text-lg font-display font-bold text-white uppercase tracking-tight mb-1">
                                            Link Your LeetCode Account
                                        </h3>
                                        <p className="text-xs font-mono text-white/50 leading-relaxed">
                                            We need your LeetCode username to verify your submissions and track your progress.
                                            Without it, you won't be able to complete assignments or earn revisit credits.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setUsernameInput('');
                                            setIsEditingUsername(true);
                                        }}
                                        className="px-8 py-3 bg-amber-500 text-background font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex-shrink-0 whitespace-nowrap"
                                    >
                                        Set Username Now
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Inline Username Editor Modal */}
                        <AnimatePresence>
                            {isEditingUsername && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="fixed inset-0 z-50 flex items-center justify-center p-6"
                                >
                                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsEditingUsername(false)} />
                                    <motion.div
                                        initial={{ y: 20 }}
                                        animate={{ y: 0 }}
                                        className="relative w-full max-w-md glass-panel overflow-hidden border-accent/20 shadow-[0_0_50px_rgba(0,255,157,0.15)]"
                                    >
                                        <div className="h-1.5 bg-accent shadow-[0_0_20px_rgba(0,255,157,0.5)]" />
                                        <div className="p-8">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center border border-accent/20">
                                                    <ExternalLink size={18} className="text-accent" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-display font-bold text-white uppercase tracking-tight">
                                                        {profile?.leetcode_username ? 'Update LeetCode ID' : 'Link LeetCode Account'}
                                                    </h3>
                                                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                                                        {profile?.leetcode_username ? 'Currently: ' + profile.leetcode_username : 'Required for verification'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mb-6">
                                                <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">
                                                    LeetCode Username
                                                </label>
                                                <div className="flex items-center bg-black/40 border border-white/10 rounded-sm overflow-hidden focus-within:border-accent transition-colors">
                                                    <span className="px-3 text-white/20 font-mono text-xs">leetcode.com/u/</span>
                                                    <input
                                                        type="text"
                                                        placeholder="your-username"
                                                        value={usernameInput}
                                                        onChange={(e) => setUsernameInput(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleUpdateUsername()}
                                                        autoFocus
                                                        className="flex-1 bg-transparent px-3 py-3 text-sm font-mono text-white focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setIsEditingUsername(false)}
                                                    className="flex-1 px-4 py-3 border border-white/10 text-white/40 hover:text-white font-mono text-[10px] uppercase tracking-widest transition-all hover:border-white/20"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleUpdateUsername}
                                                    disabled={usernameLoading || !usernameInput.trim()}
                                                    className="flex-1 px-4 py-3 bg-accent text-background font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,157,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {usernameLoading ? 'Saving...' : 'Save Username'}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 glass-panel p-6 sm:p-10 relative overflow-hidden group border-white/5">
                                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                                    <User size={160} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-8 sm:mb-10 text-center sm:text-left">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent/10 rounded-full flex items-center justify-center border border-accent/20 ring-4 ring-accent/5">
                                            <span className="text-2xl sm:text-3xl font-black text-accent">{user?.name?.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <h1 className="text-4xl font-display font-bold tracking-tighter text-white">{user?.name}</h1>
                                            <div className="flex flex-wrap items-center gap-3 mt-4">
                                                <div className={`flex items-center gap-2 px-3 py-1 border rounded-sm cursor-pointer transition-all ${profile?.leetcode_username
                                                    ? 'bg-white/5 border-white/10 hover:border-accent/30'
                                                    : 'bg-amber-500/10 border-amber-500/30 animate-pulse'
                                                    }`} onClick={handleUpdateUsername}>
                                                    <span className="text-[15px] font-mono text-white/40 uppercase tracking-widest font-bold">LEETCODE-IDENTITY:</span>
                                                    <span className={`text-[15px] font-mono uppercase tracking-widest ${profile?.leetcode_username ? 'text-accent font-bold' : 'text-amber-400 font-bold'
                                                        }`}>
                                                        {profile?.leetcode_username || '⚠ NOT_LINKED — CLICK TO SET'}
                                                    </span>
                                                </div>
                                                {/* <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-sm">
                                                    <Zap size={10} className="text-accent" />
                                                    <span className="text-[10px] font-mono text-accent font-black uppercase tracking-widest">Active_Protocol</span>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest mb-1 italic">Total Points</span>
                                            <span className="text-4xl font-black text-accent drop-shadow-[0_0_15px_rgba(0,255,157,0.4)]">{profile?.totalPoints || 0}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest mb-1 italic">Global Rank</span>
                                            <span className="text-4xl font-black text-white">{userRank ? `#${userRank}` : '--'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest mb-1 italic">Days Present</span>
                                            <span className="text-4xl font-black text-white">{profile?.attendanceSummary?.daysPresent || 0}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest mb-1 italic">Days Absent</span>
                                            <span className="text-4xl font-black text-red-500/80">{profile?.attendanceSummary?.daysAbsent || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-panel p-0 flex flex-col items-center justify-center text-center border-white/5 relative group overflow-hidden bg-black/40">
                                <div className="absolute top-8 left-8 z-20 pointer-events-none">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-1.5 h-1.5 bg-accent animate-pulse rounded-full" />
                                        <h3 className="font-display font-bold text-xl text-white tracking-tight drop-shadow-2xl">IDENTITY_VOID</h3>
                                    </div>
                                </div>
                                <div className="w-full h-full min-h-[350px]">
                                    <UserAvatar seed={user?.rollNo || '007'} totalPoints={profile?.totalPoints || 0} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Score History */}
                    <div className="flex items-center justify-between mb-8 mt-12">
                        <h2 className="text-3xl font-display font-bold text-white tracking-tighter flex items-center gap-4">
                            <Calendar className="text-accent" size={28} /> SCORE_HISTORY
                        </h2>
                        <div className="h-[1px] flex-1 mx-8 bg-gradient-to-r from-white/10 to-transparent hidden sm:block" />
                    </div>

                    <div className="glass-panel overflow-hidden border-white/5">
                        <table className="w-full text-left font-mono text-sm">
                            <thead className="border-b border-white/5 bg-white/5">
                                <tr>
                                    <th className="px-8 py-6 text-[10px] text-white/40 uppercase tracking-widest">Date / Index</th>
                                    <th className="px-8 py-6 text-[10px] text-white/40 uppercase tracking-widest">Delta Points</th>
                                    <th className="px-8 py-6 text-[10px] text-white/40 uppercase tracking-widest">Status Code</th>
                                    <th className="px-8 py-6 text-[10px] text-white/40 uppercase tracking-widest">System Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {history.length > 0 ? (
                                    history.map((entry, idx) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-8 py-6 text-white group-hover:text-accent transition-colors">{entry.date}</td>
                                            <td className="px-8 py-6 font-bold text-accent">+{entry.points}</td>
                                            <td className="px-8 py-6">
                                                <span className={`px-2 py-1 text-[10px] font-bold rounded-sm border uppercase ${entry.status === 'present' ? 'text-accent border-accent/20 bg-accent/5' : 'text-red-400 border-red-500/20 bg-red-500/5'}`}>
                                                    {entry.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-white/40 italic">{entry.remarks || '---'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center text-white/20 italic font-mono uppercase tracking-widest">
                                            No transaction history found for this identifier.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            <AnimatePresence>
                {historicalRecord && <HistoricalRecordModal record={historicalRecord} onClose={() => setHistoricalRecord(null)} />}
                {showValidationLocal && (
                    <ValidationModal
                        question={selectedQuestionLocal}
                        onClose={() => setShowValidationLocal(false)}
                        onVerify={handleVerifyCompletion}
                    />
                )}
            </AnimatePresence>

            {modalLoading && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/40 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(0,255,157,0.3)]" />
                        <span className="text-[10px] font-mono text-white/60 uppercase tracking-[0.4em]">Decrypting Archive...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
