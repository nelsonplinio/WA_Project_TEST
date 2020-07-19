export default function formatCurrencyValue(value: number, currency?: string, locales?: string | string[]): string {
  return Intl.NumberFormat(locales || 'pt-BR', {
    style: 'currency',
    currency: currency || 'BRL'
  }).format(value);
}
