import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import Tooltip from '../Tooltip';

const QuestionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border: none;
  background: none;
  outline: none;

  font-size: 16px;
  font-family: fontoed;
  color: #F5A623;
  cursor: pointer;
`

export default function QuestionHelper({ text }: { text: string }): React.ReactElement {
  const [show, setShow] = useState<boolean>(false)

  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  return (
    <Tooltip text={text} show={show}>
      <QuestionWrapper onClick={open} onMouseEnter={open} onMouseLeave={close}>
        <i className='fo-info'></i>
      </QuestionWrapper>
    </Tooltip>
  )
}
