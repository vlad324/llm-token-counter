'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

const SunIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
  </svg>
);

const MoonIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
  </svg>
);

const MonitorIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
  </svg>
);

const themes = [
  {
    name: 'light',
    icon: SunIcon,
    label: 'Light',
    description: 'Light theme'
  },
  {
    name: 'dark',
    icon: MoonIcon,
    label: 'Dark',
    description: 'Dark theme'
  },
  {
    name: 'system',
    icon: MonitorIcon,
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
        className="p-2 rounded-lg bg-muted/50 hover:bg-muted border border-border/50 transition-colors"
        aria-label="Toggle theme menu"
      >
        <currentTheme.icon/>
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
                <t.icon/>
                <span className="font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
