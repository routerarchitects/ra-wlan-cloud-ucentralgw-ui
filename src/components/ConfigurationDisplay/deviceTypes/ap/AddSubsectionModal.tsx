import React from 'react';
import {
  Button,
  Center,
  SimpleGrid,
  useDisclosure,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { CreateButton } from 'components/Buttons/CreateButton';
import { Modal } from 'components/Modals/Modal';

interface Props {
  editing: boolean;
  activeSubs: string[];
  addSub: (sub: string) => void;
}

const AddSubsectionModal = ({ editing, activeSubs, addSub }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();

  const addNewSub = (sub: string) => {
    addSub(sub);
    onClose();
  };

  return (
    <>
      <CreateButton
        label={t('configurations.add_subsection')}
        onClick={onOpen}
        isDisabled={!editing}
        ml={2}
        isCompact
      />
      <Modal 
          onClose={onClose} 
          isOpen={isOpen} 
          title={t('configurations.add_subsection')}
      >
          <SimpleGrid minChildWidth="200px" spacing={4}>
            <Center>
              <Button
                colorScheme="blue"
                isDisabled={activeSubs.includes('globals')}
                onClick={() => addNewSub('globals')}
              >
                {t('configurations.globals')}
              </Button>
            </Center>
            <Center>
              <Button colorScheme="blue" isDisabled={activeSubs.includes('unit')} onClick={() => addNewSub('unit')}>
                {t('configurations.unit')}
              </Button>
            </Center>
            <Center>
              <Button
                colorScheme="blue"
                isDisabled={activeSubs.includes('metrics')}
                onClick={() => addNewSub('metrics')}
              >
                {t('configurations.metrics')}
              </Button>
            </Center>
            <Center>
              <Button
                colorScheme="blue"
                isDisabled={activeSubs.includes('services')}
                onClick={() => addNewSub('services')}
              >
                {t('configurations.services')}
              </Button>
            </Center>
            <Center>
              <Button
                colorScheme="blue"
                isDisabled={activeSubs.includes('radios')}
                onClick={() => addNewSub('radios')}
              >
                {t('configurations.radios')}
              </Button>
            </Center>
            <Center>
              <Button
                colorScheme="blue"
                isDisabled={activeSubs.includes('interfaces')}
                onClick={() => addNewSub('interfaces')}
              >
                {t('configurations.interfaces')}
              </Button>
            </Center>
            <Center>
              <Button
                colorScheme="blue"
                isDisabled={activeSubs.includes('third-party')}
                onClick={() => addNewSub('third-party')}
              >
                {t('configurations.third_party')}
              </Button>
            </Center>
          </SimpleGrid>
      </Modal>
    </>
  );
};

export default React.memo(AddSubsectionModal);
