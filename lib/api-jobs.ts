
import api from './api';

export interface Job {
    _id: string;
    title: string;
    type: string;
    location: string;
    description: string;
    requirements: string[]; // Handled as array, but maybe input as specific strings
    salary: string;
    deadline?: string;
    isActive: boolean;
    createdAt: string;
}

export const getAllJobs = async (activeOnly = false) => {
    try {
        const query = activeOnly ? '?active=true' : '';
        const response = await api.get(`/jobs${query}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getJobById = async (id: string) => {
    try {
        const response = await api.get(`/jobs/${id}`);
        return response.data; // Wrapper usually returns { success: true, data: ... }
    } catch (error) {
        throw error;
    }
};

export const createJob = async (jobData: Partial<Job>) => {
    try {
        const response = await api.post('/jobs', jobData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateJob = async (id: string, jobData: Partial<Job>) => {
    try {
        const response = await api.put(`/jobs/${id}`, jobData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteJob = async (id: string) => {
    try {
        const response = await api.delete(`/jobs/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
