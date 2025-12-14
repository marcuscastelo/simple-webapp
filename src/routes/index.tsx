import { A } from '@solidjs/router'
import {
  Building2,
  Gift,
  Leaf,
  MapPin,
  Recycle,
  TrendingUp,
  Users,
} from 'lucide-solid'
import { For } from 'solid-js'

import heroImage from '~/assets/hero-recycling.jpg'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'

const Home = () => {
  const stats = [
    {
      icon: Recycle,
      value: '250+',
      label: 'Toneladas Recicladas',
      color: 'text-primary',
    },
    {
      icon: Users,
      value: '10.5K',
      label: 'Utilizadores Ativos',
      color: 'text-accent',
    },
    {
      icon: Building2,
      value: '150+',
      label: 'Empresas Parceiras',
      color: 'text-primary',
    },
    {
      icon: TrendingUp,
      value: '92%',
      label: 'Taxa de Reciclagem',
      color: 'text-accent',
    },
  ]

  const features = [
    {
      icon: MapPin,
      title: 'Pontos de Recolha',
      description:
        'Encontre facilmente os pontos de recolha mais próximos no mapa interativo',
    },
    {
      icon: Gift,
      title: 'Recompensas',
      description:
        'Ganhe recompensas por cada material reciclado e contribua para o ambiente',
    },
    {
      icon: Leaf,
      title: 'Impacto Ambiental',
      description: 'Acompanhe o seu impacto positivo no planeta em tempo real',
    },
  ]

  return (
    <div class="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section class="relative overflow-hidden">
        <div class="absolute inset-0 bg-base-200" />
        <div class="container mx-auto px-4 py-20 relative">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div class="space-y-8">
              <h1 class="text-5xl md:text-6xl font-bold leading-tight">
                Recicle e receba{' '}
                <span class="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                  recompensas!
                </span>
              </h1>
              <p class="text-xl text-muted-foreground">
                Transforme os seus resíduos em valor. Junte-se à nossa
                comunidade e contribua para um planeta mais sustentável enquanto
                ganha benefícios.
              </p>
              <div class="flex flex-wrap gap-4">
                <A href="/dashboard">
                  <Button variant="hero" size="lg" class="shadow-lg">
                    Começar Agora
                  </Button>
                </A>
                <A href="/collection-points">
                  <Button variant="outline" size="lg">
                    Ver Pontos de Recolha
                  </Button>
                </A>
              </div>
            </div>
            <div class="relative">
              <div class="absolute inset-0 bg-linear-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <img
                src={heroImage}
                alt="Pessoas reciclando felizes"
                class="relative rounded-3xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section class="py-16 bg-base-100">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <For each={stats}>
              {(stat) => {
                const Icon = stat.icon
                return (
                  <Card class="border-none bg-base-50 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent class="p-6 text-center space-y-2">
                      <Icon class={`h-10 w-10 mx-auto ${stat.color}`} />
                      <div class="text-3xl font-bold">{stat.value}</div>
                      <div class="text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                )
              }}
            </For>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section class="py-20">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold mb-4">Como Funciona</h2>
            <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
              Um processo simples e eficaz para tornar a reciclagem
              recompensadora
            </p>
          </div>
          <div class="grid md:grid-cols-3 gap-8">
            <For each={features}>
              {(feature) => {
                const Icon = feature.icon
                return (
                  <Card class="border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <CardContent class="p-8 space-y-4">
                      <div class="h-16 w-16 rounded-2xl bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                        <Icon class="h-8 w-8 text-primary-foreground" />
                      </div>
                      <h3 class="text-2xl font-bold">{feature.title}</h3>
                      <p class="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              }}
            </For>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section class="py-20 relative overflow-hidden">
        <div class="absolute inset-0 bg-base-200" />
        <div class="container mx-auto px-4 relative">
          <Card class="border-none shadow-xl bg-base-100">
            <CardContent class="p-12 text-center space-y-6">
              <h2 class="text-4xl font-bold">Pronto para Começar?</h2>
              <p class="text-xl opacity-90 max-w-2xl mx-auto">
                Junte-se a milhares de utilizadores que já estão a fazer a
                diferença. Comece hoje a reciclar e a ganhar recompensas!
              </p>
              <A href="/auth">
                <Button size="lg" class="shadow-xl">
                  Criar Conta Grátis
                </Button>
              </A>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default Home
