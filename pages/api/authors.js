import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://csemerwcwzpomjngyhwr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzZW1lcndjd3pwb21qbmd5aHdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwODY1NTcsImV4cCI6MjA1ODY2MjU1N30.dUOWenm4xySjXhpSrLhEibeRPY9ClHHnMRzNcd1PpHk'
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('Author Data')
        .select('id, Name, Link')
        .order('Name');

      if (error) throw error;

      return res.status(200).json(data);
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Failed to fetch authors' });
    }
  }
} 