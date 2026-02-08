import React, { useState, useEffect } from "react";
import useAppStore from "./appStore";
import { supabase } from "./supabase";
import {
  Plus,
  Filter,
  LayoutGrid,
  List as ListIcon,
  MoreVertical,
} from "lucide-react";
import { motion } from "framer-motion";

const RoomCard = ({ room, onUpdate }) => {
  const statusColors = {
    available: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    occupied: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    cleaning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    maintenance: "bg-slate-700 text-slate-400 border-slate-600",
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-colors group relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-white font-display">
            {room.room_number}
          </h3>
          <p className="text-sm text-slate-400 capitalize">
            {room.room_type.replace("-", " ")}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide border ${statusColors[room.current_status]}`}
        >
          {room.current_status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Floor</span>
          <span className="text-slate-300">{room.floor}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">View</span>
          <span className="text-slate-300 capitalize">{room.view_type}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Rate</span>
          <span className="text-white font-medium">₹{room.base_price}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-2">
        {room.current_status === "cleaning" && (
          <button
            onClick={() => onUpdate(room.id, "available")}
            className="col-span-2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Mark Ready
          </button>
        )}
        {room.current_status === "available" && (
          <button
            onClick={() => onUpdate(room.id, "maintenance")}
            className="col-span-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            Set Maintenance
          </button>
        )}
        {(room.current_status === "occupied" ||
          room.current_status === "maintenance") && (
          <button
            onClick={() => onUpdate(room.id, "cleaning")}
            className="col-span-2 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-500 rounded-lg text-xs font-medium transition-colors border border-amber-600/20"
          >
            Request Cleaning
          </button>
        )}
      </div>
    </div>
  );
};

const AddRoomModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "standard",
    floor: "1",
    viewType: "city",
    capacity: "2",
    basePrice: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("rooms").insert([
      {
        room_number: formData.roomNumber,
        room_type: formData.roomType,
        floor: Number(formData.floor),
        view_type: formData.viewType,
        capacity: Number(formData.capacity),
        base_price: Number(formData.basePrice),
        current_status: "available",
      },
    ]);

    setLoading(false);
    if (!error) {
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl">
        <h2 className="text-xl font-display font-bold text-white mb-6">
          Create New Room
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">
                Room Number
              </label>
              <input
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-primary-500 outline-none"
                value={formData.roomNumber}
                onChange={(e) =>
                  setFormData({ ...formData, roomNumber: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Floor</label>
              <input
                type="number"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-primary-500 outline-none"
                value={formData.floor}
                onChange={(e) =>
                  setFormData({ ...formData, floor: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Type</label>
              <select
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white outline-none"
                value={formData.roomType}
                onChange={(e) =>
                  setFormData({ ...formData, roomType: e.target.value })
                }
              >
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">View</label>
              <select
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white outline-none"
                value={formData.viewType}
                onChange={(e) =>
                  setFormData({ ...formData, viewType: e.target.value })
                }
              >
                <option value="city">City</option>
                <option value="garden">Garden</option>
                <option value="sea">Sea</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">
              Base Rate (₹)
            </label>
            <input
              type="number"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-primary-500 outline-none"
              value={formData.basePrice}
              onChange={(e) =>
                setFormData({ ...formData, basePrice: e.target.value })
              }
            />
          </div>
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-500"
            >
              {loading ? "Creating..." : "Create Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Rooms = () => {
  const { setPageTitle } = useAppStore();
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setPageTitle("Room Management");
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const { data } = await supabase
      .from("rooms")
      .select("*")
      .order("room_number");
    if (data) setRooms(data);
  };

  const updateStatus = async (id, status) => {
    await supabase
      .from("rooms")
      .update({ current_status: status })
      .eq("id", id);
    fetchRooms();
  };

  const filteredRooms =
    filter === "all" ? rooms : rooms.filter((r) => r.current_status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-2 p-1 bg-slate-900 rounded-lg border border-slate-800 w-fit">
          {["all", "available", "occupied", "cleaning", "maintenance"].map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${filter === f ? "bg-slate-700 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
              >
                {f}
              </button>
            ),
          )}
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary-900/20"
        >
          <Plus className="w-4 h-4" /> Add Room
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredRooms.map((room) => (
          <RoomCard key={room.id} room={room} onUpdate={updateStatus} />
        ))}
      </div>

      <AddRoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchRooms}
      />
    </div>
  );
};

export default Rooms;
