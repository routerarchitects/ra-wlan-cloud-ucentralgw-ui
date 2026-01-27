/* eslint-disable react/no-array-index-key */
import React, { useCallback, useState } from 'react';
import { Box, Center, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import CreateInterfaceButton from './CreateInterfaceButton';
import InterfaceTab from './InterfaceTab';
import SingleInterface from './SingleInterface';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  arrayHelpers: PropTypes.shape({
    push: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
  }).isRequired,
  interfacesLength: PropTypes.number.isRequired,
};

const Interfaces = ({ editing, arrayHelpers, interfacesLength }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleRemove = (index) => {
    arrayHelpers.remove(index);
    if (index > 0) setTabIndex(0);
  };

  const handleTabsChange = useCallback((index) => {
    setTabIndex(index);
  }, []);

  if (interfacesLength === 0) {
    return (
      <Center>
        <CreateInterfaceButton
          editing={editing}
          arrayHelpers={arrayHelpers}
          setTabIndex={setTabIndex}
          arrLength={interfacesLength}
        />
      </Center>
    );
  }
  return (
    <Card variant="widget">
      <CardBody display="block" px={{base: '2px', md: '12px'}}>
        <Box display="unset" position="unset" w="100%">
          <Tabs index={tabIndex} onChange={handleTabsChange} variant="enclosed" isLazy w="100%">
            <Box overflowX="auto" overflowY="auto" pt={1} h={{base: "80px", md: "56px"}}>
              <TabList mt={0} flexWrap={{base: editing ? 'wrap' : 'nowrap', md: 'nowrap'}}>
                {Array(interfacesLength)
                  .fill(1)
                  .map((el, i) => (
                    <InterfaceTab key={i} index={i} />
                  ))}
                <CreateInterfaceButton
                  editing={editing}
                  arrayHelpers={arrayHelpers}
                  setTabIndex={setTabIndex}
                  arrLength={interfacesLength}
                />
              </TabList>
            </Box>
            <TabPanels w="100%">
              {Array(interfacesLength)
                .fill(1)
                .map((el, i) => (
                  <TabPanel key={i} p={{base: 0, md: 4}}>
                    <SingleInterface index={i} remove={handleRemove} editing={editing} />
                  </TabPanel>
                ))}
            </TabPanels>
          </Tabs>
        </Box>
      </CardBody>
    </Card>
  );
};

Interfaces.propTypes = propTypes;
export default React.memo(Interfaces);