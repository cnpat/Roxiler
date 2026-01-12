const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || 'Request failed' };
    }

    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' };
  }
}

export const api = {
  auth: {
    signup: (body: { name: string; email: string; address: string; password: string }) =>
      apiRequest<{ user: any }>('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
    login: (body: { email: string; password: string }) =>
      apiRequest<{ user: any }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    logout: () => apiRequest('/auth/logout', { method: 'POST' }),
    updatePassword: (body: { oldPassword: string; newPassword: string }) =>
      apiRequest('/auth/password', { method: 'PATCH', body: JSON.stringify(body) }),
  },
  stores: {
    list: (params?: { name?: string; address?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return apiRequest<{ stores: any[] }>(`/stores?${query}`);
    },
    getPublic: () => apiRequest<{ stores: any[] }>('/stores/public'),
  },
  ratings: {
    submit: (body: { storeId: string; score: number }) =>
      apiRequest('/ratings', { method: 'POST', body: JSON.stringify(body) }),
  },
  admin: {
    dashboard: () => apiRequest<{ stats: any }>('/admin/dashboard/stats'),
    createUser: (body: { name: string; email: string; address: string; password: string; role: string }) =>
      apiRequest<{ user: any }>('/admin/users', { method: 'POST', body: JSON.stringify(body) }),
    listUsers: (params?: { name?: string; email?: string; address?: string; role?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return apiRequest<{ users: any[] }>(`/admin/users?${query}`);
    },
    getUser: (id: string) => apiRequest<{ user: any }>(`/admin/users/${id}`),
    createStore: (body: { name: string; email: string; address: string; owner: string }) =>
      apiRequest<{ store: any }>('/admin/stores', { method: 'POST', body: JSON.stringify(body) }),
    listStores: (params?: { name?: string; email?: string; address?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return apiRequest<{ stores: any[] }>(`/admin/stores?${query}`);
    },
    getStore: (id: string) => apiRequest<{ store: any }>(`/admin/stores/${id}`),
  },
  owner: {
    dashboard: () => apiRequest<{ store: any; ratings: any[] }>('/owner/dashboard'),
  },
};
