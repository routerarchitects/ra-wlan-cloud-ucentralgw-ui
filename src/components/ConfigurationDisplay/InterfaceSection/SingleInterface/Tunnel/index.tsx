import React, { useCallback } from 'react';
import TunnelForm from './Tunnel';
import { useFastField } from 'hooks/useFastField';

const Tunnel = ({ editing, index }: { editing: boolean; index: number }) => {
  const { value, onChange } = useFastField({ name: `configuration[${index}].tunnel` });
  const { value: protoValue } = useFastField({ name: `configuration[${index}].tunnel.proto` });

  const onToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.checked) {
        onChange(undefined);
      } else {
        onChange({ proto: 'mesh' });
      }
    },
    [onChange],
  );

  const onProtoChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (e.target.value === 'mesh') onChange({ proto: 'mesh' });
      else if (e.target.value === 'vxlan') {
        onChange({
          proto: 'vxlan',
          'peer-address': '192.168.0.1',
          'peer-port': 4700,
        });
      } else if (e.target.value === 'l2tp') {
        onChange({
          proto: 'l2tp',
          server: '192.168.0.1',
          password: 'YOUR_PASSWORD',
        });
      } else {
        onChange({
          proto: 'gre',
          'peer-address': '192.168.0.1',
          'dhcp-healthcheck': true,
        });
      }
    },
    [onChange],
  );

  return (
    <TunnelForm
      isDisabled={!editing}
      namePrefix={`configuration[${index}].tunnel`}
      value={value}
      onToggle={onToggle}
      onProtoChange={onProtoChange}
      protoValue={protoValue}
      variableBlockId={value?.__variableBlock?.[0] as string | undefined}
    />
  );
};
export default React.memo(Tunnel);
