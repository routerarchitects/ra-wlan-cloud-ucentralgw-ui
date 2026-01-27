import React from 'react';
import { Heading, Select, SimpleGrid, Text } from '@chakra-ui/react';
import { SelectField } from 'components/Form/Fields/SelectField';
import { StringField } from 'components/Form/Fields/StringField';
import { ToggleField } from 'components/Form/Fields/ToggleField';

interface Props {
  editing: boolean;
  namePrefix: string;
  state: 'on' | 'off' | 'custom';
  onSelect: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const RoamingForm = ({ editing, namePrefix, state, onSelect }: Props) => (
  <>
    <Heading size="md" display="flex" mt={4}>
      <Text mr={2} my="auto">
        Roaming
      </Text>
      <Select
        onChange={onSelect}
        borderRadius="15px"
        w="unset"
        _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
        isDisabled={!editing}
        value={state}
        my="auto"
      >
        <option value="on">Auto</option>
        <option value="custom">Custom</option>
        <option value="off">Off</option>
      </Select>
    </Heading>
    {state === 'custom' && (
      <SimpleGrid minChildWidth="300px" spacing="20px">
        <SelectField
          name={`${namePrefix}.message-exchange`}
          label="message-exchange"
          definitionKey="interface.ssid.roaming.message-exchange"
          isDisabled={!editing}
          options={[
            {
              label: 'air',
              value: 'air',
            },
            {
              label: 'ds',
              value: 'ds',
            },
          ]}
          isRequired
        />
        <ToggleField
          name={`${namePrefix}.generate-psk`}
          label="generate-psk"
          definitionKey="interface.ssid.roaming.generate-psk"
          isDisabled={!editing}
          isRequired
        />
        <StringField
          name={`${namePrefix}.domain-identifier`}
          label="domain-identifier"
          definitionKey="interface.ssid.roaming.domain-identifier"
          isDisabled={!editing}
          emptyIsUndefined
        />
        <StringField
          name={`${namePrefix}.pmk-r0-key-holder`}
          label="pmk-r0-key-holder"
          definitionKey="interface.ssid.roaming.pmk-r0-key-holder"
          isDisabled={!editing}
          emptyIsUndefined
        />
        <StringField
          name={`${namePrefix}.pmk-r1-key-holder`}
          label="pmk-r1-key-holder"
          definitionKey="interface.ssid.roaming.pmk-r1-key-holder"
          isDisabled={!editing}
          emptyIsUndefined
        />
      </SimpleGrid>
    )}
  </>
);

export default React.memo(RoamingForm);
