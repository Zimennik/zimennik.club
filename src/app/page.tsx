'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'

interface Message {
  id: string
  content: string
  author: {
    username: string
    avatar: string
  }
  timestamp: string
}

export default function Home() {
  const { data: session, status } = useSession()
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    if (status === 'loading') return
    if (session) {
      fetch('/api/messages')
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(err => console.error(err))
    }
  }, [session])

  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">Zimennik Club</h1>
        <button 
          onClick={() => signIn('discord')}
          className="bg-[#5865F2] text-white px-6 py-3 rounded-lg hover:bg-[#4752C4] transition-colors"
        >
          Войти через Discord
        </button>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Zimennik Club</h1>
          <button 
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Выйти
          </button>
        </div>

        <div className="space-y-4">
          {messages.map(message => (
            <div key={message.id} className="bg-white/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Image
                  src={message.author.avatar}
                  alt={message.author.username}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="font-medium">{message.author.username}</span>
                <span className="text-sm text-gray-400">
                  {new Date(message.timestamp).toLocaleString()}
                </span>
              </div>
              <p>{message.content}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
