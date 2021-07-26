import React from 'react';

import './CheckboxCommon.scss';

const CheckboxCommon = (props: any) => {
  const { checked = false, onChange = () => {}, label = '' } = props;
  const id = btoa(Math.random().toString());

  const handleClick = () => {
    onChange(!checked);
  };

  return (
    <div className="form-check">
      <input
        onChange={handleClick}
        className="form-check-input"
        type="checkbox"
        checked={checked}
        id={id}
      />
      {label && (
        <label className="form-check-label" htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  );
};

export default CheckboxCommon;
