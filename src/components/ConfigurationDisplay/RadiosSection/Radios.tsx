/* eslint-disable react/no-array-index-key */
import React, { useCallback, useMemo, useState } from 'react';
import { Box, Center, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import RadioPicker from './RadioPicker';
import RadioTab from './RadioTab';
import SingleRadio from './SingleRadio';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  arrayHelpers: PropTypes.shape({
    push: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  }).isRequired,
  radioBands: PropTypes.arrayOf(PropTypes.string).isRequired,
  radioBandsLength: PropTypes.number.isRequired,
};

const Radios = ({ editing, arrayHelpers, radioBands, radioBandsLength }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleRemove = useCallback(
    (index) => () => {
      arrayHelpers.remove(index);
      if (index > 0) setTabIndex(0);
    },
    [arrayHelpers],
  );

  const handleTabsChange = useCallback((index) => {
    setTabIndex(index);
  }, []);

  if (radioBandsLength === 0) {
    return (
      <Center>
        <RadioPicker
          radios={radioBands}
          editing={editing}
          arrayHelpers={arrayHelpers}
          setTabIndex={setTabIndex}
          arrLength={radioBandsLength}
        />
      </Center>
    );
  }

  const tabs = useMemo(
    () =>
      Array(radioBandsLength)
        .fill(1)
        .map((el, i) => <RadioTab key={i} index={i} />),
    [editing, radioBandsLength],
  );
  const panels = useMemo(
    () =>
      Array(radioBandsLength)
        .fill(1)
        .map((el, i) => (
          <TabPanel key={i} px={{base: 1}}>
            <SingleRadio namePrefix={`configuration[${i}]`} index={i} remove={handleRemove(i)} isDisabled={!editing} />
          </TabPanel>
        )),
    [editing, radioBandsLength],
  );

  return (
    <Card variant="widget">
      <CardBody display="block" px={{base: 1, md: 12}}>
        <Box display="unset" position="unset" w="100%">
          <Tabs index={tabIndex} onChange={handleTabsChange} variant="enclosed" isLazy w="100%">
            <Box overflowX="auto" overflowY="auto" pt={1} h="56px">
              <TabList mt={0}>
                {tabs}
                <RadioPicker
                  radios={radioBands}
                  editing={editing}
                  arrayHelpers={arrayHelpers}
                  setTabIndex={setTabIndex}
                  arrLength={radioBandsLength}
                />
              </TabList>
            </Box>
            <TabPanels>{panels}</TabPanels>
          </Tabs>
        </Box>
      </CardBody>
    </Card>
  );
};

Radios.propTypes = propTypes;
export default React.memo(Radios, isEqual);