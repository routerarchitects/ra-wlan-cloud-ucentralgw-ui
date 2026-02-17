import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { INTERFACE_IPV4_SCHEMA } from '../../interfacesConstants';
import Ipv4Form from './Ipv4';
import { useFastField } from 'hooks/useFastField';

const Ipv4: React.FC<{ editing: boolean; index: number }> = ({ editing, index }) => {
  const { t } = useTranslation();
  const { value, onChange } = useFastField({ name: `configuration[${index}].ipv4` });
  const { value: role } = useFastField({ name: `configuration[${index}].role` });

  const { ipv4 } = useMemo(
    () => ({
      ipv4: value?.addressing ?? '',
    }),
    [value],
  );

  const onToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.checked) {
        onChange(undefined);
      } else {
        onChange({ addressing: 'dynamic' });
      }
    },
    [onChange],
  );

  const onIpv4Change = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (e.target.value === '') {
        onChange(undefined);
      } else if (e.target.value === 'dynamic') onChange({ addressing: 'dynamic' });
      else {
        onChange({
          ...INTERFACE_IPV4_SCHEMA(t, true).cast(),
          'port-forward': undefined,
          'use-dns': role === 'upstream' ? [] : undefined,
          addressing: 'static',
        });
      }
    },
    [role],
  );

  return (
    <Ipv4Form
      isEnabled={value !== undefined}
      ipv4={ipv4}
      role={role}
      isDisabled={!editing}
      namePrefix={`configuration[${index}].ipv4`}
      onToggle={onToggle}
      onChange={onIpv4Change}
      variableBlockId={value?.__variableBlock?.[0] as string | undefined}
    />
  );
};

export default React.memo(Ipv4);
