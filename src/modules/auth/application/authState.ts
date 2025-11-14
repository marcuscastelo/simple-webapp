import { Session } from '@supabase/supabase-js'
import { createRoot, createSignal, onMount } from 'solid-js'

import { supabase } from '~/shared/infrastructure/supabase/supabase'

export type AuthState =
  | {
      isAuthenticated: true
      session: Session
    }
  | {
      isAuthenticated: false
      session?: undefined
    }

const authStateObj = createRoot(() => {
  const [authState, setAuthState] = createSignal<AuthState>({
    isAuthenticated: false,
  })

  onMount(() => {
    console.log('Checking initial auth session...')
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        console.log('Initial session data:', data)
        if (error === null && data && data.session) {
          setAuthState({
            isAuthenticated: true,
            session: data.session,
          })
        } else {
          if (error) {
            console.error('Error retrieving session:', error)
          }
          setAuthState({
            isAuthenticated: false,
          })
        }

        supabase.auth.onAuthStateChange((event, session) => {
          console.debug('Auth state changed:', { event, session })
          if (session) {
            setAuthState({
              isAuthenticated: true,
              session: session,
            })
          } else {
            setAuthState({
              isAuthenticated: false,
            })
          }
        })
      })
      .catch((error) => {
        console.error('Error getting session:', error)
      })
  })

  return { authState }
})

export const useAuthState = () => authStateObj
