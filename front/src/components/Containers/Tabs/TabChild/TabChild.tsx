import React, { ReactNode } from 'react';
import classNames from 'classnames';
import './TabChild.scss';
import { Icon } from '../../../Common';

interface ITabChildProps {
  title: string;
  handleClickTabItem?: (index: number) => void;
  activeTab?: number;
  index?: number;
  disabled?: boolean;
  icon?: string;
  children?: ReactNode;
  className?: string;
}

const TabChild = (props: ITabChildProps) => {
  const { disabled, icon, index, activeTab, title, handleClickTabItem, className } = props;

  const handleClick = () => {
    !disabled && handleClickTabItem && handleClickTabItem(index || 0);
  };

  return (
    <li
      className={classNames(className, 'tab-list-item', { active: activeTab === index, disabled })}
      onClick={handleClick}
    >
      {icon && (
        <>
          <Icon type={icon} size="22px" /> &nbsp;
        </>
      )}
      {title}
    </li>
  );
};

export default TabChild;
