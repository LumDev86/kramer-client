let counter = 0;

export function generateOrderNumber(): string {
  counter++;
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `KR-${date}-${String(counter).padStart(4, '0')}`;
}
