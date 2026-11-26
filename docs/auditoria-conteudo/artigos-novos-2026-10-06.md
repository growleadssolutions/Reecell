# Oito artigos aprovados após a auditoria dos 17 candidatos

Implementados no projeto em 06/10/2026. O blog passa de 23 para 31 artigos. A matriz de 15 keywords e o inventário anteriores são fotografias da primeira auditoria; este documento registra a decisão posterior, aprovada na conversa. Não registra publicação remota.

As URLs abaixo usam o prefixo `/2026/10/06/` e barra final. Todas têm ação CRIAR NOVA, conteúdo próprio, title, description, H1, keyword, FAQs, CTA e links internos. As URLs antigas e seus conteúdos foram preservados.

| Keyword / slug novo | Intenção delimitada | Conteúdo relacionado e diferença |
| --- | --- | --- |
| tela do celular piscando / `tela-do-celular-piscando` | Investigar imagem intermitente | Tela verde Samsung e tela trincada citam o sintoma, mas não desenvolvem a comparação entre aplicativo, menus e mudanças de brilho. |
| tela do celular com manchas pretas ou roxas / `tela-do-celular-com-manchas-ou-linhas` | Descrever alterações localizadas de imagem | Manchas e linhas foram reunidas numa URL. Não repetir o guia específico de Samsung verde nem o de riscos de vidro rachado. |
| touch do celular não funciona / `touch-do-celular-nao-funciona` | Investigar resposta ao toque com imagem presente | Artigos de trinca e orçamento não cobrem substancialmente ausência de resposta com vidro intacto. |
| celular sem sinal ou sem rede / `celular-sem-sinal-ou-sem-rede` | Linha reconhecida, mas sem serviço móvel | Nenhum artigo anterior dedicado. Encaminhar ausência de identificação do SIM ao artigo seguinte. |
| celular não reconhece chip / `celular-nao-reconhece-chip` | Identificação e ativação de SIM/eSIM | Nenhum artigo anterior dedicado. Evitar reescrever o guia de cobertura e rede. |
| celular travando muito / `celular-travando-muito` | Lentidão e congelamentos com aparelho ligado | Artigo de desligamentos trata outro comportamento; há links para ele e para o de touch. |
| vale a pena consertar um celular antigo / `vale-a-pena-consertar-celular-antigo` | Decidir continuidade de uso versus substituição | Expande uma lacuna de decisão global, sem repetir apenas custo de tela ou desgaste de bateria. |
| quanto tempo demora para consertar um celular / `quanto-tempo-demora-consertar-celular` | Entender etapas do prazo e planejar atendimento | FAQs anteriores são breves. O guia distingue avaliação, aprovação, peça, reparo e testes, sem prazos inventados. |

## Fontes e imagens

Orientações técnicas conferidas em fontes oficiais, com links dentro dos artigos relevantes:

- [Google: funcionamento da tela Android](https://support.google.com/android/answer/7666942?hl=pt-BR).
- [Google: Android lento](https://support.google.com/android/answer/7667018?hl=pt-BR).
- [Apple: SOS, Sem Serviço ou Buscando](https://support.apple.com/pt-br/120000).
- [Apple: SIM Inválido ou Sem SIM](https://support.apple.com/pt-br/108914).
- [Samsung: problemas de exibição](https://www.samsung.com/br/support/mobile-devices/fixing-galaxy-device-display-issues/).

A foto de bancada já existente é usada como imagem de atendimento, com legenda que não atribui a ela um defeito específico. Não foram inventadas fotos de manchas, chips ou reparos. Não se apresentam valores, prazos, resultados ou disponibilidade sem confirmação da loja.

## Integração e validação

O blog, as leituras relacionadas e o sitemap consomem a coleção existente automaticamente. Os novos artigos fazem links entre si e para conteúdos anteriores e serviços. Não foram inseridas novas tags nos arquivos históricos da migração.

O contrato de hospedagem passa a derivar artigos novos publicados separadamente do mapa legado. As 75 URLs históricas e os 28 hashes de conteúdo preservado continuam obrigatórios. O sitemap local contém 69 URLs; são gerados 70 HTMLs, incluindo a 404.

Validações: build, verificação estrutural, verificação editorial dos 31 artigos e 164 casos HTTP locais, sem falhas. O contrato local não representa teste na infraestrutura da Vercel. Commit, push e deploy não foram executados nesta etapa.
