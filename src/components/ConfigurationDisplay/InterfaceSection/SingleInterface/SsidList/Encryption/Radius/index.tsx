import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { INTERFACE_SSID_RADIUS_SCHEMA } from '../../../../interfacesConstants';
import RadiusForm from './Radius';
import { useFastField } from 'hooks/useFastField';

type Props = { editing: boolean; namePrefix: string; isPasspoint?: boolean; isNotRequired: boolean };

const Radius = ({ editing, namePrefix, isPasspoint, isNotRequired }: Props) => {
  const { t } = useTranslation();
  const { value: customRadius } = useFastField({ name: `${namePrefix}.__variableBlock` });
  const { value: radius, onChange: onRadiusChange } = useFastField({ name: `${namePrefix}` });
  const { value: accounting, onChange: setAccounting } = useFastField({ name: `${namePrefix}.accounting` });
  const { value: dynamicAuth, onChange: setDynamicAuth } = useFastField({
    name: `${namePrefix}.dynamic-authorization`,
  });

  const isUsingCustomRadius = useMemo(() => customRadius === undefined, [customRadius]);

  const onEnabledAccountingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setAccounting({
        host: '192.168.178.192',
        port: 1813,
        secret: 'YOUR_SECRET',
      });
    } else {
      setAccounting(undefined);
    }
  };

  const isAccountingEnabled = useMemo(() => accounting !== undefined, [accounting !== undefined]);

  const isEnabled = React.useMemo(() => radius !== undefined, [radius !== undefined]);
  const onEnableToggle = React.useCallback(() => {
    if (isEnabled) onRadiusChange(undefined);
    else onRadiusChange(INTERFACE_SSID_RADIUS_SCHEMA(t, true).cast());
  }, [isEnabled]);
  const onEnableDynamicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setDynamicAuth({
        host: '192.168.178.192',
        port: 1813,
        secret: 'YOUR_SECRET',
      });
    } else {
      setDynamicAuth(undefined);
    }
  };

  const isDynamicEnabled = useMemo(() => dynamicAuth !== undefined, [dynamicAuth !== undefined]);

  return (
    <RadiusForm
      editing={editing}
      isUsingCustom={isUsingCustomRadius}
      onAccountingChange={onEnabledAccountingChange}
      isAccountingEnabled={isAccountingEnabled}
      onDynamicChange={onEnableDynamicChange}
      isDynamicEnabled={isDynamicEnabled}
      variableBlock={customRadius}
      namePrefix={namePrefix}
      isEnabled={isEnabled}
      onEnableToggle={onEnableToggle}
      isPasspoint={isPasspoint}
      isNotRequired={isNotRequired}
    />
  );
};

export default React.memo(Radius);
