import React from 'react';
import { Heading, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import { StringField } from 'components/Form/Fields/StringField';
import { ToggleField } from 'components/Form/Fields/ToggleField';

interface Props {
  editing: boolean;
  namePrefix: string;
  isEnabled: boolean;
  onToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RrmForm = (
  {
    editing,
    namePrefix,
    isEnabled,
    onToggle
  }: Props
) => (<>
  <Heading size="md" display="flex" mt={4}>
    <Text mr={2}>RRM</Text>
    <Switch
      onChange={onToggle}
      isChecked={isEnabled}
      borderRadius="15px"
      size="lg"
      isDisabled={!editing}
      _disabled={{ opacity: 0.8, cursor: 'not-allowed' }}
    />
  </Heading>
  {isEnabled && (
    <SimpleGrid minChildWidth="300px" spacing="20px">
      <ToggleField
        name={`${namePrefix}.neighbor-reporting`}
        label="neighbor-reporting"
        definitionKey="interface.ssid.rrm.neighbor-reporting"
        isDisabled={!editing}
      />
      <StringField
        name={`${namePrefix}.lci`}
        label="lci"
        definitionKey="interface.ssid.rrm.lci"
        isDisabled={!editing}
        emptyIsUndefined
      />
      <StringField
        name={`${namePrefix}.civic-location`}
        label="civic-location"
        definitionKey="interface.ssid.rrm.civic-location"
        isDisabled={!editing}
        emptyIsUndefined
      />
      <ToggleField
        name={`${namePrefix}.ftm-responder`}
        label="ftm-responder"
        definitionKey="interface.ssid.rrm.ftm-responder"
        isDisabled={!editing}
      />
      <ToggleField
        name={`${namePrefix}.stationary-ap`}
        label="stationary-ap"
        definitionKey="interface.ssid.rrm.stationary-ap"
        isDisabled={!editing}
      />
    </SimpleGrid>
  )}
</>);

export default React.memo(RrmForm);
