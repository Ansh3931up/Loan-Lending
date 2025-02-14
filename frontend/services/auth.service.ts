import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3014/api/v1';

// Add axios interceptor to handle token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error('Login error:', axiosError.response?.data);
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Login failed'
      };
    }
  },

  async signup(formData: FormData) {
    try {
      const response = await axios.post(`${API_URL}/users/register`, formData);
      if (response.data.data.accessToken) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
      }
      return {
        success: true,
        user: response.data.data.user
      };
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Signup failed'
      };
    }
  },

  async getUser() {
    try {
      const response = await axios.get(`${API_URL}/users/getUser`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      
      const axiosError = error as AxiosError<{ message: string }>;
      localStorage.removeItem('accessToken'); // Clear token if invalid
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to fetch user'
      };
    }
  },

  async logout() {
    try {
      // Call backend logout endpoint
      const response = await axios.post(`${API_URL}/users/logout`);
      console.log("Logout Response:", response);
      
      // Clear local storage
      localStorage.removeItem('accessToken');
      
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error('Logout error:', error);
      // Still clear local storage even if backend call fails
      localStorage.removeItem('accessToken');
      
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Logout failed'
      };
    }
  }
};

export const questionnaireService = {
  getQuestionnaire: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/questionnaire`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error('Get questionnaire error:', error);
      throw axiosError;
    }
  },

  submitQuestionnaire: async (answers: { [key: string]: string }) => {
    try {
      const response = await axios.post(`${API_URL}/users/questionnaire/submit`, { answers });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error('Submit questionnaire error:', error);
      throw axiosError;
    }
  },

  getStatus: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/questionnaire/status`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error('Get status error:', error);
      throw axiosError;
    }
  }
}; 