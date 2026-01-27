import React from 'react';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { CardHeader } from 'components/Containers/Card/CardHeader';
import { CreatableSelectField } from 'components/Form/Fields/CreatableSelectField';
import { ToggleField } from 'components/Form/Fields/ToggleField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const Ntp = ({ editing }) => (
  <Card variant="widget" mb={4}>
    <CardHeader>
      <Heading size="md" borderBottom="1px solid">
        NTP
      </Heading>
    </CardHeader>
    <CardBody>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <CreatableSelectField
          name="configuration.ntp.servers"
          label="servers"
          definitionKey="service.ntp.servers"
          isDisabled={!editing}
          isRequired
        />
        <ToggleField
          name="configuration.ntp.local-server"
          label="local-server"
          definitionKey="service.ntp.local-server"
          isDisabled={!editing}
          isRequired
        />
      </SimpleGrid>
    </CardBody>
  </Card>
);

Ntp.propTypes = propTypes;
export default React.memo(Ntp);
