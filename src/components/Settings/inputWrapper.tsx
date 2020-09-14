import React from 'react';
import _ from 'lodash';

export default function InputWrapper(props: any) {
  const { active, children } = props
  const classStr = active === true ? "input-container input-container-active" : "input-container input-container-inactive"
  return (<div className={"inline-div"}>
          <span className={classStr}>
            {props.children}
          </span>
        </div>)
}