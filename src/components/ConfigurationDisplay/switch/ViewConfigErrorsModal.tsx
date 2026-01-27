import React from 'react';
import { IconButton, Tooltip, useDisclosure } from '@chakra-ui/react';
import { CheckCircle, WarningOctagon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { CloseButton } from 'components/Buttons/CloseButton';
import { Modal } from 'components/Modals/Modal';

interface Props {
  errors: Record<string, any[]>;
  activeConfigurations: string[];
  isDisabled?: boolean;
}

const ViewConfigErrorsModal = ({ errors, activeConfigurations, isDisabled = false }: Props) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const normalizeErrors = (items?: any[]) => {
    if (!Array.isArray(items)) return items;
    return items.map((item) => {
      if (item && typeof item === 'object' && 'key' in item && 'error' in item) {
        return { [item.key]: item.error };
      }
      return item;
    });
  };
  const errorAmount =
    (errors.globals?.length ?? 0) +
    (errors.unit?.length ?? 0) +
    (errors.metrics?.length ?? 0) +
    (errors.services?.length ?? 0) +
    (errors.ethernet?.length ?? 0) +
    (errors.radios?.length ?? 0) +
    (errors.interfaces?.length ?? 0) +
    (errors['third-party']?.length ?? 0);

  return (
    <>
      <Tooltip
        label={`${errorAmount} ${errorAmount === 1 ? t('common.error') : t('common.errors')}`}
        hasArrow
        shouldWrapChildren
      >
        <IconButton
          aria-label="Errors"
          colorScheme={errorAmount === 0 ? 'green' : 'red'}
          type="button"
          onClick={onOpen}
          ml={2}
          icon={errorAmount === 0 ? <CheckCircle size={20} /> : <WarningOctagon size={20} />}
          isDisabled={isDisabled || errorAmount === 0}
        />
      </Tooltip>
      <Modal 
          onClose={onClose} 
          isOpen={isOpen} 
          title={`${errorAmount} ${errorAmount === 1 ? t('common.error') : t('common.errors')}`}
          topRightButtons={<CloseButton ml={2} onClick={onClose} />}
      >
        <pre>
          {JSON.stringify(
            {
              globals: activeConfigurations.includes('globals') ? normalizeErrors(errors.globals) : undefined,
              unit: activeConfigurations.includes('unit') ? normalizeErrors(errors.unit) : undefined,
              metrics: activeConfigurations.includes('metrics') ? normalizeErrors(errors.metrics) : undefined,
              services: activeConfigurations.includes('services') ? normalizeErrors(errors.services) : undefined,
              ethernet: activeConfigurations.includes('ethernet') ? normalizeErrors(errors.ethernet) : undefined,
              radios: activeConfigurations.includes('radios') ? normalizeErrors(errors.radios) : undefined,
              interfaces: activeConfigurations.includes('interfaces') ? normalizeErrors(errors.interfaces) : undefined,
              'third-party': activeConfigurations.includes('third-party') ? normalizeErrors(errors['third-party']) : undefined,
            },
            null,
            2,
          )}
        </pre>
      </Modal>
    </>
  );
};

export default React.memo(ViewConfigErrorsModal);
