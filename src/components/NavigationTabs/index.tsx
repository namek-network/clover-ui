import React from 'react';
import styled, { css } from 'styled-components';
import { darken } from 'polished';
import { NavLink } from 'react-router-dom';

const Tabs = styled.div<{ customStyle?: string|undefined }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
  ${({ customStyle }) => customStyle && css`${customStyle}`}
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
  color: #888D9B;
  font-size: 16px;
  font-weight: bold;
  font-family: Roboto-Bold, Roboto;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: bolder;
    color: #FF8212;
    text-decoration: none;
  }

  :hover,
  :focus {
    color: ${darken(0.1, '#FF8212')};
    text-decoration: none;
  }
`;

export function SwapPoolTabs({ active, customStyle }: { active: 'swap' | 'pool', customStyle?: string | undefined }) {
  return (
    <Tabs style={{ marginBottom: '20px' }} customStyle={customStyle}>
      <StyledNavLink id={`swap-nav-link`} to={'/swap'} isActive={() => active === 'swap'}>
        Swap
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={'/pool'} isActive={() => active === 'pool'}>
        Pool
      </StyledNavLink>
    </Tabs>
  )
};
