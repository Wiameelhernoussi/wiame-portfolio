export function resolveImageUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const backendBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  return `${backendBase}${path.startsWith('/') ? path : '/' + path}`;
}
