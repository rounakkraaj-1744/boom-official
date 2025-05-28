export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString()}`;
}

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength)
    return text;
  return text.substring(0, maxLength) + "...";
}