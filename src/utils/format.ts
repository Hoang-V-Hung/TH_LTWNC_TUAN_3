/** Giá API đang là USD — quy đổi hiển thị sang VND cho đúng nghiệp vụ VN. */
const USD_TO_VND = 25000;

export function formatVND(usd: number): string {
  const vnd = Math.round(usd * USD_TO_VND);
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(vnd);
}

export function formatUSD(usd: number): string {
  return `$${usd.toFixed(2)}`;
}
