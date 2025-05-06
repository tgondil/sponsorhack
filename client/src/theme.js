import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  colors: {
    brand: {
      50: '#f5f5f5',
      100: '#e0e0e0',
      200: '#c2c2c2',
      300: '#a3a3a3',
      400: '#858585',
      500: '#666666',
      600: '#525252',
      700: '#3d3d3d',
      800: '#292929',
      900: '#141414',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'black',
          color: 'white',
          _hover: {
            bg: 'gray.800',
          },
        },
        outline: {
          borderColor: 'gray.200',
          color: 'gray.700',
          _hover: {
            bg: 'gray.50',
          },
        },
        ghost: {
          color: 'gray.700',
          _hover: {
            bg: 'gray.50',
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: '600',
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            borderColor: 'gray.200',
            borderRadius: 'md',
            _hover: {
              borderColor: 'gray.300',
            },
            _focus: {
              borderColor: 'black',
              boxShadow: '0 0 0 1px black',
            },
          },
        },
      },
      defaultProps: {
        variant: 'outline',
      },
    },
    Switch: {
      baseStyle: {
        track: {
          _checked: {
            bg: 'black',
          },
        },
      },
    },
    Textarea: {
      variants: {
        outline: {
          borderColor: 'gray.200',
          borderRadius: 'md',
          _hover: {
            borderColor: 'gray.300',
          },
          _focus: {
            borderColor: 'black',
            boxShadow: '0 0 0 1px black',
          },
        },
      },
      defaultProps: {
        variant: 'outline',
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'white',
        color: 'gray.800',
      },
    },
  },
});

export default theme; 