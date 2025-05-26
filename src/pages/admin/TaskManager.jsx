import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { CheckSquare, Square, Plus } from 'lucide-react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch tasks from Supabase
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setTasks(data || []);
      setLoading(false);
    };
    fetchTasks();
  }, []);

  // Add a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title: newTask }])
      .select();
    if (!error && data) setTasks([data[0], ...tasks]);
    setNewTask('');
    setLoading(false);
  };

  // Toggle task completion
  const handleToggle = async (task) => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ completed: !task.completed })
      .eq('id', task.id)
      .select();
    if (!error && data) {
      setTasks(tasks.map(t => (t.id === task.id ? data[0] : t)));
    }
  };

  // Delete a task
  const handleDelete = async (id) => {
    await supabase.from('tasks').delete().eq('id', id);
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <CheckSquare className="h-5 w-5 text-primary-600 mr-2" />
        Task Manager
      </h2>
      <form onSubmit={handleAddTask} className="flex mb-4">
        <input
          className="flex-1 border rounded-l px-3 py-2 focus:outline-none"
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-primary-600 text-white px-4 py-2 rounded-r flex items-center"
          disabled={loading}
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </button>
      </form>
      <ul>
        {tasks.length === 0 && !loading && (
          <li className="text-gray-500">No tasks yet.</li>
        )}
        {tasks.map(task => (
          <li
            key={task.id}
            className="flex items-center justify-between py-2 border-b last:border-b-0"
          >
            <button
              onClick={() => handleToggle(task)}
              className="mr-2"
              aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {task.completed ? (
                <CheckSquare className="h-5 w-5 text-green-600" />
              ) : (
                <Square className="h-5 w-5 text-gray-400" />
              )}
            </button>
            <span
              className={`flex-1 ${task.completed ? 'line-through text-gray-400' : ''}`}
            >
              {task.title}
            </span>
            <button
              onClick={() => handleDelete(task.id)}
              className="text-red-500 hover:text-red-700 ml-2"
              aria-label="Delete task"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
