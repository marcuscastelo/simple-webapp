import { useStringSearchParam } from '~/modules/common/hooks/useStringSearchParam'
import { CollectionPointsMap } from '~/modules/map/sections/CollectionPointsMap'

export default function Map() {
  const [search] = useStringSearchParam('search')
  const [placeId] = useStringSearchParam('placeId')
  const [latParam] = useStringSearchParam('lat')
  const [lngParam] = useStringSearchParam('lng')

  const lat = latParam() ? parseFloat(latParam()!) : null
  const lng = lngParam() ? parseFloat(lngParam()!) : null

  return (
    <main class="">
      <CollectionPointsMap
        search={search()}
        placeId={placeId()}
        lat={lat}
        lng={lng}
      />
    </main>
  )
}
