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

const FacebookWifi = ({ editing }) => (
  <Card variant="widget" mb={4}>
    <CardHeader>
      <Heading size="md" borderBottom="1px solid">
        Facebook WiFi
      </Heading>
    </CardHeader>
    <CardBody>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <StringField
          name="configuration.facebook-wifi.vendor-id"
          label="vendor-id"
          definitionKey="service.facebook-wifi.vendor-id"
          isDisabled={!editing}
          isRequired
        />
        <StringField
          name="configuration.facebook-wifi.gateway-id"
          label="gateway-id"
          definitionKey="service.facebook-wifi.gateway-id"
          isDisabled={!editing}
          isRequired
        />
        <StringField
          name="configuration.facebook-wifi.secret"
          label="secret"
          definitionKey="service.facebook-wifi.secret"
          isDisabled={!editing}
          isRequired
        />
      </SimpleGrid>
    </CardBody>
  </Card>
);

FacebookWifi.propTypes = propTypes;
export default React.memo(FacebookWifi);
