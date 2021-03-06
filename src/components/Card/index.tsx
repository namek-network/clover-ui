import React from 'react'
import styled from 'styled-components'
import { CardProps, Text } from 'rebass'
import { Box } from 'rebass/styled-components'

const Card = styled(Box)<{ padding?: string; border?: string; borderRadius?: string }>`
  width: 100%;
  border-radius: 16px;
  padding: 1.25rem;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`
export default Card

export const LightCard = styled(Card)`
  border: 1px solid #F7F8FA;
  background-color: #FFFFFF;
`

export const GreyCard = styled(Card)`
  background-color: #EDEEF2;
`

export const OutlineCard = styled(Card)`
  border: 1px solid #EDEEF2;
`

export const YellowCard = styled(Card)`
  background-color: rgba(243, 132, 30, 0.05);
  color: #F3841E;
  font-weight: 500;
`

export const PinkCard = styled(Card)`
  background-color: rgba(255, 0, 122, 0.03);
  color: #ff007a;
  font-weight: 500;
`

const BlueCardStyled = styled(Card)`
  background-color: #FDEAF1;
  color: #ff007a;
  border-radius: 12px;
  width: fit-content;
`

export const BlueCard = ({ children, ...rest }: CardProps): React.ReactElement => {
  return (
    <BlueCardStyled {...rest}>
      <Text fontWeight={500} color="#2172E5">
        {children}
      </Text>
    </BlueCardStyled>
  )
}
