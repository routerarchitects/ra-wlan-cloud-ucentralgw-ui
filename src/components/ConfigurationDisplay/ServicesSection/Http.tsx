import React from 'react';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { CardHeader } from 'components/Containers/Card/CardHeader';
import { NumberField } from 'components/Form/Fields/NumberField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const Http = ({ editing }) => (
  <Card variant="widget" mb={4}>
    <CardHeader>
      <Heading size="md" borderBottom="1px solid">
        Http
      </Heading>
    </CardHeader>
    <CardBody>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <NumberField
          name="configuration.http.http-port"
          label="http-port"
          definitionKey="service.http.http-port"
          isDisabled={!editing}
          isRequired
          w={24}
        />
      </SimpleGrid>
    </CardBody>
  </Card>
);

Http.propTypes = propTypes;
export default React.memo(Http);
