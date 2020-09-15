import React from 'react'
import styled from 'styled-components'
import { TokenType } from '../../state/token/types';

import Logo from '../Logo'

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: TokenType
  size?: string
  style?: React.CSSProperties
}) {
  const srcs: string[] = (currency == null || currency.logo == null) ? [] : [currency.logo];

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.name ?? 'token'} logo`} style={style} />
}
