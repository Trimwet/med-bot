import { useState } from 'react'
import { Send, Paperclip, Mic, MoreVertical } from 'lucide-react'

interface Message {
  id: number
  sender: 'bot' | 'user'
  text: string
  time: string
  options?: string[]
}

const initialMessages: Message[] = [
  {
    id: 1,
    sender: 'bot',
    text: "Hello! I'm MedBot. What symptoms are experiencing today? You can describe them here or use the body map on the left.",
    time: '10:30 AM',
  },
  {
    id: 2,
    sender: 'user',
    text: 'I have a sharp pain in my upper abdomen since this morning.',
    time: '10:31 AM',
  },
  {
    id: 3,
    sender: 'bot',
    text: 'I understand. Does the pain radiate to your back, or is it accompanied by any nausea?',
    time: '10:31 AM',
    options: ['Yes, to my back', 'No radiation'],
  },
]

export const CustomerDashboardHome = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    const newMsg: Message = {
      id: messages.length + 1,
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages([...messages, newMsg])
    setInput('')
  }

  const handleOptionClick = (option: string) => {
    const newMsg: Message = {
      id: messages.length + 1,
      sender: 'user',
      text: option,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages([...messages, newMsg])
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Welcome to MedBot 👋
            </h1>
            <p className="text-gray-500 text-sm mb-4 max-w-lg">
              I'm your AI health assistant. Tell me how you're feeling today, or
              select an area on the body map to begin a targeted assessment.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="bg-[#073B4C] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#0A202A] transition-colors">
                Start Quick Scan
              </button>
              <button className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                View Recent Reports
              </button>
            </div>
          </div>
          <img
            src="/hero-doctor.jpg"
            alt="Medical dashboard"
            className="hidden lg:block w-48 h-32 object-cover rounded-lg flex-shrink-0"
          />
        </div>
      </div>

      {/* Chat Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#073B4C] rounded-full flex items-center justify-center">
              <img src="/assets/Logoico.png" alt="MedBot" className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">MedBot AI</p>
              <p className="text-xs text-green-500 font-medium">● ONLINE</p>
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="p-3 sm:p-4 space-y-4 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id}>
              <div
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} gap-2 sm:gap-3`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 bg-[#073B4C] rounded-full flex items-center justify-center flex-shrink-0">
                    <img src="/assets/Logoico.png" alt="Bot" className="w-5 h-5" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] sm:max-w-[70%] px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#073B4C] text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === 'user' && (
                  <div className="w-8 h-8 bg-[#073B4C] rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                    JD
                  </div>
                )}
              </div>
              <p
                className={`text-xs text-gray-400 mt-1 ${
                  msg.sender === 'user' ? 'text-right' : 'ml-10'
                }`}
              >
                {msg.time}
              </p>
              {msg.options && (
                <div className="flex flex-wrap gap-2 ml-10 mt-2">
                  {msg.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOptionClick(opt)}
                      className="px-3 sm:px-4 py-2 border border-gray-300 rounded-full text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 sm:p-4 border-t border-gray-100">
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 hidden sm:block">
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-3 sm:px-4 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30"
            />
            <button className="p-2 text-gray-400 hover:text-gray-600 hidden sm:block">
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={handleSend}
              className="p-2.5 bg-[#073B4C] text-white rounded-lg hover:bg-[#0A202A] transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
