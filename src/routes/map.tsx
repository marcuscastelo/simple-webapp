import { TestMap } from '~/components/TestMap'
import { useStringSearchParam } from '~/hooks/useStringSearchParam'

export default function Map() {
  const [search] = useStringSearchParam('search')

  return (
    <main class="">
      <TestMap search={search()} />
    </main>
  )
}
