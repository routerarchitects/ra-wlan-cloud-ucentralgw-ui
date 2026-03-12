import React from 'react';
import { ChatIcon } from '@chakra-ui/icons';
import { IconButton, useBoolean, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useLocation } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import SidebarDevices from './Devices';
import { Navbar } from './Navbar';
import { PageContainer } from './PageContainer';
import { Sidebar } from './Sidebar';
import lightLogo from 'assets/mango-cloud.png';
import AiAssistantPanel from 'components/AiAssistantPanel';
import LanguageSwitcher from 'components/LanguageSwitcher';
import { useUiFeatureFlags } from 'hooks/useUiFeatureFlags';
import { RouteName } from 'models/Routes';
import NotFoundPage from 'pages/NotFound';
import routes from 'router/routes';

const Layout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isSidebarOpen, { toggle: toggleSidebar }] = useBoolean(false);
  const aiAssistantDisclosure = useDisclosure();
  const { aiAssistantEnabled, grafanaEnabled } = useUiFeatureFlags();
  document.documentElement.dir = 'ltr';

  const visibleRoutes = React.useMemo(
    () =>
      routes
        .map((route) => {
          if (!route.children) return route;
          if (route.id !== 'system-group') return route;

          return {
            ...route,
            children: route.children.filter((child) => (child.id === 'system-grafana' ? grafanaEnabled : true)),
          };
        })
        .filter((route) => (!route.children ? true : route.children.length > 0)),
    [grafanaEnabled],
  );

  React.useEffect(() => {
    if (!aiAssistantEnabled) aiAssistantDisclosure.onClose();
  }, [aiAssistantEnabled, aiAssistantDisclosure]);

  const activeRoute = React.useMemo(() => {
    let name: RouteName = '';
    for (const route of visibleRoutes) {
      if (!route.children && route.path === location.pathname) {
        name = route.navName ?? route.name;
        break;
      }
      if (route.path?.includes('/:')) {
        const routePath = route.path.split('/:')[0];
        const currPath = location.pathname.split('/');
        if (routePath && location.pathname.startsWith(routePath) && currPath.length === 3) {
          name = route.navName ?? route.name;
          break;
        }
      }
      if (route.children) {
        for (const child of route.children) {
          if (child.path === location.pathname) {
            name = child.navName ?? child.name;
            break;
          }
        }
      }
    }

    if (typeof name === 'function') return name(t);

    if (name.includes('PATH')) {
      name = location.pathname.split('/')[location.pathname.split('/').length - 1] ?? '';
    }

    if (name.includes('RAW-')) name.replace('RAW-', '');

    return t(name);
  }, [t, location.pathname, visibleRoutes]);

  const routeInstances = React.useMemo(() => {
    const instances = [];

    for (const route of visibleRoutes) {
      // @ts-ignore
      if (!route.children) instances.push(<Route path={route.path} element={<route.component />} key={route.id} />);
      else {
        for (const child of route.children) {
          // @ts-ignore
          instances.push(<Route path={child.path} element={<child.component />} key={child.id} />);
        }
      }
    }

    return instances;
  }, [visibleRoutes]);

  return (
    <>
      <Sidebar
        routes={visibleRoutes}
        isOpen={isSidebarOpen}
        toggle={toggleSidebar}
        version={__APP_VERSION__}
        logo={
          <img
            src={lightLogo}
            alt="MangoCloud"
            width="180px"
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        }
      >
        <SidebarDevices />
      </Sidebar>
      <Navbar
        toggleSidebar={toggleSidebar}
        languageSwitcher={<LanguageSwitcher />}
        activeRoute={activeRoute}
        rightElements={aiAssistantEnabled ? (
          <IconButton
            mr={2}
            variant="solid"
            aria-label="Open AI assistant"
            icon={<ChatIcon />}
            onClick={aiAssistantDisclosure.onOpen}
            color="white"
            bgGradient="linear(to-br, #00C2FF, #FF4ECD)"
            borderRadius="14px"
            boxShadow="0 0 0 1px rgba(255,255,255,0.14), 0 6px 16px rgba(255, 78, 205, 0.22)"
            _hover={{
              transform: 'translateY(-1px) scale(1.015)',
              bgGradient: 'linear(to-br, #20D6FF, #FF74DC)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.2), 0 7px 18px rgba(255, 78, 205, 0.28)',
            }}
            _active={{
              transform: 'scale(0.985)',
            }}
            sx={{
              animation: 'aiAgentFloat 3.6s ease-in-out infinite',
              '@keyframes aiAgentFloat': {
                '0%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-1px)' },
                '100%': { transform: 'translateY(0px)' },
              },
            }}
          />
        ) : undefined}
      />
      {aiAssistantEnabled ? (
        <AiAssistantPanel
          isOpen={aiAssistantDisclosure.isOpen}
          onClose={aiAssistantDisclosure.onClose}
          activeRoute={activeRoute}
        />
      ) : null}
      <PageContainer waitForUser>
        <Routes>{[...routeInstances, <Route path="*" element={<NotFoundPage />} key={uuid()} />]}</Routes>
      </PageContainer>
    </>
  );
};

export default Layout;
