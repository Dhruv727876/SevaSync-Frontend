import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import InputPanel from '../components/InputPanel';
import NeedCard from '../components/NeedCard';
import MatchModal from '../components/MatchModal';
import { getNeeds, matchVolunteers } from '../services/api';
import StatsBar from '../components/StatsBar';
import LiveFeed from '../components/LiveFeed';
import { Search, Filter, LayoutGrid, List, Info, Loader2, Users, Sparkles, X, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import AnalyticsView from '../components/AnalyticsView';
import CommandPalette from '../components/CommandPalette';

const Dashboard = () => {
    const [needs, setNeeds] = useState(() => {
        const saved = localStorage.getItem('sevasync_needs');
        return saved ? JSON.parse(saved) : [];
    });
    const [loading, setLoading] = useState(needs.length === 0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [volunteers, setVolunteers] = useState([]);
    const [currentNeed, setCurrentNeed] = useState(null);
    const [matchingLoading, setMatchingLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showCriticalOnly, setShowCriticalOnly] = useState(false);
    const [showNamedOnly, setShowNamedOnly] = useState(false);
    const [decisionLog, setDecisionLog] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'analytics'
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

    // Persist needs to localStorage
    useEffect(() => {
        localStorage.setItem('sevasync_needs', JSON.stringify(needs));
    }, [needs]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsCommandPaletteOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const logReasoning = (keyword, trace) => {
        setDecisionLog(prev => [{
            id: Date.now(),
            keyword,
            trace,
            timestamp: new Date().toLocaleTimeString()
        }, ...prev].slice(0, 5)); // Keep last 5
    };

    const fetchNeeds = async () => {
        if (needs.length > 0) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const res = await getNeeds();
            const data = res.data || [];
            const needsWithStatus = data.map(n => ({ ...n, status: 'pending', timestamp: 'Just now' }));
            setNeeds(needsWithStatus);
        } catch (error) {
            console.error('Failed to fetch needs:', error);
            const demoData = [
                { id: 1, need_type: 'Food for 200 people', village: 'Kamrup', people: 200, urgency: 'Critical', priority_score: 9.8, status: 'pending', timestamp: '5m ago' },
                { id: 2, need_type: 'Medical Supplies', village: 'Majuli', people: 150, urgency: 'High', priority_score: 8.5, status: 'pending', timestamp: '12m ago' },
                { id: 3, need_type: 'Drinking Water', village: 'Dhubri', people: 500, urgency: 'Medium', priority_score: 7.2, status: 'pending', timestamp: '24m ago' }
            ];
            setNeeds(demoData);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNeeds();
    }, []);

    const handleFindVolunteers = async (need) => {
        setCurrentNeed(need);
        setIsModalOpen(true);
        setMatchingLoading(true);
        
        try {
            console.log("Calling match API with:", need.id);
            const res = await matchVolunteers(need.id);
            
            // Following user's requested data structure
            const data = res.data;
            console.log("MATCH RESPONSE:", data);
            
            const rawMatches = data.matches || data.volunteers || data || [];
            const formattedMatches = rawMatches.map(v => ({
                id: v.id,
                name: v.name,
                match_score: v.match_score || "92",
                explanation: v.explanation || `${v.name} has relevant skills and is available now.`
            }));
            
            setVolunteers(formattedMatches);
        } catch (error) {
            console.error('Matching failed:', error);
            // Fallback for demo
            setVolunteers([
                { id: 1, name: 'Rahul Sharma', match_score: '98', explanation: 'Certified medical responder with experience in flood relief zones.' },
                { id: 2, name: 'Priya Das', match_score: '94', explanation: 'Logistics expert specializing in food and water supply chains.' },
                { id: 3, name: 'Amit Kumar', match_score: '89', explanation: 'Local volunteer with deep knowledge of terrain.' },
                { id: 4, name: 'Siddharth Roy', match_score: '86', explanation: 'Emergency communication specialist available for immediate deployment.' }
            ]);
        } finally {
            setMatchingLoading(false);
        }
    };

    const handleMatch = () => {
        if (currentNeed) {
            handleFindVolunteers(currentNeed);
        }
    };

    const handleAnalysisComplete = (newNeed) => {
        const needWithMeta = { 
            ...newNeed, 
            status: 'pending', 
            timestamp: 'Just now',
            confidence: Math.floor(Math.random() * (95 - 85 + 1) + 85)
        };
        setNeeds(prev => [needWithMeta, ...prev]);
        setCurrentNeed(needWithMeta);
    };

    const updateNeedStatus = (id, newStatus) => {
        setNeeds(prev => prev.map(n => n.id === id ? { ...n, status: newStatus } : n));
    };

    const filteredNeeds = needs.filter(need => {
        if (showCriticalOnly && need.urgency?.toLowerCase() !== 'critical') return false;
        if (showNamedOnly && need.village?.toLowerCase() === 'unknown') return false;
        
        const search = searchTerm.toLowerCase();
        if (search) {
            return (
                need.village?.toLowerCase().includes(search) ||
                need.need_type?.toLowerCase().includes(search) ||
                need.urgency?.toLowerCase().includes(search)
            );
        }
        return true;
    });

    return (
        <div className="h-screen bg-zinc-950 flex flex-col font-['Inter'] overflow-hidden">
            <Navbar />
            <StatsBar needsCount={needs.length} />
            
            <main className="flex-1 flex overflow-hidden relative">
                {/* Mobile Toggle Button */}
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-2xl shadow-indigo-500/40 active:scale-95 transition-all"
                >
                    <Sparkles size={24} />
                </button>

                {/* ASIDE: Sidebar */}
                <aside className={`
                    fixed inset-y-0 left-0 z-[60] w-[320px] bg-zinc-950 border-r border-zinc-800 p-8 overflow-y-auto transition-transform duration-300 ease-in-out custom-scrollbar
                    md:relative md:translate-x-0 md:bg-zinc-900/10
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    <div className="flex items-center justify-between mb-8 md:hidden">
                        <h2 className="text-xl font-bold text-white">AI Analysis</h2>
                        <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-zinc-500 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <InputPanel onAnalysisComplete={(newNeed) => {
                        handleAnalysisComplete(newNeed);
                        setIsSidebarOpen(false); // Auto-close on mobile
                    }} />
                    
                    <button 
                        onClick={handleMatch}
                        disabled={!currentNeed || matchingLoading}
                        className="w-full mt-4 py-4 bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed group cursor-pointer"
                    >
                        {matchingLoading ? (
                            <Loader2 className="animate-spin text-indigo-500" size={18} />
                        ) : (
                            <Users className="text-indigo-500 group-hover:scale-110 transition-transform" size={18} />
                        )}
                        <span>Match Volunteers</span>
                    </button>
                    
                    <div className="mt-8">
                        <div className="flex items-center gap-2 text-indigo-400 mb-4 px-2">
                            <Sparkles size={16} />
                            <span className="text-sm font-semibold uppercase tracking-wider">Decision Log</span>
                        </div>
                        <div className="space-y-3">
                            {decisionLog.length > 0 ? (
                                <AnimatePresence initial={false}>
                                    {decisionLog.map((log) => (
                                        <motion.div 
                                            key={log.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 hover:border-indigo-500/30 transition-all group"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-bold text-indigo-400 uppercase">Parameter: {log.keyword}</span>
                                                <span className="text-[10px] text-zinc-600">{log.timestamp}</span>
                                            </div>
                                            <p className="text-[11px] text-zinc-400 leading-relaxed italic">
                                                "{log.trace}"
                                            </p>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            ) : (
                                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 border-dashed flex flex-col items-center text-center">
                                    <Info size={20} className="text-zinc-700 mb-2" />
                                    <p className="text-[10px] text-zinc-600 leading-relaxed uppercase font-bold tracking-widest">
                                        No Reasoning Traces Logged
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <LiveFeed />
                </aside>

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div 
                        className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* RIGHT SIDE: Needs Dashboard */}
                <section className="flex-1 flex flex-col bg-zinc-950/50">
                    <header className="p-8 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center justify-between w-full sm:w-auto">
                            <div>
                                <h1 className="text-2xl font-bold text-white tracking-tight">Needs Dashboard</h1>
                                <p className="text-zinc-500 text-sm mt-1">Real-time situational awareness across regions</p>
                            </div>
                            <button 
                                onClick={() => setIsSidebarOpen(true)}
                                className="md:hidden p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-indigo-400 active:scale-95 transition-all"
                            >
                                <Sparkles size={20} />
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl mr-2">
                                <button 
                                    onClick={() => setViewMode('cards')}
                                    className={`p-1.5 rounded-lg transition-all ${viewMode === 'cards' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    <LayoutGrid size={16} />
                                </button>
                                <button 
                                    onClick={() => setViewMode('analytics')}
                                    className={`p-1.5 rounded-lg transition-all ${viewMode === 'analytics' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    <BarChart3 size={16} />
                                </button>
                            </div>

                            <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
                                <button 
                                    onClick={() => { setShowCriticalOnly(false); setShowNamedOnly(false); }}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${(!showCriticalOnly && !showNamedOnly) ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    All
                                </button>
                                <button 
                                    onClick={() => setShowCriticalOnly(!showCriticalOnly)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${showCriticalOnly ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    Critical
                                </button>
                                <button 
                                    onClick={() => setShowNamedOnly(!showNamedOnly)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${showNamedOnly ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    Named Regions
                                </button>
                            </div>
                            <div className="relative flex-1 sm:flex-none">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                <input 
                                    type="text" 
                                    placeholder="Search villages..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm transition-all focus:border-indigo-500 outline-none w-full min-w-[200px]"
                                />
                            </div>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-8 pt-4">
                        {loading ? (
                            <div className="h-full flex items-center justify-center">
                                <div className="flex flex-col items-center gap-4">
                                    <Loader2 className="animate-spin text-indigo-500" size={40} />
                                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest animate-pulse">Initializing Ops Dashboard...</p>
                                </div>
                            </div>
                        ) : viewMode === 'analytics' ? (
                            <AnalyticsView needs={needs} />
                        ) : filteredNeeds.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
                                <AnimatePresence mode="popLayout">
                                    {filteredNeeds.map((need, i) => (
                                        <NeedCard 
                                            key={need.id || i} 
                                            need={need} 
                                            onFindVolunteers={handleFindVolunteers} 
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-24 h-24 bg-zinc-900/50 border border-zinc-800 rounded-full flex items-center justify-center mb-6 text-zinc-700 shadow-inner"
                                >
                                    <LayoutGrid size={40} className="text-zinc-800" />
                                </motion.div>
                                <h3 className="text-xl font-bold text-white tracking-tight">No needs yet.</h3>
                                <p className="text-zinc-500 max-w-sm mt-2 text-sm">
                                    Analyze a situation to get started.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <MatchModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                volunteers={volunteers}
                matches={volunteers}
                need={currentNeed}
                loading={matchingLoading}
                onLogReasoning={logReasoning}
                onDeploy={() => currentNeed?.id && updateNeedStatus(currentNeed.id, 'assigned')}
            />

            <CommandPalette 
                isOpen={isCommandPaletteOpen}
                onClose={() => setIsCommandPaletteOpen(false)}
                needs={needs}
                onSearchSelect={(need) => {
                    setSearchTerm(need.village);
                    setCurrentNeed(need);
                }}
            />
        </div>
    );
};

export default Dashboard;
