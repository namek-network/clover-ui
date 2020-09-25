import styled from 'styled-components'

const Circle = styled.div<{
  size?: string
}>`
  width: ${({ size }) => (size ? size : '32px')};
  height: ${({ size }) => (size ? size : '32px')};
  line-height: ${({ size }) => (size ? size : '32px')};
  border-radius: 50%;
  flex-shrink: 0;
  text-align: center;
`

export default Circle
