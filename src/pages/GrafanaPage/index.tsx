import * as React from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Link,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Card } from 'components/Containers/Card';
import { useTranslation } from 'react-i18next';

const EMBED_TIMEOUT_MS = 8000;
type DashboardStatus = 'loading' | 'loaded' | 'failed';
const ERROR_SIGNATURES = ['an error occurred.', 'bad gateway', 'temporarily unavailable', 'nginx'];

const isGrafanaDocument = (iframe: HTMLIFrameElement) => {
  try {
    const doc = iframe.contentDocument;
    if (!doc) return false;

    const title = doc.title.toLowerCase();
    const baseHref = doc.querySelector('base')?.getAttribute('href') ?? '';

    return baseHref.startsWith('/grafana/') || title.includes('grafana');
  } catch {
    return false;
  }
};

const isEmbedErrorDocument = (iframe: HTMLIFrameElement) => {
  try {
    const doc = iframe.contentDocument;
    if (!doc) return false;

    const pageText = doc.body?.innerText?.toLowerCase() ?? '';
    const title = doc.title.toLowerCase();

    return ERROR_SIGNATURES.some((signature) => pageText.includes(signature) || title.includes(signature));
  } catch {
    return false;
  }
};

const GrafanaPage = () => {
  const { t } = useTranslation();
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
        { id: 'cadvisor', name: 'Cadvisor Exporter', url: resolveGrafanaUrl(grafanaCadvisorPath) },
        { id: 'kafka', name: 'Kafka Exporter Overview', url: resolveGrafanaUrl(grafanaKafkaPath) },
        { id: 'node', name: 'Node Exporter Full', url: resolveGrafanaUrl(grafanaNodePath) },
        { id: 'postgres', name: 'PostgreSQL Database', url: resolveGrafanaUrl(grafanaPostgresPath) },
      ].filter((dashboard) => dashboard.url !== ''),
    [resolveGrafanaUrl, grafanaCadvisorPath, grafanaKafkaPath, grafanaNodePath, grafanaPostgresPath],
  );

  const timeoutRefs = React.useRef<Record<string, number>>({});
  const [dashboardStatus, setDashboardStatus] = React.useState<Record<string, DashboardStatus>>({});
  const [reloadCount, setReloadCount] = React.useState<Record<string, number>>({});

  const clearDashboardTimeout = React.useCallback((dashboardId: string) => {
    const timeoutId = timeoutRefs.current[dashboardId];
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      delete timeoutRefs.current[dashboardId];
    }
  }, []);

  const markDashboardFailed = React.useCallback(
    (dashboardId: string) => {
      clearDashboardTimeout(dashboardId);
      setDashboardStatus((prev) => ({ ...prev, [dashboardId]: 'failed' }));
    },
    [clearDashboardTimeout],
  );

  const startDashboardLoad = React.useCallback(
    (dashboardId: string) => {
      clearDashboardTimeout(dashboardId);
      setDashboardStatus((prev) => ({ ...prev, [dashboardId]: 'loading' }));
      timeoutRefs.current[dashboardId] = window.setTimeout(() => {
        setDashboardStatus((prev) =>
          prev[dashboardId] === 'loaded' ? prev : { ...prev, [dashboardId]: 'failed' },
        );
      }, EMBED_TIMEOUT_MS);
    },
    [clearDashboardTimeout],
  );

  React.useEffect(() => {
    dashboards.forEach((dashboard) => startDashboardLoad(dashboard.id));

    return () => {
      Object.keys(timeoutRefs.current).forEach((dashboardId) => clearDashboardTimeout(dashboardId));
    };
  }, [clearDashboardTimeout, dashboards, startDashboardLoad]);

  const onDashboardLoad = React.useCallback(
    (dashboardId: string, iframe: HTMLIFrameElement) => {
      if (isGrafanaDocument(iframe)) {
        clearDashboardTimeout(dashboardId);
        setDashboardStatus((prev) => ({ ...prev, [dashboardId]: 'loaded' }));
        return;
      }

      if (isEmbedErrorDocument(iframe)) {
        markDashboardFailed(dashboardId);
      }
    },
    [clearDashboardTimeout, markDashboardFailed],
  );

  const onDashboardRetry = React.useCallback(
    (dashboardId: string) => {
      setReloadCount((prev) => ({ ...prev, [dashboardId]: (prev[dashboardId] ?? 0) + 1 }));
      startDashboardLoad(dashboardId);
    },
    [startDashboardLoad],
  );

  if (dashboards.length === 0) {
    return (
      <Card p={4}>
        <Text fontSize="sm" color="gray.500">
          {t('grafana.missing_dashboards')}
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
              <Box border="1px solid" borderColor="gray.200" borderRadius="8px" overflow="hidden" position="relative">
                {dashboardStatus[dashboard.id] === 'failed' ? (
                  <Alert status="warning" variant="left-accent" alignItems="flex-start" borderRadius="8px" minH="220px">
                    <AlertIcon mt={1} />
                    <Box>
                      <AlertTitle>{t('grafana.embed_failed_title')}</AlertTitle>
                      <AlertDescription mt={2}>
                        {t('grafana.embed_failed_description', { dashboard: dashboard.name })}
                      </AlertDescription>
                      <Box mt={4} display="flex" gap={3} flexWrap="wrap">
                        <Button as="a" href={dashboard.url} target="_blank" rel="noreferrer" colorScheme="blue">
                          {t('grafana.open_in_new_tab')}
                        </Button>
                        <Button variant="outline" onClick={() => onDashboardRetry(dashboard.id)}>
                          {t('grafana.retry_embed')}
                        </Button>
                      </Box>
                    </Box>
                  </Alert>
                ) : (
                  <>
                    <iframe
                      key={`${dashboard.id}-${reloadCount[dashboard.id] ?? 0}`}
                      title={dashboard.name}
                      src={`${dashboard.url}${dashboard.url.includes('?') ? '&' : '?'}kiosk`}
                      style={{ width: '100%', height: '760px', border: '0' }}
                      onLoad={(event) => onDashboardLoad(dashboard.id, event.currentTarget)}
                      onError={() => markDashboardFailed(dashboard.id)}
                    />
                    {dashboardStatus[dashboard.id] !== 'loaded' ? (
                      <Box
                        position="absolute"
                        inset={0}
                        bg="white"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        px={6}
                      >
                        <VStack spacing={3}>
                          <Spinner />
                          <Text fontSize="sm" color="gray.600">
                            {t('grafana.loading_dashboard')}
                          </Text>
                          <Link href={dashboard.url} isExternal color="blue.500" fontWeight="medium">
                            {t('grafana.open_in_new_tab')}
                          </Link>
                        </VStack>
                      </Box>
                    ) : null}
                  </>
                )}
              </Box>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Card>
  );
};

export default GrafanaPage;
