import { object, number, string, array, bool } from 'yup';
import { testFqdnHostname, testIpv4, testLength, testUcMac } from '../utils/formTests';

export const SERVICES_FINGERPRINT_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    mode: string().required(t('form.required')).oneOf(['always', 'polled', 'final', 'raw-data']).default('always'),
    minimumAge: number().required(t('form.required')).moreThan(-1).integer().default(60),
    maximumAge: number().required(t('form.required')).moreThan(-1).integer().default(60),
    periodicity: number().required(t('form.required')).moreThan(-1).integer().default(600),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const SERVICES_DHCP_RELAY_VLAN_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    vlan: number().required(t('form.required')).moreThan(-1).lessThan(4097).integer().default(1),
    'relay-server': string().required(t('form.required')).default(''),
    'circuit-id-format': string().required(t('form.required')).default('vlan-id'),
    'remote-id-format': string().required(t('form.required')).default('ap-mac'),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const SERVICES_DHCP_RELAY_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    'select-ports': array().of(string()).min(1, t('form.required')).default([]),
    vlans: array().of(SERVICES_DHCP_RELAY_VLAN_SCHEMA(t, useDefault)).default([]),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const SERVICES_CLASSIFIER_DNS_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    fqdn: string().default(''),
    'suffix-matching': bool().default(true),
    reclassify: bool().default(true),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const SERVICES_CLASSIFIER_PORTS_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    protocol: string().required(t('form.required')).default('any'),
    port: number().required(t('form.required')).positive().lessThan(65536).integer().default(1812),
    'range-end': number().required(t('form.required')).positive().lessThan(65536).integer().default(1813),
    reclassify: bool().default(true),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const SERVICES_INGRESS_FILTER_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    name: string().required(t('form.required')).default(''),
    program: string().required(t('form.required')).default(''),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const SERVICES_USER_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    mac: string()
      .required(t('form.required'))
      .test('services.ieee8021x.user.mac.length', t('form.invalid_mac_uc'), testUcMac)
      .default(''),
    'user-name': string().required(t('form.required')).default(''),
    'vlan-id': number().required(t('form.required')).moreThan(-1).lessThan(65536).integer().default(1),
    password: string()
      .required(t('form.required'))
      .test('services.ieee8021x.user.password.length', t('form.min_max_string', { min: 8, max: 63 }), (val) =>
        testLength({ val, min: 8, max: 63 }),
      )
      .default(''),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const SERVICES_REALMS_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    realm: string().required(t('form.required')).default('*'),
    port: number().required(t('form.required')).moreThan(-1).lessThan(65536).integer().default(22),
    secret: string().required(t('form.required')).default(''),
    'auto-discover': bool().default(false),
    'use-local-certificates': bool().default(false),
    'ca-certificate-filename': string().default(''),
    'ca-certificate': string().required(t('form.required')).default(''),
    'certificate-filename': string().default(''),
    certificate: string().required(t('form.required')).default(''),
    'private-key-filename': string().default(''),
    'private-key': string().required(t('form.required')).default(''),
    'private-key-password': string().required(t('form.required')).default(''),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const SERVICES_LLDP_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    describe: string().required(t('form.required')).default(''),
    location: string().required(t('form.required')).default(''),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const SERVICES_GPS_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    'baud-rate': number().required(t('form.required')).default(2400),
    'adjust-time': bool().required(t('form.required')).default(false),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const SERVICES_SSH_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    port: number().required(t('form.required')).moreThan(-1).lessThan(65536).integer().default(22),
    'password-authentication': bool().default(true),
    'authorized-keys': array()
      .of(string())
      .when('password-authentication', {
        is: false,
        then: array().of(string()).required(t('form.required')).min(1, t('form.required')).default([]),
        otherwise: array().of(string()),
      })
      .default(undefined),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_NTP_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    servers: array().of(string()).required(t('form.required')).min(1, t('form.required')).default([]),
    'local-server': bool().default(false),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_MDNS_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    enable: bool().default(false),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_RTTY_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    host: string()
      .required(t('form.required'))
      .test('rtty.host.value', t('form.invalid_fqdn_host'), testFqdnHostname)
      .default(''),
    port: number().required(t('form.required')).moreThan(-1).lessThan(65536).integer().default(5912),
    token: string()
      .required(t('form.required'))
      .test('rtty.token.length', t('form.min_max_string', { min: 32, max: 32 }), (val) =>
        testLength({ val, min: 32, max: 32 }),
      )
      .default(''),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_LOG_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    host: string().required(t('form.required')).test('log.host.value', t('form.invalid_cidr'), testIpv4).default(''),
    port: number().required(t('form.required')).moreThan(-1).lessThan(65536).integer().default(5912),
    proto: string().required(t('form.required')).default('udp'),
    size: number().required(t('form.required')).moreThan(31).lessThan(65536).integer().default(1000),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_HTTP_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    'http-port': number().required(t('form.required')).moreThan(0).lessThan(65536).integer().default(80),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_IGMP_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    enable: bool().default(false),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_IEEE8021X_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    'use-local-certificate': bool().default(false),
    'ca-certificate-filename': string().default(''),
    'ca-certificate': string().required(t('form.required')).default(''),
    'server-certificate-filename': string().default(''),
    'server-certificate': string().required(t('form.required')).default(''),
    'private-key-filename': string().default(''),
    'private-key': string().required(t('form.required')).default(''),
    users: array()
      .of(SERVICES_USER_SCHEMA(t, useDefault))
      .required(t('form.required'))
      .min(1, t('form.required'))
      .default([]),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_RADIUS_PROXY_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    realms: array().of(SERVICES_REALMS_SCHEMA(t, useDefault)).required(t('form.required')).default([]),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_ONLINE_CHECK_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    'ping-hosts': array().of(string()).required(t('form.required')).min(1, t('form.required')).default([]),
    'download-hosts': array().of(string()).required(t('form.required')).min(1, t('form.required')).default([]),
    'check-interval': number().required(t('form.required')).moreThan(-1).lessThan(65536).integer().default(60),
    'check-threshold': number().required(t('form.required')).moreThan(-1).lessThan(65536).integer().default(1),
    action: array().of(string()).required(t('form.required')).min(1, t('form.required')).default([]),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_OPEN_FLOW_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    controller: string()
      .required(t('form.required'))
      .test('open-flow.cidr.value', t('form.invalid_cidr'), testIpv4)
      .default(''),
    mode: string().required(t('form.required')).default('ssl'),
    'ca-certificate-filename': string().default(''),
    'ca-certificate': string().required(t('form.required')).default(''),
    'ssl-certificate-filename': string().default(''),
    'ssl-certificate': string().required(t('form.required')).default(''),
    'private-key-filename': string().default(''),
    'private-key': string().required(t('form.required')).default(''),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_DATA_PLANE_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    'ingress-filters': array()
      .of(SERVICES_INGRESS_FILTER_SCHEMA(t, useDefault))
      .required(t('form.required'))
      .min(1, t('form.required'))
      .default([]),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_WIFI_STEERING_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    mode: string().required(t('form.required')).default('local'),
    'assoc-steering': bool().default(false),
    'auto-channel': bool().default(false),
    'required-snr': number().required(t('form.required')).integer().default(0),
    'required-probe-snr': number().required(t('form.required')).integer().default(0),
    'required-roam-snr': number().required(t('form.required')).integer().default(0),
    'load-kick-threshold': number().required(t('form.required')).integer().default(0),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_QUALITY_OF_SERVICE_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    'select-ports': array().of(string()).default(['WAN*']),
    'bandwidth-up': number().required(t('form.required')).moreThan(-1).integer().default(0),
    'bandwidth-down': number().required(t('form.required')).moreThan(-1).integer().default(0),
    'bulk-detection': object()
      .shape({
        dscp: string().required(t('form.required')).default('CS0'),
        'packets-per-second': number().required(t('form.required')).moreThan(-1).integer().default(0),
      })
      .notRequired()
      .default(undefined),
    classifier: array()
      .of(
        object().shape({
          ports: SERVICES_CLASSIFIER_PORTS_SCHEMA(t, useDefault),
          dns: SERVICES_CLASSIFIER_DNS_SCHEMA(t, useDefault),
        }),
      )
      .default([]),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_FACEBOOK_WIFI_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    'vendor-id': string().required(t('form.required')).default(''),
    'gateway-id': string().required(t('form.required')).default(''),
    secret: string().required(t('form.required')).default(''),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};
