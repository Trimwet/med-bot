import { useState } from 'react'
import { Search, Clock, AlertCircle, BookOpen } from 'lucide-react'

type Category = 'All' | 'Common Illnesses' | 'Prevention' | 'First Aid' | 'Healthy Living' | 'Mental Health'

interface Article {
  title: string
  description: string
  readTime: string
  image: string
  category: Exclude<Category, 'All'>
}

const CATEGORIES: Category[] = ['All', 'Common Illnesses', 'Prevention', 'First Aid', 'Healthy Living', 'Mental Health']

const ARTICLES: Article[] = [
  { title: 'Common Cold', description: 'Learn about causes, symptoms, and home care.', readTime: '5 min read', image: '/hero-doctor.jpg', category: 'Common Illnesses' },
  { title: 'Flu (Influenza)', description: 'Understand the flu, symptoms, and when to see a doctor.', readTime: '6 min read', image: '/hero-doctor.jpg', category: 'Common Illnesses' },
  { title: 'Fever', description: 'Types of fever, causes, and home care tips.', readTime: '4 min read', image: '/hero-doctor.jpg', category: 'Common Illnesses' },
  { title: 'Headache', description: 'Types, causes, and effective relief methods.', readTime: '4 min read', image: '/hero-doctor.jpg', category: 'Common Illnesses' },
  { title: 'Hand Hygiene', description: 'Simple steps to keep your hands clean and safe.', readTime: '4 min read', image: '/hero-doctor.jpg', category: 'Prevention' },
  { title: 'Vaccinations', description: 'Stay protected with recommended vaccines.', readTime: '5 min read', image: '/hero-doctor.jpg', category: 'Prevention' },
  { title: 'Nutrition Basics', description: 'Eat right, feel right — the basics of balanced eating.', readTime: '5 min read', image: '/hero-doctor.jpg', category: 'Prevention' },
  { title: 'Healthy Habits', description: 'Daily habits for a stronger and healthier you.', readTime: '6 min read', image: '/hero-doctor.jpg', category: 'Prevention' },
  { title: 'Treating Minor Cuts', description: 'Step-by-step first aid for cuts and scrapes.', readTime: '3 min read', image: '/hero-doctor.jpg', category: 'First Aid' },
  { title: 'Managing Stress', description: 'Practical techniques to reduce everyday stress.', readTime: '5 min read', image: '/hero-doctor.jpg', category: 'Mental Health' },
]

export const HealthLibrary = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [search, setSearch] = useState('')

  const filtered = ARTICLES.filter((a) => {
    const matchesCategory = activeCategory === 'All' || a.category === activeCategory
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-3 sm:px-6 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-gray-900">Health Library</h1>
          <span className="text-xs text-gray-400">({filtered.length})</span>
        </div>
      </div>

      {/* Search + Categories */}
      <div className="px-3 sm:px-6 py-3 border-b border-gray-100 shrink-0 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles, topics, conditions..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#073B4C]/20 focus:border-[#073B4C] transition-colors"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === cat ? 'bg-[#073B4C] text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No articles found</p>
            <p className="text-xs text-gray-500">Try a different search term or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((article) => (
              <div
                key={article.title}
                className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="h-28 bg-gray-100 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="p-3.5">
                  <p className="text-[10px] font-medium text-[#073B4C] uppercase tracking-wider mb-1">
                    {article.category}
                  </p>
                  <h3 className="text-sm font-medium text-gray-900 mb-1 truncate">{article.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed">{article.description}</p>
                  <div className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div className="flex items-start gap-2 mt-6 px-3.5 py-3 bg-gray-50 rounded-xl">
          <AlertCircle className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Information provided is for general knowledge only and not a substitute for professional
            medical advice. Always consult a healthcare professional for medical concerns.
          </p>
        </div>
      </div>
    </div>
  )
}
