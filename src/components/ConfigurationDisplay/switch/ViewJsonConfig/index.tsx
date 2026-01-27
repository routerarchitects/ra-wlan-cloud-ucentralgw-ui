import React from 'react';
import { IconButton, Tooltip, useDisclosure } from '@chakra-ui/react';
import { ArrowsOut } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { CloseButton } from 'components/Buttons/CloseButton';
import { Modal } from 'components/Modals/Modal';

interface Props {
  configurations: {
    globals?: any;
    unit?: any;
    metrics?: any;
    services?: any;
    radios?: any;
    interfaces?: {
      configuration: any[];
    };
    'third-party'?: any;
  };
  activeConfigurations: string[];
  isDisabled?: boolean;
}

const ViewJsonConfigModal = ({ configurations, activeConfigurations, isDisabled }: Props) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const configStringToDisplay = () => {
    try {
      const finalConfig: Record<string, any> = {};
      const configToDisplay = {
        globals: activeConfigurations.includes('globals') ? configurations.globals : undefined,
        unit: activeConfigurations.includes('unit') ? configurations.unit : undefined,
        metrics: activeConfigurations.includes('metrics') ? configurations.metrics : undefined,
        services: activeConfigurations.includes('services') ? configurations.services : undefined,
        radios: activeConfigurations.includes('radios') ? configurations.radios : undefined,
        'third-party': activeConfigurations.includes('third-party') ? configurations['third-party'] : undefined,
      };

      for (const [key, config] of Object.entries(configToDisplay)) {
        if (config) {
          finalConfig[key] = config.configuration;
        }
      }
      
      if (activeConfigurations.includes('interfaces') && configurations.interfaces) {
           finalConfig['interfaces'] = configurations.interfaces.configuration;
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
