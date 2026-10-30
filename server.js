import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('./dist/', import.meta.url))
const port = Number(process.env.PORT || 10000)
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
}

if (!existsSync(join(root, 'index.html'))) {
  console.error('Production files are missing. Run npm run build before starting the server.')
  process.exit(1)
}

createServer((request, response) => {
  const urlPath = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
  const requestedPath = normalize(join(root, urlPath))
  const isInsideBuild = requestedPath.startsWith(root)
  const filePath = isInsideBuild && existsSync(requestedPath) && statSync(requestedPath).isFile()
    ? requestedPath
    : join(root, 'index.html')

  try {
    const body = readFileSync(filePath)
    response.writeHead(200, {
      'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream',
      'Cache-Control': filePath.endsWith('index.html') ? 'no-cache' : 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    })
    response.end(body)
  } catch {
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('Unable to load the store. Please try again shortly.')
  }
}).listen(port, '0.0.0.0', () => console.log(`Market Lane is listening on port ${port}`))
