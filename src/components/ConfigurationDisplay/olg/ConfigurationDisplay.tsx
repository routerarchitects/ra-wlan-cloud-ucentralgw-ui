import React from 'react';
import GlobalsSection from '../ap/sections/Globals';
import { GLOBALS_SCHEMA } from '../ap/sections/Globals/globalsConstants';
import UnitSection from '../ap/sections/Unit';
import { UNIT_SCHEMA } from '../ap/sections/Unit/unitConstants';
import MetricsSection from '../ap/sections/Metrics';
import { METRICS_SCHEMA } from '../ap/sections/Metrics/metricsConstants';
import ServicesSection from '../ap/sections/Services';
import { SERVICES_SCHEMA } from '../ap/sections/Services/servicesConstants';
import RadiosSection from '../ap/sections/Radios';
import { RADIOS_SCHEMA } from '../ap/sections/Radios/radiosConstants';
import InterfaceSection from '../ap/sections/Interfaces';
import { INTERFACES_SCHEMA } from '../ap/sections/Interfaces/interfacesConstants';
import NatSection from './sections/Nat';
import { NAT_SCHEMA } from './sections/Nat/natConstants';
import ThirdPartySection from '../ap/sections/ThirdParty';
import { THIRD_PARTY_SCHEMA } from '../ap/sections/ThirdParty/thirdPartyConstants';
import ConfigurationDisplayBase from '../common/ConfigurationDisplayBase';
import { ConfigurationDisplayProps, SectionDef } from '../common/types';

const sections: SectionDef[] = [
  { key: 'globals', tabLabel: 'configurations.globals', name: 'Globals', schema: GLOBALS_SCHEMA, Component: GlobalsSection },
  { key: 'unit', tabLabel: 'configurations.unit', name: 'Unit', schema: UNIT_SCHEMA, Component: UnitSection },
  { key: 'metrics', tabLabel: 'configurations.metrics', name: 'Metrics', schema: METRICS_SCHEMA, Component: MetricsSection },
  { key: 'services', tabLabel: 'configurations.services', name: 'Services', schema: SERVICES_SCHEMA, Component: ServicesSection },
  { key: 'radios', tabLabel: 'configurations.radios', name: 'Radios', schema: RADIOS_SCHEMA, Component: RadiosSection },
  { key: 'interfaces', tabLabel: 'configurations.interfaces', name: 'Interfaces', schema: INTERFACES_SCHEMA, Component: InterfaceSection },
  { key: 'nat', tabLabel: 'configurations.nat', name: 'Nat', schema: NAT_SCHEMA, Component: NatSection },
  { key: 'third-party', tabLabel: 'configurations.third_party', name: 'Third Party', schema: THIRD_PARTY_SCHEMA, Component: ThirdPartySection },
];

const ConfigurationDisplay = (props: ConfigurationDisplayProps) => (
  <ConfigurationDisplayBase {...props} sections={sections} />
);

export default React.memo(ConfigurationDisplay);
