// Curadoria por intenção. Não altera o H1, corpo nem permalink dos artigos publicados.
export const seoTitles: Record<string, string> = {
  'tela-de-celular-bombinhas': 'Quanto custa trocar a tela em Bombinhas? | ReeCell',
};

export const serviceReading: Record<string, string[]> = {
  'troca-de-tela-de-celular-em-bombinhas': ['tela-de-celular-bombinhas', 'tela-trincada-do-celular-posso-continuar-usando-ou-devo-trocar', 'iphone-com-tela-quebrada-em-bombinhas'],
  'troca-de-bateria-de-celular-em-bombinhas': ['troca-de-bateria-de-celular-sinais', 'celular-desligando-sozinho-bateria-sistema-placa', 'celular-carregando-lentamente'],
  'conserto-de-celular-em-bombinhas': ['celular-nao-liga-principais-causas', 'conector-de-carga-com-defeito-sinais', 'celular-caiu-na-agua-o-que-fazer'],
};

export function serviceForArticle(slug: string, category?: string) {
  if (category === 'Tela e imagem') return 'troca-de-tela-de-celular-em-bombinhas';
  if (slug === 'troca-de-bateria-de-celular-sinais' || slug === 'celular-desligando-sozinho-bateria-sistema-placa') return 'troca-de-bateria-de-celular-em-bombinhas';
  return 'conserto-de-celular-em-bombinhas';
}

const diagnosis = '/conserto-de-celular-em-bombinhas/';
const battery = '/troca-de-bateria-de-celular-em-bombinhas/';
const screen = '/troca-de-tela-de-celular-em-bombinhas/';
type CommercialLink = { href: string; label: string };
const contextualLinks: Record<string, CommercialLink[]> = {
  'celular-desligando-sozinho-bateria-sistema-placa': [{ href: diagnosis, label: 'Consultar o diagnóstico dos desligamentos' }, { href: battery, label: 'Entender quando avaliar a troca de bateria' }],
  'celular-nao-liga-principais-causas': [{ href: diagnosis, label: 'Avaliação do celular que não liga em Bombinhas' }],
  'conector-de-carga-com-defeito-sinais': [{ href: diagnosis, label: 'Consultar avaliação do conector e do carregamento' }],
  'tela-trincada-do-celular-posso-continuar-usando-ou-devo-trocar': [{ href: screen, label: 'Conhecer a avaliação para troca de tela' }],
  'celular-carregando-lentamente': [{ href: diagnosis, label: 'Investigar a causa do carregamento lento' }],
  'camera-do-celular-embacada-ou-tremendo': [{ href: diagnosis, label: 'Consultar avaliação de falhas na câmera' }],
  'alto-falante-ou-microfone-do-celular-nao-funciona': [{ href: diagnosis, label: 'Consultar avaliação do áudio do celular' }],
  'melhores-lojas-de-celulares-em-bombinhas': [{ href: '/', label: 'Conhecer a ReeCell, assistência técnica em Bombas' }],
};
export function commercialLinksForArticle(slug: string, category?: string): CommercialLink[] {
  return contextualLinks[slug] ?? [{ href: `/${serviceForArticle(slug, category)}/`, label: category === 'Tela e imagem' ? 'Consultar avaliação da tela em Bombinhas' : slug === 'troca-de-bateria-de-celular-sinais' ? 'Conhecer o serviço de troca de bateria' : 'Consultar uma avaliação técnica em Bombinhas' }];
}
