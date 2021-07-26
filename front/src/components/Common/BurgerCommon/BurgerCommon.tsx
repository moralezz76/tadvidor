import React from 'react';
import classNames from 'classnames';
import './BurgerCommon.scss';

const BurgerCommon = (props: any) => {
  const { active } = props;
  const _class = classNames('d-block d-md-none hamburger', { 'is-active': active });
  return (
    <div className={_class} {...props}>
      <div className="hamburger-box">
        <div className="hamburger-inner"></div>
      </div>
    </div>
  );
};

export default BurgerCommon;
