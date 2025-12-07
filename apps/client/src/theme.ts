import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  theme: {
    tokens: {
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
    semanticTokens: {
      colors: {
        primary: { value: '{colors.brand.500}' },
        accent: { value: '#2dd4bf' },
        'fg.default': { value: '{colors.gray.50}' },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
