import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { uploadExcel, getUploadStatus, getAvailableSeasons } from '../services/api';
import { Upload, FileSpreadsheet, CheckCircle, XCircle, Loader2, RefreshCw, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SessionSelector = ({ availableSeasons, currentSession, onSessionChange, compact = false }) => {
    const selectedSeasonData = availableSeasons.find(s => s.season === currentSession.season) || (availableSeasons.length > 0 ? availableSeasons[0] : null);
    const availableLevels = selectedSeasonData ? selectedSeasonData.levels : [];

    return (
        <div className={`flex flex-wrap items-center gap-4 ${compact ? '' : 'mb-8'}`}>
            {!compact && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-sm">
                    <Layers size={14} className="text-accent" />
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold">Sync Protocol:</span>
                </div>
            )}
            <div className="flex items-center gap-3">
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

const DatePicker = ({ selectedDate, onChange }) => {
    const [viewDate, setViewDate] = useState(new Date(selectedDate));
    const [showPicker, setShowPicker] = useState(false);

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const formatDate = (date) => {
        // Set to noon to avoid timezone shifts when converting to ISO date string
        const d = new Date(date);
        d.setHours(12, 0, 0, 0);
        return d.toISOString().split('T')[0];
    };

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleDateSelect = (day) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day, 12, 0, 0);
        onChange(formatDate(newDate));
        setShowPicker(false);
    };

    const isToday = (day) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            viewDate.getMonth() === today.getMonth() &&
            viewDate.getFullYear() === today.getFullYear()
        );
    };

    const isSelected = (day) => {
        const current = new Date(selectedDate);
        return (
            day === current.getDate() &&
            viewDate.getMonth() === current.getMonth() &&
            viewDate.getFullYear() === current.getFullYear()
        );
    };

    const days = [];
    const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDay = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    for (let d = 1; d <= totalDays; d++) {
        days.push(
            <button
                key={d}
                onClick={() => handleDateSelect(d)}
                className={`h-10 w-10 rounded-sm flex items-center justify-center text-sm font-mono transition-all ${isSelected(d)
                    ? 'bg-accent text-background font-bold'
                    : isToday(d)
                        ? 'border border-accent/40 text-accent'
                        : 'hover:bg-white/10 text-white/80'
                    }`}
            >
                {d}
            </button>
        );
    }

    const monthNames = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setShowPicker(!showPicker)}
                className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 hover:border-accent/40 rounded-sm transition-all group"
            >
                <CalendarIcon size={18} className="text-accent group-hover:scale-110 transition-transform" />
                <span className="text-white font-mono text-sm tracking-widest">{selectedDate}</span>
            </button>

            <AnimatePresence>
                {showPicker && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowPicker(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute mt-4 left-0 z-50 glass-panel p-6 border border-white/10 shadow-2xl min-w-[320px]"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <button onClick={handlePrevMonth} className="p-1 hover:text-accent transition-colors">
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="text-center">
                                    <div className="text-xs font-mono text-white/40 tracking-[0.2em]">{viewDate.getFullYear()}</div>
                                    <div className="text-sm font-display font-black text-white tracking-widest uppercase">
                                        {monthNames[viewDate.getMonth()]}
                                    </div>
                                </div>
                                <button onClick={handleNextMonth} className="p-1 hover:text-accent transition-colors">
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                    <div key={i} className="h-10 w-10 flex items-center justify-center text-[10px] font-mono text-white/30">
                                        {d}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {days}
                            </div>

                            <button
                                onClick={() => {
                                    onChange(formatDate(new Date()));
                                    setShowPicker(false);
                                }}
                                className="mt-6 w-full py-2 border border-white/5 hover:bg-white/5 text-[10px] font-mono text-white/40 hover:text-white transition-all uppercase tracking-widest"
                            >
                                Jump to Today
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

const AdminUpload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error'
    const [message, setMessage] = useState('');
    const [alreadyUploaded, setAlreadyUploaded] = useState(false);
    const [forceUpload, setForceUpload] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [availableSeasons, setAvailableSeasons] = useState([]);
    const [currentSession, setCurrentSession] = useState({
        season: import.meta.env.VITE_CURRENT_SEASON,
        level: import.meta.env.VITE_CURRENT_LEVEL
    });

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await getAvailableSeasons();
                let seasons = res.data;
                const envSeason = import.meta.env.VITE_CURRENT_SEASON;
                const envLevel = import.meta.env.VITE_CURRENT_LEVEL;
                let fs = seasons.find(s => s.season === envSeason);
                if (!fs) seasons = [{ season: envSeason, levels: [envLevel] }, ...seasons];
                else if (!fs.levels.includes(envLevel)) fs.levels = [...fs.levels, envLevel];
                setAvailableSeasons(seasons);
            } catch (err) {
                console.error("Failed to fetch sessions:", err);
            }
        };
        fetchSessions();
    }, []);

    useEffect(() => {
        checkStatus();
    }, [selectedDate, currentSession]);

    const checkStatus = async () => {
        try {
            setAlreadyUploaded(false); // Reset while checking
            const response = await getUploadStatus(selectedDate, currentSession);
            if (response.data.uploaded) {
                setAlreadyUploaded(true);
            }
        } catch (error) {
            console.error('Error checking upload status:', error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setStatus(null);
        setMessage('');
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await uploadExcel(formData, selectedDate, currentSession);
            setStatus('success');
            setAlreadyUploaded(true);
            setForceUpload(false);
            setMessage(`Successfully processed ${response.data.total_processed} entries. Updated ${response.data.updated_count} users.`);
            setFile(null);
        } catch (error) {
            console.error('Upload failed:', error);
            setStatus('error');
            setMessage(error.response?.data?.detail || 'Failed to upload file. Please ensure it follows the correct format.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 pb-12 px-6 max-w-4xl mx-auto">
            <div className="mb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <h1 className="text-4xl font-display font-bold tracking-tighter flex items-center gap-4 text-white">
                        <Upload className="text-accent" size={36} /> ADMIN_PORTAL
                    </h1>
                    
                    <div className="flex items-center gap-3">
                        <Link 
                            to="/admin/curriculum" 
                            className="hidden md:flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 text-white/60 font-mono text-[10px] font-black uppercase tracking-widest hover:border-accent/40 hover:text-accent transition-all rounded-sm"
                        >
                            Curriculum_Manager
                        </Link>
                        <SessionSelector 
                            availableSeasons={availableSeasons}
                            currentSession={currentSession}
                            onSessionChange={setCurrentSession}
                            compact
                        />
                    </div>
                </div>
                
                <p className="text-white/60 font-mono tracking-tight max-w-2xl">
                    Upload daily score sheets to update participant rankings for the current active period. The system will automatically detect <strong>Roll Numbers</strong> from email prefixes and normalize names to <strong>UPPERCASE</strong>.
                </p>
            </div>

            <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 glass-panel p-8 border border-white/5">
                <div>
                    <h3 className="text-xs font-mono text-white/40 uppercase tracking-[0.2em] mb-2">Target Synchronization Date</h3>
                    <p className="text-sm text-white/60 mb-4 font-body">Select the date corresponding to the metrics in your Excel file.</p>
                    <DatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
                </div>

                <div className="flex flex-col items-end">
                    <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-2">Live Status</div>
                    {alreadyUploaded ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                            <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-tighter">Synchronized_{selectedDate}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                            <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-tighter">Awaiting_Data_{selectedDate}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="glass-panel p-12 border-dashed border-2 border-white/10 hover:border-accent/40 transition-all text-center relative overflow-hidden group">
                {alreadyUploaded && !forceUpload ? (
                    <div className="relative z-10 flex flex-col items-center py-8">
                        <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-accent/5">
                            <CheckCircle className="text-accent" size={48} />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-white mb-2 uppercase tracking-tight">DATA_COMMITTED_{selectedDate.replace(/-/g, '_')}</h2>
                        <p className="text-white/60 font-mono text-sm mb-10">Metrics for this period have already been processed and finalized.</p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="px-6 py-3 bg-accent/10 border border-accent/20 rounded-sm">
                                <span className="text-accent font-mono text-xs font-bold tracking-widest uppercase">READY_FOR_NEXT_SESSION</span>
                            </div>
                            <button
                                onClick={() => setForceUpload(true)}
                                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm font-mono text-xs tracking-widest uppercase transition-all flex items-center gap-2 group"
                            >
                                <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" /> FORCE_REUPLOAD
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleUpload} className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <FileSpreadsheet className="text-accent" size={40} />
                        </div>

                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                        />

                        <label
                            htmlFor="file-upload"
                            className="px-8 py-3 bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/40 rounded-sm cursor-pointer font-black text-white text-sm tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                        >
                            {file ? file.name : 'SELECT_DAILY_METRICS'}
                        </label>

                        {file && (
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-8 px-12 py-4 bg-accent text-background font-display font-black text-lg tracking-wider rounded-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,157,0.3)]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" /> COMMITTING_DATA...
                                    </>
                                ) : (
                                    'START_SYNCHRONIZATION'
                                )}
                            </button>
                        )}

                        {forceUpload && (
                            <button
                                type="button"
                                onClick={() => setForceUpload(false)}
                                className="mt-4 text-[10px] font-mono text-white/40 hover:text-white uppercase tracking-widest transition-colors underline underline-offset-4"
                            >
                                Cancel Reupload
                            </button>
                        )}
                    </form>
                )}

                {status === 'success' && (
                    <div className="mt-8 p-6 bg-accent/10 border border-accent/20 rounded-sm flex items-start gap-4 text-left animate-in fade-in slide-in-from-bottom-4">
                        <CheckCircle className="text-accent shrink-0" size={24} />
                        <div>
                            <p className="text-accent font-black tracking-tight">SYNCHRONIZATION_COMPLETE</p>
                            <p className="text-sm text-white/70 mt-1 font-medium">{message}</p>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-sm flex items-start gap-4 text-left animate-in fade-in slide-in-from-bottom-4">
                        <XCircle className="text-red-500 shrink-0" size={24} />
                        <div>
                            <p className="text-red-500 font-black tracking-tight">SYNCHRONIZATION_FAILED</p>
                            <p className="text-sm text-white/70 mt-1 font-medium">{message}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUpload;
