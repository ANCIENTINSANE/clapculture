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

export function generateOrderId() {
  return '#CLAP' + Math.floor(10000 + Math.random() * 90000).toString();
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
  // If it's already an absolute URL, return it as is
  if (url.startsWith('http') || url.startsWith('data:')) {
    return url;
  }
  
  // Assume the local URL is a file ID in Appwrite (e.g. '/qrcode.png' -> 'qrcode.png')
  const fileId = url.startsWith('/') ? url.slice(1) : url;
  
  // Construct the Appwrite storage URL
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6a7dfa97003713198186';
  const bucketId = 'media';
  
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
}
