import { API_KEY, MAP_ID } from '~/utils/env'

export default function TestEnv() {
  return (
    <main class="">
      <p>API Key: {API_KEY}</p>
      <p>Map ID: {MAP_ID}</p>
    </main>
  )
}
