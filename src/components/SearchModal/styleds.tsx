import styled from 'styled-components'
import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'

export const ModalInfo = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 1rem 1rem;
  margin: 0.25rem 0.5rem;
  justify-content: center;
  flex: 1;
  user-select: none;
`

export const FadedSpan = styled(RowFixed)`
  color: #ff007a;
  font-size: 14px;
`

export const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
  padding-bottom: 12px;
`

export const MenuItem = styled(RowBetween)`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto minmax(0, 72px);
  grid-gap: 16px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
`

export const SearchInput = styled.input`
  position: relative;
  display: flex;
  padding: 16px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  border-radius: 20px;
  color: #000000;
  border-style: solid;
  border: 1px solid #EDEEF2;
  -webkit-appearance: none;

  font-size: 18px;

  ::placeholder {
    color: #888D9B;
  }
  transition: border 100ms;
  :focus {
    border: 1px solid #ff007a;
    outline: none;
  }
`
export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: #F7F8FA;
`

export const SeparatorDark = styled.div`
  width: 100%;
  height: 1px;
  background-color: #EDEEF2;
`
