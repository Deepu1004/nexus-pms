import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Building2, ArrowRight, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError('Invalid credentials provided.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950">
       {/* Left Side - Hero */}
       <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden border-r border-slate-800">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-slate-900 z-0" />
          <div className="relative z-10 p-12">
             <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-primary-500/30">
                <Building2 className="w-8 h-8 text-white" />
             </div>
             <h1 className="text-5xl font-display font-bold text-white mb-6">Nexus PMS</h1>
             <p className="text-xl text-slate-400 max-w-md leading-relaxed">
                The next-generation property management system for modern hospitality enterprises.
             </p>
          </div>
       </div>

       {/* Right Side - Form */}
       <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
             <div className="text-center lg:text-left">
                <h2 className="text-3xl font-display font-bold text-white">Welcome back</h2>
                <p className="text-slate-400 mt-2">Sign in to your dashboard to continue.</p>
             </div>

             <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-300">Work Email</label>
                   <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                        placeholder="name@company.com"
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-300">Password</label>
                   <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                      <input 
                        type="password" 
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-10 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                        placeholder="••••••••"
                      />
                   </div>
                </div>

                {error && (
                   <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">
                      {error}
                   </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                   {loading ? 'Signing in...' : 'Sign In'}
                   {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
             </form>
          </div>
       </div>
    </div>
  );
};

export default Login;