import styled from 'styled-components'
import { Button as RebassButton } from 'rebass/styled-components'

export const PrimitiveButton = styled(RebassButton)`
  color: white;
  border: 0;
  background: #FF6E12;
  border-radius: 8px;
  font-size: 18px;
  outline: none;
  height: 49px;
  width: 100%;

  &:focus {
    outline: none;
  }
  &:hover {
    background: ${({ disabled }) => !disabled && '#FF9712'};
  }
  &:active {
    background: ${({ disabled }) => !disabled && '#FF6E12'};
  }
  &:disabled {
    background: #E2E4EA;
  }
}`

export const SecondaryLittleButton = styled(RebassButton)`
  color: #F99E3C;
  border: 1px solid #F99E3C;
  background-color: transparent;
  border-radius: 4px;
  outline:none;

  &:hover  {
    background: #FCF0DC;
    border: 1px solid #F99E3C;
    color: #E48014;
    outline:none;
  }

  &:active  {
    background: #FFE8BF;
    border-radius: 4px;
    border: 1px solid #F99E3C;
    outline:none;
  }

  &:focus  {
    outline:none;
  }
}`

export const ButtonBigCommon = styled(RebassButton)<{
  padding?: string
  width?: string
  borderRadius?: string
}>`
  padding: ${({ padding }) => (padding ? padding : '18px')};
  width: ${({ width }) => (width ? width : '100%')};
  height: 49px;

  background-color: #FF6E12;
  outline: none;
  border: 1px solid transparent;
  border-radius: ${({ borderRadius }) => (borderRadius ? borderRadius : '8px')};

  text-align: center;
  text-decoration: none;
  font-size: 18px;
  font-weight: 500;
  font-family: Helvetica;
  color: #FFFFFF;

  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;

  cursor: pointer;
  position: relative;
  z-index: 1;

  > * {
    user-select: none;
  }

  &:focus {
    background-color: ${({ disabled }) => !disabled && '#FF6E12'};
    outline: none;
  }
  &:hover {
    background-color: ${({ disabled }) => !disabled && '#FF9712'};
  }
  :disabled {
    background-color: #E2E4EA;
    :hover {
      cursor: auto;
    }
  }
`

export const ButtonSmallPrimary = styled(RebassButton)<{
  padding?: string
  width?: string
  borderRadius?: string
}>`
  padding: ${({ padding }) => (padding ? padding : '5px')};
  width: ${({ width }) => (width ? width : 'auto')};
  height: 32px;

  background-color: #FF6E12;
  outline: none;
  border: 1px solid transparent;
  border-radius: ${({ borderRadius }) => (borderRadius ? borderRadius : '4px')};

  text-align: center;
  text-decoration: none;
  font-size: 16px;
  font-weight: 400;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #FFFFFF;

  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;

  cursor: pointer;
  position: relative;
  z-index: 1;

  > * {
    user-select: none;
  }

  &:focus {
    background-color: ${({ disabled }) => !disabled && '#FF8212'};
    outline: none;
  }
  &:hover {
    background-color: ${({ disabled }) => !disabled && '#FF9712'};
  }
  :disabled {
    background-color: #E2E4EA;
    :hover {
      cursor: auto;
    }
  }
`

export const ButtonSmallSecondary = styled(RebassButton)<{
  padding?: string
  width?: string
  borderRadius?: string
}>`
  padding: ${({ padding }) => (padding ? padding : '5px')};
  width: ${({ width }) => (width ? width : 'auto')};
  height: 32px;

  background-color: #FFFFFF;
  outline: none;
  border: 1px solid #F99E3C;
  border-radius: ${({ borderRadius }) => (borderRadius ? borderRadius : '4px')};

  text-align: center;
  text-decoration: none;
  font-size: 16px;
  font-weight: 400;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #E48014;

  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;

  cursor: pointer;
  position: relative;
  z-index: 1;

  > * {
    user-select: none;
  }

  &:focus {
    background-color: ${({ disabled }) => !disabled && '#FFFFFF'};
    outline: none;
  }
  &:hover {
    background-color: ${({ disabled }) => !disabled && '#FCF0DC'};
  }
  &:active {
    background-color: ${({ disabled }) => !disabled && '#FFE8BF'};
    outline: none;
  }
  &:disabled {
    background-color: #E2E4EA;
    :hover {
      cursor: auto;
    }
  }
`
