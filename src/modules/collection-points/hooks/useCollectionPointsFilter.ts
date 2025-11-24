import { Accessor, createMemo } from 'solid-js'

import type { CollectionPoint } from '../types'

/**
 * Hook for filtering collection points by waste type.
 * @param points - Array of collection points to filter
 * @param selectedType - Signal accessor for the currently selected waste type
 * @returns Memoized filtered array of collection points
 */
export function useCollectionPointsFilter(
  points: CollectionPoint[],
  selectedType: Accessor<string>,
) {
  const filteredPoints = createMemo(() => {
    const type = selectedType()
    if (type === 'all') {
      return points
    }
    return points.filter((point) => point.types.includes(type))
  })

  return filteredPoints
}
