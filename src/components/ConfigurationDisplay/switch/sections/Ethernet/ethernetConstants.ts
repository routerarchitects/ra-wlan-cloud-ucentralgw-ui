import { array, bool, number, object, string } from 'yup';

export const ETHERNET_PORT_OPTIONS = Array.from({ length: 41 }, (_, i) => ({
  label: `Eth${i}`,
  value: `Ethernet${i}`,
}));

export const DUPLEX_OPTIONS = [
  { label: 'half', value: 'half' },
  { label: 'full', value: 'full' },
];

export const LLDP_ADMIN_STATUS_OPTIONS = [
  { label: 'receive', value: 'rx' },
  { label: 'transmit', value: 'tx' },
  { label: 'tx-rx', value: 'rx-tx' },
  { label: 'disabled', value: 'disabled' },
];

export const POE_DETECTION_OPTIONS = [
  { label: '4pt-dot3af', value: '4pt-dot3af' },
  { label: '2pt-dot3af', value: '2pt-dot3af' },
  { label: 'dot3bt', value: 'dot3bt' },
];

export const POE_PRIORITY_OPTIONS = [
  { label: 'high', value: 'high' },
  { label: 'low', value: 'low' },
];

export const VOICE_VLAN_MODE_OPTIONS = [
  { label: 'none', value: 'none' },
  { label: 'manual', value: 'manual' },
  { label: 'auto', value: 'auto' },
];

export const VOICE_VLAN_DETECT_OPTIONS = [
  { label: 'oui', value: 'oui' },
  { label: 'lldp', value: 'lldp' },
];

export const DEFAULT_STORM_CONTROL = {
  'broadcast-pps': 500,
  'multicast-pps': 500,
  'unknown-unicast-pps': 500,
};

export const DEFAULT_BPDU_GUARD = {
  enabled: true,
  'auto-recovery-intvl-secs': 300,
};

export const DEFAULT_DHCP_SNOOP_PORT = {
  'dhcp-snoop-port-trust': false,
};

export const DEFAULT_VOICE_VLAN = {
  'voice-vlan-intf-mode': 'auto',
  'voice-vlan-intf-priority': 6,
  'voice-vlan-intf-detect-voice': 'oui',
  'voice-vlan-intf-security': false,
};

export const DEFAULT_POE = {
  'admin-mode': true,
  detection: '4pt-dot3af',
  'power-limit': 30000,
  priority: 'high',
  'do-reset': false,
};

export const DEFAULT_LLDP = {
  'lldp-admin-status': undefined,
  'lldp-basic-tlv-mgmt-ip-v4': false,
  'lldp-basic-tlv-mgmt-ip-v6': false,
  'lldp-basic-tlv-port-descr': false,
  'lldp-basic-tlv-sys-capab': false,
  'lldp-basic-tlv-sys-descr': false,
  'lldp-basic-tlv-sys-name': false,
  'lldp-dot1-tlv-proto-ident': false,
  'lldp-dot1-tlv-proto-vid': false,
  'lldp-dot1-tlv-pvid': false,
  'lldp-dot1-tlv-vlan-name': false,
  'lldp-dot3-tlv-link-agg': false,
  'lldp-dot3-tlv-mac-phy': false,
  'lldp-dot3-tlv-max-frame': false,
  'lldp-dot3-tlv-poe': false,
  'lldp-med-tlv-ext-poe': false,
  'lldp-med-tlv-inventory': false,
  'lldp-med-tlv-location': false,
  'lldp-med-tlv-med-cap': false,
  'lldp-med-tlv-network-policy': false,
  'lldp-notification': false,
  'lldp-med-notification': false,
};

