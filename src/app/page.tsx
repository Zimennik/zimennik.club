"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface DiscordMessage {
  id: string;
  content: string;
  author: {
    username: string;
    avatar: string;
  };
  timestamp: string;
}

export default function Home() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<DiscordMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetch("/api/messages")
        .then((res) => res.json())
        .then((data) => {
          setMessages(
            data.map((msg: any) => ({
              id: msg.id,
              content: msg.content,
              author: {
                username: msg.author.username,
                avatar: `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`,
              },
              timestamp: new Date(msg.timestamp).toLocaleString(),
            }))
          );
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
          setLoading(false);
        });
    }
  }, [session]);

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-8">Zimennik Club</h1>
        
        {session ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <p>Welcome, {session.user?.name}!</p>
              <button
                onClick={() => signOut()}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Sign Out
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Latest Messages</h2>
              {loading ? (
                <p>Loading messages...</p>
              ) : messages.length > 0 ? (
                messages.map((message) => (
                  <div key={message.id} className="bg-white/10 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={message.author.avatar}
                        alt={message.author.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="font-medium">
                        {message.author.username}
                      </span>
                      <span className="text-sm text-gray-400">
                        {message.timestamp}
                      </span>
                    </div>
                    <p>{message.content}</p>
                  </div>
                ))
              ) : (
                <p>No messages found</p>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => signIn("discord")}
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded"
          >
            Sign in with Discord
          </button>
        )}
      </div>
    </main>
  );
}
