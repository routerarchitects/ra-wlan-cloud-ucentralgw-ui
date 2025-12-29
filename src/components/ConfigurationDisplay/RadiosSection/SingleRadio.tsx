import React from 'react';
import { Flex, Heading, SimpleGrid, Spacer } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import AdvancedSettings from './AdvancedSettings';
import ChannelPicker from './ChannelPicker';
// import LockedRadio from './LockedRadio'; // Temporarily disabled - requires owprov-ui page components
import { SINGLE_RADIO_SCHEMA } from './radiosConstants';
import Rates from './Rates';
import { DeleteButton } from 'components/Buttons/DeleteButton';
import ConfigurationResourcePicker from 'components/CustomFields/ConfigurationResourcePicker';
import { NumberField } from 'components/Form/Fields/NumberField';
import { SelectField } from 'components/Form/Fields/SelectField';
import { ToggleField } from 'components/Form/Fields/ToggleField';
import COUNTRY_LIST from 'constants/countryList';
import { useFastField } from 'hooks/useFastField';

type Props = {
  namePrefix: string;
  remove?: () => void;
  isDisabled?: boolean;
  canEditBand?: boolean;
};

const SingleRadio = ({ isDisabled, namePrefix, remove, canEditBand }: Props) => {
  const { t } = useTranslation();
  const { value } = useFastField({ name: namePrefix });

  return (
    <>
      <Flex>
        <Heading mt={2} mr={2} size="md" textDecor="underline">
          General
        </Heading>
        {remove !== undefined && (
          <ConfigurationResourcePicker
            name={namePrefix}
            prefix="radio"
            isDisabled={isDisabled ?? false}
            defaultValue={SINGLE_RADIO_SCHEMA}
          />
        )}
        <Spacer />
        {remove !== undefined && (
          <DeleteButton isDisabled={isDisabled} onClick={() => remove()} label={t('configurations.delete_radio')} />
        )}
      </Flex>
      {value !== undefined && value.__variableBlock === undefined ? (
        <>
          <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
            <SelectField
              name={`${namePrefix}.band`}
              label="band"
              definitionKey="radio.band"
              isDisabled={!canEditBand || isDisabled}
              isRequired
              options={[
                { value: '2G', label: '2G' },
                { value: '5G', label: '5G' },
                { value: '5G-lower', label: '5G-lower' },
                { value: '5G-upper', label: '5G-upper' },
                { value: '6G', label: '6G' },
              ]}
            />
            <SelectField
              name={`${namePrefix}.bandwidth`}
              label="bandwidth"
              definitionKey="radio.bandwidth"
              isDisabled={isDisabled}
              isInt
              isRequired
              options={[
                { value: 5, label: '5' },
                { value: 10, label: '10' },
                { value: 20, label: '20' },
              ]}
            />
            <SelectField
              name={`${namePrefix}.country`}
              label="country"
              definitionKey="radio.country"
              isDisabled={isDisabled}
              isRequired
              options={COUNTRY_LIST}
            />
            <SelectField
              name={`${namePrefix}.channel-mode`}
              label="channel-mode"
              definitionKey="radio.channel-mode"
              isDisabled={isDisabled}
              isRequired
              options={[
                { value: 'HT', label: 'HT (A,B,G,N)' },
                { value: 'VHT', label: 'VHT (A,B,G,N,AC)' },
                { value: 'HE', label: 'HE (WiFi 6,A,B,G,N,AC,AX)' },
              ]}
            />
            <SelectField
              name={`${namePrefix}.channel-width`}
              label="channel-width"
              definitionKey="radio.channel-width"
              isRequired
              isDisabled={isDisabled}
              isInt
              options={[
                { value: 20, label: '20 MHz' },
                { value: 40, label: '40 MHz' },
                { value: 80, label: '80 MHz' },
                { value: 160, label: '160 MHz' },
              ]}
            />
            <ChannelPicker namePrefix={namePrefix} isDisabled={isDisabled} />
            <SelectField
              name={`${namePrefix}.mimo`}
              label="mimo"
              definitionKey="radio.mimo"
              isDisabled={isDisabled}
              options={[
                { value: '', label: 'None' },
                { value: '1x1', label: '1x1' },
                { value: '2x2', label: '2x2' },
                { value: '3x3', label: '3x3' },
                { value: '4x4', label: '4x4' },
                { value: '5x5', label: '5x5' },
                { value: '6x6', label: '6x6' },
                { value: '7x7', label: '7x7' },
                { value: '8x8', label: '8x8' },
              ]}
              emptyIsUndefined
            />
            <NumberField
              name={`${namePrefix}.tx-power`}
              label="tx-power"
              definitionKey="radio.tx-power"
              isDisabled={isDisabled}
              isRequired
              w={24}
            />
            <ToggleField
              name={`${namePrefix}.legacy-rates`}
              label="legacy-rates"
              definitionKey="radio.legacy-rates"
              isDisabled={isDisabled}
              falseIsUndefined
            />
            <NumberField
              name={`${namePrefix}.maximum-clients`}
              label="maximum-clients"
              definitionKey="radio.maximum-clients"
              isDisabled={isDisabled}
              acceptEmptyValue
              w={24}
            />
            <ToggleField
              name={`${namePrefix}.he.multiple-bssid`}
              label="multiple-bssid"
              definitionKey="radio.he.multiple-bssid"
              isDisabled={isDisabled}
              falseIsUndefined
            />
            <Rates namePrefix={namePrefix} />
          </SimpleGrid>
          <AdvancedSettings namePrefix={namePrefix} isDisabled={isDisabled} />
        </>
      ) : (
        <div style={{ padding: '20px', background: '#FFF3CD', borderRadius: '8px', margin: '10px 0' }}>
          <p style={{ margin: 0, color: '#856404' }}>
            <strong>Variable Block Radio Configuration</strong><br/>
            This radio uses a variable block configuration (ID: {String(value?.__variableBlock?.[0] || 'unknown')}).<br/>
            Advanced editing interface temporarily unavailable.
          </p>
        </div>
        // <LockedRadio variableBlockId={value?.__variableBlock?.[0]} /> // Temporarily disabled
      )}
    </>
  );
};

export default React.memo(SingleRadio);
