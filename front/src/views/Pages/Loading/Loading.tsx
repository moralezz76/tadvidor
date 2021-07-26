import React from 'react';
import './Loading.scss';

interface ILoadingProps {
  withOverlay?: boolean;
}

const Loading = ({ withOverlay = true }: ILoadingProps) => (
  <div className="loading-wrapper">
    <div className="loading-wrapper__spinner" />
    {withOverlay && <div className="loading-wrapper__overlay" />}
  </div>
);

export default Loading;
