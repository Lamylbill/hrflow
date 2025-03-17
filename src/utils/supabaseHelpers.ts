
import { supabase } from '@/integrations/supabase/client';
import { EmployeeRecord } from '@/types/database';

/**
 * Helper functions to provide type-safe access to Supabase tables
 * These helpers allow us to use proper typing without modifying the read-only types.ts file
 */

// Helper for the employees table
export const employeesTable = {
  select: () => {
    return supabase.from('employees') as any;
  },
  
  insert: (data: Omit<EmployeeRecord, 'id' | 'created_at' | 'updated_at'>) => {
    return (supabase.from('employees') as any).insert(data);
  },
  
  update: (id: string, data: Partial<EmployeeRecord>) => {
    return (supabase.from('employees') as any).update(data).eq('id', id);
  },
  
  delete: (id: string) => {
    return (supabase.from('employees') as any).delete().eq('id', id);
  },
  
  getById: (id: string) => {
    return (supabase.from('employees') as any).select('*').eq('id', id).single();
  },
  
  getByUserId: (userId: string) => {
    return (supabase.from('employees') as any).select('*').eq('user_id', userId);
  }
};
