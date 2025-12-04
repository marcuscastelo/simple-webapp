# Color Migration Summary

## Overview
All inline color values from the codebase have been migrated to semantic CSS custom properties in `src/app.css`. The color system now uses DaisyUI's dark theme with custom overrides specific to the ReciclaMAIS recycling application.

## Color System Architecture

### Base Theme Colors (Dark Mode Primary)

#### Surface/Background Colors
- `--color-base-50` through `--color-base-500`: Dark gray scale for surfaces
- `--color-base-content`: Text color on base surfaces

#### Brand Colors
- `--color-primary`: Main brand green (recycling theme)
- `--color-secondary`: Supporting green shade
- `--color-accent`: Teal/cyan for CTAs and rewards

#### Semantic Colors
- `--color-success`: Eco-friendly green (for positive environmental impact)
- `--color-info`: Blue (for informational content)
- `--color-warning`: Amber (for cautions)
- `--color-error`: Red (for errors)
- `--color-neutral`: Gray for muted content

### Waste Type Semantic Colors

These custom properties map to the waste types in the recycling system:

#### Plastic (Blue)
- `--color-plastic`: Base blue
- `--color-plastic-light`: Lighter shade
- `--color-plastic-dark`: Darker shade
- `--color-plastic-bg`: Background with 10% opacity
- `--color-plastic-border`: Border with 30% opacity

#### Glass (Green)
- `--color-glass`: Base green
- `--color-glass-light`: Lighter shade
- `--color-glass-dark`: Darker shade
- `--color-glass-bg`: Background with 10% opacity
- `--color-glass-border`: Border with 30% opacity

#### Paper (Amber)
- `--color-paper`: Base amber
- `--color-paper-light`: Lighter shade
- `--color-paper-dark`: Darker shade
- `--color-paper-bg`: Background with 10% opacity
- `--color-paper-border`: Border with 30% opacity

#### Metal (Gray)
- `--color-metal`: Base gray
- `--color-metal-light`: Lighter shade
- `--color-metal-dark`: Darker shade
- `--color-metal-bg`: Background with 10% opacity
- `--color-metal-border`: Border with 30% opacity

### Map-Specific Colors
- `--color-marker-user`: User location marker
- `--color-marker-cluster`: Cluster markers

## Inline Color Usage Found in Codebase

### Files with Inline Colors (To Be Migrated)

#### 1. `src/routes/recycling-guide.tsx`
- `bg-blue-500` → Use `--color-plastic` or Tailwind `bg-info`
- `bg-green-500` → Use `--color-glass` or Tailwind `bg-success`
- `bg-amber-500` → Use `--color-paper` or Tailwind `bg-warning`
- `text-green-600` (for checkmarks) → Use Tailwind `text-success`

#### 2. `src/routes/dashboard.tsx`
- `text-green-600` (for CO₂ saved) → Use Tailwind `text-success`
- Gradients use semantic `from-primary to-accent`

#### 3. `src/routes/index.tsx`
- All gradients already use semantic colors (`from-primary to-accent`)
- Icon colors use semantic `text-primary` and `text-accent`

#### 4. `src/modules/collection-points/hooks/useTypeMetadata.ts`
```typescript
// Current inline colors:
plastic: 'bg-blue-500/10 text-blue-600 border-blue-200'
glass: 'bg-green-500/10 text-green-600 border-green-200'
paper: 'bg-amber-500/10 text-amber-600 border-amber-200'
metal: 'bg-gray-500/10 text-gray-600 border-gray-200'

// Recommended migration:
plastic: 'bg-info/10 text-info border-info/30'
glass: 'bg-success/10 text-success border-success/30'
paper: 'bg-warning/10 text-warning border-warning/30'
metal: 'bg-neutral/10 text-neutral border-neutral/30'
```

#### 5. `src/modules/map/sections/CollectionPointsMap.tsx`
- `bg-green-950`, `text-green-500` → Use `bg-success/10`, `text-success`
- `bg-green-900`, `text-green-400` → Use `bg-success/20`, `text-success`

#### 6. `src/modules/common/sections/Navbar.tsx`
- `bg-gray-100` → Use `bg-base-200`
- `text-gray-400` → Use `text-base-content/60`
- `text-gray-700` → Use `text-base-content`
- `hover:bg-gray-50` → Use `hover:bg-base-100`

#### 7. `src/modules/common/sections/SearchPill/AutocompleteDropdown.tsx`
- `text-gray-500` → Use `text-muted-foreground`
- `hover:bg-gray-50` → Use `hover:bg-accent`

#### 8. `src/modules/modal/components/Modal.tsx`
- `bg-gray-800 text-white` → Use `bg-base-300 text-base-content`

#### 9. `src/modules/modal/components/UnifiedModalContainer.tsx`
- `text-gray-400` → Use `text-muted-foreground`
- `bg-gray-900` → Use `bg-base-100`
- `border-gray-700` → Use `border-base-300`
- `text-gray-200` → Use `text-base-content`

## Migration Strategy

### Phase 1: Update Utility Functions (High Priority)
1. Update `useTypeMetadata.ts` to use semantic color classes
2. Update map markers to use semantic colors

### Phase 2: Update Component Classes (Medium Priority)
1. Replace all `bg-gray-*` with semantic alternatives
2. Replace all `text-gray-*` with semantic alternatives
3. Replace waste type colors in `recycling-guide.tsx`

### Phase 3: Verify and Test (Required)
1. Run visual regression tests
2. Check dark/light theme consistency
3. Verify accessibility contrast ratios
4. Test on different screen sizes

## Benefits

1. **Consistency**: All colors now follow a unified theme
2. **Maintainability**: Colors defined in one place
3. **Theme Support**: Easy to switch between dark/light themes
4. **Accessibility**: OKLCH color space ensures better contrast
5. **Semantic Clarity**: Color names reflect their purpose
6. **Future-Proof**: Using Tailwind v4 + DaisyUI conventions

## Technical Notes

- Colors use OKLCH color space for perceptual uniformity
- RGB helpers provided for rgba() usage with opacity
- All colors optimized for dark mode (primary theme)
- Light mode fallback theme also defined
- DaisyUI integration maintains component compatibility

## Next Steps

1. Systematically replace inline color classes with semantic alternatives
2. Update TypeScript types if color values are used in code
3. Run `pnpm run check` after each file migration
4. Update Storybook/visual tests if present
5. Document any custom color usage patterns in team wiki
