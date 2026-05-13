import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { RiSendPlaneLine, RiUserLine } from "react-icons/ri";

export default function MessagingPage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    api.get("/messages/contacts").then(({ data }) => setContacts(data.contacts));
  }, []);

  useEffect(() => {
    if (!selected) return;
    api.get(`/messages/${selected.user_id}`).then(({ data }) => setMessages(data.messages));
  }, [selected]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !selected) return;
    setSending(true);
    try {
      await api.post("/messages", { receiver_id: selected.user_id, content: text.trim() });
      setText("");
      const { data } = await api.get(`/messages/${selected.user_id}`);
      setMessages(data.messages);
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl h-[calc(100vh-140px)] flex gap-6">
        {/* Contacts sidebar */}
        <div className="w-72 glass rounded-2xl border border-[var(--neural-border)] flex flex-col">
          <div className="p-4 border-b border-[var(--neural-border)]">
            <h2 className="font-display font-semibold text-white">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {contacts.length === 0 && (
              <p className="text-sm text-[var(--text-muted)] text-center py-8">No contacts yet</p>
            )}
            {contacts.map(c => (
              <button key={c.id} onClick={() => setSelected(c)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                  selected?.id === c.id ? "bg-[var(--cyber-primary)]/10 border border-[var(--cyber-primary)]/30" : "hover:bg-white/5 border border-transparent"
                }`}>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--cyber-primary)] to-[var(--cyber-secondary)] flex items-center justify-center text-[#040d1a] font-bold text-sm flex-shrink-0">
                  {c.full_name?.[0] || "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-display font-medium text-white truncate">
                    {user?.role === "patient" ? `Dr. ${c.full_name}` : c.full_name}
                  </p>
                  {c.unread_count > 0 && (
                    <span className="text-xs bg-[var(--cyber-primary)] text-[#040d1a] px-2 py-0.5 rounded-full font-bold">{c.unread_count} new</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 glass rounded-2xl border border-[var(--neural-border)] flex flex-col">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-[var(--text-muted)]">
              <div className="text-center">
                <RiUserLine size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a contact to start messaging</p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-4 border-b border-[var(--neural-border)] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--cyber-primary)] to-[var(--cyber-secondary)] flex items-center justify-center text-[#040d1a] font-bold text-sm">
                  {selected.full_name?.[0]}
                </div>
                <div>
                  <p className="font-display font-semibold text-white text-sm">
                    {user?.role === "patient" ? `Dr. ${selected.full_name}` : selected.full_name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">{selected.email}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m, i) => {
                  const mine = m.sender_id === user?.id || (user?.role === "patient" && m.sender_id === user?.id);
                  const isMine = m.sender_id === parseInt(localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"))?.id);
                  return (
                    <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className={`flex ${m.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-sm px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        m.sender_id === user?.id
                          ? "bg-gradient-to-br from-[var(--cyber-primary)] to-[var(--cyber-secondary)] text-[#040d1a] font-medium"
                          : "glass border border-[var(--neural-border)] text-[var(--text-secondary)]"
                      }`}>
                        {m.content}
                        <p className="text-xs opacity-60 mt-1">{new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-[var(--neural-border)] flex gap-3">
                <input
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Type a message..."
                  className="input-cyber flex-1"
                />
                <button onClick={sendMessage} disabled={sending || !text.trim()} className="btn-cyber py-2.5 px-4 disabled:opacity-50">
                  <RiSendPlaneLine size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
