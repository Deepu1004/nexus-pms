import React, { useState, useEffect } from "react";
import useAppStore from "./appStore";
import { supabase } from "./supabase";
import { Search, Mail, Phone, MapPin, User, Plus } from "lucide-react";

const Guests = () => {
  const { setPageTitle } = useAppStore();
  const [guests, setGuests] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setPageTitle("Guests & CRM");
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    const { data } = await supabase
      .from("guests")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setGuests(data);
  };

  const filtered = guests.filter(
    (g) =>
      g.first_name.toLowerCase().includes(search.toLowerCase()) ||
      g.last_name.toLowerCase().includes(search.toLowerCase()) ||
      g.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search guests..."
            className="bg-slate-950 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:border-primary-500 outline-none w-64"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Guest
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((guest) => (
          <div
            key={guest.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-primary-500/50 transition-colors group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-lg font-bold text-slate-300 border border-slate-700">
                {guest.first_name[0]}
                {guest.last_name[0]}
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-400 border border-slate-700">
                {guest.loyalty_tier || "Standard"}
              </span>
            </div>

            <h3 className="text-white font-semibold text-lg">
              {guest.first_name} {guest.last_name}
            </h3>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Mail className="w-3.5 h-3.5" />{" "}
                <span className="truncate">{guest.email || "No email"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Phone className="w-3.5 h-3.5" />{" "}
                <span>{guest.phone || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="w-3.5 h-3.5" />{" "}
                <span>{guest.nationality || "Unknown"}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-500">
              <span>
                Visits:{" "}
                <span className="text-slate-300">{guest.visit_count}</span>
              </span>
              <span>
                Spent:{" "}
                <span className="text-slate-300">₹{guest.total_spent}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Guests;
