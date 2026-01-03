import React from 'react';
import { Heading, SimpleGrid, Spacer } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import { CardHeader } from 'components/Containers/Card/CardHeader';
import { NumberField } from 'components/Form/Fields/NumberField';
import { StringField } from 'components/Form/Fields/StringField';

interface Props {
  editing: boolean;
  subsectionPicker?: React.ReactNode;
  buttons?: React.ReactNode;
}

const SectionGeneralCard = ({ editing, subsectionPicker, buttons }: Props) => {
  const { t } = useTranslation();

  return (
    <Card variant="widget" mb={4}>
      <CardHeader display="flex">
        <div>
          <Heading size="md" borderBottom="1px solid" mt={1}>
            {t('common.general_info')}
          </Heading>
        </div>
        <Spacer />
        {buttons}
      </CardHeader>
      <CardBody>
        <SimpleGrid minChildWidth="300px" spacing="20px" mb={8} mt={2} w="100%">
          <StringField name="name" label={t('common.name')} isRequired isDisabled={true} />
          {/* <StringField name="description" label={t('common.description')} isDisabled={!editing} /> */}
          {subsectionPicker}
          {/* <NumberField
            name="weight"
            label={t('configurations.weight')}
            isDisabled={!editing}
            isRequired
            min={0}
            w={24}
          /> */}
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

export default React.memo(SectionGeneralCard);
