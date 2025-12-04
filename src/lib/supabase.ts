const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface ImageGeneration {
  id: string;
  session_id: string;
  name?: string;
  session_name?: string | null;
  folder_id: string;
  folder_url: string | null;
  reference_image_url: string | null;
  reference_image_key: string | null;
  total_images: number;
  generated_count: number;
  status: 'processing' | 'completed' | 'failed' | 'cancelled';
  images: any[];
  error_message: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export const supabase = {
  async fetchSessions() {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/image_generations?order=created_at.desc&limit=10`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch sessions');
    }
    
    return response.json() as Promise<ImageGeneration[]>;
  },

  async createSession(data: Partial<ImageGeneration>) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/image_generations`,
      {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify(data),
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to create session');
    }
    
    return response.json();
  },

  async updateSession(sessionId: string, data: Partial<ImageGeneration>) {
    // Remove session_id from update data to avoid conflicts
    const { session_id, ...updateData } = data as any;
    
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/image_generations?session_id=eq.${sessionId}`,
      {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify(updateData),
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to update session');
    }
    
    return response.json();
  },

  async deleteSession(sessionId: string) {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/image_generations?session_id=eq.${sessionId}`,
      {
        method: 'DELETE',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to delete session');
    }
    
    return true;
  },
};
