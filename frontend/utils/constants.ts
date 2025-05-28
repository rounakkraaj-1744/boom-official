export const API_BASE_URL = "http://localhost:3000/api";

export const VIDEO_TYPES = {
  SHORT_FORM: "SHORT_FORM",
  LONG_FORM: "LONG_FORM",
} as const;

export const TRANSACTION_TYPES = {
  PURCHASE: "PURCHASE",
  GIFT_SENT: "GIFT_SENT",
  GIFT_RECEIVED: "GIFT_RECEIVED",
} as const;

export const GIFT_AMOUNTS = [10, 50, 100, 500] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/mpeg", "video/quicktime"];