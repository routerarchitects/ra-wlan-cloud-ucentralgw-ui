import PropTypes from 'prop-types';

export const SubscriberShape = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export const ContactShape = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export const EntityShape = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export const LocationShape = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export const TagShape = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  serialNumber: PropTypes.string.isRequired,
};

export const ConfigurationSectionShape = PropTypes.shape({
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    weight: PropTypes.number.isRequired,
    configuration: PropTypes.instanceOf(Object).isRequired,
  }),
  invalidValues: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      error: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]).isRequired,
    }),
  ).isRequired,
  isDirty: PropTypes.bool.isRequired,
});
