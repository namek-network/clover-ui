import React, { useState } from 'react';
import _ from 'lodash';
import InputWrapper from './inputWrapper'

interface TranDeadlineCompPropTypes {
  transDeadline: number,
  setTransDeadline: (val: number) => void
}
export default function TranDeadlineComp(props: TranDeadlineCompPropTypes): React.ReactElement {
  const {transDeadline, setTransDeadline} = props;
  const [transDeadlineInput, setTransDeadlineInput] = useState('')
  
  const validNumber = (v: number) => v > 0 && v <= 1000
  const parseInput = (value: string) => {
    setTransDeadlineInput(value)

    try {
      const valueAsInt: number = Number.parseInt(value)
      if (!Number.isNaN(valueAsInt) && validNumber(valueAsInt)) {
        setTransDeadline(valueAsInt)
      }
    } catch(e) {
      console.log('error:'+e)
    }
  }

  return (
    <div className="slip-container">
      <InputWrapper active={(_.isEmpty(transDeadlineInput) && validNumber(transDeadline)) || (!Number.isNaN(transDeadlineInput) && validNumber(Number.parseInt(transDeadlineInput)))}>
        <input 
          placeholder={transDeadline.toString()}
          value={transDeadlineInput}
          onBlur={() => {
            parseInput(transDeadline.toString())
          }}
          onChange={e => parseInput(e.target.value)}/>
      </InputWrapper>
      <span className="per-text">minutes</span>
    </div>
  );
}