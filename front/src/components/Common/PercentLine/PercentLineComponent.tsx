import React from 'react';
import './PercentLineComponent.scss';

const PercentLineComponent = (props: any) => {
  const { percent = 0 } = props;

  return (
    <div className="percent-line">
      <div style={{ maxWidth: `${percent}%` }}></div>
    </div>
  );
};

export default PercentLineComponent;
