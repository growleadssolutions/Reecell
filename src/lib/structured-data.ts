import { business } from '../data/business';
export type SchemaNode = { '@type': string | string[]; '@id'?: string; [key: string]: unknown };
export interface BreadcrumbItem { name: string; href: string }
export const absoluteURL = (path: string) => new URL(path, business.url).href;
export const entityIds = { organization: `${business.url}/#organization`, localbusiness: `${business.url}/#localbusiness`, website: `${business.url}/#website` };
export function baseGraph(): SchemaNode[] {
  return [
    { '@type': 'Organization', '@id': entityIds.organization, name: business.name, url: business.url, ...(business.logo && { logo: absoluteURL(business.logo) }), ...(business.socialLinks.length > 0 && { sameAs: business.socialLinks }) },
    { '@type': 'LocalBusiness', '@id': entityIds.localbusiness, name: business.name, url: business.url, telephone: business.phone,
      parentOrganization: { '@id': entityIds.organization },
      address: { '@type': 'PostalAddress', streetAddress: `${business.address.street}, ${business.address.neighborhood}`, addressLocality: business.address.city, addressRegion: business.address.state, postalCode: business.address.postalCode, addressCountry: business.address.country },
      ...(business.coordinates && { geo: { '@type': 'GeoCoordinates', ...business.coordinates } }),
      openingHoursSpecification: business.hours.map(h => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.days, opens: h.opens, closes: h.closes })),
    },
    { '@type': 'WebSite', '@id': entityIds.website, url: `${business.url}/`, name: business.name, inLanguage: 'pt-BR', publisher: { '@id': entityIds.organization } },
  ];
}
export function breadcrumbNode(items: BreadcrumbItem[], url: string): SchemaNode {
  return { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: absoluteURL(item.href) })) };
}
// Somente para serviços descritos na página, com informações verificadas.
export function serviceNode(name: string, path: string, description: string): SchemaNode {
  return { '@type': 'Service', '@id': `${absoluteURL(path)}#service`, name, description, url: absoluteURL(path), provider: { '@id': entityIds.localbusiness } };
}
