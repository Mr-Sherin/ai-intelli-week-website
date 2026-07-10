const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('app/api');
files.push('lib/supabase.ts');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let updated = false;
  
  if (content.includes('process.env.NEXT_PUBLIC_SUPABASE_URL;')) {
    content = content.replace(/process\.env\.NEXT_PUBLIC_SUPABASE_URL;/g, "process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('localhost', '127.0.0.1');");
    updated = true;
  }
  
  if (content.includes('process.env.NEXT_PUBLIC_SUPABASE_URL ||')) {
    content = content.replace(/process\.env\.NEXT_PUBLIC_SUPABASE_URL\s+\|\|/g, "process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('localhost', '127.0.0.1') ||");
    updated = true;
  }
  
  if (updated) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
