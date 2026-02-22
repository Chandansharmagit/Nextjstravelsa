import { CONFIG } from '../config';

/**
 * Resolves an image path to a full URL if it's a relative path from the backend,
 * or returns the path as-is if it's already a full URL or a relative path from the frontend.
 */
export const getImageUrl = (path: string | undefined | null): string => {
    if (!path) return CONFIG.LOGO_URL;

    // If it's already a full URL (http/https), return it
    if (path.startsWith('http')) {
        return path;
    }

    // If it's a relative path starting with /uploads, it's from the backend
    if (path.startsWith('/uploads')) {
        return `${CONFIG.BACKEND_URL}${path}`;
    }

    // If it's any other absolute path from root, assume it's a frontend public asset or append backend URL if it seems like a backend artifact
    // In this specific project, most dynamic images come from the backend.
    if (path.startsWith('/')) {
        // If it looks like a public asset that should be on the frontend, we could check here.
        // For now, let's keep it simple.
        return path;
    }

    return path;
};
