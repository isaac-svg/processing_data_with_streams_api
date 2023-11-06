import fs from 'fs';
import path from 'path';
import { extname, join, dirname } from 'path';
import { fileURLToPath } from 'url';
export function getContentType  (filePath) {
    const extname = path.extname(filePath);
    switch (extname) {
      case '.html':
        return 'text/html';
      case '.css':
        return 'text/css';
      case '.js':
        return 'text/javascript';
      default:
        return 'text/plain';
    }
  };


export function loadUI(req, res){
    const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

    console.log(import.meta.url, "--------------------")
    const filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
  const contentType = getContentType(filePath);

  fs.readFile(filePath, (err, data) => {
    
  });

}

