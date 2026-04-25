import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Zap, MessageSquare } from 'lucide-react';

const activities = [
    { id: 1, type: 'assignment', text: 'Volunteer Rahul S. assigned to Kamrup', time: '2m ago' },
    { id: 2, type: 'report', text: 'New medical supply need in Majuli', time: '12m ago' },
    { id: 3, type: 'sms', text: 'SMS Broadcast sent to 50 responders', time: '18m ago' },
    { id: 4, type: 'assignment', text: 'Food distribution started in Dhubri', time: '24m ago' },
];

const LiveFeed = () => {
    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Radio size={14} className="text-red-500 animate-pulse" />
                    Live Mission Feed
                </h3>
                <span className="text-[10px] text-zinc-500 font-mono">LIVE_UPDATE</span>
            </div>
            
            <div className="space-y-3">
                <AnimatePresence>
                    {activities.map((activity, i) => (
                        <motion.div 
                            key={activity.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group"
                        >
                            <div className="flex gap-3">
                                <div className="mt-1">
                                    {activity.type === 'assignment' && <Zap size={12} className="text-yellow-500" />}
                                    {activity.type === 'report' && <MessageSquare size={12} className="text-indigo-400" />}
                                    {activity.type === 'sms' && <Radio size={12} className="text-emerald-400" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-zinc-300 leading-snug group-hover:text-white transition-colors">
                                        {activity.text}
                                    </p>
                                    <p className="text-[10px] text-zinc-600 mt-1 uppercase font-semibold">
                                        {activity.time}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            
            <button className="w-full mt-4 py-2 border border-zinc-800 rounded-lg text-[10px] text-zinc-500 uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all font-bold">
                View Full Logs
            </button>
        </div>
    );
};

export default LiveFeed;
