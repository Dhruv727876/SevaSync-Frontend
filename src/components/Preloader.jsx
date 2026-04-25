import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';

const Preloader = ({ children }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate initial app boot sequence
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <AnimatePresence mode="wait">
                {loading && (
                    <motion.div
                        key="preloader"
                        initial={{ opacity: 1 }}
                        exit={{ 
                            opacity: 0,
                            scale: 1.05,
                            transition: { duration: 0.8, ease: "easeInOut" }
                        }}
                        className="fixed inset-0 z-[1000] bg-zinc-950 flex flex-col items-center justify-center overflow-hidden"
                    >
                        {/* Background Gradients */}
                        <div className="absolute inset-0 overflow-hidden">
                            <motion.div 
                                animate={{ 
                                    scale: [1, 1.2, 1],
                                    opacity: [0.1, 0.2, 0.1]
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/20 blur-[120px]"
                            />
                            <motion.div 
                                animate={{ 
                                    scale: [1.2, 1, 1.2],
                                    opacity: [0.1, 0.2, 0.1]
                                }}
                                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                                className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-500/20 blur-[120px]"
                            />
                        </div>

                        <div className="relative flex flex-col items-center">
                            {/* Logo Icon */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ duration: 1.2, ease: "backOut" }}
                                className="w-20 h-20 bg-linear-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center text-white shadow-[0_0_50px_rgba(79,70,229,0.4)] mb-8"
                            >
                                <Activity size={40} />
                            </motion.div>

                            {/* Brand Name */}
                            <div className="overflow-hidden h-12 flex flex-col items-center">
                                <motion.h1
                                    initial={{ y: 50 }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.5, ease: "power4.out" }}
                                    className="text-4xl font-black text-white tracking-tighter"
                                >
                                    SEVASYNC
                                </motion.h1>
                            </div>

                            {/* Status Sequence */}
                            <div className="mt-4 h-4 overflow-hidden relative w-64 text-center">
                                <motion.p
                                    initial={{ y: 20 }}
                                    animate={{ y: [20, 0, 0, -20] }}
                                    transition={{ 
                                        times: [0, 0.1, 0.9, 1],
                                        duration: 0.8,
                                        delay: 1.2
                                    }}
                                    className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]"
                                >
                                    Initializing Neural Core
                                </motion.p>
                                <motion.p
                                    initial={{ y: 20 }}
                                    animate={{ y: [20, 0, 0, -20] }}
                                    transition={{ 
                                        times: [0, 0.1, 0.9, 1],
                                        duration: 0.8,
                                        delay: 1.8
                                    }}
                                    className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] absolute inset-0"
                                >
                                    Syncing Mission Data
                                </motion.p>
                                <motion.p
                                    initial={{ y: 20 }}
                                    animate={{ y: 0 }}
                                    transition={{ 
                                        duration: 0.8,
                                        delay: 2.4
                                    }}
                                    className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.3em] absolute inset-0"
                                >
                                    Operational Ready
                                </motion.p>
                            </div>

                            {/* Loading Bar */}
                            <div className="mt-12 w-48 h-[1px] bg-zinc-900 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '100%' }}
                                    transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                                    className="w-full h-full bg-linear-to-r from-transparent via-indigo-500 to-transparent"
                                />
                            </div>
                        </div>

                        {/* Animated Grid Lines */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                             style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }} 
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            {!loading && children}
        </>
    );
};

export default Preloader;
