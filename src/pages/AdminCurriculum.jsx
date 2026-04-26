import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCurriculum, addCurriculum, deleteCurriculum } from '../services/api';
import { Shield, Calendar, Plus, Trash2, CheckCircle, ExternalLink, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AdminCurriculum = () => {
    const { isAdmin } = useAuth();
    const [curriculum, setCurriculum] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        date: new Date().toISOString().split('T')[0],
        class_questions: '',
        assigned_questions: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await getCurriculum();
            setCurriculum(res.data || []);
        } catch (err) {
            console.error("Failed to fetch curriculum:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);
        try {
            const payload = {
                date: form.date,
                class_questions: form.class_questions.split(',').map(s => s.trim()).filter(s => s),
                assigned_questions: form.assigned_questions.split(',').map(s => s.trim()).filter(s => s)
            };
            await addCurriculum(payload);
            setMessage({ type: 'success', text: 'Curriculum protocol updated successfully.' });
            setForm({ ...form, class_questions: '', assigned_questions: '' });
            fetchData();
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update protocol. Check permissions.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (date) => {
        if (!window.confirm(`Delete curriculum for ${date}?`)) return;
        try {
            await deleteCurriculum(date);
            fetchData();
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    if (!isAdmin) return <div className="pt-32 text-center text-white/40 font-mono uppercase">Unauthorized Access Detected</div>;

    return (
        <div className="pt-24 pb-12 px-6 max-w-5xl mx-auto">
            <Link to="/dashboard" className="flex items-center gap-2 text-white/40 hover:text-accent transition-colors mb-8 font-mono text-xs uppercase tracking-widest">
                <ArrowLeft size={14} /> Back to Command Centre
            </Link>

            <div className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <Shield className="text-accent" size={18} />
                    <span className="text-accent font-mono text-xs font-bold tracking-[0.3em] uppercase">Security Level: Admin</span>
                </div>
                <h1 className="text-5xl font-display font-bold tracking-tighter mb-4 text-white uppercase">CURRICULUM_MANAGER</h1>
                <p className="text-white/40 font-mono text-sm tracking-tight max-w-2xl">
                    Configure daily class lectures and assigned tasks. Data is cached in Vercel Blob for performant delivery.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Entry Form */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleSubmit} className="glass-panel p-8 border-accent/20 sticky top-24">
                        <h2 className="text-lg font-display font-bold text-white uppercase mb-6 tracking-tight flex items-center gap-2">
                            <Plus size={18} className="text-accent" /> NEW_ENTRY
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-2">Execution Date</label>
                                <input 
                                    type="date" 
                                    value={form.date}
                                    onChange={(e) => setForm({...form, date: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-3 text-white font-mono text-xs focus:border-accent outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-2">Class Questions (Comma Separated Slugs)</label>
                                <textarea 
                                    rows="3"
                                    placeholder="two-sum, add-two-numbers"
                                    value={form.class_questions}
                                    onChange={(e) => setForm({...form, class_questions: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-3 text-white font-mono text-xs focus:border-accent outline-none resize-none"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-2">Assigned Questions (Comma Separated Slugs)</label>
                                <textarea 
                                    rows="3"
                                    placeholder="longest-substring, reverse-integer"
                                    value={form.assigned_questions}
                                    onChange={(e) => setForm({...form, assigned_questions: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 rounded-sm px-4 py-3 text-white font-mono text-xs focus:border-accent outline-none resize-none"
                                />
                            </div>

                            {message && (
                                <div className={`p-4 text-[10px] font-mono uppercase border ${message.type === 'success' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                    {message.text}
                                </div>
                            )}

                            <button 
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-accent text-background font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,157,0.2)]"
                            >
                                {submitting ? 'PROCESSING...' : 'UPDATE_CURRICULUM'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* History List */}
                <div className="lg:col-span-2">
                    <div className="space-y-6">
                        {loading ? (
                            <div className="p-20 text-center animate-pulse font-mono text-xs text-white/20 uppercase tracking-[0.5em]">Fetching_Archive...</div>
                        ) : curriculum.length > 0 ? (
                            curriculum.map((item, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={idx} 
                                    className="glass-panel p-6 border-white/5 group relative"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <Calendar size={14} className="text-accent" />
                                                <h3 className="text-xl font-display font-bold text-white tracking-tight">{item.date}</h3>
                                            </div>
                                            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Protocol Index: {curriculum.length - idx}</span>
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(item.date)}
                                            className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-sm"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <span className="text-[10px] font-mono text-white/40 uppercase block mb-3 border-b border-white/5 pb-2">Class Lectures</span>
                                            <div className="space-y-2">
                                                {item.class_questions?.map((slug, qIdx) => (
                                                    <div key={qIdx} className="flex items-center justify-between text-[11px] font-mono text-white/80 bg-white/5 p-2 rounded-sm border border-white/5">
                                                        <span>{slug}</span>
                                                        <a href={`https://leetcode.com/problems/${slug}/`} target="_blank" rel="noreferrer" className="text-white/20 hover:text-accent">
                                                            <ExternalLink size={10} />
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-mono text-white/40 uppercase block mb-3 border-b border-white/5 pb-2">Assigned Tasks</span>
                                            <div className="space-y-2">
                                                {item.assigned_questions?.map((slug, qIdx) => (
                                                    <div key={qIdx} className="flex items-center justify-between text-[11px] font-mono text-accent bg-accent/5 p-2 rounded-sm border border-accent/10">
                                                        <span>{slug}</span>
                                                        <a href={`https://leetcode.com/problems/${slug}/`} target="_blank" rel="noreferrer" className="text-accent/20 hover:text-accent">
                                                            <ExternalLink size={10} />
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="p-20 border border-white/5 border-dashed rounded-sm text-center font-mono text-xs text-white/20 uppercase tracking-widest">
                                No curriculum records found in database.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCurriculum;
