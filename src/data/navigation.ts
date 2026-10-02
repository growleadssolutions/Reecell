import { servicePages } from './service-pages';
export const services = servicePages.map(page => ({ label: page.label, href: `/${page.slug}/` }));
export const navigation = [
  { label: 'Início', href: '/' }, ...services,
  { label: 'Blog', href: '/blog/' }, { label: 'Contato', href: '/contato-reecell-bombinhas/' },
];
