import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutGrid, BedDouble, CalendarRange, Wallet, Users, LogOut, 
  Building2, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import useAppStore from '../../store/appStore';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useAppStore();
  const { logout } = useAuth();
  
  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/' },
    { icon: CalendarRange, label: 'Bookings', path: '/bookings' },
    { icon: BedDouble, label: 'Rooms', path: '/rooms' },
    { icon: Users, label: 'Guests', path: '/guests' },
    { icon: Wallet, label: 'Revenue', path: '/revenue' },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isSidebarOpen ? 260 : 80 }}
      className="h-full bg-slate-900 border-r border-slate-800 flex flex-col relative transition-all duration-300 z-20"
    >
      {/* Brand Section */}
      <div className="h-20 flex items-center justify-center border-b border-slate-800/50">
        <div className="flex items-center gap-3 overflow-hidden px-4 w-full">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/20">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col"
            >
              <span className="font-display font-bold text-lg text-white tracking-tight">Nexus PMS</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Enterprise</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-24 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary-600 hover:border-primary-500 transition-all z-50 shadow-md"
      >
        {isSidebarOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group overflow-hidden",
              isActive 
                ? "bg-primary-600 text-white shadow-lg shadow-primary-900/20" 
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            )}
          >
            <item.icon className={cn("w-5 h-5 shrink-0")} />
            
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-sm whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-800">
        <div className={cn(
          "bg-slate-800/50 rounded-xl p-3 flex items-center gap-3 transition-all border border-slate-700/50",
          !isSidebarOpen && "justify-center p-2"
        )}>
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center shrink-0 border border-slate-600">
            <span className="font-bold text-xs text-slate-300">AD</span>
          </div>
          
          {isSidebarOpen && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-white truncate">Admin User</span>
              <span className="text-xs text-slate-500 truncate">Manager</span>
            </div>
          )}
          
          {isSidebarOpen && (
            <button
              onClick={logout}
              className="ml-auto text-slate-500 hover:text-red-400 transition-colors p-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;