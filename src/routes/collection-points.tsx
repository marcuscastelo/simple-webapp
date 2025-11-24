import { Clock, MapPin, Maximize, Minimize, Phone, Star } from 'lucide-solid'
import { createMemo, createSignal, For, Show } from 'solid-js'

import { SearchPill } from '~/components/SearchPill/SearchPill'
import { TestMap } from '~/components/TestMap'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Select, SelectItem } from '~/components/ui/select'
import { useStringSearchParam } from '~/hooks/useStringSearchParam'
import { cn } from '~/utils/cn'

const CollectionPoints = () => {
  const [selectedType, setSelectedType] = createSignal<string>('all')
  const [isFullscreen, setIsFullscreen] = createSignal<boolean>(true)

  const [search, setSearch] = createSignal<string | null>(null)
  const [placeId, setPlaceId] = createSignal<string | null>(null)
  const [userLat, setUserLat] = createSignal<number | null>(null)
  const [userLng, setUserLng] = createSignal<number | null>(null)

  const [getLatParam] = useStringSearchParam('lat')
  const [getLngParam] = useStringSearchParam('lng')

  // Read coordinates from URL on mount
  const latFromUrl = getLatParam()
  const lngFromUrl = getLngParam()
  if (latFromUrl && lngFromUrl) {
    setUserLat(parseFloat(latFromUrl))
    setUserLng(parseFloat(lngFromUrl))
  }

  const wasteTypes = [
    { value: 'all', label: 'Todos os Tipos' },
    { value: 'plastic', label: 'Plástico' },
    { value: 'glass', label: 'Vidro' },
    { value: 'paper', label: 'Papel' },
    { value: 'metal', label: 'Metal' },
  ]

  const collectionPoints = [
    {
      id: 1,
      name: 'EcoPonto Braga Centro',
      address: 'Praça da República, 25, Braga',
      phone: '+351 253 123 456',
      schedule: 'Seg-Sex: 8h-20h | Sáb: 9h-18h',
      rating: 4.8,
      types: ['plastic', 'glass', 'paper', 'metal'],
      company: 'EcoRecicla Braga',
    },
    {
      id: 2,
      name: 'Ponto Verde Gualtar',
      address: 'Rua de Gualtar, 150, Braga',
      phone: '+351 253 987 654',
      schedule: 'Seg-Dom: 9h-19h',
      rating: 4.7,
      types: ['plastic', 'glass', 'paper'],
      company: 'Verde Minho',
    },
    {
      id: 3,
      name: 'ReciclaPoint Maximinos',
      address: 'Avenida da Liberdade, 320, Braga',
      phone: '+351 253 456 789',
      schedule: 'Seg-Sex: 9h-19h | Sáb: 10h-17h',
      rating: 4.9,
      types: ['plastic', 'metal', 'paper', 'glass'],
      company: 'Braga Recicla',
    },
    {
      id: 4,
      name: 'EcoPonto São Victor',
      address: 'Rua de São Victor, 89, Braga',
      phone: '+351 253 234 567',
      schedule: 'Seg-Sex: 8h-19h | Sáb: 9h-17h',
      rating: 4.6,
      types: ['plastic', 'glass', 'paper', 'metal'],
      company: 'EcoRecicla Braga',
    },
  ]

  const filteredPoints = createMemo(() =>
    selectedType() === 'all'
      ? collectionPoints
      : collectionPoints.filter((point) =>
          point.types.includes(selectedType()),
        ),
  )

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      plastic: 'bg-blue-500/10 text-blue-600 border-blue-200',
      glass: 'bg-green-500/10 text-green-600 border-green-200',
      paper: 'bg-amber-500/10 text-amber-600 border-amber-200',
      metal: 'bg-gray-500/10 text-gray-600 border-gray-200',
    }
    return colors[type] || ''
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      plastic: 'Plástico',
      glass: 'Vidro',
      paper: 'Papel',
      metal: 'Metal',
    }
    return labels[type] || type
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

        {/* Map Placeholder */}
        <Card
          class={cn(
            'mb-8 shadow-lg overflow-hidden h-[400px] transition-all duration-300 ease-in-out relative',
            {
              'h-screen w-screen fixed inset-0 rounded-none': isFullscreen(),
            },
          )}
        >
          {/* Toggle fullscreen button (overlay on right) */}
          <div class="absolute top-3 right-3 z-40">
            <button
              class="inline-flex items-center gap-2 rounded-md bg-white/80  px-2 py-1 text-sm shadow hover:brightness-95 transition"
              onClick={() => setIsFullscreen((v) => !v)}
              aria-pressed={isFullscreen()}
              aria-label={
                isFullscreen() ? 'Exit fullscreen' : 'Open fullscreen'
              }
            >
              {isFullscreen() ? (
                <Minimize class="h-4 w-4" />
              ) : (
                <Maximize class="h-4 w-4" />
              )}
              <span class="hidden sm:inline">
                {isFullscreen() ? 'Close' : 'Fullscreen'}
              </span>
            </button>
          </div>

          <Show when={isFullscreen()}>
            {/* Search bar (overlay on left) */}
            <div class="absolute top-3 left-3 z-40">
              <SearchPill
                onSearch={setSearch}
                onPlaceSelected={setPlaceId}
                onUseLocationClick={(lat, lng) => {
                  setUserLat(lat)
                  setUserLng(lng)
                }}
              />
            </div>
          </Show>

          <TestMap
            placeId={placeId()}
            search={search()}
            lat={userLat()}
            lng={userLng()}
          />
        </Card>

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

        {/* Collection Points List */}
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <For each={filteredPoints()}>
            {(point) => (
              <Card class="shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <CardTitle class="text-xl mb-2">{point.name}</CardTitle>
                      <CardDescription class="text-sm">
                        {point.company}
                      </CardDescription>
                    </div>
                    <div class="flex items-center gap-1 bg-accent/20 px-2 py-1 rounded-lg">
                      <Star class="h-4 w-4 text-accent fill-accent" />
                      <span class="font-semibold">{point.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="flex items-start gap-2 text-sm">
                    <MapPin class="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span class="text-muted-foreground">{point.address}</span>
                  </div>

                  <div class="flex items-center gap-2 text-sm">
                    <Clock class="h-4 w-4 text-muted-foreground shrink-0" />
                    <span class="text-muted-foreground">{point.schedule}</span>
                  </div>

                  <div class="flex items-center gap-2 text-sm">
                    <Phone class="h-4 w-4 text-muted-foreground shrink-0" />
                    <span class="text-muted-foreground">{point.phone}</span>
                  </div>

                  <div class="space-y-2">
                    <div class="flex flex-wrap gap-2">
                      <For each={point.types}>
                        {(type) => (
                          <Badge variant="outline" class={getTypeColor(type)}>
                            {getTypeLabel(type)}
                          </Badge>
                        )}
                      </For>
                    </div>
                  </div>

                  <Button class="w-full" variant="outline">
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            )}
          </For>
        </div>
      </div>
    </div>
  )
}

export default CollectionPoints
