/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import classNames from 'classnames';
import prettyBtyes from 'pretty-bytes';
import './DropZone.scss';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';

import { t } from '../../../config/i18n';
import BaseField, { IProps } from '../BaseField/BaseField';
import { IGenericObject } from '../../../config/interfaces';
import { FormikProps } from 'formik';

interface IDropzoneProps extends IProps {
  allowedExt: string;
  maxSize?: number;
  minSize?: number;
  multiple?: boolean;
  fieldChange?: (
    values: IGenericObject,
    set: (values: IGenericObject) => void,
    FormikProps: FormikProps<IGenericObject>
  ) => void;
}

const DropZone = (props: IDropzoneProps) => {
  const {
    field: { name, value },
    form: { setFieldValue, setFieldTouched, values },
    allowedExt,
    maxSize = 4194304,
    minSize = 1,
    multiple = false,
    fieldChange,
  } = props;

  const set = (values: IGenericObject) => {
    Object.keys(values).forEach(key => setFieldValue(key, values[key]));
  };

  const [acceptedFiles, setAcceptedFiles]: any[] = useState([]);

  const fileNameFormatter = (fileName: string) => {
    const splitName = fileName.split('.');
    const name = splitName[0];
    const ext = splitName.length > 1 ? `.${splitName[1]}` : '';
    const formattedName =
      name.length > 37
        ? `${name.substring(0, 32)}...${name.substring(name.length - 2, name.length)}${ext}`
        : `${name}${ext}`;
    return formattedName;
  };

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      let retValue: any[] = [];
      acceptedFiles.forEach((file: any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          retValue = [...retValue, { filename: file.name, file: reader.result }];
          const value = acceptedFiles.length === 1 ? retValue[0] : retValue;

          const canChange: any =
            fieldChange && fieldChange({ ...values, [name]: value }, set, props.form);
          canChange !== false && setFieldValue(name, value);
        };
        reader.readAsDataURL(file);
      });
    } else {
      setFieldValue(name, '');
      fieldChange && fieldChange({ ...values, [name]: {} }, set, props.form);
    }
  }, [acceptedFiles]);

  useEffect(() => {
    if (value === '') {
      setAcceptedFiles([]);
    }
  }, [value]);

  const onDropAccepted = useCallback(files => {
    setAcceptedFiles([...files]);
  }, []);

  const removeFile = (file: any) => () => {
    const newFiles: any[] = [...acceptedFiles];
    newFiles.splice(newFiles.indexOf(file), 1);
    setFieldTouched(name);
    setAcceptedFiles(newFiles);
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDropAccepted,
    accept: allowedExt,
    multiple: multiple,
    minSize: minSize,
    maxSize: maxSize,
  });

  const classesContainer = classNames('drop-zone__container', {
    'drop-zone--selected': acceptedFiles.length > 0,
  });

  const classesLabel = classNames('drop-zone__label');

  return (
    <BaseField {...props}>
      {({ classes }: IGenericObject) => {
        return (
          <div
            className={classNames(classesContainer, {
              'is-invalid': classes.indexOf('is-invalid') !== -1,
            })}
          >
            <div {...getRootProps({ className: 'drop-zone__input' })}>
              <input {...getInputProps()} />
              <AiOutlineCloudUpload className="drop-zone__icon" />
              {acceptedFiles.length === 0 && (
                <span className={classesLabel}>
                  {t('labelDropZone')} {allowedExt && `(${allowedExt})`}
                </span>
              )}
            </div>
            <div className="drop-zone__files">
              {acceptedFiles.map((file: any) => (
                <div className="drop-zone__files__content" key={file.path}>
                  <span>
                    <span>
                      {fileNameFormatter(file.path)}
                      <span className="size">({prettyBtyes(file.size)})</span>
                    </span>
                  </span>
                  <BsTrash className="drop-zone__remove" onClick={removeFile(file)} />
                </div>
              ))}
            </div>
            <span className="drop-zone__rules">
              [{t('labelMaxSize', { size: prettyBtyes(maxSize) })}]
            </span>
          </div>
        );
      }}
    </BaseField>
  );
};
export default DropZone;
