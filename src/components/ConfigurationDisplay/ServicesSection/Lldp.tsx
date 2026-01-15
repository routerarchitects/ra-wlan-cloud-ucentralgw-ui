import React from 'react';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { CardHeader } from 'components/Containers/Card/CardHeader';
import { StringField } from 'components/Form/Fields/StringField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const Lldp = ({ editing }) => (
  <Card variant="widget" mb={4}>
    <CardHeader>
      <Heading size="md" borderBottom="1px solid">
        Lldp
      </Heading>
    </CardHeader>
    <CardBody>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <StringField
          name="configuration.lldp.describe"
          label="describe"
          definitionKey="service.lldp.describe"
          isDisabled={!editing}
          isRequired
        />
        <StringField
          name="configuration.lldp.location"
          label="location"
          definitionKey="service.lldp.location"
          isDisabled={!editing}
          isRequired
        />
      </SimpleGrid>
    </CardBody>
  </Card>
);

Lldp.propTypes = propTypes;
export default React.memo(Lldp);
