import { createTheme, alpha } from '@mui/material/styles';

// 1980's CRT monitor with green text aesthetic
const palette = {
  mode: 'dark',
  primary: {
    main: '#00FF00', // Bright green (phosphor green)
    light: '#33FF33',
    dark: '#00CC00',
    contrastText: '#000000',
  },
  secondary: {
    main: '#00AAAA', // Cyan-ish
    light: '#00CCCC',
    dark: '#008888',
    contrastText: '#000000',
  },
  accent: {
    main: '#FFAA00', // Amber (for warnings/highlights)
    light: '#FFCC00',
    dark: '#CC8800',
    contrastText: '#000000',
  },
  error: {
    main: '#FF5555',
    light: '#FF7777',
    dark: '#CC4444',
  },
  warning: {
    main: '#FFAA00',
    light: '#FFCC00',
    dark: '#CC8800',
  },
  info: {
    main: '#55AAFF',
    light: '#77CCFF',
    dark: '#4488CC',
  },
  success: {
    main: '#00FF00',
    light: '#33FF33',
    dark: '#00CC00',
  },
  grey: {
    50: '#E0E0E0',
    100: '#C2C2C2',
    200: '#A3A3A3',
    300: '#858585',
    400: '#666666',
    500: '#474747',
    600: '#2A2A2A',
    700: '#1F1F1F',
    800: '#141414',
    900: '#0A0A0A',
  },
  background: {
    default: '#000000', // Black background
    paper: '#111111', // Slightly lighter black for cards/papers
    subtle: '#0A0A0A', // Very subtle dark background
  },
  text: {
    primary: '#00FF00', // Bright green text
    secondary: '#00CC00', // Slightly dimmer green
    disabled: '#006600', // Very dim green
  },
};

// Custom font for terminal-like appearance
const terminalFont = 'var(--font-geist-mono), "Courier New", monospace';

const theme = createTheme({
  palette,
  typography: {
    fontFamily: terminalFont,
    h1: {
      fontFamily: terminalFont,
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '0.02em',
    },
    h2: {
      fontFamily: terminalFont,
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '0.02em',
    },
    h3: {
      fontFamily: terminalFont,
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '0.02em',
    },
    h4: {
      fontFamily: terminalFont,
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.02em',
    },
    h5: {
      fontFamily: terminalFont,
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.02em',
    },
    h6: {
      fontFamily: terminalFont,
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.02em',
    },
    subtitle1: {
      fontFamily: terminalFont,
      fontSize: '1.125rem',
      lineHeight: 1.5,
      letterSpacing: '0.02em',
    },
    subtitle2: {
      fontFamily: terminalFont,
      fontSize: '0.875rem',
      lineHeight: 1.57,
      letterSpacing: '0.02em',
    },
    body1: {
      fontFamily: terminalFont,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.02em',
    },
    body2: {
      fontFamily: terminalFont,
      fontSize: '0.875rem',
      lineHeight: 1.43,
      letterSpacing: '0.02em',
    },
    button: {
      fontFamily: terminalFont,
      textTransform: 'uppercase',
      fontWeight: 500,
      letterSpacing: '0.05em',
    },
  },
  shape: {
    borderRadius: 0, // Sharp corners for that retro look
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#000000',
          color: '#00FF00',
          // CRT screen effect
          '&::before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
            backgroundSize: '100% 2px, 3px 100%',
            pointerEvents: 'none',
            zIndex: 9999,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0px',
          padding: '8px 24px',
          fontWeight: 500,
          border: '1px solid #00FF00',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 0 10px #00FF00, 0 0 20px #00FF00',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 0 10px #00FF00, 0 0 20px #00FF00',
          },
        },
        containedPrimary: {
          backgroundColor: 'transparent',
          color: '#00FF00',
          border: '1px solid #00FF00',
          '&:hover': {
            backgroundColor: 'rgba(0, 255, 0, 0.1)',
          },
        },
        outlined: {
          borderColor: '#00FF00',
          color: '#00FF00',
          '&:hover': {
            backgroundColor: 'rgba(0, 255, 0, 0.1)',
            borderColor: '#00FF00',
          },
        },
        text: {
          color: '#00FF00',
          '&:hover': {
            backgroundColor: 'rgba(0, 255, 0, 0.1)',
          },
        },
      },
      variants: [
        {
          props: { variant: 'accent' },
          style: {
            backgroundColor: 'transparent',
            color: palette.accent.main,
            border: `1px solid ${palette.accent.main}`,
            '&:hover': {
              backgroundColor: 'rgba(255, 170, 0, 0.1)',
              boxShadow: '0 0 10px #FFAA00, 0 0 20px #FFAA00',
            },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '0px',
          border: '1px solid #00FF00',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          boxShadow: '0 0 5px #00FF00',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          border: '1px solid #00FF00',
        },
        elevation1: {
          boxShadow: '0 0 5px #00FF00',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          borderBottom: '1px solid #00FF00',
          boxShadow: '0 0 10px #00FF00',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#000000',
          border: '1px solid #00FF00',
          boxShadow: '0 0 10px #00FF00',
          borderRadius: 0,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 255, 0, 0.1)',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#00FF00',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          border: '1px solid #00FF00',
          color: '#00FF00',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0, 255, 0, 0.2)',
        },
      },
    },
  },
});

export default theme; 