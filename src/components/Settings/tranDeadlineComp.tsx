import React, { Component, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import InputWrapper from './inputWrapper'

export default function TranDeadlineComp(props: any) {
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
    } catch {
    }
  }

  return (
    <div className="slip-container">
      <InputWrapper active={(_.isEmpty(transDeadlineInput) && validNumber(transDeadline)) || (!Number.isNaN(transDeadlineInput) && validNumber(Number.parseInt(transDeadlineInput)))}>
        <input 
          placeholder={transDeadline}
          value={transDeadlineInput}
          onBlur={() => {
            parseInput(transDeadline)
          }}
          onChange={e => parseInput(e.target.value)}/>
      </InputWrapper>
      <span className="per-text">minutes</span>
    </div>
  );
}

TranDeadlineComp.propTypes = {
  transDeadline: PropTypes.number.isRequired,
  setTransDeadline: PropTypes.func.isRequired
};