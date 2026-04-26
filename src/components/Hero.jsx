import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Zap, Instagram, Linkedin } from 'lucide-react';

const ELabsModal = ({ onClose }) => (
    <AnimatePresence>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 backdrop-blur-md bg-black/70"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.93, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.93, y: 20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-2xl bg-[#0a0a0a] border border-accent/30 shadow-[0_0_60px_rgba(0,255,157,0.15)] overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Green top bar */}
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-accent to-transparent" />

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-accent/60" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-accent/60" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-accent/60" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-accent/60" />

                {/* Glow blob */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-accent/8 blur-[60px] pointer-events-none" />

                <div className="p-8 md:p-10 pt-12 md:pt-14 relative overflow-y-auto max-h-[85vh]">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-8">
                        <div className="flex items-start gap-6">
                            <img
                                src="https://res.cloudinary.com/dpqdgcipi/image/upload/v1719200986/Trasnparent12_1_d7siyr.png"
                                alt="E Labs Logo"
                                className="w-16 h-16 object-contain"
                            />
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                    <span className="text-[10px] font-mono text-accent/70 uppercase tracking-[0.3em] font-bold">Community Platform</span>
                                </div>
                                <h2 className="text-4xl font-black tracking-tighter text-white">
                                    E <span className="text-accent">Labs</span>
                                </h2>
                                <div className="mt-1 h-[1px] w-16 bg-gradient-to-r from-accent/60 to-transparent" />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 text-white/30 hover:text-accent hover:bg-accent/10 rounded-sm transition-all border border-transparent hover:border-accent/20 z-[210]"
                    >
                        <X size={18} />
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-6">
                        <Zap size={14} className="text-accent shrink-0" />
                        <div className="h-[1px] flex-1 bg-white/5" />
                    </div>

                    {/* Body */}
                    <div className="space-y-4">
                        <p className="text-white/70 leading-relaxed text-sm md:text-base font-light tracking-wide">
                            E Labs is a student-run peer-to-peer technical engagement platform designed to empower learners. We go beyond the confines of traditional academic curricula, offering a diverse range of courses and projects that cater to your unique interests and professional aspirations.
                        </p>
                        <p className="text-white/70 leading-relaxed text-sm md:text-base font-light tracking-wide">
                            Our platform provides a dynamic and collaborative learning environment where you can connect with fellow students, share knowledge, and work together on challenging projects. By actively engaging with your peers, you gain valuable real-world experience, develop essential soft skills, and bridge the critical gap between theoretical knowledge and the ever-evolving demands of the professional world.
                        </p>
                        <p className="text-white/70 leading-relaxed text-sm md:text-base font-light tracking-wide">
                            At E Labs, we believe in the power of collaborative learning and mentorship to foster innovation, creativity, and personal growth. Join us on this exciting journey of discovery and unlock your full potential.
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-4">
                        <a
                            href="https://www.instagram.com/elabs.kiit/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-accent/20 bg-accent/5 hover:bg-accent/10 hover:border-accent/40 group transition-all"
                        >
                            <Instagram size={14} className="text-accent/70 group-hover:text-accent transition-colors" />
                            <span className="text-[10px] font-mono text-accent/70 group-hover:text-accent uppercase tracking-[0.2em] font-medium transition-colors">@elabs.kiit</span>
                        </a>
                        <a
                            href="https://www.linkedin.com/company/kiit-elabs/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-accent/20 bg-accent/5 hover:bg-accent/10 hover:border-accent/40 group transition-all"
                        >
                            <Linkedin size={14} className="text-accent/70 group-hover:text-accent transition-colors" />
                            <span className="text-[10px] font-mono text-accent/70 group-hover:text-accent uppercase tracking-[0.2em] font-medium transition-colors">LinkedIn</span>
                        </a>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    </AnimatePresence>
);

const Hero = () => {
    const [showModal, setShowModal] = useState(false);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
    };

    return (
        <>
            {showModal && <ELabsModal onClose={() => setShowModal(false)} />}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 px-4 overflow-hidden">
                {/* Background Decorative Element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 text-center"
                >
                    <motion.div variants={itemVariants} className="inline-block mb-4 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                        <span className="text-accent text-xs font-mono tracking-widest uppercase">E Labs Presents</span>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 mb-4 text-[10px] md:text-xs font-mono font-bold tracking-[0.4em] text-accent/60 uppercase">
                        <span>{import.meta.env.VITE_CURRENT_SEASON || 'N/A'}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-accent/30" />
                        <span>{import.meta.env.VITE_CURRENT_LEVEL || 'N/A'}</span>
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-6xl md:text-9xl font-bold mb-6 tracking-tighter"
                    >
                        LEET<span className="text-accent neon-text">VERSE</span>
                    </motion.h1>

                    <motion.div variants={itemVariants} className="mb-10 max-w-2xl mx-auto">
                        <p className="text-2xl md:text-3xl text-text-secondary font-mono terminal-text uppercase tracking-widest">
                            CODING. DSA. CONTEST.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => document.getElementById('leaderboard').scrollIntoView({ behavior: 'smooth' })}
                            className="group relative px-8 py-4 bg-accent text-background font-bold text-lg overflow-hidden transition-all hover:pr-12 shadow-[0_0_20px_rgba(0,255,157,0.3)]"
                        >
                            <span className="relative z-10">VIEW LEADERBOARD</span>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">→</span>
                        </button>

                        <button
                            onClick={() => setShowModal(true)}
                            className="group px-8 py-4 border border-accent/40 text-white font-bold text-lg hover:border-accent hover:text-accent hover:shadow-[0_0_20px_rgba(0,255,157,0.2)] transition-all duration-300"
                        >
                            ABOUT E <span className="text-accent">LABS</span>
                        </button>
                    </motion.div>
                </motion.div>


            </section>
        </>
    );
};

export default Hero;
