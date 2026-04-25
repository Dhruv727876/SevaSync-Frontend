import React from 'react';
import { Activity, Bell, User } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Activity className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                    SevaSync
                </span>
            </div>
            
            <div className="flex items-center gap-6">
                <button className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
                    <Bell size={20} />
                </button>
                <div className="h-8 w-px bg-zinc-800"></div>
                <button className="flex items-center gap-3 group cursor-pointer">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">Admin Dashboard</p>
                        <p className="text-xs text-zinc-500">NGO Management</p>
                    </div>
                    <div className="w-9 h-9 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center group-hover:border-indigo-500 transition-colors">
                        <User size={18} className="text-zinc-400 group-hover:text-white" />
                    </div>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
