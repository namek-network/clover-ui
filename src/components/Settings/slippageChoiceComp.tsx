import React, { useState } from 'react';
import _ from 'lodash';
import InputWrapper from './inputWrapper'

interface OptionButtonProps {
  text: string,
  onClick: () => void,
  active: boolean,
  customClass?: string
}
const OptionButton = (props: OptionButtonProps) => {
  const { text, active, onClick, customClass } = props
  const classStr = (active ? "option-btn active-btn":"option-btn inactive-btn") + (_.isEmpty(customClass) ? "" : " " + customClass)
  return (
    <button onClick={onClick} className={classStr}>
      {text}
    </button>
  )
}

interface SlippageChoiceCompPropTypes {
  slippageTol: number,
  setSlippageTol: (val: number) => void
}

export default function SlippageChoiceComp(props: SlippageChoiceCompPropTypes): React.ReactElement {
  const {slippageTol, setSlippageTol} = props;
  const [slippageInput, setSlippageInput] = useState('')

  const parseInput = (value: string) => {
    setSlippageInput(value)

    try {
      const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
      if (!Number.isNaN(valueAsIntFromRoundedFloat)) {
        if ( valueAsIntFromRoundedFloat > 10 && valueAsIntFromRoundedFloat < 5000) {
          setSlippageTol(valueAsIntFromRoundedFloat)
        }
      }
    } catch(e) {
      console.log('error:' + e)
    }
  }

  return (
    <div className="slip-container">
      <OptionButton
        text="0.1%"
        onClick={() => {
          setSlippageTol(10)
          setSlippageInput('')
        }}
        active={slippageTol === 10}></OptionButton>
      <OptionButton 
        text="0.5%" 
        onClick={() => {
          setSlippageTol(50)
          setSlippageInput('')
        }}
        active={slippageTol === 50}
        customClass={"btn-margin"}></OptionButton>
      <OptionButton 
        text="1%" 
        onClick={() => {
          setSlippageTol(100)
          setSlippageInput('')
        }}
        active={slippageTol === 100}
        customClass={"btn-margin"}></OptionButton>
        <InputWrapper active={!_.includes([10, 50, 100], slippageTol)}>
          <input 
            placeholder={(slippageTol / 100).toFixed(2)}
            value={slippageInput}
            onBlur={() => {
              parseInput((slippageTol / 100).toFixed(2))
            }}
            onChange={e => parseInput(e.target.value)}/>
        </InputWrapper>
        <span className="per-text">%</span>
      
    </div>
  );
}
