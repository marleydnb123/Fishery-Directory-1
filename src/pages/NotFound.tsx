import React, { useState } from "react";
import axios from "axios";

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
          model: "sonar-medium-online", // Or any available model
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
    <section className="max-w-lg mx-auto bg-white rounded-xl shadow p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">Chat with Perplexity Agent</h2>
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

export default ChatAgent;
