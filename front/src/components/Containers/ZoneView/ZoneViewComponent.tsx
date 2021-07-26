import React, { ReactNode } from 'react';
import './ZoneViewComponent.scss';

interface IZoneViewProps {
  children: ReactNode;
  active: string;
}

const ZoneView = (props: IZoneViewProps) => {
  const { children, active } = props;

  return (
    <div className="zone-view">
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
