import React from 'react';
import { Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import He from './He';
import { CreatableSelectField } from 'components/Form/Fields/CreatableSelectField';
import { NumberField } from 'components/Form/Fields/NumberField';
import { SelectField } from 'components/Form/Fields/SelectField';
import { ToggleField } from 'components/Form/Fields/ToggleField';

type Props = {
  isDisabled?: boolean;
  namePrefix: string;
};
const AdvancedSettings = ({ namePrefix, isDisabled }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Flex>
        <Heading size="md" pt={2} borderBottom="1px solid">
          {t('configurations.advanced_settings')}
        </Heading>
      </Flex>
      <SimpleGrid minChildWidth="300px" spacing="20px">
        <ToggleField
          name={`${namePrefix}.allow-dfs`}
          label="allow-dfs"
          definitionKey="radio.allow-dfs"
          isDisabled={isDisabled}
          defaultValue
        />
        <SelectField
          name={`${namePrefix}.rates.beacon`}
          label="beacon-rate"
          definitionKey="radio.rates.beacon"
          isDisabled={isDisabled}
          isInt
          emptyIsUndefined
          options={[
            { value: '', label: t('common.none') },
            { value: 1000, label: '1000' },
            { value: 2000, label: '2000' },
            { value: 5500, label: '5500' },
            { value: 6000, label: '6000' },
            { value: 9000, label: '9000' },
            { value: 11000, label: '11000' },
            { value: 12000, label: '12000' },
            { value: 18000, label: '18000' },
            { value: 24000, label: '24000' },
            { value: 36000, label: '36000' },
            { value: 48000, label: '48000' },
            { value: 54000, label: '54000' },
          ]}
        />
        <NumberField
          name={`${namePrefix}.beacon-interval`}
          label="beacon-interval"
          definitionKey="radio.beacon-interval"
          isDisabled={isDisabled}
          isRequired
          w={24}
        />
        <CreatableSelectField
          name={`${namePrefix}.hostapd-iface-raw`}
          label="hostapd-iface-raw"
          definitionKey="radio.hostapd-iface-raw"
          isDisabled={isDisabled}
          placeholder={t('configurations.hostapd_warning')}
          emptyIsUndefined
        />
        <SelectField
          name={`${namePrefix}.rates.multicast`}
          label="multicast"
          definitionKey="radio.rates.multicast"
          isDisabled={isDisabled}
          isInt
          emptyIsUndefined
          options={[
            { value: '', label: t('common.none') },
            { value: 1000, label: '1000' },
            { value: 2000, label: '2000' },
            { value: 5500, label: '5500' },
            { value: 6000, label: '6000' },
            { value: 9000, label: '9000' },
            { value: 11000, label: '11000' },
            { value: 12000, label: '12000' },
            { value: 18000, label: '18000' },
            { value: 24000, label: '24000' },
            { value: 36000, label: '36000' },
            { value: 48000, label: '48000' },
            { value: 54000, label: '54000' },
          ]}
        />
        <He namePrefix={namePrefix} isDisabled={isDisabled} />
        <SelectField
          name={`${namePrefix}.require-mode`}
          label="require-mode"
          definitionKey="radio.require-mode"
          isDisabled={isDisabled}
          options={[
            { value: '', label: 'None' },
            { value: 'HT', label: 'HT (A,B,G,N)' },
            { value: 'VHT', label: 'VHT (A,B,G,N,AC)' },
            { value: 'HE', label: 'HE (WiFi 6,A,B,G,N,AC,AX)' },
          ]}
          emptyIsUndefined
        />
      </SimpleGrid>
    </>
  );
};

export default AdvancedSettings;
