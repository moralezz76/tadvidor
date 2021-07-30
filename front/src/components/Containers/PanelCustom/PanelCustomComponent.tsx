import React from 'react';
import classNames from 'classnames';
import './PanelCustomComponent.scss';

const PanelCustomComponent = (props: any) => {
  const { title, value, children, className } = props;
  return (
    <div className={classNames('custom-panel', className)}>
      <div className="panel-title">
        <div className="float-right">{value}</div>
        <div>{title && <b>{title}</b>}&nbsp;</div>
      </div>
      <div className="content">{children}</div>
    </div>
  );
};

export default PanelCustomComponent;
