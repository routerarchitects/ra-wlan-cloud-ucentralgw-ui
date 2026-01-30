import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Center, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import isEqual from 'react-fast-compare';
import { useTranslation } from 'react-i18next';
import { LoadingOverlay } from 'components/LoadingOverlay';
import useConfigurationTabs from './hooks/useConfigurationTabs';
import { ConfigurationDisplayProps, ConfigurationSection, SectionDef } from './types';
import AddSubsectionModal from './modals/AddSubsectionModal';
import ViewConfigErrorsModal from './modals/ViewConfigErrorsModal';
import ViewConfigWarningsModal from './modals/ViewConfigWarningsModal';
import ViewJsonConfigModal from './modals/ViewJsonConfig';
import ExpertModeButton from './components/ExpertModeButton';
import ImportConfigurationButton from './components/ImportConfigurationButton';

type Props = ConfigurationDisplayProps & {
  sections: SectionDef[];
};

const ConfigurationDisplayBase = ({ configuration, onConfigChange, isLoading = false, renderModals, sections }: Props) => {
  const { t } = useTranslation();
  const { tabIndex, onTabChange, tabsWithNewConfiguration, tabsRemovedConfiguration } = useConfigurationTabs();
  const sectionKeys = useMemo(() => sections.map((s) => s.key), [sections]);
  const isHydratingRef = useRef(false);

  const defaultSectionState = useMemo(() => {
    const base: Record<string, ConfigurationSection> = {};
    for (const section of sections) {
      base[section.key] = {
        data: { configuration: section.schema(t).cast({}) },
        isDirty: false,
        invalidValues: [],
      };
    }
    return base;
  }, [sections, t]);

  const [activeConfigurations, setActiveConfigurations] = useState<string[]>([]);
  const [sectionState, setSectionState] = useState<Record<string, ConfigurationSection>>(defaultSectionState);
  const [pendingImport, setPendingImport] = useState<Record<string, any> | null>(null);

  const parseConfig = useCallback(
    (config: Record<string, any>) => {
      const keys = Object.keys(config).filter((k) => sectionKeys.includes(k));
      setActiveConfigurations(keys);

      const nextState: Record<string, ConfigurationSection> = { ...sectionState };
      for (const key of keys) {
        nextState[key] = {
          data: { configuration: key === 'third-party' ? config['third-party'] : config[key] },
          isDirty: false,
          invalidValues: [],
        };
      }
      setSectionState(nextState);
    },
    [sectionKeys, sectionState],
  );

  useEffect(() => {
    if (configuration) {
      const currentKeys = Object.keys(configuration);
      if (!isEqual([...currentKeys].sort(), [...activeConfigurations].sort())) {
        isHydratingRef.current = true;
        parseConfig(configuration);
      }
    }
  }, [configuration]);

  useEffect(() => {
    if (isHydratingRef.current) {
      isHydratingRef.current = false;
      return;
    }
    const newConfig: Record<string, any> = {};
    for (const key of activeConfigurations) {
      const value = sectionState[key]?.data?.configuration;
      if (value !== undefined) {
        if (key === 'third-party') newConfig['third-party'] = value;
        else newConfig[key] = value;
      }
    }
    onConfigChange(newConfig);
  }, [sectionState, activeConfigurations]);

  const addSubsection = useCallback(
    (sub: string) => {
      const newSubs = [...activeConfigurations, sub];
      setActiveConfigurations(newSubs);
      tabsWithNewConfiguration(sub, newSubs);

      const def = sections.find((s) => s.key === sub);
      if (def) {
        setSectionState((prev) => ({
          ...prev,
          [sub]: { data: { configuration: def.schema(t).cast({}) }, isDirty: false, invalidValues: [] },
        }));
      }
    },
    [activeConfigurations, sections, t, tabsWithNewConfiguration],
  );

  const removeSub = useCallback(
    (sub: string) => {
      const newSubs = activeConfigurations.filter((s) => s !== sub);
      setActiveConfigurations(newSubs);
      tabsRemovedConfiguration();
    },
    [activeConfigurations, tabsRemovedConfiguration],
  );

  const onImportConfig = (newConf: any) => {
    const parsedMatches: Record<string, any> = {};
    if (Array.isArray(newConf)) {
      newConf.forEach((c: any) => {
        if (c.configuration) {
          try {
            const inner = JSON.parse(c.configuration) as Record<string, any>;
            const key = Object.keys(inner)[0];
            if (key) parsedMatches[key] = inner[key];
          } catch {
            // ignore
          }
        }
      });
    }
    isHydratingRef.current = true;
    setActiveConfigurations([]);
    setPendingImport(parsedMatches);
  };

  useEffect(() => {
    if (!pendingImport) return;
    isHydratingRef.current = true;
    parseConfig(pendingImport);
    setPendingImport(null);
  }, [pendingImport, parseConfig]);

  const defaultConfiguration = useMemo(() => {
    const defaults: Record<string, { name: string; description: string; weight: number; configuration: object }> = {};
    for (const section of sections) {
      defaults[section.key] = {
        name: section.name,
        description: '',
        weight: 0,
        configuration: section.schema(t).cast({}),
      };
    }
    return defaults;
  }, [sections, t]);

  useEffect(() => {
    if (renderModals) {
      const warnings: Record<string, any> = {};
      const errors: Record<string, any> = {};
      const configurations: Record<string, any> = {};
      for (const section of sections) {
        warnings[section.key] = [];
        errors[section.key] = sectionState[section.key]?.invalidValues ?? [];
        configurations[section.key] = sectionState[section.key]?.data ?? {};
      }

      const modals = (
        <>
          <ViewConfigWarningsModal warnings={warnings} activeConfigurations={activeConfigurations} />
          <ViewConfigErrorsModal errors={errors} activeConfigurations={activeConfigurations} />
          <ExpertModeButton
            defaultConfiguration={defaultConfiguration}
            currentConfiguration={Object.fromEntries(
              activeConfigurations.map((k) => [k, sectionState[k]?.data?.configuration]),
            )}
            activeConfigurations={activeConfigurations}
            isDisabled={false}
            setConfig={onImportConfig}
            configurationSections={sectionKeys}
          />
          <ImportConfigurationButton
            isDisabled={false}
            setConfig={onImportConfig}
            configurationSections={sectionKeys}
          />
          <AddSubsectionModal editing activeSubs={activeConfigurations} addSub={addSubsection} sections={sections} />
          <ViewJsonConfigModal configurations={configurations} activeConfigurations={activeConfigurations} />
        </>
      );
      renderModals(modals);
    }
  }, [renderModals, activeConfigurations, sectionState, defaultConfiguration, onImportConfig, addSubsection, sections, sectionKeys]);

  return (
    <Box w="100%">
      {isLoading ? (
        <Center w="100%" py={12}>
          <Spinner size="xl" />
        </Center>
      ) : (
        <LoadingOverlay isLoading={false}>
          <Box w="100%">
            <Tabs variant="enclosed" w="100%" index={tabIndex} onChange={onTabChange}>
              <TabList flexWrap={{ base: 'wrap', md: 'nowrap' }}>
                {sections.map((section) => {
                  if (!activeConfigurations.includes(section.key)) return null;
                  const label = t(section.tabLabel);
                  return <Tab key={section.key}>{label === section.tabLabel ? section.name : label}</Tab>;
                })}
              </TabList>
              <TabPanels>
                {sections.map((section) =>
                  activeConfigurations.includes(section.key) ? (
                    <TabPanel key={section.key} px={{ base: 0, md: 4 }}>
                      <section.Component
                        editing
                        setSection={(data) =>
                          setSectionState((prev) => ({
                            ...prev,
                            [section.key]: data,
                          }))
                        }
                        sectionInformation={sectionState[section.key]}
                        removeSub={removeSub}
                      />
                    </TabPanel>
                  ) : null,
                )}
              </TabPanels>
            </Tabs>
          </Box>
        </LoadingOverlay>
      )}
    </Box>
  );
};

export default React.memo(ConfigurationDisplayBase);
