import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Fish, 
  MapPin, 
  Home as HomeIcon, 
  MessageSquare, 
  Users, 
  TrendingUp,
  CheckCircle,
  Circle,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const Dashboard: React.FC = () => {
  const [fisheries, setFisheries] = useState<any[]>([]);
  const [lakes, setLakes] = useState<any[]>([]);
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fake stats for demonstration
  const totalUsers = 158;
  const totalBookings = 47;

  // --- TASKS STATE ---
  const [tasks, setTasks] = useState<any[]>([]);
  const [taskInput, setTaskInput] = useState('');
  const [taskLoading, setTaskLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editInput, setEditInput] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: fisheriesData } = await supabase.from('fisheries').select('*');
      setFisheries(fisheriesData || []);
      const { data: lakesData } = await supabase.from('lakes').select('*');
      setLakes(lakesData || []);
      const { data: accommodationsData } = await supabase.from('accommodation').select('*');
      setAccommodations(accommodationsData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  // --- TASKS CRUD LOGIC ---
  const fetchTasks = async () => {
    setTaskLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('id', { ascending: false });
    if (!error) setTasks(data || []);
    setTaskLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    setTaskLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title: taskInput, completed: false }])
      .select();
    if (!error && data) {
      setTasks([data[0], ...tasks]);
      setTaskInput('');
    }
    setTaskLoading(false);
  };

  // Toggle complete
  const handleToggleTask = async (taskId: number, completed: boolean) => {
    setTaskLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .update({ completed: !completed })
      .eq('id', taskId)
      .select();
    if (!error && data) {
      setTasks(tasks.map(t => t.id === taskId ? data[0] : t));
    }
    setTaskLoading(false);
  };

  // Inline Edit
  const startEdit = (task: any) => {
    setEditingId(task.id);
    setEditInput(task.title);
    setTimeout(() => {
      editInputRef.current?.focus();
    }, 0);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditInput('');
  };
  const handleEditSave = async (taskId: number) => {
    if (!editInput.trim()) {
      cancelEdit();
      return;
    }
    setTaskLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .update({ title: editInput })
      .eq('id', taskId)
      .select();
    if (!error && data) {
      setTasks(tasks.map(t => t.id === taskId ? data[0] : t));
    }
    setEditingId(null);
    setEditInput('');
    setTaskLoading(false);
  };

  // Delete
  const handleDeleteTask = async (taskId: number) => {
    setTaskLoading(true);
    await supabase.from('tasks').delete().eq('id', taskId);
    setTasks(tasks.filter(t => t.id !== taskId));
    setDeleteConfirmId(null);
    setTaskLoading(false);
  };

  // --- FISHERIES TABLE ---
  const topFisheries = [...fisheries]
    .sort((a, b) => {
      const lakesA = lakes.filter(lake => lake.fishery_id === a.id).length;
      const lakesB = lakes.filter(lake => lake.fishery_id === b.id).length;
      return lakesB - lakesA;
    })
    .slice(0, 3);

  // --- ANIMATION ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      </motion.div>
      
      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-md cursor-pointer transition-transform"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Total Fisheries</h3>
            <div className="bg-primary-100 p-2 rounded-full">
              <MapPin className="h-5 w-5 text-primary-900" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{loading ? '...' : fisheries.length}</p>
          <div className="mt-2 text-xs text-green-600 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>2 new this month</span>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-md cursor-pointer transition-transform"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Total Lakes</h3>
            <div className="bg-primary-100 p-2 rounded-full">
              <Fish className="h-5 w-5 text-primary-900" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{loading ? '...' : lakes.length}</p>
          <div className="mt-2 text-xs text-green-600 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>4 new this month</span>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-md cursor-pointer transition-transform"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Accommodations</h3>
            <div className="bg-primary-100 p-2 rounded-full">
              <HomeIcon className="h-5 w-5 text-primary-900" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{loading ? '...' : accommodations.length}</p>
          <div className="mt-2 text-xs text-green-600 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>1 new this month</span>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-md cursor-pointer transition-transform"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Users</h3>
            <div className="bg-primary-100 p-2 rounded-full">
              <Users className="h-5 w-5 text-primary-900" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
          <div className="mt-2 text-xs text-green-600 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>12 new this month</span>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-md cursor-pointer transition-transform"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Bookings</h3>
            <div className="bg-primary-100 p-2 rounded-full">
              <MessageSquare className="h-5 w-5 text-primary-900" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalBookings}</p>
          <div className="mt-2 text-xs text-green-600 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>8 new this week</span>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Quick Actions */}
      <motion.div 
        className="bg-white p-6 rounded-xl shadow-md mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
      >
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div whileHover={{ scale: 1.02 }} className="transition-transform">
            <Link 
              to="/admin/fisheries" 
              className="bg-primary-50 hover:bg-primary-100 p-4 rounded-lg transition-colors flex items-center"
            >
              <MapPin className="h-5 w-5 text-primary-600 mr-2" />
              <span>Manage Fisheries</span>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} className="transition-transform">
            <Link 
              to="/admin/lakes" 
              className="bg-primary-50 hover:bg-primary-100 p-4 rounded-lg transition-colors flex items-center"
            >
              <Fish className="h-5 w-5 text-primary-600 mr-2" />
              <span>Manage Lakes</span>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} className="transition-transform">
            <Link 
              to="/admin/messages" 
              className="bg-primary-50 hover:bg-primary-100 p-4 rounded-lg transition-colors flex items-center"
            >
              <MessageSquare className="h-5 w-5 text-primary-600 mr-2" />
              <span>View Messages</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>
      
      {/* TASK LIST (INLINE EDIT) */}
      <motion.div
        className="bg-white p-6 rounded-xl shadow-md mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        whileHover={{ scale: 1.02 }}
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <CheckCircle className="mr-2 text-primary-600" /> Task List
        </h2>
        <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
            placeholder="Add a new task..."
            value={taskInput}
            onChange={e => setTaskInput(e.target.value)}
            disabled={taskLoading}
          />
          <button
            type="submit"
            className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition"
            disabled={taskLoading || !taskInput.trim()}
          >
            Add
          </button>
        </form>
        {taskLoading && <div className="text-gray-500 text-sm mb-2">Loading...</div>}
        <ul className="divide-y divide-gray-200">
          {tasks.length === 0 && !taskLoading && (
            <li className="py-2 text-gray-400">No tasks yet.</li>
          )}
          {tasks.map(task => (
            <li
              key={task.id}
              className="flex items-center justify-between py-2 group hover:bg-gray-50 rounded transition"
            >
              {/* Complete/Incomplete toggle */}
              <button
                className="mr-3 focus:outline-none"
                onClick={() => handleToggleTask(task.id, task.completed)}
                aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                {task.completed ? (
                  <CheckCircle className="text-green-500 h-5 w-5" />
                ) : (
                  <Circle className="text-gray-400 h-5 w-5 group-hover:text-primary-500" />
                )}
              </button>
              {/* Inline Editable Title */}
              {editingId === task.id ? (
                <input
                  ref={editInputRef}
                  className="flex-1 border rounded px-2 py-1 text-sm"
                  value={editInput}
                  onChange={e => setEditInput(e.target.value)}
                  onBlur={() => handleEditSave(task.id)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleEditSave(task.id);
                    }
                    if (e.key === 'Escape') {
                      cancelEdit();
                    }
                  }}
                  autoFocus
                  disabled={taskLoading}
                />
              ) : (
                <span
                  className={`flex-1 text-left text-base cursor-pointer ${
                    task.completed ? 'line-through text-gray-400' : 'text-gray-800'
                  } hover:bg-primary-50 rounded px-1`}
                  onClick={() => startEdit(task)}
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') startEdit(task);
                  }}
                  role="button"
                  aria-label="Edit task"
                >
                  {task.title}
                </span>
              )}
              {/* Delete */}
              <button
                className="text-red-500 hover:text-red-700 ml-3"
                onClick={() => setDeleteConfirmId(task.id)}
                aria-label="Delete"
                disabled={editingId !== null || taskLoading}
              >
                <Trash2 className="h-5 w-5" />
              </button>
              {/* Delete Confirmation */}
              {deleteConfirmId === task.id && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
                  <div className="bg-white rounded shadow-lg p-6 w-80">
                    <h3 className="text-lg font-semibold mb-2">Delete Task?</h3>
                    <p className="mb-4 text-gray-600">Are you sure you want to delete this task?</p>
                    <div className="flex justify-end gap-2">
                      <button
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                        onClick={() => setDeleteConfirmId(null)}
                        disabled={taskLoading}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleDeleteTask(task.id)}
                        disabled={taskLoading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </motion.div>
      
      {/* Top Fisheries */}
      <motion.div 
        className="bg-white p-6 rounded-xl shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
      >
        <h2 className="text-lg font-semibold mb-4">Top Fisheries</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  District
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lakes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Accommodation
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topFisheries.map((fishery) => {
                const fisheryLakes = lakes.filter(lake => lake.fishery_id === fishery.id);
                return (
                  <tr key={fishery.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{fishery.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">{fishery.district}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">{fisheryLakes.length}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {fishery.isfeatured ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Yes
                        </span> 
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {fishery.hasaccommodation ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Available
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          None
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })} 
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right">
          <Link 
            to="/admin/fisheries" 
            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
          >
            View All Fisheries →
          </Link> 
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
