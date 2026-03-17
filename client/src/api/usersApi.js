import apiClient from "./client";

export const createUserRequest = async (payload) => {
  const { data } = await apiClient.post("/users", payload);
  return data;
};

export const getUsersRequest = async () => {
  const { data } = await apiClient.get("/users");
  return data;
};

export const getUserByIdRequest = async (id) => {
  const { data } = await apiClient.get(`/users/${id}`);
  return data;
};

export const updateUserByIdRequest = async (id, payload) => {
  const { data } = await apiClient.put(`/users/${id}`, payload);
  return data;
};

export const deleteUserByIdRequest = async (id) => {
  const { data } = await apiClient.delete(`/users/${id}`);
  return data;
};

export const getMyProfileRequest = async () => {
  const { data } = await apiClient.get("/users/me/profile");
  return data;
};

export const updateMyProfileRequest = async (payload) => {
  const { data } = await apiClient.put("/users/me/profile", payload);
  return data;
};
