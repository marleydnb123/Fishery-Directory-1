import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Trash2, Calendar, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<any>(null);

  // Fetch messages from Supabase
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      } else {
        setMessages(data || []);
      }
      setLoading(false);
    };
    fetchMessages();
  }, []);

  // Filter messages based on search term
  const filteredMessages = messages.filter(message =>
    message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Mark as read (updates Supabase and local state)
  const handleMarkAsRead = async (id: string) => {
    await supabase.from('messages').update({ read: true }).eq('id', id);
    setMessages(messages.map(message =>
      message.id === id ? { ...message, read: true } : message
    ));
  };

  // Delete message (removes from Supabase and local state)
  const handleDeleteMessage = async (id: string) => {
    await supabase.from('messages').delete().eq('id', id);
    setMessages(messages.filter(message => message.id !== id));
    setIsModalOpen(false);
    setCurrentMessage(null);
  };

  // Open message modal
  const openMessageModal = (message: any) => {
    setCurrentMessage(message);
    setIsModalOpen(true);
    if (!message.read) {
      handleMarkAsRead(message.id);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  return (
    <div>
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold">Messages</h1>
        <div className="flex items-center">
          <span className="text-gray-600 mr-2">{messages.filter(m => !m.read).length} unread</span>
          <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
            {messages.length} total
          </span>
        </div>
      </motion.div>

      <motion.div
        className="bg-white p-4 rounded-xl shadow-md mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
      </motion.div>

      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {loading ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <span>Loading messages...</span>
          </div>
        ) : filteredMessages.length > 0 ? (
          filteredMessages.map((message) => (
            <motion.div
              key={message.id}
              variants={itemVariants}
              className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${
                message.read ? 'border-gray-200' : 'border-primary-600'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className={`p-2 rounded-full mr-3 ${
                      message.read ? 'bg-gray-100 text-gray-600' : 'bg-primary-100 text-primary-600'
                    }`}>
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{message.name}</h3>
                      <p className="text-sm text-gray-600">{message.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(message.created_at)}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-gray-700 line-clamp-2">{message.message}</p>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => openMessageModal(message)}
                    className="px-3 py-1 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => {
                      setCurrentMessage(message);
                      setIsModalOpen(true);
                    }}
                    className="px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No messages found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try a different search term' : 'Your inbox is empty'}
            </p>
          </div>
        )}
      </motion.div>

      {/* Message Modal */}
      {isModalOpen && currentMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">Message from {currentMessage.name}</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setCurrentMessage(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{currentMessage.email}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(currentMessage.created_at)}</span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-800 whitespace-pre-line">{currentMessage.message}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setCurrentMessage(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => handleDeleteMessage(currentMessage.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
