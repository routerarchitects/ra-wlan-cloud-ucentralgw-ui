import React, { useCallback, useState, useEffect } from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import { Formik } from 'formik';
import isEqual from 'react-fast-compare';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import InternalFormAccess from '../../../common/components/InternalFormAccess';
import SectionGeneralCard from '../../../common/components/SectionGeneralCard';
import Unit from './Unit';
import { UNIT_SCHEMA } from './unitConstants';
import { DeleteButton } from 'components/Buttons/DeleteButton';
import { ConfigurationSection } from '../types';

interface Props {
  editing: boolean;
  setSection: (section: ConfigurationSection) => void;
  sectionInformation: ConfigurationSection;
  removeSub: (sub: string) => void;
}

const UnitSection = ({ editing, setSection, sectionInformation, removeSub }: Props) => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = useState(uuid());
  const sectionRef = useCallback(
    (node: any) => {
      if (node !== null) {
        const invalidValues = [];
        for (const [k, error] of Object.entries(node.errors)) {
          invalidValues.push({ key: `unit.${k}`, error: error as string | object });
        }

        const newSection = {
          data: { configuration: node.values.configuration },
          isDirty: node.dirty,
          invalidValues,
        };

        if (!isEqual(sectionInformation, newSection)) {
          setSection(newSection);
        }
      }
    },
    [sectionInformation, setSection],
  );

  const removeUnit = () => removeSub('unit');

  useEffect(() => {
    if (!editing) {
      setFormKey(uuid());
    }
  }, [editing]);

  return (
    <Formik
      key={formKey}
      innerRef={sectionRef}
      initialValues={{ name: 'Unit', ...(sectionInformation.data ?? UNIT_SCHEMA(t).cast({})) }}
      validationSchema={UNIT_SCHEMA(t)}
    >
      <>
        <InternalFormAccess shouldValidate={sectionInformation?.shouldValidate} />
        <SimpleGrid minChildWidth="400px" spacing={4}>
          <SectionGeneralCard buttons={<DeleteButton onClick={removeUnit} isDisabled={!editing} />} editing={editing} />
          <Unit editing={editing} />
        </SimpleGrid>
      </>
    </Formik>
  );
};

export default React.memo(UnitSection, isEqual);
