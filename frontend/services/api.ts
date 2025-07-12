import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useUser } from "../context/UserContext";

export function useApi() {
    const { setUser } = useUser();

    const API_URL = 'http://localhost:8080/';
    const api = axios.create({
        baseURL: API_URL,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    api.interceptors.request.use(
        async config => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        }, error => Promise.reject(error)
    );


    api.interceptors.response.use(
        response => response,
        async error => {
            if (error.response?.status === 401 || error.response?.status === 403) {
                await AsyncStorage.removeItem("token");
                setUser(null);
            }
            return Promise.reject(error);
        }
    );

    return {
        login: (data: any) => api.post('/login', data),
        register: (data: any) => api.post('/register', data),
        createReport: (data: any) => api.post('/reports', data),
        getAllReports: () => api.get('/reports'),
        getReport: (id: any) => api.get(`/reports/${id}`),
        updateReport: (id: any, data: any) => api.put(`/reports/${id}`, data),
        createAttendant: (data: any) => api.post('admin/attendant', data),
        getAllUsers: () => api.get('/admin/users'),
        deleteUser: (id: any) => api.delete(`/admin/users/${id}`),
        createAttendantGroup: (data: any) => api.post('/attendants', data),
        getAllAttendantGroups: () => api.get('/attendants'),
        deleteAttendantGroup: (id: any) => api.delete(`/attendants/${id}`),
    };
}