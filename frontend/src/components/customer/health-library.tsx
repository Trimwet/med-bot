import { useState } from 'react'
import { Search, Clock, AlertCircle } from 'lucide-react'

type Category = 'All' | 'Common Illnesses' | 'Prevention' | 'First Aid' | 'Healthy Living' | 'Mental Health'

interface Article {
  title: string
  description: string
  readTime: string
  image: string
  category: string
}

const categories: Category[] = ['All', 'Common Illnesses', 'Prevention', 'First Aid', 'Healthy Living', 'Mental Health']

const commonIllnesses: Article[] = [
  {
    title: 'Common Cold',
    description: 'Learn about causes, symptoms, and...',
    readTime: '5 min read',
    image: '/hero-doctor.jpg',
    category: 'Common Illnesses',
  },
  {
    title: 'Flu (Influenza)',
    description: 'Understand the flu, symptoms, and when to...',
    readTime: '6 min read',
    image: '/hero-doctor.jpg',
    category: 'Common Illnesses',
  },
  {
    title: 'Fever',
    description: 'Types of fever, causes, and home care tips.',
    readTime: '4 min read',
    image: '/hero-doctor.jpg',
    category: 'Common Illnesses',
  },
  {
    title: 'Headache',
    description: 'Types, causes, and effective relief methods.',
    readTime: '4 min read',
    image: '/hero-doctor.jpg',
    category: 'Common Illnesses',
  },
]

const prevention: Article[] = [
  {
    title: 'Hand Hygiene',
    description: 'Simple steps to keep your hands clean and safe.',
    readTime: '4 min read',
    image: '/hero-doctor.jpg',
    category: 'Prevention',
  },
  {
    title: 'Vaccinations',
    description: 'Stay protected with recommended vaccines.',
    readTime: '5 min read',
    image: '/hero-doctor.jpg',
    category: 'Prevention',
  },
  {
    title: 'Nutrition Basics',
    description: 'Eat right, feel right. Basics of balanced...',
    readTime: '5 min read',
    image: '/hero-doctor.jpg',
    category: 'Prevention',
  },
  {
    title: 'Healthy Habits',
    description: 'Daily habits for a stronger and healthier you.',
    readTime: '6 min read',
    image: '/hero-doctor.jpg',
    category: 'Prevention',
  },
]

export const HealthLibrary = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [search, setSearch] = useState('')

  const filterArticles = (articles: Article[]) => {
    if (activeCategory !== 'All' && activeCategory !== articles[0]?.category) return []
    if (!search) return articles
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase())
    )
  }

  const filteredCommon = filterArticles(commonIllnesses)
  const filteredPrevention = filterArticles(prevention)

  const showCommon = filteredCommon.length > 0
  const showPrevention = filteredPrevention.length > 0

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Health Library</h1>
        <p className="text-sm text-gray-500 mt-1">
          Trusted health information to help you and your family stay informed.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles, topics, conditions..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#073B4C]/30"
        />
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Categories</h2>
        <div className="flex overflow-x-auto gap-2 pb-1 -mx-1 px-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-[#073B4C] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Common Illnesses */}
      {showCommon && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Common Illnesses</h2>
            <button className="text-sm font-semibold text-[#073B4C] hover:underline">
              View all ›
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCommon.map((article) => (
              <div
                key={article.title}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2 leading-relaxed">
                    {article.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prevention */}
      {showPrevention && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Prevention</h2>
            <button className="text-sm font-semibold text-[#073B4C] hover:underline">
              View all ›
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredPrevention.map((article) => (
              <div
                key={article.title}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2 leading-relaxed">
                    {article.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-500 leading-relaxed">
            Information provided is for general knowledge only and not a substitute for
            professional medical advice. Always consult a healthcare professional for
            medical concerns.
          </p>
        </div>
      </div>
    </div>
  )
}
