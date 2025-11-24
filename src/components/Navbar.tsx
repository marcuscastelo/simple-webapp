import { A } from '@solidjs/router'

import logo from '~/assets/logo.png'
import { SearchPill } from '~/components/SearchPill/SearchPill'
import { mapActions } from '~/modules/map/application/mapActions'

export function Navbar() {
  return (
    <header class="bg-white/60 backdrop-blur-sm sticky top-0 z-40">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between gap-4">
          <Logo />
          <div class="max-w-1/2 flex-1">
            <SearchPill onSearch={mapActions.openMapsPageWithSearch} />
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
        <div class="h-10 w-10 rounded-full flex items-center justify-center bg-white border border-gray-200 shadow-sm text-sm font-semibold text-[#4285F4]">
          G
        </div>
      </A>
    </div>
  )
}
