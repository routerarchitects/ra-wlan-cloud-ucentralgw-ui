import { createContext, useContext } from 'react';

// TODO: Stub - ConfigurationProvider context from owprov-ui
// This needs proper implementation

interface ConfigurationContextType {
  configuration?: any;
  setConfiguration?: (config: any) => void;
}

const ConfigurationContext = createContext<ConfigurationContextType>({});

export const useConfigurationContext = () => useContext(ConfigurationContext);

export const ConfigurationProvider = ConfigurationContext.Provider;
