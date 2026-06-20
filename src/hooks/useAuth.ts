import { useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth';

export const useLogin = () => {
  const loginStore = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    },
    onSuccess: async (data) => {
      const { access_token } = data;
      
      try {
        const userResponse = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${access_token}` }
        });
        loginStore(userResponse.data, access_token);
        navigate('/');
      } catch (err) {
        console.error('Failed to fetch user profile', err);
      }
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (userData: RegisterCredentials) => {
      const response = await api.post('/auth/register', userData);
      return response.data;
    },
    onSuccess: () => {
      navigate('/login');
    },
  });
};
