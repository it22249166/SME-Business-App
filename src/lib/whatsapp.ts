export function buildWhatsAppLink(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}

export function buildWhatsAppBroadcastLink(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?text=${encoded}`;
}

export function buildSMSLink(phone: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `sms:${phone}?body=${encoded}`;
}
