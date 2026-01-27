/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import { Box, Flex, Heading, IconButton, Tooltip } from '@chakra-ui/react';
import { Plus } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { ClassifierField } from './ClassifierField';
import { useFastField } from 'hooks/useFastField';

const Classifiers = ({ editing }: { editing: boolean }) => {
  const { t } = useTranslation();
  const { value, onChange } = useFastField({
    name: 'configuration.quality-of-service.classifier',
  });

  const length = value?.length ?? 0;

  const onAdd = () => {
    if (length === 0) {
      onChange([{ dscp: 'CS0', ports: [], dns: [] }]);
    } else {
      onChange([...value, { dscp: 'CS0', ports: [], dns: [] }]);
    }
  };

  const onRemove = (index: number) => () => {
    onChange(value.filter((_: unknown, i: number) => i !== index));
  };

  return (
    <Box>
      <Flex>
        <Heading size="sm" mt={1.5} mr={2}>
          Classifiers
        </Heading>
        <Tooltip label={t('crud.add')}>
          <IconButton
            aria-label={t('crud.add')}
            onClick={onAdd}
            icon={<Plus size={20} />}
            size="sm"
            colorScheme="blue"
            isDisabled={!editing}
          />
        </Tooltip>
      </Flex>
      {value?.map((_: unknown, index: number) => (
        <ClassifierField index={index} editing={editing} key={index} onRemove={onRemove(index)} />
      ))}
    </Box>
  );
};

export default Classifiers;
