import React, { useCallback } from 'react';
import ObjectArrayFieldInput from './Input';
import { useFastField } from 'hooks/useFastField';
import { FieldProps } from 'models/Form';
import { Column } from 'models/Table';

interface ObjectArrayFieldModalOptions {
  buttonLabel?: string;
  modalTitle?: string;
}

interface Props extends FieldProps {
  fields: React.ReactNode;
  columns: Column<unknown>[];
  options?: ObjectArrayFieldModalOptions;
  schema: (t: (e: string) => string, useDefault?: boolean) => object;
}

const ObjectArrayFieldModal = ({
  name,
  label,
  fields,
  schema,
  columns,
  hideLabel = false,
  isDisabled = false,
  isHidden = false,
  isRequired = false,
  emptyIsUndefined = false,
  definitionKey,
  options = {},
}: Props) => {
  const { value, error, isError, onChange, onBlur } = useFastField<unknown[] | undefined>({ name });

  const onFieldChange = useCallback(
    (v: unknown[]) => {
      if (emptyIsUndefined && v.length === 0) onChange(undefined);
      else onChange(v);
    },
    [onChange, emptyIsUndefined],
  );

  return (
    <ObjectArrayFieldInput
      name={name}
      label={label ?? name}
      value={value}
      fields={fields}
      schema={schema}
      columns={columns}
      hideLabel={hideLabel}
      onChange={onFieldChange}
      isHidden={isHidden}
      onBlur={onBlur}
      isError={isError}
      error={error}
      isRequired={isRequired}
      isDisabled={isDisabled}
      definitionKey={definitionKey}
      options={options}
    />
  );
};

export default React.memo(ObjectArrayFieldModal);