export const ETHERNET_BPDU_GUARD_SCHEMA = (t: (s: string) => string, useDefault = false) => {
  const shape = object().shape({
    enabled: bool().default(false),
    'auto-recovery-intvl-secs': number().required(t('form.required')).moreThan(-1).integer().default(300),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const ETHERNET_DHCP_SNOOP_PORT_SCHEMA = (t: (s: string) => string, useDefault = false) => {
  const shape = object().shape({
    'dhcp-snoop-port-trust': bool().default(false),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const ETHERNET_STORM_CONTROL_SCHEMA = (t: (s: string) => string, useDefault = false) => {
  const shape = object().shape({
    'broadcast-pps': number().required(t('form.required')).moreThan(-1).integer().default(500),
    'multicast-pps': number().required(t('form.required')).moreThan(-1).integer().default(500),
    'unknown-unicast-pps': number().required(t('form.required')).moreThan(-1).integer().default(500),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const ETHERNET_POE_SCHEMA = (t: (s: string) => string, useDefault = false) => {
  const shape = object().shape({
    'admin-mode': bool().default(true),
    detection: string().required(t('form.required')).default('4pt-dot3af'),
    'power-limit': number().required(t('form.required')).moreThan(-1).integer().default(30000),
    priority: string().required(t('form.required')).default('high'),
    'do-reset': bool().default(false),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const ETHERNET_LLDP_SCHEMA = (t: (s: string) => string, useDefault = false) => {
  const shape = object().shape({
    'lldp-admin-status': string()
      .oneOf(LLDP_ADMIN_STATUS_OPTIONS.map((o) => o.value))
      .default(undefined),
    'lldp-basic-tlv-mgmt-ip-v4': bool().default(false),
    'lldp-basic-tlv-mgmt-ip-v6': bool().default(false),
    'lldp-basic-tlv-port-descr': bool().default(false),
    'lldp-basic-tlv-sys-capab': bool().default(false),
    'lldp-basic-tlv-sys-descr': bool().default(false),
    'lldp-basic-tlv-sys-name': bool().default(false),
    'lldp-dot1-tlv-proto-ident': bool().default(false),
    'lldp-dot1-tlv-proto-vid': bool().default(false),
    'lldp-dot1-tlv-pvid': bool().default(false),
    'lldp-dot1-tlv-vlan-name': bool().default(false),
    'lldp-dot3-tlv-link-agg': bool().default(false),
    'lldp-dot3-tlv-mac-phy': bool().default(false),
    'lldp-dot3-tlv-max-frame': bool().default(false),
    'lldp-dot3-tlv-poe': bool().default(false),
    'lldp-med-tlv-ext-poe': bool().default(false),
    'lldp-med-tlv-inventory': bool().default(false),
    'lldp-med-tlv-location': bool().default(false),
    'lldp-med-tlv-med-cap': bool().default(false),
    'lldp-med-tlv-network-policy': bool().default(false),
    'lldp-notification': bool().default(false),
    'lldp-med-notification': bool().default(false),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const ETHERNET_VOICE_VLAN_SCHEMA = (t: (s: string) => string, useDefault = false) => {
  const shape = object().shape({
    'voice-vlan-intf-mode': string().required(t('form.required')).default('auto'),
    'voice-vlan-intf-priority': number().required(t('form.required')).moreThan(-1).lessThan(7).integer().default(6),
    'voice-vlan-intf-detect-voice': string().required(t('form.required')).default('oui'),
    'voice-vlan-intf-security': bool().default(false),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const ETHERNET_ENTRY_SCHEMA = (t: (s: string) => string, useDefault = false) => {
  const shape = object().shape({
    duplex: string().required(t('form.required')).oneOf(DUPLEX_OPTIONS.map((o) => o.value)).default('full'),
    'edge-port': bool().default(false),
    enabled: bool().default(true),
    'lldp-interface-config': ETHERNET_LLDP_SCHEMA(t, useDefault),
    poe: ETHERNET_POE_SCHEMA(t, useDefault),
    'select-ports': array().of(string()).required(t('form.required')).min(1, t('form.required')).default([]),
    speed: number().required(t('form.required')).moreThan(0).integer().default(1000),
    'bpdu-guard': ETHERNET_BPDU_GUARD_SCHEMA(t, useDefault),
    'dhcp-snoop-port': ETHERNET_DHCP_SNOOP_PORT_SCHEMA(t, useDefault),
    'storm-control': ETHERNET_STORM_CONTROL_SCHEMA(t, useDefault),
    'voice-vlan-intf-config': ETHERNET_VOICE_VLAN_SCHEMA(t, useDefault),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const ETHERNET_SCHEMA = (t: (s: string) => string, useDefault = false) =>
  object().shape({
    configuration: array().of(ETHERNET_ENTRY_SCHEMA(t, useDefault)).default([]),
  });

export const getEthernetEntryDefaults = (t: (s: string) => string) => {
  const defaults = ETHERNET_ENTRY_SCHEMA(t, true).cast();
  return {
    ...defaults,
    'edge-port': undefined,
    'bpdu-guard': undefined,
    'dhcp-snoop-port': undefined,
    'lldp-interface-config': undefined,
    poe: undefined,
    'storm-control': undefined,
    'voice-vlan-intf-config': undefined,
  };
};
