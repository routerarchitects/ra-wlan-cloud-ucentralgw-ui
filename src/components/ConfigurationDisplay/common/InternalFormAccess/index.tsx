import * as React from 'react';
import { useFormikContext } from 'formik';

type Props = {
  shouldValidate?: boolean;
};

const InternalFormAccess = ({ shouldValidate }: Props) => {
  const { submitForm } = useFormikContext();

  React.useEffect(() => {
    if (shouldValidate) {
      setTimeout(() => {
        submitForm();
      }, 1000);
    }
  }, [shouldValidate]);

  return null;
};

export default InternalFormAccess;
