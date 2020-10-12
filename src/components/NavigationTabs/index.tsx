import React from 'react'
import styled, { css } from 'styled-components'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Tabs = styled.div<{ customStyle?: string|undefined }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;

  ${({ customStyle }) => customStyle && css`${customStyle}`}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    border-radius: 0;
    background: #FFFFFF; 
  `};
`;

const activeClassName = 'ACTIVE';

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  height: 3rem;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: #666F83;
  font-size: 16px;
  font-weight: 300;
  font-family: Roboto-Bold, Roboto;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: bold;
    color: #FF8212;
    text-decoration: none;
  }

  :hover:not(.${activeClassName}) {
    color: #111A34;
    text-decoration: none;
  }
`;

export default function NavigationTabs({ active, customStyle }: { active: 'swap' | 'pool' | 'farm', customStyle?: string | undefined }): React.ReactElement {
  const { t } = useTranslation();

  return (
    <Tabs style={{ marginBottom: '20px' }} customStyle={customStyle}>
      <StyledNavLink id={`swap-nav-link`} to={'/swap'} isActive={() => active === 'swap'}>
        {t('swap')}
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={'/pool'} isActive={() => active === 'pool'}>
        {t('pool')}
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={'/farm'} isActive={() => active === 'farm'}>
        {t('farm')}
      </StyledNavLink>
    </Tabs>
  )
}
