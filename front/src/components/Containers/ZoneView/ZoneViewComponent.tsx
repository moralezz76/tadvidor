import classNames from 'classnames';
import React, { ReactNode } from 'react';
import './ZoneViewComponent.scss';

interface IZoneViewProps {
  children: ReactNode;
  active: string;
  className?: string;
}

const ZoneView = (props: IZoneViewProps) => {
  const { children, active, className } = props;

  return (
    <div className={classNames('zone-view', className)}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          const {
            props: { id },
          } = child;
          return id === active && child;
        }
      })}
    </div>
  );
};

export default ZoneView;
