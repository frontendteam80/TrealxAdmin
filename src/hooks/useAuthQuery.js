import { useQuery } from "@tanstack/react-query";
import { useAuthFetch } from "../auth/useAuthFetch";

export const useAuthQuery = (key, url, options = {}) => {
  const authFetch = useAuthFetch();

  return useQuery({
    queryKey: [key],
    queryFn: () => authFetch(url),
    ...options,
  });
};