export const SERVICES_AIRTIME_POLICIES_SCHEMA = (t, useDefault = false) => {
  const shape = object().shape({
    'dns-match': array().of(string()).required(t('form.required')).min(1, t('form.required')).default([]),
    'dns-weight': number().required(t('form.required')).moreThan(-1).lessThan(65536).integer().default(256),
  });

  return useDefault ? shape : shape.nullable().default(undefined);
};

export const SERVICES_SCHEMA = (t, useDefault = false) =>
  object().shape({
    name: string().required(t('form.required')).default('Services'),
    description: string().default(''),
    weight: number().required(t('form.required')).moreThan(-1).integer().default(1),
    configuration: object().shape({
      lldp: SERVICES_LLDP_SCHEMA(t, useDefault),
      ssh: SERVICES_SSH_SCHEMA(t, useDefault),
      ntp: SERVICES_NTP_SCHEMA(t, useDefault),
      http: SERVICES_HTTP_SCHEMA(t, useDefault),
      mdns: SERVICES_MDNS_SCHEMA(t, useDefault),
      rtty: SERVICES_RTTY_SCHEMA(t, useDefault),
      log: SERVICES_LOG_SCHEMA(t, useDefault),
      igmp: SERVICES_IGMP_SCHEMA(t, useDefault),
      'online-check': SERVICES_ONLINE_CHECK_SCHEMA(t, useDefault),
      'open-flow': SERVICES_OPEN_FLOW_SCHEMA(t, useDefault),
      'wifi-steering': SERVICES_WIFI_STEERING_SCHEMA(t, useDefault),
      'quality-of-service': SERVICES_QUALITY_OF_SERVICE_SCHEMA(t, useDefault),
      'facebook-wifi': SERVICES_FACEBOOK_WIFI_SCHEMA(t, useDefault),
      'airtime-policies': SERVICES_AIRTIME_POLICIES_SCHEMA(t, useDefault),
      'data-plane': SERVICES_DATA_PLANE_SCHEMA(t, useDefault),
      'radius-proxy': SERVICES_RADIUS_PROXY_SCHEMA(t, useDefault),
      ieee8021x: SERVICES_IEEE8021X_SCHEMA(t, useDefault),
      gps: SERVICES_GPS_SCHEMA(t, useDefault),
      'dhcp-relay': SERVICES_DHCP_RELAY_SCHEMA(t, useDefault),
      fingerprint: SERVICES_FINGERPRINT_SCHEMA(t, useDefault),
    }),
  });

