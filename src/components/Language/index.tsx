import React, { useEffect, useState, MouseEvent } from 'react';
import '../../assets/vendors/font-bxb/bxb-font.css'
import styled from 'styled-components';
import Column from '../Column'
import _ from 'lodash'

const Wrapper = styled.div`
  position: relative;
`

const TextButton = styled.div`
  color: #F78408;
  cursor: pointer;
  border-radius: 4px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
  font-family: Roboto-Regular, Roboto;
  font-weight: 400;

  &:hover {
    background: #FCF0DC;
  }
`

const DropDown = styled(Column)`
  position: absolute;
  top: 35px;
  right: 0; 
  width: 78px;
  align-items: center;
  background: #FFFFFF;
  box-shadow: 0px 0px 20px 0px rgba(17, 26, 52, 0.1);
  border-radius: 8px;
  padding: 8px 0;
  z-index: 1000;
`

const LangBtn = styled.div<{actived?: boolean}>`
  line-height: 30px;
  height: 30px;
  font-size: 14px;
  font-family: Helvetica;
  color: ${({ actived }) => (actived ? '#FF8212' : '#858B9C')};
  cursor: pointer;
  width: 100%;
  text-align: center;

  &:hover {
    background: #F3F4F7;
  }
`

const languageList = ['EN', '中文', 'KOR']
export default function LanguageComp(): React.ReactElement {
  const [open, setOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('EN')

  const handleClick = (e: MouseEvent) => {
    setOpen(!open)
    e.nativeEvent.stopImmediatePropagation()
  }

  const onItemClick = (lang: string, selectedLanguage: string) => {
    if (lang === selectedLanguage) {
      return
    }
    setSelectedLanguage(lang)
  }
  
  useEffect(() => {
    const listener = () => {
      setOpen(false)
    }
    document.addEventListener('click', listener)

    return () => {
      document.removeEventListener('click', listener)
    }
  })
    return (
      <Wrapper>
        <TextButton onClick={handleClick}>{selectedLanguage}</TextButton>
        {
          open && 
          <DropDown>
            {
              _.map(languageList, (l) => {
                return <LangBtn actived={l === selectedLanguage} onClick={() => {onItemClick(l, selectedLanguage)}} key={l}>{l}</LangBtn>
              })
            }
          </DropDown>

        }
      </Wrapper>
    );

}
