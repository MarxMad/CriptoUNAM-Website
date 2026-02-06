import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

// Importa los datos antiguos
import { newsletterData } from '../src/data/newsletterData.js';

const BLOG_DIR = path.join(process.cwd(), 'blog');
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'blog-posts.json');

async function generateBlogData() {
  console.log('Iniciando la generación de datos del blog...');

  const files = await fs.readdir(BLOG_DIR);
  const newPosts = [];

  for (const file of files) {
    if (path.extname(file) === '.md') {
      const filePath = path.join(BLOG_DIR, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const { data, content } = matter(fileContent);

      // Validar metadatos
      if (!data.title || !data.date || !data.author || !data.image) {
        console.warn(`Saltando archivo ${file}: metadatos incompletos.`);
        continue;
      }

      newPosts.push({
        id: path.basename(file, '.md'), // ej: '2025-02-05-navegando-la-tormenta'
        titulo: data.title,
        fecha: data.date, // ej: '2025-02-05'
        autor: data.author,
        imagen: data.image, // ej: '/images/blog/2025-02-05-caida-mercado-puma.png'
        tags: data.tags || ['General'],
        contenido: content,
      });
    }
  }
  
  console.log(`Se encontraron ${newPosts.length} nuevos posts en formato Markdown.`);

  // Combina los posts antiguos con los nuevos
  // Asegurándose de que los tipos coincidan
  const combinedData = [...newsletterData, ...newPosts];
  
  // Ordena por fecha (más recientes primero)
  combinedData.sort((a, b) => {
    const dateA = new Date(a.fecha).getTime();
    const dateB = new Date(b.fecha).getTime();
    return dateB - dateA;
  });

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(combinedData, null, 2));

  console.log(`¡Éxito! Se generó el archivo blog-posts.json con ${combinedData.length} entradas.`);
}

generateBlogData().catch(error => {
  console.error('Error generando los datos del blog:', error);
  process.exit(1);
});
