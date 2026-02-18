import React from 'react';
import { Tab } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const propTypes = {
  ruleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  mode: PropTypes.oneOf(['snat', 'dnat']).isRequired,
};

const RuleTab = ({ ruleId, mode }) => <Tab>{`Rule ${ruleId} (${mode.toUpperCase()})`}</Tab>;

RuleTab.propTypes = propTypes;

export default React.memo(RuleTab);
