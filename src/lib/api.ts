const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function apiRequest(endpoint: string, method: string = 'GET', body?: any) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

// Specific API methods
export const careerApi = {
  getRoadmap: (userId: string) => apiRequest(`/roadmap/${userId}`),
  getTasks: (userId: string) => apiRequest(`/tasks/${userId}`),
  completeTask: (taskId: string) => apiRequest(`/tasks/complete/${taskId}`, 'POST'),
  chat: (message: string, userId: string) => apiRequest('/ai/chat', 'POST', { message, user_id: userId }),
  analyzeResume: (content: string) => apiRequest('/resume/analyze', 'POST', { file_content: content }),
  analyzeComms: (audioData: string) => apiRequest('/comms/analyze', 'POST', { audio_data: audioData }),
};
