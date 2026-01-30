import React from 'react';
import { IconButton, Tooltip, useDisclosure } from '@chakra-ui/react';
import { ArrowsOut } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { CloseButton } from 'components/Buttons/CloseButton';
import { Modal } from 'components/Modals/Modal';

interface Props {
  configurations: Record<string, any>;
  activeConfigurations: string[];
  isDisabled?: boolean;
}

const ViewJsonConfigModal = ({ configurations, activeConfigurations, isDisabled }: Props) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const configStringToDisplay = () => {
    try {
      const finalConfig: Record<string, any> = {};
      for (const key of activeConfigurations) {
        const config = configurations[key];
        if (config && config.configuration !== undefined) {
          finalConfig[key] = config.configuration;
        }
      }

      return JSON.stringify(finalConfig, null, 2);
    } catch (e) {
      return null;
    }
  };

  return (
    <>
      <Tooltip label={t('common.view_json')}>
        <IconButton
          aria-label="Show JSON Configuration"
          colorScheme="gray"
          type="button"
          onClick={onOpen}
          icon={<ArrowsOut size={20} />}
          isDisabled={isDisabled}
          ml={2}
        />
      </Tooltip>
      <Modal 
          onClose={onClose} 
          isOpen={isOpen} 
          title={t('configurations.configuration_json')}
      >
        <pre>{configStringToDisplay()}</pre>
      </Modal>
    </>
  );
};

export default React.memo(ViewJsonConfigModal);
