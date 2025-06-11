'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ChatPage() {
  const [sessionValid, setSessionValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const validateSession = async () => {
      try {
        // Check if the user is logged in by fetching user data
        const res = await axios.get('https://ai-agents.ddns.net/oauth/me', {
          withCredentials: true, // send cookies with the request
        });
        const user = res.data;
        console.log('User:', user);
        setSessionValid(true);
      } catch {
        router.push('/'); // Redirect to home if not logged in
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, [router]);

  // If loading or session is not valid, show loading state or redirect
  // If session is valid, render the chat interface

  if (loading) return <div className="text-white p-6">Loading...</div>;
  if (!sessionValid) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">AI Event Scheduler</h1>
      <ChatInterface />
    </div>
  );
}

function ChatInterface() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

    const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');

    try {
      const res = await axios.post('https://ai-agents.ddns.net/prompt/', { prompt: input }, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(res)

      const data = res.data;

      // Extract relevant fields from the response
      const event = data.data;
      const start = new Date(event?.start?.dateTime).toLocaleString();
      const end = new Date(event?.end?.dateTime).toLocaleString();
      const participants = event?.attendees?.map((a: { email: string }) => a.email).join(', ') || 'No attendees';
      const summary = event?.summary || 'Untitled Event';
      const link = event?.htmlLink || '#';

      const confirmationMessage = `
  ✅ Event Created: **${summary}**
  🗓 Date: ${start} - ${end}
  👥 Participants: ${participants}
  🔗 [View on Google Calendar](${link})
      `.trim();

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.response },
        { role: 'assistant', content: confirmationMessage },
      ]);

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "⚠️ Something went wrong while processing your event." }
      ]);
    }
  };

  return (
    <div>
      <div className="h-[60vh] overflow-y-auto mb-4 bg-gray-800 p-4 rounded">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div
              className={`inline-block px-4 py-2 rounded ${
                msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-l"
          placeholder="Ask the AI agent..."
        />
        <button onClick={sendMessage} className="bg-blue-600 px-4 py-2 rounded-r text-white">
          Send
        </button>
      </div>
    </div>
  );
}
