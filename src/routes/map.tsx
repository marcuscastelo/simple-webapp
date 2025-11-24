import { TestMap } from '~/components/TestMap'
import { useStringSearchParam } from '~/hooks/useStringSearchParam'

export default function Map() {
  const [search] = useStringSearchParam('search')
  const [placeId] = useStringSearchParam('placeId')

  return (
    <main class="">
      <TestMap search={search()} placeId={placeId()} />
    </main>
  )
}
