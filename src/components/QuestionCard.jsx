import React from 'react';
import { ExternalLink, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const QuestionCard = ({ question, type, onComplete, status }) => {
    // type: 'class' | 'assigned' | 'extra'
    // status: 'pending' | 'done' | 'missed'
    
    const slug = typeof question === 'string' ? question : question.slug;
    const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const lcLink = `https://leetcode.com/problems/${slug}/`;

    return (
        <div className={`p-5 rounded-sm border transition-all group ${
            status === 'done' ? 'bg-accent/5 border-accent/20' : 
            status === 'missed' ? 'bg-red-500/5 border-red-500/20' : 
            'bg-white/5 border-white/10 hover:border-white/20'
        }`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-sm uppercase font-bold ${
                            type === 'class' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            type === 'assigned' ? 'bg-accent/10 text-accent border border-accent/20' :
                            'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}>
                            {type}
                        </span>
                        {status === 'done' && <CheckCircle size={10} className="text-accent" />}
                        {status === 'missed' && <AlertCircle size={10} className="text-red-400" />}
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-accent transition-colors leading-tight mb-2">
                        {title}
                    </h4>
                    <div className="flex items-center gap-4 text-[10px] font-mono text-white/40">
                        <a 
                            href={lcLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-1 hover:text-white transition-colors"
                        >
                            <ExternalLink size={10} /> LC_SLUG: {slug}
                        </a>
                    </div>
                </div>

                {(type === 'assigned' || type === 'class') && !status && (
                    <button
                        onClick={() => onComplete(slug)}
                        className="px-3 py-1.5 bg-accent/10 hover:bg-accent text-accent hover:text-background border border-accent/20 text-[10px] font-black uppercase tracking-widest transition-all rounded-sm shrink-0"
                    >
                        Mark Done
                    </button>
                )}
                
                {status && (
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2 px-2 py-1 bg-accent/20 border border-accent/20 rounded-sm">
                            <CheckCircle size={12} className="text-accent" />
                            <span className="text-[10px] font-black text-accent uppercase tracking-tighter">Verified</span>
                        </div>
                        {status === 'pending' && (
                            <span className="text-[8px] font-mono text-white/40 uppercase">Revisit Scheduled</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionCard;
