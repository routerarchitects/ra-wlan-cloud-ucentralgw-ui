// TODO: Stub implementation - Resources hooks from owprov-ui not available in ucentralgw-ui
// These hooks need to be properly implemented or the components using them need to be adapted

export const useGetResources = () => {
  return {
    data: [],
    isLoading: false,
    isFetching: false,
    refetch: () => Promise.resolve(),
  };
};

export const useGetAllResources = () => {
  return {
    data: [],
    isLoading: false,
    isFetching: false,
    refetch: () => Promise.resolve(),
  };
};

export const useGetResource = () => {
  return {
    data: null,
    isLoading: false,
    isFetching: false,
    refetch: () => Promise.resolve(),
  };
};
