import React from 'react';
import FormFields from './FormFields/FormFields';
import BaseField from './BaseField/BaseField';
import TextInput from './TextInput/TextInput';
import PasswordInput from './PasswordInput/PasswordInput';
import Button from './Button/Button';
import DropZone from './DropZone/DropZone';
import SelectInput from './SelectInput/SelectInput';
import { t } from '../../config/i18n';

export { FormFields, BaseField, TextInput, PasswordInput, Button, DropZone, SelectInput };

export class FieldFormatter {
  static EMPTY = (value: any) => {
    // add "—" to empty values

    return (
      <div className="is-value-render">
        {(typeof value === 'string' && value.trim() === '') || value === null || value === undefined
          ? '—'
          : value}
      </div>
    );
  };

  static MULTI_SELECT = (values: any, dfl: string) => {
    if (!values || !values[0])
      return {
        value: dfl,
      };
    const l = values.length;
    const transl = t('selectItemsSelected', { s: l === 1 ? '' : 's' });
    return {
      value: `(${l}) ${transl}`,
      element: (
        <>
          <b>({l})</b> {transl}
        </>
      ),
    };
  };

  static DEFAULT_SELECT = (values: any, dfl: string) => {
    if (!values || !values[0])
      return {
        value: dfl,
        element: dfl,
      };
    const [, value] = values[0];
    return { value, element: value };
  };

  static COUNTRIES = (values: any, dfl: string) => {
    if (!values || !values[0])
      return {
        value: dfl,
      };
    const l = values.length;

    const transl = t('selectItemsSelected', { s: l === 1 ? '' : 's' });
    return {
      value: l ? `(${l}) ${transl}` : dfl,
      element: l ? (
        <>
          <b>({l})</b> {transl}
        </>
      ) : (
        dfl
      ),
    };
  };

  static DATETIME = (values: any, dfl: string) => {
    if (!values || !values[0])
      return {
        value: dfl,
      };

    const [, value] = values[0];
    console.log(values);

    return {
      value,
      element: value,
    };
  };
}
