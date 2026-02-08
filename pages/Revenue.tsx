import React, { useEffect, useState } from 'react';
import useAppStore from '../store/appStore';
import { supabase } from '../lib/supabase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatCurrency } from '../lib/utils';
import { DollarSign, TrendingUp, CreditCard } from 'lucide-react';

const Revenue = () => {
  const { setPageTitle } = useAppStore();
  const [transactions, setTransactions] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    setPageTitle('Financials & Revenue');
    const loadData = async () => {
        const { data } = await supabase.from('payments').select('*, reservations(guests(first_name, last_name))').order('payment_date', { ascending: false });
        if(data) {
            setTransactions(data);
            setTotalRevenue(data.reduce((acc, curr) => acc + curr.amount, 0));
        }
    }
    loadData();
  }, []);

  // Simple Chart Data aggregation
  const chartData = transactions.slice(0, 20).map(t => ({
     date: new Date(t.payment_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric'}),
     amount: t.amount
  })).reverse();

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3 mb-2 text-slate-400">
                    <DollarSign className="w-5 h-5" /> Total Revenue
                </div>
                <div className="text-3xl font-display font-bold text-white">{formatCurrency(totalRevenue)}</div>
            </div>
             <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3 mb-2 text-slate-400">
                    <TrendingUp className="w-5 h-5" /> Avg. Transaction
                </div>
                <div className="text-3xl font-display font-bold text-white">
                    {formatCurrency(transactions.length > 0 ? totalRevenue / transactions.length : 0)}
                </div>
            </div>
             <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3 mb-2 text-slate-400">
                    <CreditCard className="w-5 h-5" /> Total Transactions
                </div>
                <div className="text-3xl font-display font-bold text-white">{transactions.length}</div>
            </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-6">Recent Transaction Flow</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                            cursor={{fill: '#1e293b'}}
                        />
                        <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 font-semibold text-white">Transaction Ledger</div>
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
                    <tr>
                        <th className="p-4">Date</th>
                        <th className="p-4">Guest</th>
                        <th className="p-4">Method</th>
                        <th className="p-4 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {transactions.map(t => (
                        <tr key={t.id} className="hover:bg-slate-800/50">
                            <td className="p-4 text-slate-300">{new Date(t.payment_date).toLocaleDateString()}</td>
                            <td className="p-4 text-white font-medium">{t.reservations?.guests?.first_name} {t.reservations?.guests?.last_name}</td>
                            <td className="p-4 text-slate-400 capitalize">{t.payment_method.replace('_', ' ')}</td>
                            <td className="p-4 text-right text-emerald-400 font-medium">{formatCurrency(t.amount)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default Revenue;