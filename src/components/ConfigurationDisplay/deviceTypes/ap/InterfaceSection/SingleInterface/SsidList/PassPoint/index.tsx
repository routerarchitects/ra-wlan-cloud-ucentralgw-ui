import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { INTERFACE_SSID_PASS_POINT_SCHEMA } from '../../../interfacesConstants';
import PassPointForm from './Form';
import { useFastField } from 'hooks/useFastField';

type Props = {
  isDisabled?: boolean;
  namePrefix: string;
  radiusPrefix: string;
  lockConsortium?: boolean;
};

const PassPointConfig = ({ isDisabled, namePrefix, radiusPrefix, lockConsortium }: Props) => {
  const { t } = useTranslation();
  const { value, onChange } = useFastField({ name: namePrefix });
  const { value: radius } = useFastField({ name: radiusPrefix });

  const { isEnabled } = useMemo(
    () => ({
      isEnabled: value !== undefined,
    }),
    [value],
  );

  const onToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.checked) {
        onChange(undefined);
      } else {
        if (radius) {
          // onRadiusChange(DEFAULT_PASSPOINT_RADIUS);
        }
        onChange(INTERFACE_SSID_PASS_POINT_SCHEMA(t, true).cast());
      }
    },
    [onChange, radius],
  );

  return (
    <PassPointForm
      isDisabled={isDisabled}
      namePrefix={namePrefix}
      isEnabled={isEnabled}
      onToggle={onToggle}
      lockConsortium={lockConsortium}
    />
  );
};

export default React.memo(PassPointConfig);
