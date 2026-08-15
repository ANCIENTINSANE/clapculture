export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(amount: number) {
  if (typeof amount !== 'number' || isNaN(amount)) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function generateOrderId(seq?: number) {
  if (seq) {
    return `#CLAP${String(seq).padStart(5, '0')}`;
  }
  return `#CLAP01001`;
}

export function getStatusColor(status: string) {
  switch (status.toUpperCase()) {
    case 'PENDING':
    case 'PLACED':
      return 'bg-yellow-500 text-black';
    case 'SUBMITTED':
    case 'CONFIRMED':
    case 'PROCESSING':
    case 'PACKED':
      return 'bg-blue-500 text-white';
    case 'SHIPPED':
      return 'bg-purple-500 text-white';
    case 'VERIFIED':
    case 'DELIVERED':
      return 'bg-electric-lime text-black';
    case 'REJECTED':
    case 'CANCELLED':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

export function resolveImageUrl(url: string | undefined | null): string {
  if (!url) return '';
  
  if (url.startsWith('data:')) {
    return url;
  }

  // If already pointing to our CDN-cached media proxy
  if (url.startsWith('/api/media/file/')) {
    return url;
  }

  // If it's an Appwrite storage URL, extract the fileId and route through our CDN proxy
  if (url.includes('/storage/buckets/media/files/')) {
    const match = url.match(/\/files\/([^/?#]+)/);
    if (match && match[1]) {
      return `/api/media/file/${match[1]}`;
    }
  }

  // If it's another absolute external URL (e.g. unsplash or external CDN)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Local assets starting with '/'
  if (url.startsWith('/')) {
    return url;
  }

  // Extract the filename or file ID
  const parts = url.split('/');
  const fileId = parts[parts.length - 1];

  // If the fileId contains a dot (e.g. .png, .jpg, .webp), it's a local public asset
  if (fileId.includes('.')) {
    return `/${url}`;
  }

  // Otherwise, it's an Appwrite File ID -> route through CDN proxy
  return `/api/media/file/${fileId}`;
}
