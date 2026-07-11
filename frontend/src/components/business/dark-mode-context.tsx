import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface DarkModeContextType {
  dark: boolean
  toggle: () => void
}

const DarkModeContext = createContext<DarkModeContextType>({ dark: false, toggle: () => {} })

export const useDarkMode = () => useContext(DarkModeContext)

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('medbot-business-dark')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    localStorage.setItem('medbot-business-dark', JSON.stringify(dark))
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  return (
    <DarkModeContext.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>
      {children}
    </DarkModeContext.Provider>
  )
}
