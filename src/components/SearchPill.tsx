import { Crosshair as CrosshairIcon, Search as SearchIcon } from 'lucide-solid'
import { createSignal, Show } from 'solid-js'

export type SearchPillProps = {
  onUseLocationClick?: () => void
  onSearch?: (query: string) => void
}

export function SearchPill(props: SearchPillProps) {
  const [query, setQuery] = createSignal('')

  return (
    <div class="flex-1 mx-4 min-w-0">
      <div class="flex items-center bg-white border border-gray-200 rounded-full px-3 py-2 shadow-sm">
        <button
          class="p-1 rounded-full hover:bg-gray-100 text-muted-foreground mr-2"
          onClick={() => props.onUseLocationClick?.()}
          aria-label="Use my location"
          title="Usar minha localização"
          disabled={!props.onUseLocationClick}
        >
          <CrosshairIcon class="h-4 w-4" />
        </button>
        <input
          value={query()}
          onInput={(e) => setQuery(e.currentTarget.value)}
          placeholder="Pesquisar pontos de recolha"
          class="outline-none bg-transparent text-sm flex-1"
        />
        <Show when={props.onSearch}>
          <button
            class="ml-3 bg-primary text-black rounded-full p-2 hover:opacity-95"
            onClick={() => props.onSearch?.(query())}
            aria-label="search"
          >
            <SearchIcon class="h-4 w-4" />
          </button>
        </Show>
      </div>
    </div>
  )
}
