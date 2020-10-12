import React from 'react'
import styled from 'styled-components'

export const AppBodyWrapper = styled.div`
  position: relative;
  max-width: 460px;
  width: 100%;
`

export const AppContentWrapper = styled.div`
  position: relative;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding-left: 16px;
    padding-right: 16px;
  `};
`;

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <AppBodyWrapper>{children}</AppBodyWrapper>
}
