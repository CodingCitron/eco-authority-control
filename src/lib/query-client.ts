import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { ZodError } from "zod";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        console.error(error);

        if (error instanceof ZodError) {
          return false;
        }
        if (isAxiosError(error) && error.response?.status === 401) {
          return false;
        }

        return failureCount < 3;
      },
    },
  },
});

export default queryClient;
