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
  // If it's already an absolute URL, clean it and return
  if (url.startsWith('http')) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.delete('mode');
      urlObj.searchParams.delete('impersonateuserid');
      return urlObj.toString();
    } catch {
      return url;
    }
  }
  if (url.startsWith('data:')) {
    return url;
  }
  
  // Extract the filename or file ID
  const parts = url.split('/');
  const fileId = parts[parts.length - 1];
  
  // If the fileId contains a dot (e.g. .png, .jpg), it's a local asset (or a file with extension).
  // Appwrite IDs generated via ID.unique() are 20 character strings without extensions.
  if (fileId.includes('.')) {
    return url.startsWith('/') ? url : `/${url}`;
  }
  
  // Construct the Appwrite storage URL for Appwrite File IDs
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a7dfa97003713198186';
  const bucketId = 'media';
  
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
}
