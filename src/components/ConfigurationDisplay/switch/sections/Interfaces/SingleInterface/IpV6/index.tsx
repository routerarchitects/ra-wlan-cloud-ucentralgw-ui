import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { INTERFACE_IPV6_SCHEMA } from '../../interfacesConstants';
import Ipv6Form from './Ipv6';
import { useFastField } from 'hooks/useFastField';

const Ipv6 = ({ editing, index }: { editing: boolean; index: number }) => {
  const { t } = useTranslation();
  const { value, onChange } = useFastField({ name: `configuration[${index}].ipv6` });
  const { value: role } = useFastField({ name: `configuration[${index}].role` });

  const { ipv6 } = useMemo(
    () => ({
      ipv6: value?.addressing ?? '',
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

  const onIpv6Change = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '') {
      onChange(undefined);
    } else if (e.target.value === 'dynamic') onChange({ addressing: 'dynamic' });
    else {
      onChange({
        ...INTERFACE_IPV6_SCHEMA(t, true).cast(),
        'port-forward': undefined,
        'destination-ports': undefined,
        addressing: 'static',
      });
    }
  }, []);

  return (
    <Ipv6Form ipv6={ipv6} role={role} editing={editing} index={index} onToggle={onToggle} onChange={onIpv6Change} />
  );
};

export default React.memo(Ipv6);
