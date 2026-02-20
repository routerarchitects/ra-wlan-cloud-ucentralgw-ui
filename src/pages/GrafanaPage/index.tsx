import * as React from 'react';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { Card } from 'components/Containers/Card';

const GrafanaPage = () => {
  // @ts-ignore runtime env is injected by container entrypoint for public client config
  const grafanaBaseUrl = window?._env_?.REACT_APP_GRAFANA_URL ?? '';
  // @ts-ignore runtime env is injected by container entrypoint for public client config
  const grafanaCadvisorPath = window?._env_?.REACT_APP_GRAFANA_DASHBOARD_CADVISOR ?? '';
  // @ts-ignore runtime env is injected by container entrypoint for public client config
  const grafanaKafkaPath = window?._env_?.REACT_APP_GRAFANA_DASHBOARD_KAFKA ?? '';
  // @ts-ignore runtime env is injected by container entrypoint for public client config
  const grafanaNodePath = window?._env_?.REACT_APP_GRAFANA_DASHBOARD_NODE ?? '';
  // @ts-ignore runtime env is injected by container entrypoint for public client config
  const grafanaPostgresPath = window?._env_?.REACT_APP_GRAFANA_DASHBOARD_POSTGRES ?? '';

  const resolveGrafanaUrl = React.useCallback(
    (path: string) => {
      if (!path) return '';
      if (path.startsWith('http://') || path.startsWith('https://')) return path;
      if (!grafanaBaseUrl) return '';
      const normalizedBase = grafanaBaseUrl.endsWith('/') ? grafanaBaseUrl.slice(0, -1) : grafanaBaseUrl;
      const normalizedPath = path.startsWith('/') ? path : `/${path}`;
      return `${normalizedBase}${normalizedPath}`;
    },
    [grafanaBaseUrl],
  );

  const dashboards = React.useMemo(
    () =>
      [
        { name: 'Cadvisor Exporter', url: resolveGrafanaUrl(grafanaCadvisorPath) },
        { name: 'Kafka Exporter Overview', url: resolveGrafanaUrl(grafanaKafkaPath) },
        { name: 'Node Exporter Full', url: resolveGrafanaUrl(grafanaNodePath) },
        { name: 'PostgreSQL Database', url: resolveGrafanaUrl(grafanaPostgresPath) },
      ].filter((dashboard) => dashboard.url !== ''),
    [resolveGrafanaUrl, grafanaCadvisorPath, grafanaKafkaPath, grafanaNodePath, grafanaPostgresPath],
  );

  if (dashboards.length === 0) {
    return (
      <Card p={4}>
        <Text fontSize="sm" color="gray.500">
          Set `REACT_APP_GRAFANA_DASHBOARD_*` environment variables to embed Grafana dashboards here.
        </Text>
      </Card>
    );
  }

  return (
    <Card p={4}>
      <Tabs variant="enclosed">
        <TabList>
          {dashboards.map((dashboard) => (
            <Tab key={dashboard.name}>{dashboard.name}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {dashboards.map((dashboard) => (
            <TabPanel key={dashboard.name} px={0}>
              <Box border="1px solid" borderColor="gray.200" borderRadius="8px" overflow="hidden">
                <iframe
                  title={dashboard.name}
                  src={`${dashboard.url}${dashboard.url.includes('?') ? '&' : '?'}kiosk`}
                  style={{ width: '100%', height: '760px', border: '0' }}
                />
              </Box>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Card>
  );
};

export default GrafanaPage;
