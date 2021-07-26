import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { IGenericObject } from '../../../config/interfaces';
import { FiChevronsRight } from 'react-icons/fi';
import './BreadcrumbsComponent.scss';
import { t } from '../../../config/i18n';
import { getPath } from '../../../utils/Helpers';

const BreadcrumbsComponent = (props: any) => {
  const match = useRouteMatch<IGenericObject>();
  const { path } = match;

  const Path = ({ breadcrumbsTitle, path, last }: any) => {
    return (
      <b>
        {last ? (
          <span>
            <FiChevronsRight /> {t(breadcrumbsTitle)}
          </span>
        ) : (
          <Link to={path}>
            <FiChevronsRight /> {t(breadcrumbsTitle)}
          </Link>
        )}
        &nbsp;
      </b>
    );
  };

  const paths = getPath(path);

  return (
    <div className="breadcrumbs">
      {paths.map((item: any, i: number) => (
        <Path {...item} last={i + 1 === paths.length} key={`bc_${i}`} />
      ))}
    </div>
  );
};

export default BreadcrumbsComponent;
