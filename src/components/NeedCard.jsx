import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, MapPin, Zap, Clock, ArrowUpRight } from 'lucide-react';

const urgencyConfig = {
    low: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    high: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' }
};

const StatusBadge = ({ status }) => {
    const configs = {
        pending: { label: 'Pending', bg: 'bg-amber-500/10', text: 'text-amber-500', dot: 'bg-amber-500' },
        assigned: { label: 'Assigned', bg: 'bg-emerald-500/10', text: 'text-emerald-500', dot: 'bg-emerald-500' },
        in_progress: { label: 'In Progress', bg: 'bg-blue-500/10', text: 'text-blue-500', dot: 'bg-blue-500' },
    };
    const config = configs[status] || configs.pending;

    return (
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${config.bg} ${config.text} border border-white/5 shadow-sm`}>
            <div className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{config.label}</span>
        </div>
    );
};

const NeedCard = ({ need, onFindVolunteers }) => {
    const urgency = need.urgency?.toLowerCase() || 'medium';
    const config = urgencyConfig[urgency] || urgencyConfig.medium;
    const priority = need.priority_score || 0;
    const people = need.people || need.num_people || 0;
    const status = need.status || 'pending';

    const urgencyGlow = {
        critical: 'shadow-red-500/10',
        high: 'shadow-orange-500/10',
        medium: 'shadow-yellow-500/10',
        low: 'shadow-green-500/10'
    }[urgency] || '';

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`relative overflow-hidden bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 flex flex-col gap-5 transition-all shadow-xl hover:shadow-2xl hover:border-zinc-700 group ${urgencyGlow}`}
        >
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-radial from-white/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
            
            <div className="flex justify-between items-start relative z-10">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <StatusBadge status={status} />
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${config.color}`}>
                            {need.urgency}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
                        {need.need_type}
                    </h3>
                    <div className="flex items-center gap-1.5 text-zinc-500 mt-2">
                        <MapPin size={14} className="text-zinc-400" />
                        <span className="text-sm font-medium">{need.village}</span>
                    </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                    <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800 shadow-inner group-hover:border-indigo-500/50 transition-colors`}>
                        <span className="text-xs font-bold text-white leading-none">{priority}</span>
                        <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-tighter mt-0.5">Score</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 py-1 relative z-10">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <Users size={16} className="text-indigo-400" />
                        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Affected Population</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-white">{people}</span>
                        <span className="text-xs text-zinc-500 font-medium">people</span>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <Zap size={16} className="text-yellow-400" />
                        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Priority Status</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full mt-2 overflow-hidden border border-white/5">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${priority > 10 ? priority : priority * 10}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-linear-to-r from-indigo-500 to-purple-500"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-5 border-t border-zinc-800/50 flex items-center justify-between mt-auto relative z-10">
                <div />
                <button 
                    onClick={() => onFindVolunteers(need)}
                    disabled={status === 'assigned' || status === 'in_progress'}
                    className={`group/btn flex items-center gap-2 px-4 py-2.5 transition-all duration-300 font-bold text-xs rounded-xl shadow-lg active:scale-95 cursor-pointer
                        ${status === 'pending' 
                            ? 'bg-white text-zinc-950 hover:bg-indigo-500 hover:text-white hover:shadow-indigo-500/25' 
                            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50'
                        }`}
                >
                    {status === 'pending' ? 'MATCH VOLUNTEERS' : 'RESOURCES DEPLOYED'}
                    <ArrowUpRight size={14} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </button>
            </div>
        </motion.div>
    );
};

export default NeedCard;
