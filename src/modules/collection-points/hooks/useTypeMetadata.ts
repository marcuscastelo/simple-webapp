/**
 * Hook for retrieving waste type metadata (colors and labels).
 * Provides utility functions to get display information for waste types.
 */
export function useTypeMetadata() {
  /**
   * Gets the CSS classes for a waste type's badge color scheme.
   * @param type - Waste type identifier (plastic, glass, paper, metal)
   * @returns Tailwind CSS classes for background, text, and border colors
   */
  const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      plastic: 'bg-blue-500/10 text-blue-600 border-blue-200',
      glass: 'bg-green-500/10 text-green-600 border-green-200',
      paper: 'bg-amber-500/10 text-amber-600 border-amber-200',
      metal: 'bg-gray-500/10 text-gray-600 border-gray-200',
    }
    return colors[type] || ''
  }

  /**
   * Gets the human-readable label for a waste type.
   * @param type - Waste type identifier
   * @returns Translated label for display
   */
  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      plastic: 'Plástico',
      glass: 'Vidro',
      paper: 'Papel',
      metal: 'Metal',
    }
    return labels[type] || type
  }

  return {
    getTypeColor,
    getTypeLabel,
  }
}
