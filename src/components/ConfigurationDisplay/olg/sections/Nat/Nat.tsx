/* eslint-disable react/no-array-index-key */
import React, { useCallback, useEffect, useState } from 'react';
import { Box, Center, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { Card } from 'components/Containers/Card';
import { CardBody } from 'components/Containers/Card/CardBody';
import CreateRuleButton from './CreateRuleButton';
import RuleTab from './RuleTab';
import SingleRule from './SingleRule';

const propTypes = {
  editing: PropTypes.bool.isRequired,
  rules: PropTypes.arrayOf(
    PropTypes.shape({
      mode: PropTypes.oneOf(['snat', 'dnat']).isRequired,
      index: PropTypes.number.isRequired,
      rule: PropTypes.shape({
        'rule-id': PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      }).isRequired,
    }),
  ).isRequired,
  onRemoveRule: PropTypes.func.isRequired,
  interfaceNameOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  hasSectionContext: PropTypes.bool,
};

const Nat = ({ editing, rules, onRemoveRule, interfaceNameOptions, hasSectionContext }) => {
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (rules.length === 0) {
      setTabIndex(0);
      return;
    }

    if (tabIndex >= rules.length) {
      setTabIndex(rules.length - 1);
    }
  }, [rules.length, tabIndex]);

  const handleTabsChange = useCallback((index) => {
    setTabIndex(index);
  }, []);

  const handleRemove = useCallback(
    (visibleIndex, mode, index) => {
      onRemoveRule(mode, index);
      setTabIndex(Math.max(0, visibleIndex - 1));
    },
    [onRemoveRule],
  );

  if (rules.length === 0) {
    return (
      <Center>
        <CreateRuleButton editing={editing} setTabIndex={setTabIndex} />
      </Center>
    );
  }

  return (
    <Card variant="widget">
      <CardBody display="block" px={{ base: '2px', md: '12px' }}>
        <Box display="unset" position="unset" w="100%">
          <Tabs index={tabIndex} onChange={handleTabsChange} variant="enclosed" isLazy w="100%">
            <Box overflowX="auto" overflowY="auto" pt={1} h={{ base: '80px', md: '56px' }}>
              <TabList mt={0} flexWrap={{ base: editing ? 'wrap' : 'nowrap', md: 'nowrap' }}>
                {rules.map((entry) => (
                  <RuleTab key={`${entry.mode}-${entry.rule?.['rule-id']}-${entry.index}`} ruleId={entry.rule?.['rule-id']} mode={entry.mode} />
                ))}
                <CreateRuleButton editing={editing} setTabIndex={setTabIndex} />
              </TabList>
            </Box>
            <TabPanels w="100%">
              {rules.map((entry, visibleIndex) => (
                <TabPanel key={`${entry.mode}-${entry.rule?.['rule-id']}-${entry.index}-panel`} p={{ base: 0, md: 4 }}>
                  <SingleRule
                    editing={editing}
                    index={entry.index}
                    mode={entry.mode}
                    interfaceNameOptions={interfaceNameOptions}
                    hasSectionContext={hasSectionContext}
                    remove={() => handleRemove(visibleIndex, entry.mode, entry.index)}
                  />
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>
      </CardBody>
    </Card>
  );
};

Nat.propTypes = propTypes;
Nat.defaultProps = {
  interfaceNameOptions: [],
  hasSectionContext: false,
};

export default React.memo(Nat);
