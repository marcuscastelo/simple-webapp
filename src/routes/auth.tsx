import { Show } from 'solid-js'

import { useAuthState } from '~/modules/auth/application/authState'
import { supabase } from '~/shared/infrastructure/supabase/supabase'

export default function Auth() {
  const { authState } = useAuthState()
  async function handleClick() {
    alert('Redirecionando para o Google OAuth...')
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  return (
    <div>
      <h1>Auth Page</h1>
      <Show when={authState().session}>
        {(session) => (
          <>
            <pre>{JSON.stringify(session, null, 2)}</pre>
            <button
              onClick={() => {
                void supabase.auth.signOut()
              }}
            >
              Logout
            </button>
          </>
        )}
      </Show>
      <Show when={!authState().session}>
        <button onClick={() => void handleClick()}>Login with Google</button>
      </Show>
    </div>
  )
}
