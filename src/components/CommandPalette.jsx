import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, MapPin, Zap, X, Terminal } from 'lucide-react';

const CommandPalette = ({ isOpen, onClose, needs, onSearchSelect }) => {
    const [query, setQuery] = useState('');

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                // Handled by parent but this is a reminder
            }
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const filtered = needs.filter(n => 
        n.village.toLowerCase().includes(query.toLowerCase()) ||
        n.need_type.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
                />
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden shadow-indigo-500/10"
                >
                    <div className="flex items-center px-4 py-4 border-b border-zinc-800">
                        <Search className="text-zinc-500 mr-3" size={20} />
                        <input
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Type a command or search villages..."
                            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-zinc-600 text-lg"
                        />
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-800 rounded text-[10px] font-bold text-zinc-500">
                            <span className="text-zinc-400">ESC</span>
                        </div>
                    </div>

                    <div className="p-2">
                        {query.length === 0 ? (
                            <div className="p-4">
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4 px-2">Quick Actions</p>
                                <div className="space-y-1">
                                    <CommandItem icon={Zap} label="Analyze New Situation" shortcut="A" />
                                    <CommandItem icon={Terminal} label="Clear All Mission Data" shortcut="Alt + X" />
                                    <CommandItem icon={MapPin} label="Jump to Active Regions" shortcut="J" />
                                </div>
                            </div>
                        ) : (
                            <div className="p-2">
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2 px-2">Search Results</p>
                                {filtered.length > 0 ? (
                                    filtered.map((n, i) => (
                                        <div 
                                            key={i}
                                            onClick={() => { onSearchSelect(n); onClose(); }}
                                            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer group transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-indigo-400 transition-colors">
                                                    <MapPin size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">{n.village}</p>
                                                    <p className="text-[10px] text-zinc-500 uppercase font-semibold">{n.need_type}</p>
                                                </div>
                                            </div>
                                            <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${n.urgency.toLowerCase() === 'critical' ? 'bg-red-500/10 text-red-500' : 'bg-zinc-800 text-zinc-500'}`}>
                                                {n.urgency}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center">
                                        <p className="text-zinc-600 text-sm italic">No matching villages found</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-zinc-950/50 p-3 border-t border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <div className="w-4 h-4 rounded border border-zinc-700 flex items-center justify-center text-[8px] text-zinc-500">↑</div>
                                <div className="w-4 h-4 rounded border border-zinc-700 flex items-center justify-center text-[8px] text-zinc-500">↓</div>
                                <span className="text-[10px] text-zinc-600 font-medium">Navigate</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="px-1.5 h-4 rounded border border-zinc-700 flex items-center justify-center text-[8px] text-zinc-500">Enter</div>
                                <span className="text-[10px] text-zinc-600 font-medium">Select</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-indigo-500/50 font-bold italic tracking-tight">SevaSync Terminal v1.0</p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

const CommandItem = ({ icon: Icon, label, shortcut }) => (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer group transition-all">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                <Icon size={16} />
            </div>
            <p className="text-sm font-medium text-zinc-300 group-hover:text-white">{label}</p>
        </div>
        <span className="text-[10px] font-bold text-zinc-600 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">{shortcut}</span>
    </div>
);

export default CommandPalette;
