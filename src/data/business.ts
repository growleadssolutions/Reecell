// Fonte: https://reecell.com.br/ consultada em 2026-09-14.
// Dados publicados no site atual; confirmar com a empresa antes da migração final.
export const business = {
  name: 'ReeCell', url: 'https://reecell.com.br',
  phone: '+5547988758993', phoneDisplay: '(47) 98875-8993', whatsapp: '5547988758993',
  address: { street: 'R. João de Barro, 711 - SI 04', neighborhood: 'Bombas', city: 'Bombinhas', state: 'SC', postalCode: '88215-000', country: 'BR' },
  coordinates: undefined as { latitude: number; longitude: number } | undefined, // Pendente.
  hours: [
    { label: 'Segunda a sexta', opens: '09:00', closes: '19:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    { label: 'Sábado', opens: '09:00', closes: '14:00', days: ['Saturday'] },
  ],
  closedLabel: 'Domingo: fechado',
  socialLinks: [] as string[], // Pendente: URLs oficiais verificadas.
  logo: '/reecell-logo.png',
};
export const addressText = `${business.address.street} — ${business.address.neighborhood}, ${business.address.city} - ${business.address.state}, ${business.address.postalCode}`;
