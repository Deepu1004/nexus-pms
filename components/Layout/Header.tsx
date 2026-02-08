import React from 'react';
import { Search, Bell, Settings, CalendarDays } from 'lucide-react';
import useAppStore from '../../store/appStore';
import { format } from 'date-fns';

const Header = () => {
  const { pageTitle } = useAppStore();

  return (
    <header className="h-20 px-8 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">
          {pageTitle}
        </h1>
        <p className="text-sm text-slate-400 flex items-center gap-2 mt-0.5">
          <CalendarDays className="w-3.5 h-3.5" />
          {format(new Date(), "EEEE, MMMM do, yyyy")}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search bookings, guests..." 
            className="w-64 bg-slate-900 border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
          />
        </div>

        <div className="h-8 w-px bg-slate-800 mx-2"></div>

        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-slate-900"></span>
        </button>
        
        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;