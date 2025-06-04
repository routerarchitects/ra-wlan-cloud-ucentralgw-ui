import { StyleConfig } from '@chakra-ui/theme-tools';

const CardHeader: StyleConfig = {
  baseStyle: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: {base: "5px", md: 0}
    // padding: "7px"
  },
  variants: {
    panel: () => ({
      borderBottom: '0.5px solid',
      px: '12px',
      minH: '58px',
      borderTopLeftRadius: '15px',
      borderTopRightRadius: '15px',
    }),
    unstyled: () => ({}),
  },
  defaultProps: {
    variant: 'panel',
  },
};

export default {
  components: {
    CardHeader,
  },
};
