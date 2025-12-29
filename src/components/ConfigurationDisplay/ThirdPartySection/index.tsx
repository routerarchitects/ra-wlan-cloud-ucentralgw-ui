import React, { useCallback, useState, useEffect } from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import InternalFormAccess from '../common/InternalFormAccess';
import SectionGeneralCard from '../common/SectionGeneralCard';
import ThirdParty from './ThirdParty';
import { THIRD_PARTY_SCHEMA } from './thirdPartyConstants';
import { DeleteButton } from 'components/Buttons/DeleteButton';
import { ConfigurationSectionShape } from 'components/ConfigurationDisplay/constants/propShapes';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  setSection: PropTypes.func.isRequired,
  sectionInformation: ConfigurationSectionShape.isRequired,
  removeSub: PropTypes.func.isRequired,
};

const ThirdPartySection = ({ editing, setSection, sectionInformation, removeSub }) => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = useState(uuid());
  const sectionRef = useCallback(
    (node) => {
      if (node !== null) {
        const invalidValues = [];
        for (const [k, error] of Object.entries(node.errors)) {
          invalidValues.push({ key: `third-party.${k}`, error });
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

  const removeUnit = () => removeSub('third-party');

  useEffect(() => {
    if (!editing) {
      setFormKey(uuid());
    }
  }, [editing]);

  return (
    <Formik
      key={formKey}
      innerRef={sectionRef}
      initialValues={{ ...sectionInformation.data, name: 'Third Party' }}
      validationSchema={THIRD_PARTY_SCHEMA(t)}
    >
      <>
        <InternalFormAccess shouldValidate={sectionInformation?.shouldValidate} />
        <SimpleGrid spacing={4}>
          <SectionGeneralCard buttons={<DeleteButton onClick={removeUnit} isDisabled={!editing} />} editing={editing} />
          <ThirdParty editing={editing} />
        </SimpleGrid>
      </>
    </Formik>
  );
};

ThirdPartySection.propTypes = propTypes;
export default React.memo(ThirdPartySection, isEqual);
