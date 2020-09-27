import React, { Children, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Column from '../../components/Column'
import Row, {RowBetween} from '../../components/Row'
import './index.css'
import _ from 'lodash'
import { PoolPairItem as PoolPairItemType, defaultPoolPairItem } from '../../state/pool/types';
import { showTextType } from './types'
import BigNum, {div}  from '../../types/bigNum';
import {SecondaryLittleButton} from '../../components/Button'

const ImageLeft = styled.img`
`
const ImageRight = styled.img`
  margin-left: -10px;
`

const PairTitle = styled.span`
  margin-left: 8px;
  font-size: 18px;
  font-family: Helvetica;
  color: #111A34;
`

const Toggler = styled.div`
  font-size: 16px;
  color: #666F83;
  
`

const StyledRowBetween = styled(RowBetween)`
  cursor: pointer;
`

const LabelText = styled.div`
  height: 14px;
  font-size: 14px;
  font-family: Helvetica;
  color: #858B9C;
  line-height: 14px;
`

const AmountText = styled.div`
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #41485D;
  max-width: 180px;
  line-height: 14px;
`

const ContentRowBetween = styled(RowBetween)`
  margin-bottom: 16px;
`

const ContentWrapper = styled(Column)`
  margin-top: 24px;
`

const ButtonWrapper = styled(RowBetween)`

`

const Button = styled(SecondaryLittleButton)`
  width: 160px;
  flex-grow: 1;
  padding: 6px 10px;
  line-height: 16px;
`

const ButtonLeftWrapper = styled(Button)`
  margin-right: 8px;
`

interface ItemWrapperProps {
  isOpen: boolean
  children?: React.ReactNode
}

const ItemWrapper = ({children, isOpen}: ItemWrapperProps) => {
  return <div className={isOpen? "item-wrapper item-open-background" : "item-wrapper"}>{children}</div>
}

export interface PairIconTitleProps {
  left: string,
  right: string,
  title: string,
  size?: string,
  showTitle?: boolean
}

export const PairIconTitle = ({left, right, title, size='32px', showTitle=true}: PairIconTitleProps) => {
  return (
    <div>
      <ImageLeft src={left} width={size}></ImageLeft>
      <ImageRight src={right} width={size}></ImageRight>
      {
        showTitle && <PairTitle>{title}</PairTitle>
      }
    </div>)
}

interface Content {
  label: string,
  amount: string
}
interface PairTransContentProps {
  contents: Content[]
}
export const PairTransContent = (props: PairTransContentProps) => {
  const {contents} = props
  return (
    <Column>
      {
        _.map(contents, ({label, amount}) => {
          return (
            <ContentRowBetween key={label}>
              <LabelText>
                {label}
              </LabelText>
              <AmountText>
                {amount}
              </AmountText>
          </ContentRowBetween>)
        })
      }
    </Column>
  )
}

export interface PoolPairItemProps {
  item: PoolPairItemType,
  selectedItem: PoolPairItemType,
  onSelectItem: (item: PoolPairItemType) => void
  onAddClick: () => void
  onRemoveClick: () => void
}

export default function PoolPairItem({item, selectedItem, onSelectItem, onAddClick, onRemoveClick}: PoolPairItemProps) {
    const [showData, setShowData] = useState<showTextType[]>([])

    useEffect(() => {
      setShowData([
        {
          label: `Pooled ${item.fromToken.name}`,
          amount: `${BigNum.fromBigNum(item.fromAmount).realNum} ${item.fromToken.name}`
        },
        {
          label: `Pooled ${item.toToken.name}`,
          amount: `${BigNum.fromBigNum(item.toAmount).realNum} ${item.toToken.name}`
        },
        {
          label: `My pool tokens:`,
          amount: `${BigNum.fromBigNum(item.userShare).realNum}`
        },
        {
          label: `My pool share:`,
          amount: `${div(item.userShare, item.totalShare, true)}%`
        }
      ])
    }, [item])
    return (
        <ItemWrapper isOpen={item === selectedItem}>
          <StyledRowBetween onClick={() => {
            if (item === selectedItem) {
              onSelectItem(defaultPoolPairItem)
            } else {
              onSelectItem(item)
            }
          }}>
            <PairIconTitle left={item.fromToken.logo ?? ''} right={item.toToken.logo ?? ''} title={`${item.fromToken.name}/${item.toToken.name}`}></PairIconTitle>
            <Toggler>
              {
                item === selectedItem ? <i className="fa fo-chevron-up"></i> : <i className="fa fo-chevron-down"></i>
              }
            </Toggler>
          </StyledRowBetween>
          {
            item === selectedItem && 
            <ContentWrapper>
              <PairTransContent contents={showData}></PairTransContent>
              <ButtonWrapper>
                <ButtonLeftWrapper onClick={onAddClick}>Add</ButtonLeftWrapper>
                <Button onClick={onRemoveClick}>Remove</Button>
              </ButtonWrapper>

            </ContentWrapper>
          }
        </ItemWrapper>
    );
}
