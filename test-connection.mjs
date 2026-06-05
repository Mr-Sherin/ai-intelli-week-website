import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envData = fs.readFileSync('.env.local', 'utf8');
let url = '';
let key = '';
envData.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    url = line.substring(line.indexOf('=') + 1).trim();
    if (url.endsWith('/rest/v1/')) {
      url = url.slice(0, -9);
    }
  }
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    key = line.substring(line.indexOf('=') + 1).trim();
  }
});

console.log('Testing connection to URL:', url);
const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase.from('speakers').select('*').limit(1);
  if (error) {
    console.error('Error connecting to Supabase:', error.message);
  } else {
    console.log('Successfully connected! Data retrieved:', data);
  }
}

test();
