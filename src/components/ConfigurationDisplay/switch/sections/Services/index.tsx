import React, { useCallback, useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import { useTranslation } from 'react-i18next';
import Masonry from 'react-masonry-css';
import { v4 as uuid } from 'uuid';
import InternalFormAccess from '../../../common/components/InternalFormAccess';
import SectionGeneralCard from '../../../common/components/SectionGeneralCard';
import SubSectionPicker from '../../../common/components/SubSectionPicker';
import Http from './Http';
import Https from './Https';
import Lldp from './Lldp';
import { getSubSectionDefaults, SERVICES_SCHEMA } from './servicesConstants';
import Snmp from './Snmp';
import Ssh from './Ssh';
import Telnet from './Telnet';
import { DeleteButton } from 'components/Buttons/DeleteButton';
import { ConfigurationSectionShape } from 'constants/propShapes';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  setSection: PropTypes.func.isRequired,
  sectionInformation: ConfigurationSectionShape.isRequired,
  removeSub: PropTypes.func.isRequired,
};

const ServicesSection = ({ editing, setSection, sectionInformation, removeSub }) => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = useState(uuid());

  const sectionRef = useCallback(
    (node) => {
      if (node !== null) {
        const invalidValues = [];
        for (const [k, error] of Object.entries(node.errors)) {
          invalidValues.push({ key: `services.${k}`, error });
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

  const isSubSectionActive = useCallback(
    (sub) =>
      sectionInformation.data.configuration !== undefined && sectionInformation.data.configuration[sub] !== undefined,
    [sectionInformation.data],
  );

  const onSubsectionsChange = useCallback(
    (newSubsections, setFieldValue) => {
      const alreadyActive = Object.keys(sectionInformation.data.configuration).filter(
        (sub) => sub !== '__selected_subcategories' && sectionInformation.data.configuration[sub] !== undefined,
      );

      const toRemove = alreadyActive.filter((sub) => !newSubsections.includes(sub));
      const toAdd = newSubsections.filter((sub) => !alreadyActive.includes(sub));

      for (let i = 0; i < toRemove.length; i += 1) {
        setFieldValue(`configuration.${toRemove[i]}`, undefined);
      }
      for (let i = 0; i < toAdd.length; i += 1) {
        setFieldValue(`configuration.${toAdd[i]}`, getSubSectionDefaults(t, toAdd[i]));
      }
    },
    [sectionInformation.data],
    isEqual,
  );

  const removeUnit = () => removeSub('services');

  useEffect(() => {
    if (!editing) setFormKey(uuid());
  }, [editing]);

  return (
    <Formik
      key={formKey}
      innerRef={sectionRef}
      initialValues={{ ...sectionInformation.data, name: 'Services' }}
      validationSchema={SERVICES_SCHEMA(t)}
    >
      {({ setFieldValue }) => (
        <>
                    <InternalFormAccess shouldValidate={sectionInformation?.shouldValidate} />
          <Box w="100%" overflowX="auto">
            <Masonry
              breakpointCols={{
                default: 2,
                1100: 1,
              }}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
            <SectionGeneralCard
              editing={editing}
              buttons={<DeleteButton onClick={removeUnit} isDisabled={!editing} />}
              subsectionPicker={
                <SubSectionPicker
                  editing={editing}
                    subsections={['http', 'https', 'lldp', 'snmp', 'ssh', 'telnet']}
                    onSubsectionsChange={(sub) => onSubsectionsChange(sub, setFieldValue)}
                  />
                }
              />
            {isSubSectionActive('http') && <Http editing={editing} />}
            {isSubSectionActive('https') && <Https editing={editing} />}
            {isSubSectionActive('lldp') && <Lldp editing={editing} />}
            {isSubSectionActive('snmp') && <Snmp editing={editing} />}
            {isSubSectionActive('ssh') && <Ssh editing={editing} />}
            {isSubSectionActive('telnet') && <Telnet editing={editing} />}
            </Masonry>
          </Box>
        </>
      )}
    </Formik>
  );
};

ServicesSection.propTypes = propTypes;
export default React.memo(ServicesSection, isEqual);
