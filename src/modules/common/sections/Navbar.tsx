import { A } from '@solidjs/router'
import { createEffect, createSignal, onCleanup, Show } from 'solid-js'

import logo from '~/assets/logo.png'
import { authActions } from '~/modules/auth/application/authActions'
import { useAuthState } from '~/modules/auth/application/authState'
import { SearchPill } from '~/modules/common/sections/SearchPill/SearchPill'
import { mapActions } from '~/modules/map/application/mapActions'
import { openConfirmModal } from '~/modules/modal/helpers/modalHelpers'
import { ThemeSwapButton } from '~/modules/theme/ui/ThemeSwapButton'

export function Navbar() {
  return (
    <header class="bg-base-500/60 backdrop-blur-sm sticky top-0 z-40">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between gap-4">
          <Logo />
          <div class="max-w-1/2 flex-1">
            <SearchPill
              onSearch={mapActions.openMapsPageWithSearch}
              onPlaceSelected={mapActions.openMapPageWithPlaceId}
              onUseLocationClick={mapActions.openMapPageWithCoordinates}
            />
          </div>
          <div class="flex gap-10">
            <ThemeSwapButton />
            <GoogleLoginButton />
          </div>
        </div>
      </div>
    </header>
  )
}

function Logo() {
  return (
    <div class="rounded-full bg-base-400 overflow-clip ">
      <A href="/" class="flex items-center gap-3 select-none">
        <img src={logo} alt="Recicla+" class="h-10" />
      </A>
    </div>
  )
}

function GoogleLoginButton() {
  const { authState } = useAuthState()

  const isAuthenticated = () => authState().isAuthenticated

  const avatarUrl = () => {
    const state = authState()
    if (!state.isAuthenticated) return undefined
    const metadata = state.session?.user.user_metadata as
      | Record<string, unknown>
      | undefined
    return (
      (metadata?.avatar_url as string | undefined) ||
      (metadata?.picture as string | undefined) ||
      undefined
    )
  }

  const [open, setOpen] = createSignal(false)
  let menuRef: HTMLDivElement | undefined

  const toggleMenu = (e: MouseEvent) => {
    e.preventDefault()
    setOpen((p) => !p)
  }

  createEffect(() => {
    if (!open()) return
    const onDocClick = (ev: MouseEvent) => {
      const target = ev.target as Node | null
      if (menuRef && target && !menuRef.contains(target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    onCleanup(() => document.removeEventListener('click', onDocClick))
  })

  const handleLogout = (e: MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    openConfirmModal('Tem a certeza que pretende sair da sua conta?', {
      title: 'Confirmação de Logout',
      onConfirm: () =>
        void authActions.logout().catch((error) => {
          alert(
            `Erro ao sair: ${
              error instanceof Error ? error.message : String(error)
            }`,
          )
        }),
    })
  }

  return (
    <div class="flex items-center gap-3">
      <Show
        when={isAuthenticated()}
        fallback={
          <A href="/auth" class="flex items-center">
            <div
              class="h-10 w-10 rounded-full flex items-center justify-center bg-base-500 border border-base-300 shadow-sm"
              aria-hidden="false"
              role="img"
            >
              <svg
                aria-hidden="true"
                class="h-5 w-5"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#4285F4"
                  d="M24 9.5c3.9 0 6.7 1.7 8.3 3.1l6.1-6.1C33.6 4 29.3 2 24 2 14.8 2 6.9 7.9 3.2 16.9l7.5 5.8C12.9 15 17.9 9.5 24 9.5z"
                />
                <path
                  fill="#34A853"
                  d="M46.6 24.5c0-1.6-.1-3.1-.5-4.5H24v8.5h13.2c-.6 3.3-3 6.1-6.3 7.5l7.8 6.1C44.9 37.1 46.6 31.2 46.6 24.5z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.7 29.3C9.8 26.9 9.8 24.1 9.8 24.1s0-2.8.9-5.2L3.2 12.9C1.1 16.8 0 20.9 0 24.5c0 3.6 1.1 7.7 3.2 11.6l7.5-6.8z"
                />
                <path
                  fill="#EA4335"
                  d="M24 46c5.3 0 9.6-1.8 12.8-4.9l-7.8-6.1c-2 1.4-4.5 2.3-7 2.3-6.1 0-11.1-5.5-12.5-11.4L3.2 36.1C6.9 41.1 14.8 46 24 46z"
                />
              </svg>
              <span class="sr-only">Entrar com Google</span>
            </div>
          </A>
        }
      >
        <div class="relative">
          <button
            onClick={toggleMenu}
            aria-expanded={open()}
            class="h-10 w-10 rounded-full overflow-hidden bg-base-500 border border-base-300 shadow-sm"
            title="Conta"
          >
            {avatarUrl() ? (
              <img
                src={avatarUrl()}
                alt="User avatar"
                class="h-full w-full object-cover"
              />
            ) : (
              <svg
                class="h-5 w-5 m-auto text-muted-foreground"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"
                  stroke="#9CA3AF"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M20 21v-1c0-2.761-4.03-5-8-5s-8 2.239-8 5v1"
                  stroke="#9CA3AF"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            )}
            <span class="sr-only">Conta</span>
          </button>

          {open() && (
            <div
              ref={(el) => (menuRef = el)}
              class="absolute right-0 mt-2 w-40 bg-base-500 border border-base-300 rounded-md shadow-lg overflow-hidden z-50"
            >
              <A
                href="/dashboard"
                class="block px-4 py-2 text-sm text-base-content hover:bg-base-500"
              >
                Perfil
              </A>
              <button
                onClick={handleLogout}
                class="w-full text-left block px-4 py-2 text-sm text-base-content hover:bg-base-500"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </Show>
    </div>
  )
}
