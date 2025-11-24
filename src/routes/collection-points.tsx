import { createSignal, For } from 'solid-js'

import collectionPoints from '~/collectionPoints.json'
import { Select, SelectItem } from '~/components/ui/select'
import { useCollectionPointsFilter } from '~/modules/collection-points/hooks/useCollectionPointsFilter'
import { useMapUrlParams } from '~/modules/collection-points/hooks/useMapUrlParams'
import { CollectionPointsList } from '~/modules/collection-points/sections/CollectionPointsList'
import { MapContainer } from '~/modules/collection-points/sections/MapContainer'
import wasteTypes from '~/wasteTypes.json'

export default function CollectionPoints() {
  const [selectedType, setSelectedType] = createSignal<string>('all')

  const {
    userLat,
    setUserLat,
    userLng,
    setUserLng,
    search,
    setSearch,
    placeId,
    setPlaceId,
    isFullscreen,
    setIsFullscreen,
  } = useMapUrlParams()

  const filteredPoints = useCollectionPointsFilter(
    collectionPoints,
    selectedType,
  )

  const handleLocationSelect = (lat: number, lng: number) => {
    setUserLat(lat)
    setUserLng(lng)
  }

  return (
    <div class="min-h-screen py-12">
      <div class="container mx-auto px-4">
        <div class="mb-12 text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">Pontos de Recolha</h1>
          <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
            Encontre o ponto de recolha mais próximo e comece a reciclar hoje
          </p>
        </div>

        <MapContainer
          placeId={placeId}
          search={search}
          userLat={userLat}
          userLng={userLng}
          isFullscreen={isFullscreen}
          onSearchChange={setSearch}
          onPlaceSelected={setPlaceId}
          onLocationSelect={handleLocationSelect}
          onFullscreenToggle={setIsFullscreen}
        />

        {/* Filter */}
        <div class="mb-8">
          <Select
            value={selectedType()}
            onInput={(e) =>
              setSelectedType((e.target as HTMLSelectElement).value)
            }
            class="w-full md:w-64"
          >
            <For each={wasteTypes}>
              {(type) => (
                <SelectItem value={type.value}>{type.label}</SelectItem>
              )}
            </For>
          </Select>
        </div>

        <CollectionPointsList points={filteredPoints} />
      </div>
    </div>
  )
}
