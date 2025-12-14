import { Crosshair as CrosshairIcon, Search as SearchIcon } from 'lucide-solid'
import type { Accessor } from 'solid-js'
import { Show } from 'solid-js'

/**
 * Props for the SearchInput component.
 */
export type SearchInputProps = {
  /**
   * Current search query value.
   */
  value: Accessor<string>

  /**
   * Callback fired when the input value changes.
   */
  onInput: (value: string) => void

  /**
   * Callback fired when the input is focused.
   */
  onFocus: () => void

  /**
   * Callback fired when the input loses focus.
   */
  onBlur: () => void

  /**
   * Callback fired when the "use my location" button is clicked.
   */
  onUseLocationClick?: () => void

  /**
   * Callback fired when the search button is clicked.
   */
  onSearch?: (query: string) => void

  /**
   * Ref callback for the input element.
   */
  ref?: (element: HTMLInputElement) => void
}

/**
 * Search input component with location and search buttons.
 *
 * @param props - Component props
 * @returns Search input UI
 */
export function SearchInput(props: SearchInputProps) {
  return (
    <div class="flex items-center bg-base-300 border border-base-300 rounded-full px-3 py-2 shadow-sm">
      <button
        class="p-1 rounded-full hover:bg-base-400 text-muted-foreground mr-2"
        onClick={() => props.onUseLocationClick?.()}
        aria-label="Use my location"
        title="Usar minha localização"
        disabled={!props.onUseLocationClick}
      >
        <CrosshairIcon class="h-4 w-4" />
      </button>
      <input
        ref={(r) => props.ref?.(r)}
        value={props.value()}
        onInput={(e) => props.onInput(e.currentTarget.value)}
        onFocus={() => props.onFocus()}
        onBlur={() => props.onBlur()}
        placeholder="Pesquisar pontos de recolha"
        class="outline-none bg-transparent text-sm flex-1"
      />
      <Show when={props.onSearch}>
        <button
          class="ml-3 bg-primary text-black rounded-full p-2 hover:opacity-95"
          onClick={() => props.onSearch?.(props.value())}
          aria-label="search"
        >
          <SearchIcon class="h-4 w-4" />
        </button>
      </Show>
    </div>
  )
}
