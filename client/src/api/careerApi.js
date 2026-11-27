import axiosClient from './axiosClient.js';

export const getHealth = async () => {
  const { data } = await axiosClient.get('/health');
  return data;
};

export const registerUser = async ({ name, email, password }) => {
  const { data } = await axiosClient.post('/auth/register', { name, email, password });
  return data;
};

export const loginUser = async ({ email, password }) => {
  const { data } = await axiosClient.post('/auth/login', { email, password });
  return data;
};

export const getMe = async () => {
  const { data } = await axiosClient.get('/auth/me');
  return data;
};

export const updateCareerProfile = async (profile) => {
  const { data } = await axiosClient.put('/auth/profile', profile);
  return data;
};

export const createAssessment = async (answers) => {
  const { data } = await axiosClient.post('/assessments', { answers });
  return data;
};

export const getUserAssessments = async () => {
  const { data } = await axiosClient.get('/assessments');
  return data;
};

export const getAssessment = async (id) => {
  const { data } = await axiosClient.get(`/assessments/${id}`);
  return data;
};

export const deleteAssessment = async (id) => {
  const { data } = await axiosClient.delete(`/assessments/${id}`);
  return data;
};

export const sendChat = async ({ assessmentId, message }) => {
  const { data } = await axiosClient.post('/chat', { assessmentId, message });
  return data;
};

export const getChatHistory = async (assessmentId) => {
  const { data } = await axiosClient.get(`/chat/${assessmentId}`);
  return data;
};
