import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getMembers } from '../services/api';
import { Users, Crown, Star, Instagram, Linkedin, Github, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

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
                {/* Image with Google Drive direct link handling */}
                {(() => {
                    const placeholderUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder";
                    const getDirectImageUrl = (url) => {
                        if (!url) return "";
                        const driveRegex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/;
                        const match = url.match(driveRegex);
                        if (match && match[1]) {
                            return `https://drive.google.com/uc?export=download&id=${match[1]}`;
                        }
                        return url;
                    };
                    const photoSrc = person.photoUrl ? getDirectImageUrl(person.photoUrl) : placeholderUrl;
                    return (
                        <img
                            src={photoSrc}
                            alt={person.name}
                            className="w-full h-full object-cover transition-all duration-500"
                        />
                    );
                })()}
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
    const [members, setMembers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                // Fetch members data directly via backend cached endpoint
                const response = await getMembers();
                const fetchedData = response.data;
                
                if (!fetchedData) {
                    throw new Error("No data returned from members cache.");
                }
                
                // Normalize keys (handle 'president' vs 'President', 'vice-president' vs 'Vice President')
                const normalizedData = {};
                for (const key in fetchedData) {
                    const normKey = key.toLowerCase().replace('-', ' ');
                    normalizedData[normKey] = fetchedData[key] || [];
                }
                
                // Ensure required keys exist
                if (!normalizedData['president']) normalizedData['president'] = [];
                if (!normalizedData['vice president']) normalizedData['vice president'] = [];
                
                setMembers(normalizedData);
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
                                <MemberCard key={person.id || person.rollNo || i} person={person} index={i} />
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

                    {members['vice president'].length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {members['vice president'].map((person, i) => (
                                <MemberCard key={person.id || person.rollNo || i} person={person} index={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-12 border border-white/5 bg-white/[0.02] rounded-3xl">
                            <p className="text-white/20 font-mono text-xs uppercase tracking-widest">Roster currently empty</p>
                        </div>
                    )}
                </section>


                    {/* Dynamic Domain Sections */}
                    {Object.entries(members).map(([domain, persons]) => {
                        // Skip president and vice president as they are handled above
                        if (domain === 'president' || domain === 'vice president' || domain === 'vice-president') return null;
                        
                        return (
                            <section key={domain} className="mb-24">
                                <div className="flex items-center gap-4 mb-12">
                                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                    <h3 className="flex items-center gap-3 text-accent font-mono text-sm tracking-[0.3em] uppercase">
                                        <Users size={20} className="text-accent" /> {domain}
                                    </h3>
                                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                </div>

                                {persons.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                                        {persons
                                            .sort((a, b) => {
                                                // Sort by position: Leads first, then Ass. Lead, then Members
                                                const posA = (a.position || '').toLowerCase();
                                                const posB = (b.position || '').toLowerCase();
                                                if (posA.includes('lead') && !posB.includes('lead')) return -1;
                                                if (!posA.includes('lead') && posB.includes('lead')) return 1;
                                                return 0;
                                            })
                                            .map((person, i) => (
                                            <MemberCard key={person.id || person.rollNo || i} person={person} index={i} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center p-12 border border-white/5 bg-white/[0.02] rounded-3xl">
                                        <p className="text-white/20 font-mono text-xs uppercase tracking-widest">Roster currently empty</p>
                                    </div>
                                )}
                            </section>
                        );
                    })}

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
