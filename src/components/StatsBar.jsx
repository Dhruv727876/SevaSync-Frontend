import React from 'react';
import { Users, AlertTriangle, CheckCircle2, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const StatItem = ({ icon: Icon, label, value, color, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="flex items-center gap-4 px-6 py-3 border-r border-zinc-800 last:border-r-0"
    >
        <div className={`p-2 rounded-lg bg-${color}-500/10`}>
            <Icon size={18} className={`text-${color}-400`} />
        </div>
        <div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{label}</p>
            <p className="text-lg font-bold text-white tabular-nums">{value}</p>
        </div>
    </motion.div>
);

const StatsBar = ({ needsCount }) => {
    return (
        <div className="bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 flex items-center overflow-x-auto no-scrollbar">
            <StatItem 
                icon={AlertTriangle} 
                label="Active Needs" 
                value={needsCount} 
                color="amber" 
                delay={0.1} 
            />
            <StatItem 
                icon={Users} 
                label="Volunteers Deployed" 
                value="1,248" 
                color="indigo" 
                delay={0.2} 
            />
            <StatItem 
                icon={CheckCircle2} 
                label="Missions Completed" 
                value="842" 
                color="emerald" 
                delay={0.3} 
            />
            <StatItem 
                icon={Shield} 
                label="System Status" 
                value="SECURE" 
                color="blue" 
                delay={0.4} 
            />
            
            <div className="ml-auto px-8 flex items-center gap-6">
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Sync</span>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden shadow-lg">
                                <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">+12 active responders</p>
                </div>
            </div>
        </div>
    );
};

export default StatsBar;
