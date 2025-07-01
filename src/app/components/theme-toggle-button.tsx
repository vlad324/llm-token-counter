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
        <button className="p-2.5 rounded-lg bg-muted/50 opacity-50 border border-border animate-pulse">
          <div className="w-4 h-4 bg-muted-foreground/30 rounded"></div>
        </button>
      </div>
    )
  }

  const currentTheme = themes.find(t => t.name === theme) || themes[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-lg bg-card hover:bg-accent border border-border hover:border-primary/30 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 group"
        style={{ minWidth: 'var(--touch-target-min)', minHeight: 'var(--touch-target-min)' }}
        aria-label="Toggle theme menu"
      >
        <currentTheme.icon/>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0"
            style={{ zIndex: 'var(--z-overlay)' }}
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div
            className="absolute right-0 mt-3 w-44 bg-card border border-border rounded-xl shadow-lg overflow-hidden animate-in slide-in-from-top-2 duration-200"
            style={{ zIndex: 'var(--z-dropdown)' }}>
            {themes.map((t, index) => (
              <button
                key={t.name}
                onClick={() => {
                  setTheme(t.name)
                  setIsOpen(false)
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-accent hover:text-accent-foreground transition-all duration-200 text-sm group
                  ${theme === t.name ? 'bg-primary/10 text-primary border-r-2 border-primary' : ''}
                  ${index !== themes.length - 1 ? 'border-b border-border/50' : ''}
                `}
                title={t.description}
              >
                <div
                  className={`w-5 h-5 flex items-center justify-center ${theme === t.name ? 'text-primary' : 'text-muted-foreground group-hover:text-accent-foreground'}`}>
                  <t.icon/>
                </div>
                <span className="font-medium">{t.label}</span>
                {theme === t.name && (
                  <div className="ml-auto">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                )}
              </button>
            ))}
            <div className="px-4 py-2 border-t border-border/50 bg-muted/30">
              <p className="text-xs text-muted-foreground">Theme preference</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
