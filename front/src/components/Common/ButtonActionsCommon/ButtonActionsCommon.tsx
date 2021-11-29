import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import './ButtonActionsCommon.scss';
import { Icon } from '..';
import { ListContainer, TableList } from '../../Containers';
import { useEffect } from 'react';

const ButtonActionsCommon = (props: any) => {
  const { icon, actions = [], title, roundedIcon = false, actionRender = [], onRowClick } = props;

  const [toggled, setToggled] = useState(false);
  const [options, setOptions] = useState([]);
  const mainEl = useRef<any>();

  let fireOnBur = false;

  useEffect(() => {
    setOptions(actions.map(({ icon, label }: any, n: number) => [n, icon, label]));
  }, [actions]);

  const handleOnClick = (e: any) => {
    if (!fireOnBur) setToggled(!toggled);
    fireOnBur = false;
  };

  const handleOnBlur = (e: any) => {
    fireOnBur = true;
    setToggled(false); // quitar aqui para ver el menu
  };

  const handleRowClick = (params: any) => {
    setToggled(false);
    onRowClick(params);
  };

  return (
    <div className="button-actions">
      <div
        ref={mainEl}
        className={classNames('content', { rounded: roundedIcon, selected: toggled })}
        onClick={handleOnClick}
      >
        {icon && <Icon type={icon} />}
        {title}
      </div>
      {toggled && (
        <ListContainer onBlur={handleOnBlur} mainEl={mainEl}>
          <TableList list={options} render={actionRender} onRowClick={handleRowClick} />
        </ListContainer>
      )}
    </div>
  );
};

export default ButtonActionsCommon;
