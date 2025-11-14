import { Show } from 'solid-js'

import { authActions } from '~/modules/auth/application/authActions'
import { useAuthState } from '~/modules/auth/application/authState'

export default function Auth() {
  const { authState } = useAuthState()

  return (
    <div>
      <h1>Auth Page</h1>
      <Show when={authState().session}>
        {(session) => (
          <>
            <pre>{JSON.stringify(session, null, 2)}</pre>
            <button onClick={() => void authActions.logout()}>Logout</button>
          </>
        )}
      </Show>
      <Show when={!authState().session}>
        <button onClick={() => void authActions.loginWithGoogle()}>
          Login with Google
        </button>
      </Show>
    </div>
  )
}
