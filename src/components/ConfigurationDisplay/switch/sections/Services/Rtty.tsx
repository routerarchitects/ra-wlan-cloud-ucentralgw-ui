import React from 'react';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { CardHeader } from 'components/Containers/Card/CardHeader';
import { NumberField } from 'components/Form/Fields/NumberField';
import { StringField } from 'components/Form/Fields/StringField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const Rtty = ({ editing }) => (
  <Card variant="widget" mb={4}>
    <CardHeader>
      <Heading size="md" borderBottom="1px solid">
        Rtty
      </Heading>
    </CardHeader>
    <CardBody>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <StringField
          name="configuration.rtty.host"
          label="host"
          definitionKey="service.rtty.host"
          isDisabled={!editing}
          isRequired
        />
        <NumberField
          name="configuration.rtty.port"
          label="port"
          definitionKey="service.rtty.port"
          isDisabled={!editing}
          isRequired
          w={24}
        />
        <StringField
          name="configuration.rtty.token"
          label="token"
          definitionKey="service.rtty.token"
          isDisabled={!editing}
          isRequired
        />
      </SimpleGrid>
    </CardBody>
  </Card>
);

Rtty.propTypes = propTypes;
export default React.memo(Rtty);
