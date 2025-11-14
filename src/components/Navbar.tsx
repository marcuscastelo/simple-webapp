import { A } from '@solidjs/router'
import { Crosshair, Search } from 'lucide-solid'
import { createSignal } from 'solid-js'

import logo from '~/assets/logo.png'

export function Navbar() {
  return (
    <header class="bg-white/60 backdrop-blur-sm sticky top-0 z-40">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between gap-4">
          <Logo />
          <SearchPill />
          <GoogleLoginButton />
        </div>
      </div>
    </header>
  )
}

function Logo() {
  return (
    <div class="rounded-full bg-gray-100 overflow-clip ">
      <A href="/" class="flex items-center gap-3 select-none">
        <img src={logo} alt="Recicla+" class="h-10" />
      </A>
    </div>
  )
}

function SearchPill() {
  const [query, setQuery] = createSignal('')

  return (
    <div class="flex-1 max-w-2xl mx-4">
      <div class="flex items-center bg-white border border-gray-200 rounded-full px-3 py-2 shadow-sm">
        <button
          class="p-1 rounded-full hover:bg-gray-100 text-muted-foreground mr-2"
          aria-label="Use my location"
          title="Usar minha localização"
        >
          <Crosshair class="h-4 w-4" />
        </button>
        <input
          value={query()}
          onInput={(e) => setQuery(e.currentTarget.value)}
          placeholder="Pesquisar pontos de recolha"
          class="flex-1 outline-none bg-transparent text-sm"
        />
        <button
          class="ml-3 bg-primary text-white rounded-full p-2 hover:opacity-95"
          aria-label="search"
        >
          <Search class="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function GoogleLoginButton() {
  return (
    <div class="flex items-center gap-3">
      <A href="/auth" class="flex items-center">
        <div class="h-10 w-10 rounded-full flex items-center justify-center bg-white border border-gray-200 shadow-sm text-sm font-semibold text-[#4285F4]">
          G
        </div>
      </A>
    </div>
  )
}
