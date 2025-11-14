import { A } from '@solidjs/router'
import { Crosshair, MapPin, Search } from 'lucide-solid'
import { createSignal } from 'solid-js'

export function Navbar() {
  const [query, setQuery] = createSignal('')

  return (
    <header class="bg-white/60 backdrop-blur-sm sticky top-0 z-40">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between gap-4">
          {/* Logo */}
          <A href="/" class="flex items-center gap-3 select-none">
            <div class="text-lg md:text-xl font-bold text-primary">
              Onde
              <span class="text-accent"> Reciclar</span>
              <span class="text-primary">.pt</span>
            </div>
          </A>

          {/* Center search pill - compact */}
          <div class="flex-1 max-w-2xl mx-4">
            <div class="flex items-center bg-white border border-gray-200 rounded-full px-3 py-2 shadow-sm">
              <MapPin class="h-5 w-5 text-primary mr-3" />
              <input
                value={query()}
                onInput={(e) => setQuery(e.currentTarget.value)}
                placeholder="Pesquisar pontos de recolha"
                class="flex-1 outline-none bg-transparent text-sm"
              />
              <button class="ml-3 bg-primary text-white rounded-full p-2 hover:opacity-95">
                <Search class="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right actions: location and Google login (G) */}
          <div class="flex items-center gap-3">
            <button
              class="p-2 rounded-md text-muted-foreground hover:text-primary"
              aria-label="use my location"
            >
              <Crosshair class="h-5 w-5" />
            </button>
            <A href="/auth" class="flex items-center">
              <div class="h-10 w-10 rounded-full flex items-center justify-center bg-white border border-gray-200 shadow-sm text-sm font-semibold text-[#4285F4]">
                G
              </div>
            </A>
          </div>
        </div>
      </div>
    </header>
  )
}
