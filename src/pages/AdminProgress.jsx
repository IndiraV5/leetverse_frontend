import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAdminPracticeProgress, getAdminPracticeExport } from '../services/api';
import { Layers, Zap, Calendar, ExternalLink, Activity, X, User, Shield, Download, FileDown, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserProgressModal = ({ user, date, curriculum, onClose }) => {
    if (!user) return null;

    const classQs = curriculum?.class_questions || [];
    const assignQs = curriculum?.assigned_questions || [];

    const renderQuestionList = (title, doneList, missingList, totalList, icon) => {
        if (totalList.length === 0) return null;
        
        return (
            <div className="mb-6 bg-white/5 border border-white/10 p-4 rounded-sm">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-3">
                    {icon}
                    <h4 className="font-display font-bold text-white uppercase tracking-tight">{title}</h4>
                    <span className="ml-auto text-[10px] font-mono text-accent">
                        {doneList.length}/{totalList.length} DONE
                    </span>
                </div>
                
                {doneList.length > 0 && (
                    <div className="mb-3">
                        <span className="text-[10px] font-mono text-accent uppercase tracking-widest block mb-1">Completed</span>
                        <div className="flex flex-wrap gap-2">
                            {doneList.map(q => (
                                <span key={q} className="px-2 py-1 bg-accent/10 border border-accent/20 text-accent text-[10px] font-mono rounded-sm">{q}</span>
                            ))}
                        </div>
                    </div>
                )}
                
                {missingList.length > 0 && (
                    <div>
                        <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest block mb-1">Missing</span>
                        <div className="flex flex-wrap gap-2">
                            {missingList.map(q => (
                                <span key={q} className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono rounded-sm">{q}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-background/80">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border-accent/20 shadow-[0_0_50px_rgba(0,255,157,0.1)]"
            >
                <div className="h-1 bg-accent w-full" />
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-sm"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    <div className="flex items-start gap-6 mb-8">
                        <div className="w-16 h-16 bg-accent/10 rounded-sm flex items-center justify-center border border-accent/20">
                            <span className="text-2xl font-black text-accent font-display">{user.name?.charAt(0) || user.rollNo.charAt(0)}</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-display font-black text-white tracking-tight uppercase">{user.name || 'Unknown'}</h3>
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                <span className="px-2 py-0.5 bg-white/10 text-white font-mono text-xs uppercase tracking-widest rounded-sm border border-white/20">
                                    {user.rollNo}
                                </span>
                                {user.leetcode_username && user.leetcode_username !== "NOT_LINKED" ? (
                                    <a 
                                        href={`https://leetcode.com/${user.leetcode_username}/`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-[10px] font-mono text-accent hover:text-white transition-colors border border-accent/20 px-2 py-0.5 rounded-sm bg-accent/5"
                                    >
                                        <ExternalLink size={10} /> {user.leetcode_username}
                                    </a>
                                ) : (
                                    <span className="text-[10px] font-mono text-red-400 border border-red-500/20 px-2 py-0.5 rounded-sm bg-red-500/5">NO LC LINKED</span>
                                )}
                                <span className="text-[10px] font-mono text-white/40 border border-white/10 px-2 py-0.5 rounded-sm bg-white/5">
                                    TOTAL SOLVED: {user.total_completed}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                        <Calendar size={16} className="text-accent" />
                        <span className="font-mono text-sm tracking-[0.2em] uppercase text-white/70">Progress for: <span className="text-white font-bold">{date}</span></span>
                    </div>

                    {renderQuestionList("Class Tasks", user.class_done, user.class_missing, classQs, <Layers size={14} className="text-blue-400" />)}
                    {renderQuestionList("Assigned Tasks", user.assign_done, user.assign_missing, assignQs, <Zap size={14} className="text-accent" />)}
                    
                    {user.extra?.length > 0 && (
                        <div className="mb-6 bg-white/5 border border-white/10 p-4 rounded-sm">
                            <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-3">
                                <Activity size={14} className="text-purple-400" />
                                <h4 className="font-display font-bold text-white uppercase tracking-tight">Extra Practice</h4>
                                <span className="ml-auto text-[10px] font-mono text-purple-400">
                                    {user.extra.length} SOLVED
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {user.extra.map(q => (
                                    <span key={q} className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-mono rounded-sm">{q}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {classQs.length === 0 && assignQs.length === 0 && user.extra?.length === 0 && (
                        <div className="p-8 text-center border border-white/10 border-dashed rounded-sm">
                            <p className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em]">No activity or tasks for this date.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

const AdminProgress = () => {
    const { isAdmin } = useAuth();
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [data, setData] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!isAdmin) return;
            try {
                const response = await getAdminPracticeProgress();
                setData(response.data);
                if (response.data?.dates?.length > 0) {
                    setSelectedDate(response.data.dates[response.data.dates.length - 1]);
                }
            } catch (error) {
                console.error("Failed to fetch practice progress", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [isAdmin]);

    const handleExport = async (forAll = false) => {
        setExporting(true);
        try {
            const params = forAll ? {} : { date: selectedDate };
            const response = await getAdminPracticeExport(params);
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const filename = forAll ? `practice_report_full.xlsx` : `practice_report_${selectedDate}.xlsx`;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export failed", error);
        } finally {
            setExporting(false);
        }
    };

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="font-mono text-red-500 tracking-widest uppercase text-sm">ACCESS_DENIED</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-background">
                <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
                <p className="text-accent font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">Aggregating_Matrix...</p>
            </div>
        );
    }

    const currentProgress = data?.progress?.[selectedDate] || [];
    const currentCurriculum = data?.curriculum?.[selectedDate] || {};

    return (
        <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <Shield className="text-accent" size={18} />
                    <span className="text-accent font-mono text-xs font-bold tracking-[0.3em] uppercase">Admin_Clearance: Level 5</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-5xl font-display font-bold tracking-tighter mb-4 text-white uppercase">PRACTICE_TRACKER</h1>
                        <p className="text-white/40 font-mono text-sm tracking-tight max-w-2xl">
                            Monitor daily progress, completed tasks, and extra practice across all participants in the network.
                        </p>
                    </div>
                    <button
                        onClick={() => handleExport(true)}
                        disabled={exporting}
                        className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white/60 font-mono text-xs font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all rounded-sm disabled:opacity-50"
                    >
                        <FileDown size={16} /> {exporting ? 'GENERATING...' : 'EXPORT_FULL_SESSION'}
                    </button>
                </div>
            </div>

            {data?.dates?.length === 0 ? (
                <div className="p-20 text-center border border-white/10 border-dashed rounded-sm bg-white/5">
                    <p className="font-mono text-accent uppercase tracking-widest text-sm">No curriculum dates found for this session.</p>
                </div>
            ) : (
                <>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 p-4 bg-white/5 border border-white/10 rounded-sm">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">Select Snapshot:</span>
                            <div className="flex items-center gap-2">
                                <select 
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="bg-black/40 border border-accent/30 text-accent font-mono text-sm px-4 py-2 rounded-sm focus:outline-none focus:border-accent"
                                >
                                    {data?.dates?.map(d => (
                                        <option key={d} value={d} className="bg-background text-white">{d}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => handleExport(false)}
                                    disabled={exporting}
                                    title="Export this day"
                                    className="p-2 bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-background transition-all rounded-sm disabled:opacity-50"
                                >
                                    {exporting ? <RefreshCw size={18} className="animate-spin" /> : <Download size={18} />}
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="flex flex-col text-right">
                                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Class Tasks</span>
                                <span className="text-white font-mono font-bold">{currentCurriculum.class_questions?.length || 0}</span>
                            </div>
                            <div className="w-px bg-white/10 h-8" />
                            <div className="flex flex-col text-right">
                                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Assigned Tasks</span>
                                <span className="text-white font-mono font-bold">{currentCurriculum.assigned_questions?.length || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentProgress.map(user => {
                            const classDone = user.class_done.length;
                            const classTotal = user.class_total;
                            const assignDone = user.assign_done.length;
                            const assignTotal = user.assign_total;
                            const extraTotal = user.extra.length;
                            
                            const isAllDone = classTotal > 0 && assignTotal > 0 && classDone === classTotal && assignDone === assignTotal;

                            return (
                                <motion.div 
                                    key={user.rollNo}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setSelectedUser(user)}
                                    className={`p-5 rounded-sm border cursor-pointer transition-colors ${
                                        isAllDone ? 'bg-accent/5 border-accent/30 hover:bg-accent/10 hover:border-accent/50' : 
                                        'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-display font-bold text-white uppercase truncate max-w-[150px]">{user.name || user.rollNo}</h4>
                                            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{user.rollNo}</span>
                                        </div>
                                        <div className="text-right">
                                            {user.leetcode_username === "NOT_LINKED" ? (
                                                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" title="LC Not Linked" />
                                            ) : (
                                                <span className="text-[10px] font-mono text-accent border border-accent/20 bg-accent/10 px-1.5 py-0.5 rounded-sm">LKD</span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-3">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-mono text-white/40 uppercase">Class</span>
                                            <span className={`text-xs font-mono font-bold ${classDone === classTotal && classTotal > 0 ? 'text-blue-400' : 'text-white'}`}>
                                                {classDone}/{classTotal}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-mono text-white/40 uppercase">Assign</span>
                                            <span className={`text-xs font-mono font-bold ${assignDone === assignTotal && assignTotal > 0 ? 'text-accent' : 'text-white'}`}>
                                                {assignDone}/{assignTotal}
                                            </span>
                                        </div>
                                        <div className="flex flex-col text-right">
                                            <span className="text-[8px] font-mono text-white/40 uppercase">Extra</span>
                                            <span className={`text-xs font-mono font-bold ${extraTotal > 0 ? 'text-purple-400' : 'text-white/40'}`}>
                                                {extraTotal > 0 ? `+${extraTotal}` : '-'}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </>
            )}

            <AnimatePresence>
                {selectedUser && (
                    <UserProgressModal 
                        user={selectedUser} 
                        date={selectedDate}
                        curriculum={currentCurriculum}
                        onClose={() => setSelectedUser(null)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminProgress;