export const getSubSectionDefaults = (t, sub) => {
  switch (sub) {
    case 'lldp':
      return SERVICES_LLDP_SCHEMA(t, true).cast();
    case 'ssh':
      return SERVICES_SSH_SCHEMA(t, true).cast();
    case 'ntp':
      return SERVICES_NTP_SCHEMA(t, true).cast();
    case 'mdns':
      return SERVICES_MDNS_SCHEMA(t, true).cast();
    case 'rtty':
      return SERVICES_RTTY_SCHEMA(t, true).cast();
    case 'log':
      return SERVICES_LOG_SCHEMA(t, true).cast();
    case 'http':
      return SERVICES_HTTP_SCHEMA(t, true).cast();
    case 'igmp':
      return SERVICES_IGMP_SCHEMA(t, true).cast();
    case 'online-check':
      return SERVICES_ONLINE_CHECK_SCHEMA(t, true).cast();
    case 'open-flow':
      return SERVICES_OPEN_FLOW_SCHEMA(t, true).cast();
    case 'wifi-steering':
      return SERVICES_WIFI_STEERING_SCHEMA(t, true).cast();
    case 'quality-of-service':
      return SERVICES_QUALITY_OF_SERVICE_SCHEMA(t, true).cast();
    case 'facebook-wifi':
      return SERVICES_FACEBOOK_WIFI_SCHEMA(t, true).cast();
    case 'airtime-policies':
      return SERVICES_AIRTIME_POLICIES_SCHEMA(t, true).cast();
    case 'data-plane':
      return SERVICES_DATA_PLANE_SCHEMA(t, true).cast();
    case 'ieee8021x':
      return SERVICES_IEEE8021X_SCHEMA(t, true).cast();
    case 'radius-proxy':
      return SERVICES_RADIUS_PROXY_SCHEMA(t, true).cast();
    case 'gps':
      return SERVICES_GPS_SCHEMA(t, true).cast();
    case 'dhcp-relay':
      return SERVICES_DHCP_RELAY_SCHEMA(t, true).cast();
    case 'fingerprint':
      return SERVICES_FINGERPRINT_SCHEMA(t, true).cast();
    default:
      return null;
  }
};
