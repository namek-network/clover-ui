import { FlattenSimpleInterpolation, ThemedCssFunction } from 'styled-components'

export type Color = string
export interface Colors {
  // base
  white: Color
  black: Color

  // primary colors
  primary1: Color
  primary2: Color
  primary3: Color

  // secondary colors
  secondary1: Color
  secondary2: Color
  secondary3: Color
  secondary4: Color
  secondary5: Color
  secondary6: Color
  secondary7: Color

  // grayscale
  grayscale1: Color
  grayscale2: Color
  grayscale3: Color
  grayscale4: Color
  grayscale5: Color
  grayscale6: Color
  grayscale7: Color
  grayscale8: Color
  grayscale9: Color

}

export interface Grids {
  sm: number
  md: number
  lg: number
}

declare module 'styled-components' {
  export interface DefaultTheme extends Colors {
    grids: Grids

    // media queries
    mediaWidth: {
      upToExtraSmall: ThemedCssFunction<DefaultTheme>
      upToSmall: ThemedCssFunction<DefaultTheme>
      upToMedium: ThemedCssFunction<DefaultTheme>
      upToLarge: ThemedCssFunction<DefaultTheme>
    }

    // css snippets
    flexColumnNoWrap: FlattenSimpleInterpolation
    flexRowNoWrap: FlattenSimpleInterpolation
  }
}
