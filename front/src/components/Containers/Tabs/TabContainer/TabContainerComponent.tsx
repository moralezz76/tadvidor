import React, { ReactNode, useEffect, useState } from 'react';
import './TabContainerComponent.scss';
import TabChild from '../TabChild/TabChild';

interface ITabContainerProps {
  children: ReactNode;
  name: string;
  activeIndex?: number;
  onClickTabItem?: (i: number) => void | null;
}

const TabContainer = (props: ITabContainerProps) => {
  const { children, name, activeIndex = 0, onClickTabItem = null } = props;
  const [activeTab, setActiveTab] = useState<number>(activeIndex);

  useEffect(() => {
    setActiveTab(activeIndex);
  }, [activeIndex]);

  const handleClickTabItem = (tab: number) => {
    onClickTabItem ? onClickTabItem(tab) : setActiveTab(tab);
  };

  return (
    <div className="tabs">
      <div className="tab-list">
        <ol>
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement(child)) {
              const { props } = child;
              const key = `${name}_${index}`;
              return React.cloneElement(child, {
                index,
                activeTab,
                key,
                handleClickTabItem,
                ...props,
              });
            }
          })}
        </ol>
      </div>
      <div className="tab-content">
        {React.Children.map(children, (child, i) => {
          if (React.isValidElement(child)) {
            const {
              props: { children },
            } = child;
            return i === activeTab && children;
          }
        })}
      </div>
    </div>
  );
};

TabContainer.Tab = (props: any) => {
  return <TabChild {...props} />;
};

export default TabContainer;
