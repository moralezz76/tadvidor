import React, { ReactNode } from 'react';
import classNames from 'classnames';
import './TabChild.scss';

interface ITabChildProps {
  title: string;
  handleClickTabItem?: (index: number) => void;
  activeTab?: number;
  index?: number;
  disabled?: boolean;
  icon?: React.ReactElement;
  children?: ReactNode;
}

const TabChild = (props: ITabChildProps) => {
  const { disabled, icon, index, activeTab, title, handleClickTabItem } = props;

  const handleClick = () => {
    !disabled && handleClickTabItem && handleClickTabItem(index || 0);
  };

  return (
    <li
      className={classNames('tab-list-item', { active: activeTab === index, disabled })}
      onClick={handleClick}
    >
      {icon}&nbsp;
      {title}
    </li>
  );
};

export default TabChild;
