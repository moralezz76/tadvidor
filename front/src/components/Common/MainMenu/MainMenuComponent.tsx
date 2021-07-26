import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import './MainMenuComponent.scss';

import { t } from '../../../config/i18n';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { IGenericObject } from '../../../config/interfaces';
import { getPath } from '../../../utils/Helpers';

const MainMenuComponent = (props: any) => {
  const match = useRouteMatch<IGenericObject>();
  const { path: appPath } = match;
  const { className = {}, menus = {} } = props;
  let history = useHistory();

  const SubMenu = (props: any) => {
    const {
      keyname,
      item: {
        route: { path },
        icon,
        submenu = {},
        mainmenu = false,
      },
    } = props;

    //console.log(props);
    const { title = `menu${_.capitalize(keyname)}` } = props;
    const haveSubmenu = Object.keys(submenu).length > 0;

    const handleClick = () => {
      !mainmenu && path && history.push(path, { a: Math.random() });
    };

    const paths = getPath(appPath);
    const active = !!paths.find((i: any) => path === i.path);

    return (
      <>
        <div className={classNames('item', { active })} onClick={handleClick}>
          {icon} {t(title)}
        </div>
        {haveSubmenu && (
          <div className="sub-menu">
            {Object.keys(submenu).map((item: any) => (
              <SubMenu item={submenu[item]} key={item} keyname={item} />
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div className={classNames('main-menu', className)}>
      {Object.keys(menus).map((item: any) => (
        <SubMenu item={menus[item]} key={item} keyname={item} />
      ))}
    </div>
  );
};

export default MainMenuComponent;
