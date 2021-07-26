import React, { useState } from 'react';
import classNames from 'classnames';
import './BlockListComponent.scss';
import { CardContainer } from '../';
import { t } from '../../../config/i18n';

import { TableList } from '..';

const BlockListComponent = (props: any) => {
  const {
    blockHeaderProps = {},
    data = {},
    actions = () => [],
    dtbuttons = [],
    render = [],
    ...rest
  } = props;

  const handleItemClick = (v: any) => {};

  return (
    <div className="block-list row">
      {Object.keys(data).map((blockTitle: any) => (
        <CardContainer title={blockTitle} className="form" {...rest}>
          <TableList
            className="table-block"
            list={data[blockTitle]}
            maxItems={10}
            render={render}
          />
        </CardContainer>
      ))}
    </div>
  );
};

export default BlockListComponent;
