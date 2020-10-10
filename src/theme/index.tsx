import React, { useMemo } from 'react'
import styled, {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
  css,
  DefaultTheme
} from 'styled-components'
import { isMobile } from 'react-device-detect'
import { Text, TextProps } from 'rebass'
import { useDarkMode } from '../state/settings/hooks'
import { Colors } from './styled'
import ImgBg from '../assets/images/bg.svg'

const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 600,
  upToMedium: 960,
  upToLarge: 1280
}

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {}
) as any

const white = '#FFFFFF'
const black = '#000000'

export function colors(darkMode: boolean): Colors {
  return {
    // base
    white,
    black,

    // primary colors
    primary1: darkMode ? '#FF8212' : '#FF8212',
    primary2: darkMode ? '#E11B7B' : '#E11B7B',
    primary3: darkMode ? 'linear-gradient(90deg, #FF8212 0%, #ED4454 100%)' : 'linear-gradient(90deg, #FF8212 0%, #ED4454 100%)',

    // secondary colors
    secondary1: darkMode ? '#FCF0DC' : '#FCF0DC',
    secondary2: darkMode ? '#56CB8F' : '#56CB8F',
    secondary3: darkMode ? '#E7F9F0' : '#E7F9F0',
    secondary4: darkMode ? '#3E85E9' : '#3E85E9',
    secondary5: darkMode ? '#ECF5FF' : '#ECF5FF',
    secondary6: darkMode ? '#FA5050' : '#FA5050',
    secondary7: darkMode ? '#FDEDED' : '#FDEDED',

    // grayscale
    grayscale1: darkMode ? '#111A34' : '#111A34',
    grayscale2: darkMode ? '#41485D' : '#41485D',
    grayscale3: darkMode ? '#666F83' : '#666F83',
    grayscale4: darkMode ? '#A8ADBD' : '#A8ADBD',
    grayscale5: darkMode ? '#C5CAD5' : '#C5CAD5',
    grayscale6: darkMode ? '#E2E4EA' : '#E2E4EA',
    grayscale7: darkMode ? '#F3F4F7' : '#F3F4F7',
    grayscale8: darkMode ? '#F9FAFB' : '#F9FAFB',
    grayscale9: darkMode ? '#FFFFFF' : '#FFFFFF'
  }
}

export function theme(darkMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode),

    grids: {
      sm: 8,
      md: 12,
      lg: 24
    },

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useDarkMode();

  const themeObject = useMemo(() => theme(darkMode), [darkMode])

  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>
}

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`

export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2'} {...props} />
  },
  link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />
  },
  blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  yellow(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'yellow1'} {...props} />
  },
  darkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text3'} {...props} />
  },
  gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'bg3'} {...props} />
  },
  italic(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />
  },
  error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />
  }
}

export const ThemedGlobalStyle = createGlobalStyle`
  body {
    font-size: 16px;
    font-weight: normal;
    font-family: 'Roboto';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    margin: 0;
    min-height: 100vh;


    background: ${isMobile ? '#F6F8FC' : `url(${ImgBg})`};
    background-size: cover;
    background-repeat: no-repeat;
    background-position: top left;
  }
`
