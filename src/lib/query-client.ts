import { QueryClient } from "@tanstack/react-query";
import { ZodError } from "zod";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof ZodError) {
          return false;
        }

        return failureCount < 3;
      },
    },
  },
});

export default queryClient;
