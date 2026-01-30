import React from 'react';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { CardHeader } from 'components/Containers/Card/CardHeader';
import { ToggleField } from 'components/Form/Fields/ToggleField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const Https = ({ editing }) => (
  <Card variant="widget" mb={4}>
    <CardHeader>
      <Heading size="md" borderBottom="1px solid">
        https
      </Heading>
    </CardHeader>
    <CardBody>
      <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
        <ToggleField
          name="configuration.https.enable"
          label="enable"
          definitionKey="service.https.enable"
          isDisabled={!editing}
        />
      </SimpleGrid>
    </CardBody>
  </Card>
);

Https.propTypes = propTypes;
export default React.memo(Https);
