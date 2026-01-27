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
import DhcpSnooping from './DhcpSnooping';
import Health from './Health';
import { getSubSectionDefaults, METRICS_SCHEMA } from './metricsConstants';
import Realtime from './Realtime';
import Statistics from './Statistics';
import Telemetry from './Telemetry';
import WifiFrames from './WifiFrames';
import WifiScan from './WifiScan';
import { DeleteButton } from 'components/Buttons/DeleteButton';
import { ConfigurationSectionShape } from 'constants/propShapes';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  setSection: PropTypes.func.isRequired,
  sectionInformation: ConfigurationSectionShape.isRequired,
  removeSub: PropTypes.func.isRequired,
};

const MetricsSection = ({ editing, setSection, sectionInformation, removeSub }) => {
  const { t } = useTranslation();
  const [formKey, setFormKey] = useState(uuid());

  const sectionRef = useCallback(
    (node) => {
      if (node !== null) {
        const invalidValues = [];
        for (const [k, error] of Object.entries(node.errors)) {
          invalidValues.push({ key: `metrics.${k}`, error });
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

  const removeUnit = () => removeSub('metrics');

  useEffect(() => {
    if (!editing) {
      setFormKey(uuid());
    }
  }, [editing]);

  return (
    <Formik
      key={formKey}
      innerRef={sectionRef}
      initialValues={{ ...sectionInformation.data, name: 'Metrics' }}
      validationSchema={METRICS_SCHEMA(t)}
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
                    subsections={[
                      'dhcp-snooping',
                      'health',
                      'realtime',
                      'statistics',
                      'telemetry',
                      'wifi-frames',
                      'wifi-scan',
                    ]}
                    onSubsectionsChange={(sub) => onSubsectionsChange(sub, setFieldValue)}
                  />
                }
              />
              {isSubSectionActive('dhcp-snooping') && <DhcpSnooping editing={editing} />}
              {isSubSectionActive('health') && <Health editing={editing} />}
              {isSubSectionActive('realtime') && <Realtime editing={editing} />}
              {isSubSectionActive('statistics') && <Statistics editing={editing} />}
              {isSubSectionActive('telemetry') && <Telemetry editing={editing} />}
              {isSubSectionActive('wifi-frames') && <WifiFrames editing={editing} />}
              {isSubSectionActive('wifi-scan') && <WifiScan editing={editing} />}
            </Masonry>
          </Box>
        </>
      )}
    </Formik>
  );
};

MetricsSection.propTypes = propTypes;
export default React.memo(MetricsSection, isEqual);
