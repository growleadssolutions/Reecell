// Adicionar futuras páginas indexáveis aqui ao preservar suas URLs originais.
// A 404 e páginas provisórias não indexáveis ficam fora desta lista.
import { servicePages } from './service-pages';
export const sitePages = ['/', ...servicePages.map(page => `/${page.slug}/`), '/contato-reecell-bombinhas/', '/blog/'];
