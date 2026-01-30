import React from 'react';
import {
  Alert,
  AlertIcon,
  Box,
  Heading,
  IconButton,
  Text,
  Textarea,
  Tooltip,
  useBoolean,
  useDisclosure,
} from '@chakra-ui/react';
import { Flask } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { SaveButton } from 'components/Buttons/SaveButton';
import { Modal } from 'components/Modals/Modal';
import { uppercaseFirstLetter } from 'helpers/stringHelper';

// @ts-ignore
const transformComputedConfigToEditable = (
  config: Record<string, unknown>,
  defaultConfiguration: Record<
    string,
    {
      name: string;
      description: string;
      weight: number;
      configuration: object;
    }
  >,
  configurationSections: string[],
) => {
  const configurations = [];

  try {
    for (const [section, value] of Object.entries(config)) {
      if (configurationSections.includes(section)) {
        const configuration = {
          name: uppercaseFirstLetter(section),
          description: defaultConfiguration[section]?.description ?? '',
          weight: defaultConfiguration[section]?.weight ?? 1,
          configuration: {} as Record<string, unknown>,
        };
        configuration.configuration[section] = value;
        configurations.push(configuration);
      }
    }

    return JSON.stringify(configurations, null, 4);
  } catch {
    return '';
  }
};

type Props = {
  activeConfigurations: string[];
  defaultConfiguration: Record<
    string,
    {
      name: string;
      description: string;
      weight: number;
      configuration: object;
    }
  >;
  currentConfiguration: Record<string, unknown>;
  setConfig: (newConfig: object) => void;
  isDisabled: boolean;
  configurationSections: string[];
};

const ExpertModeButton = ({
  activeConfigurations,
  defaultConfiguration,
  currentConfiguration,
  setConfig,
  isDisabled,
  configurationSections,
}: Props) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, { on, off }] = useBoolean();
  const [tempValue, setTempValue] = React.useState('');

  const saveValue = () => {
    try {
      const final = JSON.parse(
        transformComputedConfigToEditable(JSON.parse(tempValue), defaultConfiguration, configurationSections),
      );

      if (final) {
        const newVal = final.map((conf: { configuration: object }) => ({
          ...conf,
          configuration: JSON.stringify(conf.configuration),
        }));
        setConfig(newVal);
        onClose();
      }
    } catch (e) {
      on();
    }
  };

  const onTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTempValue(e.target.value);
    try {
      const json = JSON.parse(e.target.value);
      const res = transformComputedConfigToEditable(json, defaultConfiguration, configurationSections);
      if (res) off();
      else on();
    } catch {
      on();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      // Use currentConfiguration instead of defaultConfiguration to show actual values
      setTempValue(JSON.stringify(currentConfiguration, null, 4));
    }
  }, [isOpen, currentConfiguration]);

  return (
    <>
      <Tooltip label={t('configurations.expert_name')}>
        <IconButton
          ml={2}
          aria-label={t('configurations.expert_name')}
          colorScheme="purple"
          onClick={onOpen}
          icon={<Flask size={20} />}
          isDisabled={isDisabled}
        />
      </Tooltip>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={t('configurations.expert_name')}
        topRightButtons={<SaveButton onClick={saveValue} isDisabled={tempValue.length === 0 || error} />}
      >
        <Box>
          <Alert my={2} colorScheme="red">
            <AlertIcon />
            <Text ml={2}>{t('configurations.import_warning')}</Text>
          </Alert>
          <Heading size="sm">{t('configurations.expert_name_explanation')}</Heading>
          <Textarea h="512px" value={tempValue} onChange={onTextAreaChange} mt={2} />
        </Box>
      </Modal>
    </>
  );
};

export default ExpertModeButton;
