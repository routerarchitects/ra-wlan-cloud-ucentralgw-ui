import * as React from 'react';
import { Select } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { INTERFACE_SSID_SCHEMA } from '../../interfacesConstants';
import { useConfigurationContext } from 'contexts/ConfigurationProvider';
import { useFastField } from 'hooks/useFastField';

type Props = {
  name: string;
  isDisabled: boolean;
};

const SsidResourcePicker = ({ name, isDisabled }: Props) => {
  const { t } = useTranslation();
  const context = useConfigurationContext();
  const field = useFastField<{ __variableBlock?: string[] } | undefined>({ name });

  const availableResources = React.useMemo(() => {
    if (context.availableResources)
      return context.availableResources
        .filter(
          (resource) =>
            resource.variables[0]?.prefix === 'interface.ssid.openroaming' ||
            resource.variables[0]?.prefix === 'interface.ssid',
        )
        .map((resource) => ({ value: resource.id, label: resource.name }));
    return [];
  }, [context.availableResources?.length]);

  const selectValue = React.useMemo(() => {
    if (!field.value || !field.value.__variableBlock) return '';
    return field.value.__variableBlock[0];
  }, [field.value?.__variableBlock]);

  const onChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '') field.onChange(INTERFACE_SSID_SCHEMA(t, true).cast());
    else {
      const newObj = {} as { __variableBlock: string[] };
      newObj.__variableBlock = [e.target.value];
      field.onChange(newObj);
    }
  }, []);

  return (
    <Select value={selectValue} isDisabled={isDisabled} maxW={72} onChange={onChange}>
      <option value="">{t('configurations.no_resource_selected')}</option>
      {availableResources.map((res) => (
        <option key={res.value} value={res.value}>
          {res.label}
        </option>
      ))}
      {selectValue !== '' && !availableResources.find(({ value: resource }) => resource === selectValue) && (
        <option value={selectValue}>{t('configurations.invalid_resource')}</option>
      )}
    </Select>
  );
};

export default SsidResourcePicker;
