import React from 'react';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { CardHeader } from 'components/Containers/Card/CardHeader';
import MultiSelectField from 'components/Form/Fields/MultiSelectField';
import { NumberField } from 'components/Form/Fields/NumberField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const Statistics = ({ editing }) => {
  const { t } = useTranslation();

  return (
    <Card variant="widget" mb={4}>
      <CardHeader>
        <Heading size="md" borderBottom="1px solid">
          {t('configurations.statistics')}
        </Heading>
      </CardHeader>
      <CardBody>
        <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
          <NumberField
            name="configuration.statistics.interval"
            label="interval"
            definitionKey="metrics.statistics.interval"
            isDisabled={!editing}
            isRequired
            w={24}
          />
          <MultiSelectField
            name="configuration.statistics.types"
            label="types"
            definitionKey="metrics.statistics.types"
            options={[
              { value: 'lldp', label: 'lldp' },
              { value: 'clients', label: 'clients' },
            ]}
            isRequired
            isDisabled={!editing}
          />
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

Statistics.propTypes = propTypes;
export default React.memo(Statistics);
