
import api from './api';

export interface Application {
    _id: string;
    job: {
        _id: string;
        title: string;
    };
    name: string;
    email: string;
    phone: string;
    resume: string;
    coverLetter?: string;
    status: 'Pending' | 'Reviewed' | 'Shortlisted' | 'Rejected';
    createdAt: string;
}

export const submitApplication = async (formData: FormData) => {
    try {
        const response = await api.post('/applications', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getApplications = async (jobId?: string) => {
    try {
        const query = jobId ? `?jobId=${jobId}` : '';
        const response = await api.get(`/applications${query}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateApplicationStatus = async (id: string, status: string) => {
    try {
        const response = await api.put(`/applications/${id}`, { status });
        return response.data;
    } catch (error) {
        throw error;
    }
};
