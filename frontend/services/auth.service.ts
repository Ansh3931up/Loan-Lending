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
  async login(email: string, password: string) {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      if (response.data.data.accessToken) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
      }
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
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
    }},
  async submitRiskAssessment(riskAssessmentData: { loanStatus: string; confidence: number; probabilityApproved: number; probabilityRejected: number }) {
    try {
      const response = await axios.post(`${API_URL}/users/questionnaire/submit-risk-assessment`, riskAssessmentData);
      return {
        success: true,
        data: response.data.data
      }
    } catch (error) {
      // console.error('Submit risk assessment error:', axiosError);
      const axiosError = error as AxiosError<{ message: string }>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to submit risk assessment'
      }
    }
  },
};

export const questionnaireService = {
  getQuestionnaire: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/questionnaire`);
      console.log("Questionnaire Response:", response.data);
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