import { createEffect, createRoot, onMount } from 'solid-js'

import { createThemeStore } from '~/modules/theme/application/store/themeStore'
import { DEFAULT_THEME, Theme } from '~/modules/theme/domain/theme'
import { createThemeLocalStorage } from '~/modules/theme/infrastructure/themeLocalStoreage'

const { themeStore } = createRoot(() => {
  const themeStore = createThemeStore()
  const themeLocalStorage = createThemeLocalStorage()

  createEffect(() => {
    themeLocalStorage.saveTheme(themeStore.theme())
    document.documentElement.setAttribute('data-theme', themeStore.theme())
  })

  onMount(() => {
    const savedTheme = themeLocalStorage.getTheme({
      defaultTheme: DEFAULT_THEME,
    })
    themeStore.setTheme(savedTheme)
  })

  return { themeStore, themeLocalStorage }
})
export const themeUseCases = {
  toggleTheme: () => {
    themeStore.setTheme((prevTheme) =>
      prevTheme === 'light' ? 'dark' : 'light',
    )
  },
  currentTheme: (): Theme => {
    return themeStore.theme()
  },
}
