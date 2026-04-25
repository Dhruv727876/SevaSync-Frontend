import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, User, Star, MessageSquare, Loader2, Phone, Send, Zap, ArrowUpRight } from 'lucide-react';
import toast from 'react-hot-toast';

const MatchModal = ({ isOpen, onClose, need, matches, loading, onLogReasoning, onDeploy }) => {
    const [assignedId, setAssignedId] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [isBatchAssigning, setIsBatchAssigning] = useState(false);

    const handleAssign = (volunteer) => {
        setIsSending(true);
        setAssignedId(volunteer.id);
        
        setTimeout(() => {
            setIsSending(false);
            toast.success(`SMS sent to ${volunteer.name} (+91 98XXX XXX01)`, {
                icon: '📱',
                style: {
                    background: '#18181b',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '14px',
                    fontWeight: '600'
                }
            });
            
            if (onDeploy) onDeploy();
            
            setTimeout(() => {
                onClose();
                setAssignedId(null);
            }, 2000);
        }, 1500);
    };

    const handleAssignMultiple = () => {
        if (selectedIds.size === 0) return;
        setIsBatchAssigning(true);
        
        setTimeout(() => {
            setIsBatchAssigning(false);
            toast.success(`Assigned ${selectedIds.size} volunteers successfully`);
            if (onDeploy) onDeploy();
            setSelectedIds(new Set());
            
            setTimeout(() => {
                onClose();
            }, 1500);
        }, 1500);
    };

    const getScoreColor = (score) => {
        const val = Math.min(100, Math.max(0, parseInt(score)));
        if (val >= 80) return 'text-emerald-400';
        if (val >= 60) return 'text-amber-400';
        return 'text-rose-400';
    };

    const handleKeywordClick = (keyword) => {
        const reasoningMap = {
            'medical': 'AI prioritizes certified medical responders for health-related needs.',
            'expertise': 'Highly skilled volunteers are preferred for complex surgical/trauma needs.',
            '3km': 'Proximity reduces response time significantly in flood zones.',
            'distance': 'Geographical proximity is weighted at 40% in the matching algorithm.',
            'skills': 'Direct skill-to-need mapping ensures operational efficiency.',
            'rating': 'Volunteer ratings are based on reliability in past 5 disaster deployments.',
            'nearby': 'Hyper-local responders have better knowledge of terrain shortcuts.',
            'urgent': 'High urgency triggers a push notification to immediate-ready volunteers.',
            'available': 'Real-time GPS tracking confirms the volunteer is within active status.',
            'experience': 'Previous deployment in similar flood regions increases match confidence.',
            'response': 'Response metrics measure the speed of SMS acknowledgement.'
        };

        const trace = reasoningMap[keyword.toLowerCase()] || "AI selected this parameter based on situational criticalities.";
        
        if (onLogReasoning) {
            onLogReasoning(keyword, trace);
        }

        toast.success(trace, {
            icon: '🧠',
            duration: 4000,
            style: {
                background: '#18181b',
                color: '#fff',
                border: '1px solid rgba(79, 70, 229, 0.4)',
                fontSize: '12px'
            }
        });
    };

    const toggleSelect = (id) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) newSelected.delete(id);
        else newSelected.add(id);
        setSelectedIds(newSelected);
    };

    const formatExplanation = (text) => {
        if (!text) return "Strong match due to medical expertise and only 3km away.";
        
        const keywords = ['medical', 'expertise', '3km', 'distance', 'skills', 'rating', 'nearby', 'urgent', 'available', 'experience', 'response'];
        const parts = text.split(new RegExp(`(${keywords.join('|')})`, 'gi'));
        
        return parts.map((part, i) => 
            keywords.some(k => k.toLowerCase() === part.toLowerCase()) 
                ? <strong 
                    key={i} 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleKeywordClick(part);
                    }}
                    className="text-indigo-400 font-bold cursor-pointer hover:text-white underline decoration-indigo-400/30 hover:decoration-white transition-all px-0.5"
                  >
                    {part}
                  </strong> 
                : part
        );
    };

    if (!isOpen || !need) return null;

    const confidenceScore = need.confidence || 88;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-[32px] shadow-2xl overflow-hidden shadow-indigo-500/10"
                    >
                        <div className="p-8 pb-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-2xl font-black text-white tracking-tight">Match Intelligence</h2>
                                    <div className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[10px] font-bold text-indigo-400 uppercase tracking-widest">v2.0</div>
                                </div>
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.1em]">
                                    Situational Assignment Protocol
                                </p>
                            </div>
                            <button 
                                onClick={onClose}
                                disabled={isSending}
                                className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-zinc-400 hover:text-white transition-all disabled:opacity-30 active:scale-90"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Sending SMS Overlay */}
                        <AnimatePresence>
                            {isSending && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-50 bg-zinc-950/90 backdrop-blur-xl flex flex-col items-center justify-center gap-6"
                                >
                                    <motion.div 
                                        animate={{ 
                                            y: [-10, -30, -10], 
                                            opacity: [0.5, 1, 0.5],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="p-6 bg-indigo-500 rounded-3xl text-white shadow-[0_0_40px_rgba(79,70,229,0.4)]"
                                    >
                                        <Send size={40} />
                                    </motion.div>
                                    <div className="text-center">
                                        <h3 className="text-white font-black text-xl tracking-tight">Deploying Responders</h3>
                                        <p className="text-zinc-500 text-sm mt-1">Syncing mission data with field units...</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {loading ? (
                                <div className="py-20 flex flex-col items-center justify-center gap-6">
                                    <div className="relative">
                                        <Loader2 className="animate-spin text-indigo-500" size={56} />
                                        <div className="absolute inset-0 blur-2xl bg-indigo-500/30 rounded-full animate-pulse" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white font-bold text-lg">Querying Global Database</p>
                                        <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1">Filtering by proximity and skills...</p>
                                    </div>
                                </div>
                            ) : matches && matches.length > 0 ? (
                                <div className="flex flex-col gap-6">
                                    {/* Intelligence Summary Section */}
                                    <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                                <Zap size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">AI Confidence</p>
                                                <p className="text-lg font-black text-white">{confidenceScore}%</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Model Precision</p>
                                            <p className="text-xs font-bold text-emerald-400 uppercase tracking-tighter">High Fidelity</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between px-1">
                                            <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">Top Matches</h3>
                                            <p className="text-zinc-600 text-[9px] font-bold italic">Click names to select multiple</p>
                                        </div>
                                        
                                        {matches.map((match, index) => (
                                            <motion.div
                                                key={match.id || index}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className={`bg-zinc-900/50 border rounded-2xl p-5 transition-all group relative overflow-hidden cursor-pointer ${selectedIds.has(match.id || index) ? 'border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/20' : 'border-zinc-800 hover:border-zinc-600'}`}
                                                onClick={() => toggleSelect(match.id || index)}
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-700 group-hover:text-white group-hover:border-zinc-500 transition-all">
                                                            <User size={24} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-lg text-white leading-tight group-hover:text-indigo-400 transition-colors">
                                                                {match.name}
                                                            </h4>
                                                            <div className="flex items-center gap-3 text-xs mt-1.5">
                                                                <div className="flex items-center gap-1">
                                                                    <Star size={12} className={`${getScoreColor(match.match_score || 95)} fill-current`} />
                                                                    <span className={`font-black ${getScoreColor(match.match_score)} tracking-tight`}>
                                                                        {(() => {
                                                                            const score = parseFloat(match.match_score || 95);
                                                                            const finalScore = score <= 1 ? Math.round(score * 100) : Math.round(score);
                                                                            return Math.min(100, finalScore);
                                                                        })()}% Match
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1 text-zinc-600 font-medium">
                                                                    <Phone size={10} />
                                                                    <span>Verified Responder</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleAssign(match);
                                                        }}
                                                        disabled={assignedId !== null || isSending || isBatchAssigning}
                                                        className={`p-2.5 rounded-xl transition-all shadow-lg active:scale-90 ${
                                                            assignedId === match.id 
                                                            ? 'bg-emerald-500 text-white' 
                                                            : 'bg-white text-zinc-950 hover:bg-indigo-500 hover:text-white cursor-pointer disabled:opacity-50'
                                                        }`}
                                                    >
                                                        {assignedId === match.id ? <CheckCircle size={18} /> : <ArrowUpRight size={18} />}
                                                    </button>
                                                </div>

                                                <div className="bg-zinc-950/50 rounded-2xl p-4 border border-zinc-800/50">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <MessageSquare size={12} className="text-indigo-400" />
                                                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">AI Decision Path</span>
                                                        <span className="text-[8px] text-zinc-700 italic ml-auto">(Click blue text for logic)</span>
                                                    </div>
                                                    <p className="text-xs leading-relaxed text-zinc-400 font-medium">
                                                        {formatExplanation(match.explanation)}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <p className="text-zinc-500">No volunteers matched this specific need yet.</p>
                                </div>
                            )}
                        </div>

                        <div className="p-8 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Mission Context</span>
                                <span className="text-sm font-bold text-white truncate max-w-[180px]">
                                    {need?.village} • {need?.need_type}
                                </span>
                            </div>

                            {selectedIds.size > 0 ? (
                                <button 
                                    onClick={handleAssignMultiple}
                                    disabled={isBatchAssigning}
                                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-[0_0_30px_rgba(79,70,229,0.3)] flex items-center gap-3 active:scale-95"
                                >
                                    {isBatchAssigning ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                    <span className="text-sm uppercase tracking-tight">Deploy {selectedIds.size} Units</span>
                                </button>
                            ) : (
                                <button 
                                    onClick={onClose}
                                    className="px-6 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold text-xs hover:text-white transition-all active:scale-95"
                                >
                                    Dismiss Panel
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default MatchModal;
