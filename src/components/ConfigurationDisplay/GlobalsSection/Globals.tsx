import React from 'react';
import { Heading, SimpleGrid } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { CardHeader } from 'components/Containers/Card/CardHeader';
import { StringField } from 'components/Form/Fields/StringField';

interface Props {
  editing: boolean;
}

const Globals = ({ editing }: Props) => {
  const { t } = useTranslation();

  return (
    <Card variant="widget">
      <CardHeader>
        <Heading size="md" borderBottom="1px solid">
          {t('configurations.globals')}
        </Heading>
      </CardHeader>
      <CardBody>
        <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
          <StringField
            name="configuration.ipv4-network"
            label="ipv4-network"
            definitionKey="globals.ipv4-network"
            isDisabled={!editing}
            isRequired
          />
          <StringField
            name="configuration.ipv6-network"
            label="ipv6-network"
            definitionKey="globals.ipv6-network"
            isDisabled={!editing}
            isRequired
          />
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

export default React.memo(Globals);
