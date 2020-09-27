import React, { useState, useCallback } from 'react';
import Tooltip from '../Tooltip';
import styled, { css } from 'styled-components'

const InfoWrapper = styled.div<{customStyle?: string}>`
  cursor: pointer;
  font-size: 14px;
  color: #F5A623;
  ${({ customStyle }) => customStyle && css`${customStyle}`}
`;

export default function InfoHelper({ text, className, customStyle }: { text: string, className: string, customStyle?: string }): React.ReactElement {
const [show, setShow] = useState<boolean>(false)

const open = useCallback(() => setShow(true), [setShow])
const close = useCallback(() => setShow(false), [setShow])

return (
  <Tooltip text={text} show={show}>
    <InfoWrapper 
      onClick={open} 
      customStyle={customStyle}
      onMouseEnter={open} 
      onMouseLeave={close}><i className={className}></i></InfoWrapper>
  </Tooltip>
)
}

