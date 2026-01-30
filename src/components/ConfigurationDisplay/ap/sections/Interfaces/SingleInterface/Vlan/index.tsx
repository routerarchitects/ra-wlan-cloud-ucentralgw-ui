import React, { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import VlanForm from './Vlan';
import { useFastField } from 'hooks/useFastField';

const Vlan = ({ editing, index }: { editing: boolean; index: number }) => {
  const { value, onChange } = useFastField({ name: `configuration[${index}].vlan` });

  const { isActive, isUsingCustom, variableBlock } = useMemo(
    () => ({
      isActive: value !== undefined,
      isUsingCustom: value !== undefined && value.variableBlock === undefined,
      variableBlock: value?.variableBlock,
    }),
    [value],
  );

  const onToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.checked) {
        onChange(undefined);
      } else {
        onChange({ id: 1080 });
      }
    },
    [onChange],
  );

  const basicSchema = useCallback(
    (t: (s: string) => string) =>
      Yup.object()
        .shape({
          id: Yup.number().required(t('form.required')).moreThan(0).lessThan(4051).default(1080),
        })
        .default({
          id: 1080,
        }),
    [],
  );

  return (
    <VlanForm
      editing={editing}
      index={index}
      isActive={isActive}
      onToggle={onToggle}
      isUsingCustom={isUsingCustom}
      variableBlock={variableBlock}
      basicSchema={basicSchema}
    />
  );
};

export default React.memo(Vlan);
