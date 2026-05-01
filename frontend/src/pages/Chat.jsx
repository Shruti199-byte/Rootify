import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/UI';
import { Send, MessageSquare } from 'lucide-react';

export default function Chat() {
  const { user, token } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [newChatUserId, setNewChatUserId] = useState('');

  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/api/messages/conversations');
      setConversations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Conversation load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(`ws://127.0.0.1:8000/api/messages/ws/${token}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setMessages((prev) => {
        if (prev.find((m) => m.id === data.id)) return prev;

        if (
          activeChat &&
          (data.sender_id === activeChat || data.receiver_id === activeChat)
        ) {
          return [...prev, data];
        }

        return prev;
      });

      fetchConversations();
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    return () => {
      ws.close();
    };
  }, [token, activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openChat = async (userId) => {
    setActiveChat(userId);

    try {
      const res = await api.get(`/api/messages/${userId}`);
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Chat load error:', err);
      setMessages([]);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!newMsg.trim() || !activeChat) return;

    const payload = {
      receiver_id: activeChat,
      content: newMsg,
    };

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    } else {
      await api.post('/api/messages/', payload);
      const res = await api.get(`/api/messages/${activeChat}`);
      setMessages(res.data);
    }

    setNewMsg('');
  };

  const startNewChat = () => {
    const id = parseInt(newChatUserId);

    if (!id) {
      alert('Enter valid user ID');
      return;
    }

    if (user?.id && id === user.id) {
      alert('You cannot chat with yourself');
      return;
    }

    openChat(id);
    setNewChatUserId('');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700" style={{ height: '70vh' }}>
        <div className="flex h-full">
          <div className="w-80 border-r border-slate-700 flex flex-col">
            <div className="p-4 border-b border-slate-700">
              <div className="flex gap-2">
                <input
                  className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm w-full"
                  placeholder="User ID to chat..."
                  value={newChatUserId}
                  onChange={(e) => setNewChatUserId(e.target.value)}
                />

                <button
                  onClick={startNewChat}
                  className="bg-emerald-600 px-4 py-2 rounded text-sm"
                >
                  Go
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-sm">
                  No conversations yet
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.user_id}
                    onClick={() => openChat(conv.user_id)}
                    className={`w-full p-4 text-left hover:bg-slate-700 transition flex items-center gap-3 ${activeChat === conv.user_id ? 'bg-slate-700' : ''
                      }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                      {conv.full_name?.[0] || 'U'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-sm truncate block">
                        {conv.full_name}
                      </span>
                      <p className="text-xs text-slate-400 truncate">
                        {conv.last_message}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {activeChat ? (
              <>
                <div className="p-4 border-b border-slate-700">
                  <h3 className="font-semibold">
                    {conversations.find((c) => c.user_id === activeChat)?.full_name ||
                      `User #${activeChat}`}
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${msg.sender_id === user?.id
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-700 text-slate-200'
                          }`}
                      >
                        {msg.content}

                        <p className="text-xs mt-1 opacity-70">
                          {msg.created_at
                            ? new Date(msg.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                            : ''}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={sendMessage} className="p-4 border-t border-slate-700 flex gap-2">
                  <input
                    className="bg-slate-900 border border-slate-700 rounded px-3 py-2 flex-1"
                    placeholder="Type a message..."
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                  />

                  <button
                    type="submit"
                    className="bg-emerald-600 px-4 py-2 rounded"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Select a conversation or enter a User ID</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}