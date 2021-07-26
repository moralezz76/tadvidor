import React from 'react';
import classNames from 'classnames';
import './CardContainerComponent.scss';

const CardContainerComponent = (props: any) => {
  const { title, children, className } = props;
  return (
    <div className={classNames('card-container', className)}>
      {title && <div className="card-container-title">{title}</div>}
      <div className="card-container-body">{children}</div>
    </div>
  );
};

export default CardContainerComponent;
