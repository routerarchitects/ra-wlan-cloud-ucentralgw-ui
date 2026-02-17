import React from 'react';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { CardHeader } from 'components/Containers/Card/CardHeader';
import { SelectField } from 'components/Form/Fields/SelectField';
import { ToggleField } from 'components/Form/Fields/ToggleField';

type Props = {
  editing: boolean;
};

const Gps = ({ editing }: Props) => (
  <Card variant="widget" mb={4}>
    <CardHeader>
      <Heading size="md" borderBottom="1px solid">
        Gps
      </Heading>
    </CardHeader>
    <CardBody>
      <SimpleGrid minChildWidth="100px" spacing="20px" mb={2} mt={2} w="100%">
        <SelectField
          name="configuration.gps.baud-rate"
          label="baud-rate"
          definitionKey="service.gps.baud-rate"
          options={[
            { value: '2400', label: '2400' },
            { value: '4800', label: '4800' },
            { value: '9600', label: '9600' },
            { value: '19200', label: '19200' },
          ]}
          isInt
          isDisabled={!editing}
          isRequired
          w="100px"
        />
        <ToggleField
          name="configuration.gps.adjust-time"
          label="adjust-time"
          definitionKey="service.gps.adjust-time"
          isDisabled={!editing}
          isRequired
        />
      </SimpleGrid>
    </CardBody>
  </Card>
);

export default React.memo(Gps);
