import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import InternalFormAccess from '../../components/InternalFormAccess';
import { ConfigurationSectionShape } from 'constants/propShapes';
import ConfigRaw from './ConfigRaw';
import { SectionComponentProps } from '../../types';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  setSection: PropTypes.func.isRequired,
  sectionInformation: ConfigurationSectionShape.isRequired,
  removeSub: PropTypes.func.isRequired,
};

type ConfigRawOperation = string[];

type ConfigRawFormValues = {
  configurationText: string;
};

const getConfigRawText = (configuration: unknown) => {
  if (typeof configuration === 'string') return configuration;
  if (configuration === undefined) return '[]';

  try {
    return JSON.stringify(configuration, null, 2);
  } catch {
    return '[]';
  }
};

const parseConfigRaw = (configurationText: string): ConfigRawOperation[] | undefined => {
  try {
    const parsed: unknown = JSON.parse(configurationText);
    if (!Array.isArray(parsed)) return undefined;
    return parsed.every((entry) => Array.isArray(entry) && entry.every((value) => typeof value === 'string'))
      ? (parsed as ConfigRawOperation[])
      : undefined;
  } catch {
    return undefined;
  }
};

const ConfigRawSection = ({ editing, setSection, sectionInformation, removeSub }: SectionComponentProps) => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = useState(uuid());

  const initialValues = useMemo(
    (): ConfigRawFormValues => ({
      configurationText: getConfigRawText(sectionInformation.data?.configuration),
    }),
    [sectionInformation.data],
  );

  const sectionRef = useCallback(
    (node: FormikProps<ConfigRawFormValues> | null) => {
      if (node !== null) {
        const invalidValues = [];
        const configurationText = node.values.configurationText ?? '';
        const parsedConfiguration = parseConfigRaw(configurationText);

        if (!parsedConfiguration) {
          invalidValues.push({ key: 'config-raw.configurationText', error: t('form.invalid_config_raw') });
        }

        const newSection = {
          data: {
            configuration: parsedConfiguration ?? sectionInformation.data?.configuration ?? [],
          },
          isDirty: node.dirty,
          invalidValues,
        };

        if (!isEqual(sectionInformation, newSection)) {
          setSection(newSection);
        }
      }
    },
    [sectionInformation, setSection, t],
  );

  const removeSection = () => removeSub('config-raw');

  useEffect(() => {
    if (!editing) {
      setFormKey(uuid());
    }
  }, [editing]);

  return (
    <Formik<ConfigRawFormValues>
      key={formKey}
      innerRef={sectionRef}
      initialValues={initialValues}
      validate={(values: ConfigRawFormValues) => {
        const errors: Record<string, string> = {};
        if (!parseConfigRaw(values.configurationText ?? '')) {
          errors.configurationText = t('form.invalid_config_raw');
        }
        return errors;
      }}
    >
      <>
        <InternalFormAccess shouldValidate={sectionInformation?.shouldValidate} />
        <ConfigRaw editing={editing} onDelete={removeSection} />
      </>
    </Formik>
  );
};

ConfigRawSection.propTypes = propTypes;
export default React.memo(ConfigRawSection, isEqual);
