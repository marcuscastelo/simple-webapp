import { Crosshair as CrosshairIcon, Search as SearchIcon } from 'lucide-solid'
import { createSignal } from 'solid-js'

export function SearchPill() {
  const [query, setQuery] = createSignal('')

  return (
    <div class="flex-1 max-w-2xl mx-4">
      <div class="flex items-center bg-white border border-gray-200 rounded-full px-3 py-2 shadow-sm">
        <button
          class="p-1 rounded-full hover:bg-gray-100 text-muted-foreground mr-2"
          aria-label="Use my location"
          title="Usar minha localização"
        >
          <CrosshairIcon class="h-4 w-4" />
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
          <SearchIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
