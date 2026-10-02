# Home ReeCell — direção aplicada

Referências observadas no navegador em 14/09/2026:
https://converteup.com/ e https://luminacorrea.com.br/.

Ambas usam Manrope nos títulos e Inter no apoio. No desktop observado, H1 em
aproximadamente 65px, apoio em 19px, coluna de texto de 569–640px. Os títulos
formam blocos compactos, com entrelinha curta, próximos da altura da imagem.
O conteúdo alterna introduções, serviços, argumentos e contato.

Aplicação à ReeCell:

- H1 semântico com assistência técnica, celulares e Bombinhas; Manrope até 64px,
  largura de 16ch e entrelinha 1.06. Sem quebra fixa que prejudique o mobile.
- Apoio em Inter, entrelinha 1.65 e largura máxima de 47ch.
- Hero dividido em duas colunas equilibradas; imagem quadrada com dimensões,
  srcset, WebP, prioridade de carregamento e legenda de imagem ilustrativa.
- Serviços orientados a sintomas, CTAs específicos e mensagens diferentes por
  necessidade. Sem adicionar páginas ou alterar URLs nesta etapa.
- Convencimento baseado em utilidade: informações para consultar o atendimento,
  limites da avaliação remota, endereço, horários e dúvidas sobre orçamento.
- Nada de contadores, depoimentos, selos, prazos ou garantias inventados.
- Roxo reservado a marca e conversão, azul petróleo ao conteúdo de orientação.
- FAQ com details/summary nativos; sem dependências ou JS de cliente.
- Blog preparado para exibir artigos quando houver conteúdo publicado. Nenhum
  artigo foi migrado; o estado vazio continua explícito.

Componentes separados em src/components/home, conteúdo em src/data/home.ts e
estilos da página em src/styles/home.css. A base do blog e SEO foi preservada.
