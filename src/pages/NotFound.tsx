import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Fish, Home } from 'lucide-react';
import axios from "axios";

// --- ChatAgent component ---
const PERPLEXITY_API_KEY = "YOUR_PERPLEXITY_API_KEY"; // Replace with your key

const ChatAgent = () => {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful assistant." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", content: input }
    ];
    setMessages(newMessages);
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        "https://api.perplexity.ai/chat/completions",
        {
          model: "sonar-medium-online",
          messages: newMessages,
        },
        {
          headers: {
            Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
            "Content-Type": "application/json",
            Accept: "application/json"
          }
        }
      );
      const reply = res.data.choices?.[0]?.message?.content || "No response.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      setError("Error communicating with Perplexity.");
    }
    setLoading(false);
    setInput("");
  };

  return (
    <section className="max-w-lg mx-auto bg-white rounded-xl shadow p-6 mt-12">
      <h2 className="text-2xl font-bold mb-4 text-primary-800">Chat with Perplexity Agent</h2>
      <div className="h-64 overflow-y-auto bg-gray-50 rounded p-3 mb-4">
        {messages
          .filter(msg => msg.role !== "system")
          .map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}
            >
              <span className={`inline-block px-3 py-2 rounded ${msg.role === "user" ? "bg-blue-100" : "bg-green-100"}`}>
                {msg.content}
              </span>
            </div>
          ))}
        {loading && <div className="text-gray-400">Thinking...</div>}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type your question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-primary-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          Send
        </button>
      </form>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </section>
  );
};
// --- End ChatAgent component ---

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-100 px-4">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <Fish className="h-24 w-24 text-primary-600" />
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-900 mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-primary-800 mb-6">
          Page Not Found
        </h2>
        <p className="text-lg text-primary-600 mb-8 max-w-md mx-auto">
          Looks like you've ventured into uncharted waters! 
          The page you're looking for doesn't exist.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center bg-primary-600 hover:bg-primary-800 text-white py-3 px-6 rounded-full transition-colors"
        >
          <Home className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
      </motion.div>
      {/* Chat Agent Section */}
      <ChatAgent />
    </div>
  );
};

export default NotFound;
