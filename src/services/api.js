import axios from 'axios';
import { auth } from '../lib/firebase';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_BACKEND_URL || 'http://localhost:8000',
});

// Interceptor to add Firebase ID Token to requests
api.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const loginUser = () => api.post('/login');
export const getMyProfile = () => api.get('/me');
export const getUserProfile = (params = {}) => api.get('/profile', { params });

// export const checkLeetcodeUsername = (params = {}) => api.get('/profile/check-leetcode', { params });
export const getAvailableSeasons = () => api.get('/seasons');
export const getOverallLeaderboard = (params = {}) => api.get('/leaderboard/top10', { params });
export const getTop10Leaderboard = (rollNo, params = {}) => api.get('/leaderboard/top10', {
    params: { rollNo, ...params }
});
export const getDirectTop10 = (key = 'latest_top10_url') => api.get(`/leaderboard/cached/${key}`);
export const getCachedTop10 = () => api.get('/leaderboard/cached/top10');
export const getPreviousWinners = () => api.get('/leaderboard/previous');
export const getDailyLeaderboard = (date) => api.get(`/leaderboard/${date}`);
export const getUserHistory = (rollNo, params = {}) => api.get(`/user/${rollNo}/history`, { params });
export const getUserRank = (rollNo, params = {}) => api.get(`/user/${rollNo}/rank`, { params });
export const uploadExcel = (formData, date, params = {}) => api.post('/upload-excel', formData, {
    params: { score_date: date, ...params },
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
export const getUploadStatus = (date, params = {}) => api.get('/upload-status', {
    params: { score_date: date, ...params }
});

export const getAdminPracticeProgress = (params = {}) => api.get('/admin/practice-progress', { params });


// Curriculum & Homework
export const addCurriculum = (data) => api.post('/curriculum', data);
export const getCurriculum = (params = {}) => api.get('/curriculum', { params });
export const deleteCurriculum = (date) => api.delete(`/curriculum/${date}`);

// Questions & Reminders
export const logExtraPractice = (rollNo, date, slug) => api.post('/question/extra', null, {
    params: { roll_no: rollNo, date_str: date, slug }
});
export const getExtraPractice = (rollNo) => api.get(`/question/extra/${rollNo}`);
export const verifyAndComplete = (data) => api.post('/question/complete', data);
export const getReminders = (rollNo, date) => api.get('/reminders', {
    params: { roll_no: rollNo, date_str: date }
});

export const updateProfile = (data, params = {}) => api.patch('/profile', data, { params });
export const checkLeetcodeUsername = (params = {}) => api.get('/profile/check-leetcode', { params });

export const checkHealth = async () => {
    try {
        const response = await api.get('/');
        return response.status === 200;
    } catch {
        return false;
    }
};

export default api;
