import React, { useCallback, useMemo } from 'react';
import { useField } from 'formik';
import ResourcePicker from './ResourcePicker';

// Note: Gateway doesn't have Resources API like Provisioning does
// This component will show an empty resource list by default
// Resources would need to be provided externally if needed

interface ConfigurationResourcePickerProps {
  name: string;
  prefix: string;
  defaultValue: (t: any, useDefault: boolean) => any;
  isDisabled: boolean;
  blockedIds?: string[];
}

const ConfigurationResourcePicker: React.FC<ConfigurationResourcePickerProps> = ({
  name,
  prefix,
  defaultValue,
  isDisabled,
  blockedIds = [],
}) => {
  const [{ value }, , { setValue }] = useField(name);

  // Gateway doesn't have resources API - return empty array
  // In a real implementation, resources could be passed as props or fetched differently
  const availableResources = useMemo(() => {
    return [];
  }, []);

  const getValue = () => {
    if (!value || !value.__variableBlock) return '';
    return value.__variableBlock[0];
  };

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (e.target.value === '') setValue(defaultValue((key: string) => key, true).cast());
      else {
        const newObj: any = {};
        newObj.__variableBlock = [e.target.value];
        setValue(newObj);
      }
    },
    [defaultValue, setValue],
  );

  return (
    <ResourcePicker
      value={getValue()}
      onChange={onChange}
      resources={availableResources}
      isDisabled={isDisabled}
    />
  );
};

export default ConfigurationResourcePicker;
