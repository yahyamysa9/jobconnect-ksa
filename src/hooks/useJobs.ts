import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export interface DbJob {
  id: string;
  title: string;
  company_name: string;
  city: string;
  category: string;
  description: string | null;
  requirements: string[] | null;
  apply_link: string | null;
  publish_date: string;
  source: string | null;
  is_active: boolean;
}

export const useJobs = (filters?: { category?: string; city?: string; search?: string }) => {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      let query = supabase
        .from('jobs')
        .select('id, title, company_name, city, category, description, requirements, apply_link, publish_date, source, is_active')
        .eq('is_active', true)
        .order('publish_date', { ascending: false });

      if (filters?.category) query = query.eq('category', filters.category);
      if (filters?.city) query = query.eq('city', filters.city);
      if (filters?.search) query = query.or(`title.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as DbJob[];
    },
  });
};

export const useJob = (id: string) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as DbJob;
    },
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      return data || [];
    },
  });
};

export const useCities = () => {
  return useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const { data, error } = await supabase.from('cities').select('*').order('name');
      if (error) throw error;
      return data || [];
    },
  });
};

export const useJobCounts = () => {
  return useQuery({
    queryKey: ['job-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('category')
        .eq('is_active', true);
      if (error) throw error;
      const counts: Record<string, number> = {};
      (data || []).forEach((j) => {
        counts[j.category] = (counts[j.category] || 0) + 1;
      });
      return counts;
    },
  });
};
