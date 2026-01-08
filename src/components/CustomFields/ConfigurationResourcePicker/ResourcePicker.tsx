import React from 'react';
import { Select } from '@chakra-ui/react';
import isEqual from 'react-fast-compare';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';

interface ResourcePickerProps {
  value: string;
  resources: { value: string; label: string }[];
  isDisabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ResourcePicker: React.FC<ResourcePickerProps> = ({ value, resources, isDisabled, onChange }) => {
  const { t } = useTranslation();

  return (
    <Select value={value} isDisabled={isDisabled} maxW={72} onChange={onChange}>
      <option value="">{t('configurations.no_resource_selected')}</option>
      {resources.map((res) => (
        <option key={uuid()} value={res.value}>
          {res.label}
        </option>
      ))}
      {value !== '' && !resources.find(({ value: resource }) => resource === value) && (
        <option value={value}>{t('configurations.invalid_resource')}</option>
      )}
    </Select>
  );
};

export default React.memo(ResourcePicker, isEqual);
