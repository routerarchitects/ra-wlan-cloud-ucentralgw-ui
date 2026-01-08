import React from 'react';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { CardHeader } from 'components/Containers/Card/CardHeader';
import MultiSelectField from 'components/Form/Fields/MultiSelectField';

const propTypes = {
  editing: PropTypes.bool.isRequired,
};

const WifiFrames = ({ editing }) => {
  const { t } = useTranslation();

  return (
    <Card variant="widget" mb={4}>
      <CardHeader>
        <Heading size="md" borderBottom="1px solid">
          {t('configurations.wifi_frames')}
        </Heading>
      </CardHeader>
      <CardBody>
        <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
          <MultiSelectField
            name="configuration.wifi-frames.filters"
            label="filters"
            definitionKey="metrics.wifi-frames.filters"
            hasVirtualAll
            canSelectAll
            options={[
              { value: 'probe', label: 'probe' },
              { value: 'auth', label: 'auth' },
              { value: 'assoc', label: 'assoc' },
              { value: 'disassoc', label: 'disassoc' },
              { value: 'deauth', label: 'deauth' },
              { value: 'local-deauth', label: 'local-deauth' },
              { value: 'inactive-deauth', label: 'inactive-deauth' },
              { value: 'key-mismatch', label: 'key-mismatch' },
              { value: 'beacon-report', label: 'beacon-report' },
              { value: 'radar-detected', label: 'radar-detected' },
            ]}
            isRequired
            isDisabled={!editing}
          />
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

WifiFrames.propTypes = propTypes;
export default React.memo(WifiFrames);
