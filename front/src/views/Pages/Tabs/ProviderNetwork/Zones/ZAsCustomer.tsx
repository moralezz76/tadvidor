import classNames from 'classnames';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { FaLongArrowAltDown, FaLongArrowAltUp } from 'react-icons/fa';
import { Asn, Icon, PercentLine } from '../../../../../components/Common';
import { CardContainer, PanelCustom, TableList } from '../../../../../components/Containers';
import { t } from '../../../../../config/i18n';

const ZAsCustomer = (props: any) => {
  const { id_asn, IPv4AsCustomers = [], profileData, country } = props;

  const render: any = [
    (v: any) => <b>{v}</b>,
    (v: any) => <Icon type={v} className={v} />,
    ([star, asn, name, net, since]: any) => (
      <>
        <div>
          {star !== 0 ? <Icon type="star" /> : <Icon type="starL" />} &nbsp;
          <Asn pfx={asn} /> <b>{name}</b>
        </div>
        <div className="text-muted">
          {net} networks since {since}
        </div>
      </>
    ),
    (v: any) => (
      <>
        <PercentLine percent={v} />
        <b className="percent">{v} %</b>
      </>
    ),
  ];

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

  const { name = '' } = profileData;
  return (
    <CardContainer className="z-customer" title={`${t('titleIPV4AsCustomers')} (${country})`}>
      <SelectMe
        className="text-center select-my"
        title={t('titleServiceType')}
        options={['All', 'Retail', 'Wholesale', 'Backbone']}
        onClick={selectOnClick}
        selected="All"
      />
      <PanelCustom title={name} value={<Asn pfx={id_asn} />}>
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
          list={IPv4AsCustomers.map((a: any) => {
            return [a[0], 'bookmarkL', [a[1], a[2], a[3], a[4], a[5]], a[6]];
          })}
          maxItems={10}
          render={render}
        />
      </PanelCustom>
    </CardContainer>
  );
};

export default ZAsCustomer;
