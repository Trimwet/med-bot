import { useState } from 'react'
import {
  Search,
  MessageSquare,
  Calendar,
  Clock,
  Trash2,
  Filter,
  ChevronRight,
  MoreHorizontal,
  FileText,
  AlertCircle,
} from 'lucide-react'

type ChatEntry = {
  id: string
  title: string
  preview: string
  date: string
  time: string
  messageCount: number
  status: 'completed' | 'ongoing' | 'archived'
}

const MOCK_CHATS: ChatEntry[] = [
  {
    id: '1',
    title: 'Persistent headaches for 2 weeks',
    preview: 'Based on your symptoms, I recommend scheduling an appointment with your primary care physician...',
    date: 'Jul 11, 2026',
    time: '3:42 PM',
    messageCount: 12,
    status: 'completed',
  },
  {
    id: '2',
    title: 'Chest tightness after exercise',
    preview: 'Chest tightness during exercise can have several causes. Let me ask a few questions to help assess...',
    date: 'Jul 10, 2026',
    time: '11:15 AM',
    messageCount: 8,
    status: 'completed',
  },
  {
    id: '3',
    title: 'Stomach pain and nausea',
    preview: 'Abdominal pain with nausea can be caused by many things. Can you describe the location of the pain?',
    date: 'Jul 9, 2026',
    time: '7:30 PM',
    messageCount: 15,
    status: 'completed',
  },
  {
    id: '4',
    title: 'Skin rash on left arm',
    preview: 'A skin rash can indicate many conditions. Let me help you understand what might be causing it...',
    date: 'Jul 7, 2026',
    time: '2:10 PM',
    messageCount: 6,
    status: 'archived',
  },
  {
    id: '5',
    title: 'Difficulty sleeping',
    preview: 'Sleep difficulties are common and can have various causes. Let me ask some questions to better understand...',
    date: 'Jul 5, 2026',
    time: '9:00 AM',
    messageCount: 10,
    status: 'archived',
  },
]

const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-green-50 text-green-700',
  ongoing: 'bg-blue-50 text-blue-700',
  archived: 'bg-gray-100 text-gray-500',
}

export const ChatHistory = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'completed' | 'ongoing' | 'archived'>('all')
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  const filteredChats = MOCK_CHATS.filter((chat) => {
    const matchesSearch =
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'all' || chat.status === filter
    return matchesSearch && matchesFilter
  })

  const filterButtons = [
    { id: 'all', label: 'All' },
    { id: 'completed', label: 'Completed' },
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'archived', label: 'Archived' },
  ] as const

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-3 sm:px-6 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-gray-900">Chat History</h1>
          <span className="text-xs text-gray-400">({filteredChats.length})</span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="px-3 sm:px-6 py-3 border-b border-gray-100 shrink-0 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#073B4C]/20 focus:border-[#073B4C] transition-colors"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1.5">
          {filterButtons.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filter === f.id
                  ? 'bg-[#073B4C] text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No conversations found</p>
            <p className="text-xs text-gray-500">
              {searchQuery ? 'Try a different search term' : 'Start a new chat to begin'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className="group relative px-3 sm:px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {chat.title}
                      </h3>
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full shrink-0 ${STATUS_STYLES[chat.status]}`}>
                        {chat.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                      {chat.preview}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {chat.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {chat.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {chat.messageCount} messages
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveMenu(activeMenu === chat.id ? null : chat.id)
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Dropdown Menu */}
                {activeMenu === chat.id && (
                  <div className="absolute right-6 top-12 z-10 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1">
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                      <FileText className="w-4 h-4" />
                      View full conversation
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      Continue this chat
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
