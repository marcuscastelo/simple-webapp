import { A } from '@solidjs/router'

import logo from '~/assets/logo.png'
import { SearchPill } from '~/modules/common/sections/SearchPill/SearchPill'
import { mapActions } from '~/modules/map/application/mapActions'

export function Navbar() {
  return (
    <header class="bg-white/60 backdrop-blur-sm sticky top-0 z-40">
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

function GoogleLoginButton() {
  return (
    <div class="flex items-center gap-3">
      <A href="/auth" class="flex items-center">
        <div
          class="h-10 w-10 rounded-full flex items-center justify-center bg-white border border-gray-200 shadow-sm"
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
    </div>
  )
}
