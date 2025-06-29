'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

const themes = [
  { 
    name: 'light', 
    icon: '☀️', 
    label: 'Light',
    description: 'Light theme'
  },
  { 
    name: 'dark', 
    icon: '🌙', 
    label: 'Dark',
    description: 'Dark theme'
  },
  { 
    name: 'system', 
    icon: '💻', 
    label: 'System',
    description: 'Follow system setting'
  },
]

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="relative">
        <button className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-muted opacity-50 border border-border">
          <span>Theme</span>
          <span className="text-xs">▼</span>
        </button>
      </div>
    )
  }

  const currentTheme = themes.find(t => t.name === theme) || themes[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-background border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
        aria-label="Toggle theme menu"
      >
        <span className="text-sm">{currentTheme.icon}</span>
        <span className="text-sm font-medium">{currentTheme.label}</span>
        <span className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-40 bg-background border border-border rounded-lg shadow-lg z-20">
            {themes.map((t) => (
              <button
                key={t.name}
                onClick={() => {
                  setTheme(t.name)
                  setIsOpen(false)
                }}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground first:rounded-t-lg last:rounded-b-lg transition-colors text-sm
                  ${theme === t.name ? 'bg-primary/10 text-primary' : ''}
                `}
                title={t.description}
              >
                <span>{t.icon}</span>
                <span className="font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
