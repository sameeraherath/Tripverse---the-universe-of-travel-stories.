import axios from "axios";

const API_URL = "http://localhost:5000/api/posts";

export const getPosts = async () => axios.get(API_URL);
export const getPostById = async (id) => axios.get(`${API_URL}/${id}`);
export const createPost = async (postData) => axios.post(API_URL, postData);
export const updatePost = async (id, updatedData) =>
  axios.put(`${API_URL}/${id}`, updatedData);
export const deletePost = async (id) => axios.delete(`${API_URL}/${id}`);
