export const contentTypes: Record<string, string> = {
  // HTML и текст
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",

  // JavaScript
  ".js": "text/javascript; charset=utf-8", // или application/javascript
  ".mjs": "text/javascript; charset=utf-8",
  ".ts": "application/typescript; charset=utf-8",

  // JSON / XML
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",

  // Изображения
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".bmp": "image/bmp",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",

  // Шрифты
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",

  // Иконки
  ".ico": "image/x-icon",
  ".svgz": "image/svg+xml", // сжатый SVG

  // Видео
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "video/ogg",

  // Аудио
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".oga": "audio/ogg",

  // Архивы
  ".zip": "application/zip",
  ".tar": "application/x-tar",
  ".gz": "application/gzip",
  ".rar": "application/vnd.rar",
  ".7z": "application/x-7z-compressed",

  // Документы
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation"
};

