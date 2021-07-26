import React from 'react';
import './AccessDeniedPage.scss';
import { Link } from 'react-router-dom';

const AccessDeniedPage = () => {
  return (
    <div className="not-found">
      <div className="not-found__title" data-content="404">
        <span>
          <span>4</span>
        </span>
        <span>0</span>
        <span>
          <span>4</span>
        </span>
      </div>
      <div className="not-found__subtitle">Something's wrong here...</div>
      <p>We can't find the page you're looking for. Please go back home and start over.</p>
      <div className="not-found__buttons">
        <Link to="" className="not-found__buttons--button">
          Go to home page
        </Link>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
