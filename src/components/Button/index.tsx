import styled from 'styled-components'
import { Button as RebassButton } from 'rebass/styled-components'
import { darken } from 'polished';

export const BottomButton = styled(RebassButton)`
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
    background-color: ${({ disabled }) => !disabled && darken(0.08, '#FF6E12')};
  }
  :disabled {
    opacity: 0.4;
  }
}`

export const TopConnectButton = styled(RebassButton)`
  color: #F99E3C;
  border: 1px solid #F99E3C;
  background-color: transparent;
  border-radius: 4px;
  outline:none;
  padding: 6px 10px;
  line-height: 16px;

  &:hover  {
    background: #FCF0DC;
    border: 1px solid #F99E3C;
    color: #E48014;;
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

