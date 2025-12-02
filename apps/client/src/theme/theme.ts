import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        colors: {
          brand: {
            500: { value: '#4f46e5' }, // Primary brand indigo
          },
          teal: {
            400: { value: '#2dd4bf' }, // Accent/success teal
          },
          lightGray: {
            50: { value: '#fafafa' }, // Near-white neutral
          },
        },
      },
      radii: {
        lg: { value: '0.75rem' },
      },
    },
    semanticTokens: {
      colors: {
        primary: { value: '{colors.brand.500}' },
        accent: { value: '{colors.teal.400}' },
        'fg.default': { value: '{colors.gray.50}' },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
