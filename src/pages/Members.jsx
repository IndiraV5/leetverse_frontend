import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Users, Crown, Star, Instagram, Linkedin, Github, Loader2, AlertCircle, GraduationCap, Palette, Megaphone, Film, Code, Briefcase, X } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

const DOMAINS = [
    { id: 'web-dev', name: 'WEB DEV', icon: Code },
    { id: 'mentoring', name: 'MENTORING', icon: GraduationCap },
    { id: 'marketing-pr', name: 'MARKETING & PR', icon: Megaphone },
    { id: 'design', name: 'DESIGN', icon: Palette },
    { id: 'video-editing', name: 'VIDEO EDITING', icon: Film }
];

const MemberCard = ({ person, index }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    // Subtle image movement for depth
    const imgX = useTransform(mouseXSpring, [-0.5, 0.5], ["-5px", "5px"]);
    const imgY = useTransform(mouseYSpring, [-0.5, 0.5], ["-5px", "5px"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-accent/30 transition-all group/card flex flex-col items-center text-center relative overflow-hidden"
        >
            <motion.div
                style={{
                    x: imgX,
                    y: imgY,
                    transformZ: "50px"
                }}
                className="w-27 h-27 rounded-full overflow-hidden border-2 border-accent/20 group-hover/card:border-accent transition-all mb-6 relative z-10"
            >
                <img
                    src={person.photoUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder"}
                    alt={person.name}
                    className="w-full h-full object-cover transition-all duration-500"
                />
            </motion.div>

            <motion.h4
                style={{ transformZ: "30px" }}
                className="text-xl font-display font-bold text-white mb-2 tracking-tight z-10"
            >
                {person.name}
            </motion.h4>

            <motion.div
                style={{ transformZ: "20px" }}
                className="flex items-center gap-4 mt-4 z-10"
            >
                {person.instagram && (
                    <a href={person.instagram} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-accent transition-colors">
                        <Instagram size={18} />
                    </a>
                )}
                {person.linkedin && (
                    <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-accent transition-colors">
                        <Linkedin size={18} />
                    </a>
                )}
                {person.github && (
                    <a href={person.github} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-accent transition-colors">
                        <Github size={18} />
                    </a>
                )}
            </motion.div>

            {/* Background Glow that follows mouse */}
            <motion.div
                className="absolute inset-0 bg-accent/5 opacity-0 group-hover/card:opacity-100 transition-opacity"
                style={{
                    background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 157, 0.1) 0%, transparent 80%)`,
                }}
            />
        </motion.div>
    );
};

const Members = () => {
    const [members, setMembers] = useState({ 
        president: [], 
        'vice-president': [],
        mentoring: [],
        design: [],
        'marketing-pr': [],
        'video-editing': [],
        'web-dev': [],
        administration: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDomain, setSelectedDomain] = useState(null);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                // console.log("Fetching members from Firestore...");
                const roles = [
                    'president', 
                    'vice-president', 
                    'mentoring', 
                    'design', 
                    'marketing-pr', 
                    'marketing-and-pr', 
                    'video-editing', 
                    'web-dev', 
                    'web-development', 
                    'administration'
                ];
                const fetchedData = {
                    president: [],
                    'vice-president': [],
                    mentoring: [],
                    design: [],
                    'marketing-pr': [],
                    'video-editing': [],
                    'web-dev': [],
                    administration: []
                };

                for (const role of roles) {
                    try {
                        const personsRef = collection(db, 'members', role, 'persons');
                        const snapshot = await getDocs(personsRef);
                        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        
                        if (role === 'marketing-and-pr' || role === 'marketing-pr') {
                            fetchedData['marketing-pr'] = [...(fetchedData['marketing-pr'] || []), ...data];
                        } else if (role === 'web-development' || role === 'web-dev') {
                            fetchedData['web-dev'] = [...(fetchedData['web-dev'] || []), ...data];
                        } else {
                            fetchedData[role] = data;
                        }
                    } catch (e) {
                        console.error(`Error fetching ${role}:`, e);
                    }
                }

                setMembers(fetchedData);
            } catch (err) {
                console.error("Error fetching members:", err);
                setError("Unable to sync with database. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Loader2 className="text-accent animate-spin" size={48} />
                    <p className="text-accent/40 font-mono text-xs uppercase tracking-widest">Loading...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-6">
                <div className="text-center p-8 border border-red-500/20 bg-red-500/5 rounded-2xl max-w-md">
                    <AlertCircle className="text-red-400 mx-auto mb-4" size={48} />
                    <h3 className="text-white font-display text-xl mb-2">Sync Error</h3>
                    <p className="text-white/40 text-sm mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all rounded-lg font-mono text-xs uppercase"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-40 px-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-[160px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/[0.03] rounded-full blur-[160px] animate-pulse delay-700" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="text-center mb-24"
                >
                    <h2 className="text-accent font-mono text-sm tracking-[0.5em] uppercase mb-4">Core Team</h2>
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                        MEMBERS
                    </h1>
                    <div className="h-1 w-24 bg-accent mx-auto mb-8" />
                    <p className="text-white/60 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                        Setting things up. Our team structure is being refined and members will be listed here soon.
                    </p>
                </motion.div>

                {/* President Section */}
                <section className="mb-24">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <h3 className="flex items-center gap-3 text-accent font-mono text-sm tracking-[0.3em] uppercase">
                            <Crown size={20} className="text-accent" /> President
                        </h3>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    {members.president.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {members.president.map((person, i) => (
                                <MemberCard key={person.id} person={person} index={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-12 border border-white/5 bg-white/[0.02] rounded-3xl">
                            <p className="text-white/20 font-mono text-xs uppercase tracking-widest">Roster currently empty</p>
                        </div>
                    )}
                </section>

                {/* Vice President Section */}
                <section className="mb-32">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <h3 className="flex items-center gap-3 text-accent font-mono text-sm tracking-[0.3em] uppercase">
                            <Star size={20} className="text-accent" /> Vice President
                        </h3>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    {members['vice-president'].length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {members['vice-president'].map((person, i) => (
                                <MemberCard key={person.id} person={person} index={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-12 border border-white/5 bg-white/[0.02] rounded-3xl">
                            <p className="text-white/20 font-mono text-xs uppercase tracking-widest">Roster currently empty</p>
                        </div>
                    )}
                </section>

                {/* Domains Section */}
                <section className="mb-32">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <h3 className="flex items-center gap-3 text-accent font-mono text-sm tracking-[0.3em] uppercase">
                            <Users size={20} className="text-accent" /> Domains
                        </h3>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {DOMAINS.map((domain, i) => {
                            const Icon = domain.icon;
                            const count = members[domain.id]?.length || 0;
                            return (
                                <motion.div
                                    key={domain.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.05 }}
                                    whileHover={{ scale: 1.03, translateY: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedDomain(domain)}
                                    className="p-8 bg-black/40 border border-accent/30 rounded-2xl hover:border-accent/80 hover:shadow-[0_0_30px_rgba(0,255,157,0.15)] transition-all cursor-pointer flex flex-col items-center justify-center text-center aspect-[4/3] group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    
                                    <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent/20 group-hover:border-accent/50 transition-all shadow-[0_0_15px_rgba(0,255,157,0.05)]">
                                        <Icon className="text-accent group-hover:scale-110 transition-transform" size={28} />
                                    </div>

                                    <h4 className="text-lg font-display font-black text-white uppercase tracking-wider mb-2">
                                        {domain.name}
                                    </h4>
                                    
                                    <div className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                                        <span className="text-[9px] font-mono font-bold text-accent tracking-widest uppercase">
                                            {count} {count === 1 ? 'MEMBER' : 'MEMBERS'}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* Coming Soon Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="relative mt-20 group"
                >
                    <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-transparent to-background z-20" />

                    <div className="relative z-10 opacity-5 blur-sm pointer-events-none grayscale overflow-hidden">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="aspect-square bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center p-6">
                                    <Users size={32} className="text-white/20 mb-4" />
                                    <div className="h-2 w-full bg-white/10 rounded" />
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <h2 className="text-5xl sm:text-7xl md:text-9xl font-display font-black tracking-tighter text-white/5 uppercase select-none">
                                Coming Soon
                            </h2>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="px-8 py-3 border border-accent/20 bg-background/80 backdrop-blur-md rounded-full shadow-2xl"
                                >
                                    <p className="text-accent font-mono text-sm tracking-[0.4em] uppercase font-bold">More roles</p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Domain Members Popup Modal */}
                <AnimatePresence>
                    {selectedDomain && (
                        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-background/95">
                            {/* Backdrop Click */}
                            <div 
                                className="absolute inset-0 cursor-default" 
                                onClick={() => setSelectedDomain(null)} 
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-5xl bg-[#0a0a0a]/90 backdrop-blur-md p-8 md:p-12 border border-accent/20 rounded-2xl overflow-y-auto max-h-[85vh] z-10 shadow-[0_0_50px_rgba(0,255,157,0.15)] scrollbar-thin"
                            >
                                {/* Close Button */}
                                <button 
                                    onClick={() => setSelectedDomain(null)} 
                                    className="absolute top-6 right-6 text-white/40 hover:text-accent hover:rotate-90 transition-all duration-300 p-2 hover:bg-white/5 rounded-full"
                                >
                                    <X size={20} />
                                </button>

                                {/* Header */}
                                <div className="flex flex-col items-center text-center mb-12">
                                    <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                                        {React.createElement(selectedDomain.icon, { className: "text-accent", size: 28 })}
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
                                        {selectedDomain.name} DOMAIN
                                    </h2>
                                    <p className="text-[10px] font-mono text-accent uppercase tracking-widest mt-2 font-bold">
                                        Active Roster
                                    </p>
                                    <div className="h-[1px] w-20 bg-accent/30 mt-4" />
                                </div>

                                {/* Members list */}
                                {members[selectedDomain.id]?.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                                        {members[selectedDomain.id].map((person, i) => (
                                            <MemberCard key={person.id} person={person} index={i} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center p-16 border border-white/5 bg-white/[0.01] rounded-2xl flex flex-col items-center">
                                        <Users size={40} className="text-white/10 mb-4 animate-pulse" />
                                        <h4 className="text-white/80 font-display text-lg font-bold mb-1 uppercase tracking-tight">Roster Empty</h4>
                                        <p className="text-white/40 text-xs font-mono max-w-xs uppercase tracking-wider leading-relaxed">
                                            No team members assigned to {selectedDomain.name} yet.
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Footer Note */}
                <div className="mt-40 text-center">
                    <p className="text-white/10 font-mono text-[10px] uppercase tracking-[0.6em]">
                        Synced
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Members;
