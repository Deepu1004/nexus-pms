import React, { useState, useEffect } from 'react';
import useAppStore from '../store/appStore';
import { supabase } from '../lib/supabase';
import { Plus, Search, Filter, MoreHorizontal, CheckCircle, LogOut } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { formatCurrency } from '../lib/utils';
import { differenceInDays, addDays } from 'date-fns';

const CreateBookingModal = ({ isOpen, onClose, onSuccess }) => {
    // Simplified Logic for the example - robust implementation would require full search
    const [step, setStep] = useState(1);
    const [guests, setGuests] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [formData, setFormData] = useState({ guestId: null, roomId: null, checkIn: '', checkOut: '' });
    
    useEffect(() => {
        if(isOpen) {
            // Load initial data
            const loadData = async () => {
                const { data: g } = await supabase.from('guests').select('*').limit(5);
                setGuests(g || []);
                const { data: r } = await supabase.from('rooms').select('*').eq('current_status', 'available');
                setRooms(r || []);
            }
            loadData();
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if(!formData.guestId || !formData.roomId) return;
        
        const room = rooms.find(r => r.id === formData.roomId);
        const nights = differenceInDays(new Date(formData.checkOut), new Date(formData.checkIn));
        const total = (room.base_price * nights);

        await supabase.from('reservations').insert([{
            guest_id: formData.guestId,
            room_id: formData.roomId,
            check_in_date: formData.checkIn,
            check_out_date: formData.checkOut,
            status: 'confirmed',
            total_amount: total,
            room_rate: room.base_price,
            nights: nights
        }]);
        onSuccess();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl">
                <h2 className="text-xl font-display font-bold text-white mb-6">New Reservation</h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Guest</label>
                        <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                            onChange={e => setFormData({...formData, guestId: e.target.value})}>
                            <option value="">Select Guest...</option>
                            {guests.map(g => <option key={g.id} value={g.id}>{g.first_name} {g.last_name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="text-xs text-slate-400 block mb-1">Check In</label>
                             <input type="date" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                                onChange={e => setFormData({...formData, checkIn: e.target.value})} />
                        </div>
                        <div>
                             <label className="text-xs text-slate-400 block mb-1">Check Out</label>
                             <input type="date" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                                onChange={e => setFormData({...formData, checkOut: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Room</label>
                        <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                            onChange={e => setFormData({...formData, roomId: e.target.value})}>
                            <option value="">Select Room...</option>
                            {rooms.map(r => <option key={r.id} value={r.id}>{r.room_number} ({r.room_type}) - ₹{r.base_price}</option>)}
                        </select>
                    </div>
                    <button onClick={handleSubmit} className="w-full mt-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-500">Confirm Booking</button>
                    <button onClick={onClose} className="w-full mt-2 text-sm text-slate-400 hover:text-white">Cancel</button>
                </div>
            </div>
        </div>
    )
}

const Bookings = () => {
  const { setPageTitle } = useAppStore();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setPageTitle('Bookings');
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const { data } = await supabase
      .from('reservations')
      .select(`*, guests(first_name, last_name, email), rooms(room_number, room_type)`)
      .order('check_in_date', { ascending: false });
    if (data) setBookings(data);
  };

  const updateStatus = async (id, status, roomId) => {
    await supabase.from('reservations').update({ status }).eq('id', id);
    
    // Sync room status
    let roomStatus = 'occupied';
    if (status === 'checked_out') roomStatus = 'cleaning';
    if (status === 'confirmed') roomStatus = 'reserved'; // simplified

    if (roomId) {
        await supabase.from('rooms').update({ current_status: roomStatus }).eq('id', roomId);
    }
    fetchBookings();
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
            {['all', 'confirmed', 'checked_in', 'checked_out', 'cancelled'].map(f => (
                <button key={f} onClick={() => setFilter(f)} 
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wide transition-all ${filter === f ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-500 hover:text-slate-300'}`}>
                    {f.replace('_', ' ')}
                </button>
            ))}
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" /> New Booking
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-slate-950 border-b border-slate-800 text-xs uppercase text-slate-400 font-semibold">
                <tr>
                    <th className="p-4">Guest</th>
                    <th className="p-4">Room</th>
                    <th className="p-4">Check In</th>
                    <th className="p-4">Check Out</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Total</th>
                    <th className="p-4"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
                {filtered.map(b => (
                    <tr key={b.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-4">
                            <div className="font-medium text-white">{b.guests?.first_name} {b.guests?.last_name}</div>
                            <div className="text-xs text-slate-500">{b.guests?.email}</div>
                        </td>
                        <td className="p-4">
                            <span className="px-2 py-1 bg-slate-800 rounded text-xs">{b.rooms?.room_number}</span>
                            <span className="ml-2 text-xs text-slate-500 capitalize">{b.rooms?.room_type}</span>
                        </td>
                        <td className="p-4">{format(parseISO(b.check_in_date), 'MMM dd, yyyy')}</td>
                        <td className="p-4">{format(parseISO(b.check_out_date), 'MMM dd, yyyy')}</td>
                        <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold border ${
                                b.status === 'confirmed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                b.status === 'checked_in' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                b.status === 'checked_out' ? 'bg-slate-700/50 text-slate-400 border-slate-600' :
                                'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}>
                                {b.status.replace('_', ' ')}
                            </span>
                        </td>
                        <td className="p-4 text-right font-medium text-white">{formatCurrency(b.total_amount)}</td>
                        <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                                {b.status === 'confirmed' && (
                                    <button onClick={() => updateStatus(b.id, 'checked_in', b.room_id)} title="Check In" className="p-1.5 hover:bg-emerald-500/20 text-emerald-500 rounded"><CheckCircle className="w-4 h-4"/></button>
                                )}
                                {b.status === 'checked_in' && (
                                    <button onClick={() => updateStatus(b.id, 'checked_out', b.room_id)} title="Check Out" className="p-1.5 hover:bg-slate-700 text-slate-400 rounded"><LogOut className="w-4 h-4"/></button>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
      <CreateBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchBookings} />
    </div>
  );
};

export default Bookings;