import React from 'react';
import GlobalsSection from './sections/Globals';
import { GLOBALS_SCHEMA } from './sections/Globals/globalsConstants';
import UnitSection from './sections/Units';
import { UNIT_SCHEMA } from './sections/Units/unitConstants';
import MetricsSection from './sections/Metrics';
import { METRICS_SCHEMA } from './sections/Metrics/metricsConstants';
import ServicesSection from './sections/Services';
import { SERVICES_SCHEMA } from './sections/Services/servicesConstants';
import EthernetSection from './sections/Ethernet';
import { ETHERNET_SCHEMA } from './sections/Ethernet/ethernetConstants';
import InterfaceSection from './sections/Interfaces';
import { INTERFACES_SCHEMA } from './sections/Interfaces/interfacesConstants';
import ThirdPartySection from './sections/ThirdParty';
import { THIRD_PARTY_SCHEMA } from './sections/ThirdParty/thirdPartyConstants';
import ConfigurationDisplayBase from '../common/ConfigurationDisplayBase';
import { ConfigurationDisplayProps, SectionDef } from '../common/types';

const sections: SectionDef[] = [
  { key: 'globals', tabLabel: 'configurations.globals', name: 'Globals', schema: GLOBALS_SCHEMA, Component: GlobalsSection },
  { key: 'unit', tabLabel: 'configurations.unit', name: 'Unit', schema: UNIT_SCHEMA, Component: UnitSection },
  { key: 'metrics', tabLabel: 'configurations.metrics', name: 'Metrics', schema: METRICS_SCHEMA, Component: MetricsSection },
  { key: 'services', tabLabel: 'configurations.services', name: 'Services', schema: SERVICES_SCHEMA, Component: ServicesSection },
  { key: 'ethernet', tabLabel: 'configurations.ethernet', name: 'Ethernet', schema: ETHERNET_SCHEMA, Component: EthernetSection },
  { key: 'interfaces', tabLabel: 'configurations.interfaces', name: 'Interfaces', schema: INTERFACES_SCHEMA, Component: InterfaceSection },
  { key: 'third-party', tabLabel: 'configurations.third_party', name: 'Third Party', schema: THIRD_PARTY_SCHEMA, Component: ThirdPartySection },
];

const ConfigurationDisplay = (props: ConfigurationDisplayProps) => (
  <ConfigurationDisplayBase {...props} sections={sections} />
);

export default React.memo(ConfigurationDisplay);
