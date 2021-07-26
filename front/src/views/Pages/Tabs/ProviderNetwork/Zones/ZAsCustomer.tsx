import classNames from 'classnames';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { CardContainer, PanelCustom, TableList } from '../../../../../components/Containers';
import { t } from '../../../../../config/i18n';

const ZAsCustomer = (props: any) => {
  const { id_asn, IPv4AsCustomers = [], asName, country } = props;

  const Pfx = (props: any) => {
    const { pfx } = props;
    return (
      <div className="pfx">
        <div className="pfx-1">AS</div>
        <div className="pfx-2">{pfx.substr(2)}</div>
      </div>
    );
  };

  const SelectMe = (props: any) => {
    const { selected = '', title, options = [], onClick = () => {}, ...rest } = props;

    const [sel, setSel] = useState('');

    useEffect(() => {
      setSel(selected);
    }, [selected]);

    const handleOnClick = (v: any) => {
      setSel(v);
      onClick(v);
    };

    return (
      <div {...rest}>
        {title}:
        {options.map((item: any) => (
          <label
            className={classNames({ selected: item === sel })}
            onClick={e => handleOnClick(item)}
          >
            {item}
          </label>
        ))}
      </div>
    );
  };

  const selectOnClick = (v: string) => {
    //alert(v);
  };

  return (
    <CardContainer className="form" title={`${t('titleIPV4AsCustomers')} (${country})`}>
      <SelectMe
        className="text-center select-my"
        title={t('titleServiceType')}
        options={['All', 'Retail', 'Wholesale', 'Backbone']}
        onClick={selectOnClick}
        selected="All"
      />

      <PanelCustom title={asName} value={<Pfx pfx={id_asn} />}>
        <div className="text-right">
          Sort by: &nbsp;
          <select name="cars" id="cars">
            <option value="volvo">Relative Contribution</option>
          </select>
        </div>
        <TableList
          className="viewer"
          title="Transit Providers"
          value={IPv4AsCustomers.length}
          list={IPv4AsCustomers}
          maxItems={10}
        />
      </PanelCustom>
    </CardContainer>
  );
};

export default ZAsCustomer;
