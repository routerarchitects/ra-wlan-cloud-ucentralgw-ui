import React, { useCallback, useState, useEffect } from 'react';
import { Flex, Spacer, VStack } from '@chakra-ui/react';
import { FieldArray, Formik } from 'formik';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import InternalFormAccess from '../../../common/components/InternalFormAccess';
import SectionGeneralCard from '../../../common/components/SectionGeneralCard';
import Radios from './Radios';
import { RADIOS_SCHEMA } from './radiosConstants';
import { DeleteButton } from 'components/Buttons/DeleteButton';
import { ConfigurationSectionShape } from 'constants/propShapes';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  setSection: PropTypes.func.isRequired,
  sectionInformation: ConfigurationSectionShape.isRequired,
  removeSub: PropTypes.func.isRequired,
};

const RadiosSection = ({ editing, setSection, sectionInformation, removeSub }) => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = useState(uuid());
  const initialConfiguration = Array.isArray(sectionInformation.data?.configuration)
    ? sectionInformation.data.configuration
    : sectionInformation.data?.configuration?.configuration ?? [];
  const sectionRef = useCallback(
    (node) => {
      if (node !== null) {
        const invalidValues = [];
        for (const [k, error] of Object.entries(node.errors)) {
          invalidValues.push({ key: `radios.${k}`, error });
        }

        const newSection = {
          data: node.values,
          isDirty: node.dirty,
          invalidValues,
        };

        if (!isEqual(sectionInformation, newSection)) {
          setSection(newSection);
        }
      }
    },
    [sectionInformation],
  );

  const removeUnit = () => removeSub('radios');

  useEffect(() => {
    if (!editing) {
      setFormKey(uuid());
    }
  }, [editing]);

  return (
    <>
      <Flex>
        <Spacer />
      </Flex>
      <Formik
        key={formKey}
        innerRef={sectionRef}
        initialValues={{ ...sectionInformation.data, configuration: initialConfiguration, name: 'Radios' }}
        validationSchema={RADIOS_SCHEMA(t)}
      >
        {({ values }) => (
          <>
            <InternalFormAccess shouldValidate={sectionInformation?.shouldValidate} />
            <VStack spacing={4}>
              <SectionGeneralCard
                editing={editing}
                buttons={<DeleteButton onClick={removeUnit} isDisabled={!editing} />}
              />
              <FieldArray name="configuration">
                {(arrayHelpers) => (
                  <Radios
                    editing={editing}
                    arrayHelpers={arrayHelpers}
                    radioBands={values.configuration.map((radio) => radio.band)}
                    radioBandsLength={values.configuration.length}
                  />
                )}
              </FieldArray>
            </VStack>
          </>
        )}
      </Formik>
    </>
  );
};

RadiosSection.propTypes = propTypes;
export default React.memo(RadiosSection, isEqual);
