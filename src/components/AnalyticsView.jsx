import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const AnalyticsView = ({ needs }) => {
    // Process data for Urgency Pie Chart
    const COLORS = {
        critical: '#ef4444',
        high: '#f97316',
        medium: '#eab308',
        low: '#22c55e',
        other: '#6366f1'
    };

    // Normalize urgency data for color mapping
    const urgencyData = needs.reduce((acc, need) => {
        const rawUrgency = need.urgency?.toLowerCase() || 'medium';
        const urgency = rawUrgency === 'critical' || rawUrgency === 'high' || rawUrgency === 'medium' || rawUrgency === 'low' 
            ? rawUrgency 
            : 'other';
            
        const existing = acc.find(item => item.name === urgency);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ name: urgency, value: 1 });
        }
        return acc;
    }, []);

    const typeData = needs.reduce((acc, need) => {
        const type = need.need_type?.split(' ')[0] || 'Other';
        const existing = acc.find(item => item.name === type);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ name: type, value: 1 });
        }
        return acc;
    }, []);

    const CATEGORY_COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#fb923c'];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-3 rounded-xl shadow-2xl pointer-events-none"
                >
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{payload[0].name}</p>
                    <p className="text-lg font-black text-white">{payload[0].value} <span className="text-xs font-medium text-zinc-500">Needs</span></p>
                </motion.div>
            );
        }
        return null;
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full pb-8"
        >
            {/* Urgency Distribution */}
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 flex flex-col hover:border-zinc-700 transition-colors group">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                        Urgency Distribution
                    </h3>
                </div>
                <div className="flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={urgencyData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={8}
                                dataKey="value"
                                stroke="none"
                            >
                                {urgencyData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={COLORS[entry.name.toLowerCase()] || COLORS.other}
                                        className="outline-none"
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
                            <Legend 
                                verticalAlign="bottom" 
                                height={36}
                                content={({ payload }) => (
                                    <div className="flex justify-center gap-6 mt-4">
                                        {payload.map((entry, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">{entry.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Needs by Category */}
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 flex flex-col hover:border-zinc-700 transition-colors group">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                        Needs by Category
                    </h3>
                </div>
                <div className="flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={typeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.5} />
                            <XAxis 
                                dataKey="name" 
                                stroke="#71717a" 
                                fontSize={10} 
                                fontWeight="bold"
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                            />
                            <YAxis 
                                stroke="#71717a" 
                                fontSize={10} 
                                fontWeight="bold"
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} isAnimationActive={false} />
                            <Bar 
                                dataKey="value" 
                                radius={[8, 8, 0, 0]}
                                barSize={40}
                            >
                                {typeData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} 
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>
    );
};

export default AnalyticsView;
