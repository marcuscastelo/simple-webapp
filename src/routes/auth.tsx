import { Session } from '@supabase/supabase-js'
import { createSignal, Show } from 'solid-js'

import { supabase } from '~/shared/infrastructure/supabase/supabase'

export default function Auth() {
  const [session, setSession] = createSignal<Session>()
  async function handleClick() {
    alert('Redirecionando para o Google OAuth...')
    const { data, error } = await supabase.auth.getSession()
    console.log('Sessão atual:', session)
    if (error === null && data.session) {
      alert('Já está autenticado!')
      setSession(data.session)
      return
    }
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  return (
    <div>
      <h1>Auth Page</h1>
      <Show when={session()}>
        {(session) => <pre>{JSON.stringify(session(), null, 2)}</pre>}
      </Show>
      <button onClick={() => void handleClick()}>Clique aqui</button>
    </div>
  )
}
