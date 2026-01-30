import React from 'react';
import { Heading, SimpleGrid, Switch, Text } from '@chakra-ui/react';
import { NumberField } from 'components/Form/Fields/NumberField';

interface Props {
  editing: boolean;
  namePrefix: string;
  isEnabled: boolean;
  onToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RateLimitForm = (
  {
    editing,
    namePrefix,
    isEnabled,
    onToggle
  }: Props
) => (<>
  <Heading size="md" display="flex">
    <Text mr={2}>Rate Limit</Text>
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
      <NumberField
        name={`${namePrefix}.ingress-rate`}
        label="ingress-rate"
        definitionKey="interface.ssid.rate-limit.ingress-rate"
        isDisabled={!editing}
        unit="MB/s"
        isRequired
      />
      <NumberField
        name={`${namePrefix}.egress-rate`}
        label="egress-rate"
        definitionKey="interface.ssid.rate-limit.egress-rate"
        isDisabled={!editing}
        unit="MB/s"
        isRequired
      />
    </SimpleGrid>
  )}
</>);

export default React.memo(RateLimitForm);
