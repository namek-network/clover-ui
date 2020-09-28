import React from 'react';

interface Props {
  active: boolean,
  children: React.ReactNode
}
export default function InputWrapper(props: Props): React.ReactElement<Props> {
  const { active } = props
  const classStr = active === true ? "input-container input-container-active" : "input-container input-container-inactive"
  return (<div className={"inline-div"}>
          <span className={classStr}>
            {props.children}
          </span>
        </div>)
}