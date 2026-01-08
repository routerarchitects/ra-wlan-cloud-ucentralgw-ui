import React from 'react';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import { EVENT_TYPES_OPTIONS } from './metricsConstants';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { CardHeader } from 'components/Containers/Card/CardHeader';
import MultiSelectField from 'components/Form/Fields/MultiSelectField';
import { NumberField } from 'components/Form/Fields/NumberField';

type Props = {
  editing: boolean;
};

const Telemetry = ({ editing }: Props) => (
  <Card variant="widget" mb={4}>
    <CardHeader>
      <Heading size="md" borderBottom="1px solid">
        Telemetry
      </Heading>
    </CardHeader>
    <CardBody>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <NumberField
          name="configuration.telemetry.interval"
          label="interval"
          definitionKey="metrics.telemetry.interval"
          unit="s"
          isDisabled={!editing}
          isRequired
          w={24}
        />
        <MultiSelectField
          name="configuration.telemetry.types"
          label="types"
          definitionKey="metrics.telemetry.types"
          options={EVENT_TYPES_OPTIONS}
          isDisabled={!editing}
        />
      </SimpleGrid>
    </CardBody>
  </Card>
);

export default React.memo(Telemetry);
