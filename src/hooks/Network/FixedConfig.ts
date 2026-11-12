import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosGw } from 'constants/axiosInstances';

type FixedConfigResult = {
  status?: string;
  errorCode?: number;
  errorText?: string;
};

/** Sends the existing OWGW fixedconfig command. No uCentral changes are required. */
export const useSetFixedCountry = ({ serialNumber }: { serialNumber: string }) => {
  const queryClient = useQueryClient();

  return useMutation(
    async (country: string) => {
      const response = await axiosGw.post<FixedConfigResult>(`device/${serialNumber}/fixedconfig`, {
        serial: serialNumber,
        country,
      });
      const command = response.data;
      // The controller may return HTTP 200 for a command that was not executed.
      if (command.status !== 'completed' || (command.errorCode ?? 0) !== 0) {
        throw new Error(command.errorText || `The fixedconfig command was ${command.status ?? 'unsuccessful'}.`);
      }
      return command;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['commands', serialNumber]);
      },
    },
  );
};
