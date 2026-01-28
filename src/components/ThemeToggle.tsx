import { Moon, Sun } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative"
    >
      <Sun
        className="absolute transition-all scale-100 rotate-0 dark:scale-0 dark:-rotate-90"
        size={20}
        weight="bold"
      />
      <Moon
        className="absolute transition-all scale-0 rotate-90 dark:scale-100 dark:rotate-0"
        size={20}
        weight="bold"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
