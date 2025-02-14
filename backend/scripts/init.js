import fs from 'fs';
import path from 'path';

// Create necessary directories
const dirs = [
    'public',
    'public/temp'
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
}); 