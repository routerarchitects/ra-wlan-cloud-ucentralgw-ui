import * as React from 'react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Tooltip } from '@chakra-ui/react';
import { Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { ScriptSchema } from '../TableCard/CreateButton';
import RolesInput from '../TableCard/RolesInput';
import ScriptFileInput from '../TableCard/ScripFile';
import ScriptUploadField from '../TableCard/UploadField';
import { NumberField } from 'components/Form/Fields/NumberField';
import { SelectField } from 'components/Form/Fields/SelectField';
import { StringField } from 'components/Form/Fields/StringField';
import { ToggleField } from 'components/Form/Fields/ToggleField';
import { Script } from 'hooks/Network/Scripts';

type Props = {
  script: Script;
  formRef: React.Ref<FormikProps<Script>>;
  isEditing: boolean;
  onSubmit: (
    data: {
      id: string;
      description?: string | undefined;
      name?: string | undefined;
      uri?: string | undefined;
      content?: string | undefined;
      version?: string | undefined;
      deferred?: boolean | undefined;
      timeout?: number | undefined;
    },
    onSuccess: () => void,
    onError: () => void,
  ) => Promise<Script>;
};

const EditScriptForm = ({ script, formRef, isEditing, onSubmit }: Props) => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = React.useState(uuid());

  const isDisabled = !isEditing;

  const goToHelper = () => {
    window.open(script.uri, '_blank')?.focus();
  };

  React.useEffect(() => setFormKey(uuid()), [script, isEditing]);

  return (
    <Formik<Script>
      key={formKey}
      enableReinitialize
      innerRef={formRef as React.Ref<FormikProps<Script>>}
      initialValues={{
        ...script,
        defaultUploadURI: script.defaultUploadURI.length === 0 ? undefined : script.defaultUploadURI,
      }}
      validationSchema={ScriptSchema(t)}
      onSubmit={async (data, { setSubmitting, resetForm }) =>
        onSubmit(
          data,
          () => {
            setSubmitting(false);
            resetForm();
          },
          () => setSubmitting(false),
        )
      }
    >
      {(props: { setFieldValue: (k: string, v: unknown) => void; values: Script }) => (
        <Box w="100%">
          <Flex direction={{ base: 'column', md: 'row' }} flexWrap="wrap">
            <Box w="240px" mr={2}>
              <StringField name="name" label={t('common.name')} isRequired isDisabled={isDisabled} />
            </Box>
            <Box w="100%" maxW="560px" display="flex" flexDir={{ base: 'column', md: 'row' }}>
              <StringField name="description" label={t('common.description')} isDisabled={isDisabled} />
            </Box>
          </Flex>
          <Flex mt={2} direction={{ base: 'column', md: 'row' }} flexWrap="wrap" gap={2}>
            <Box w={{ base: '100%', md: '120px' }}>
              <SelectField
                name="type"
                label={t('common.type')}
                options={[
                  { value: 'shell', label: 'Shell' },
                  { value: 'bundle', label: 'Bundle' },
                ]}
                isRequired
                isDisabled
                w="100%" // full width within parent box
              />
            </Box>
            <Box mx={{ base: 0, md: 2 }} w={{ base: '100%', md: '160px' }}>
              <StringField name="version" label={t('footer.version')} isRequired isDisabled={isDisabled} w="100%" />
            </Box>
            <Box w={{ base: '100%', md: '100%' }} maxW="240px" mr={{ base: 0, md: 2 }}>
              <StringField name="author" label={t('script.author')} isRequired isDisabled w="100%" />
            </Box>
            <Box w="100%" maxW="460px" display="flex" flexDir={{ base: 'column', md: 'row' }}>
              <StringField name="uri" label={t('script.helper')} isDisabled={isDisabled} w="100%" />
              <Box ml={{ base: 0, md: 2 }} mt={{ base: 2, md: 'auto' }}>
                <Tooltip label={t('script.visit_external_website')}>
                  <IconButton
                    aria-label="Go to helper"
                    colorScheme="teal"
                    icon={<ExternalLinkIcon />}
                    onClick={goToHelper}
                    isDisabled={script.uri.length === 0}
                  />
                </Tooltip>
              </Box>
            </Box>
          </Flex>
          <Flex mt={2}>
            <Box w="120px" mr={2} mb={4}>
              <ToggleField
                name="deferred"
                label={t('script.deferred')}
                onChangeCallback={(v) => {
                  if (v) {
                    props.setFieldValue('timeout', undefined);
                  } else {
                    props.setFieldValue('timeout', 30);
                  }
                }}
                isDisabled={isDisabled}
              />
            </Box>
            <Box>
              {!props.values.deferred && (
                <NumberField
                  name="timeout"
                  label={t('script.timeout')}
                  isDisabled={isDisabled}
                  unit="s"
                  isRequired
                  w="100px"
                />
              )}
            </Box>
          </Flex>
          <Box mt={2} maxW="560px">
            <RolesInput name="restricted" label={t('script.restricted')} isDisabled={isDisabled} />
          </Box>
          <Box mt={2}>
            <ScriptUploadField name="defaultUploadURI" isDisabled={isDisabled} largeVersion />
          </Box>
          <Box mt={2}>
            <ScriptFileInput isDisabled={isDisabled} isLargeVersion />
          </Box>
        </Box>
      )}
    </Formik>
  );
};

export default EditScriptForm;
