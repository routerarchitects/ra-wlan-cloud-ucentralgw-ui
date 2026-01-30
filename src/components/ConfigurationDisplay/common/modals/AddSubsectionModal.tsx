import React from 'react';
import {
  Button,
  Center,
  SimpleGrid,
  useDisclosure,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { SectionDef } from '../types';
import { CreateButton } from 'components/Buttons/CreateButton';
import { Modal } from 'components/Modals/Modal';

interface Props {
  editing: boolean;
  activeSubs: string[];
  addSub: (sub: string) => void;
  sections: SectionDef[];
}

const AddSubsectionModal = ({ editing, activeSubs, addSub, sections }: Props) => {
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
            {sections.map((section) => (
              <Center key={section.key}>
                <Button
                  colorScheme="blue"
                  isDisabled={activeSubs.includes(section.key)}
                  onClick={() => addNewSub(section.key)}
                >
                  {(() => {
                    const label = t(section.tabLabel);
                    return label === section.tabLabel ? section.name : label;
                  })()}
                </Button>
              </Center>
            ))}
          </SimpleGrid>
      </Modal>
    </>
  );
};

export default React.memo(AddSubsectionModal);
