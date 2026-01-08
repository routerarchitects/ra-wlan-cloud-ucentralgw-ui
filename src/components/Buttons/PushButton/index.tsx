import React from 'react';
import { Button, IconButton, Tooltip, useBreakpoint } from '@chakra-ui/react';
import { PaperPlaneTilt } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

export interface PushButtonProps
  extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  onClick: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  isCompact?: boolean;
  isDirty?: boolean;
  dirtyCheck?: boolean;
  ml?: string | number;
}

const _PushButton: React.FC<PushButtonProps> = ({
  onClick,
  isDisabled,
  isLoading,
  isCompact = true,
  isDirty,
  dirtyCheck,
  ...props
}) => {
  const { t } = useTranslation();
  const breakpoint = useBreakpoint();

  if (!isCompact && breakpoint !== 'base' && breakpoint !== 'sm') {
    return (
      <Button
        colorScheme="teal"
        type="submit"
        onClick={onClick}
        rightIcon={<PaperPlaneTilt size={20} />}
        isLoading={isLoading}
        isDisabled={isDisabled || (dirtyCheck && !isDirty)}
        {...props}
      >
        {t('configurations.push_configuration')}
      </Button>
    );
  }
  return (
    <Tooltip label={t('configurations.push_configuration')}>
      <IconButton
        aria-label="push"
        colorScheme="teal"
        type="submit"
        onClick={onClick}
        icon={<PaperPlaneTilt size={20} />}
        isLoading={isLoading}
        isDisabled={isDisabled || (dirtyCheck && !isDirty)}
        {...props}
      />
    </Tooltip>
  );
};

export const PushButton = React.memo(_PushButton);
