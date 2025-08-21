export const currentYear = 2025;
export const formatDate = (date: Date) => {
  // Your date formatting logic
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};