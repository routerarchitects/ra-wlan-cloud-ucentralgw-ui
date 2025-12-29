import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { INTERFACE_SSID_RRM_SCHEMA } from '../../../interfacesConstants';
import RrmForm from './Rrm';
import { useFastField } from 'hooks/useFastField';

const Rrm = ({ editing, namePrefix }: { editing: boolean; namePrefix: string }) => {
  const { t } = useTranslation();
  const { value, onChange } = useFastField({ name: namePrefix });

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
        onChange(INTERFACE_SSID_RRM_SCHEMA(t, true).cast());
      }
    },
    [onChange],
  );

  return <RrmForm editing={editing} namePrefix={namePrefix} isEnabled={isEnabled} onToggle={onToggle} />;
};

export default React.memo(Rrm);
