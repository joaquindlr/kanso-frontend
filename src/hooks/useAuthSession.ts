import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';

export const useAuthSession = () => {
  const { token, setUser, logout } = useAuthStore();

  const { data: user, isError, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await api.get('/auth/me');
      return response.data;
    },
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  useEffect(() => {
    if (isError) {
      logout();
    }
  }, [isError, logout]);

  return { isLoading };
};
