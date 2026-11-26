// Reparação determinística dos oito arquivos de 06/10, sem mudar URLs ou datas.
import { readFile, readdir, writeFile } from 'node:fs/promises';
const vocabulary = `único íntegra área áreas às úteis útil Aprovação Avaliação Condições Configurações Dá Descrição Diagnóstico Há Histórico Inválido Não Olá Peça Película Separá Serviço Técnico Verificações acessório acessórios alterações alteração análise animações após aparência assistência até atendê ativação atualizações atualização ausência automático avaliação avião botões códigos cópia cópias características cartão combinação começa começou comparação compatíveis compatível condições conexões configurações configuração confirmação consequência consequências consideração dúvida decisão deformação descrição diagnóstico diferença disponíveis disponível distinção duração empréstimo espaço específica específicas específico específicos está estão estará evolução exibição extensão fábrica físico físicos força formatação forneça funções função há histórico identificação iluminação incompatíveis indicação informações informação instalação instruções interrupções inválido investigação já líquido lentidão ligações limitações limitação móveis móvel manutenção maré mudança mudanças não necessária necessárias necessário necessários notificações observações obtenção opções opção orçamento orientações orientação oscilação página pareça peça peças película poderá posição possíveis possível preço pressão previsão prioritário reúne reativação região reinicialização relógio relação removível restauração só são segurança sequência será serão serviço serviços situações situação solução substituída substituição superfície técnica técnico têm também temporários transferência usá vídeo vídeos várias vários variações verificações verificação versão visível você`;
const replacements = new Map(vocabulary.split(/\s+/).map(word => [word.replace(/[^\x00-\x7F]/g, '?'), word]));
for (const file of await readdir('src/content/blog')) {
  const path = `src/content/blog/${file}`;
  const original = await readFile(path, 'utf8');
  if (!original.includes('permalinkDate: "2026-10-06"')) continue;
  let fixed = original.replace(/[\p{L}?]+/gu, token => {
    if (replacements.has(token)) return replacements.get(token);
    if (token.endsWith('?') && replacements.has(token.slice(0, -1))) return replacements.get(token.slice(0, -1)) + '?';
    return token;
  });
  for (const [from, to] of Object.entries({
    'aprova??o': 'aprovação', 'como ficar? durante': 'como ficará durante',
    'continuar? limitado': 'continuará limitado',
    'informar ? operadora': 'informar à operadora', 'informação ? operadora': 'informação à operadora',
    'levar ? operadora': 'levar à operadora', 'Envie ?': 'Envie à',
    'necessárias ? avaliação': 'necessárias à avaliação',
    'Conte ? assistência': 'Conte à assistência', 'Informe ? assistência': 'Informe à assistência',
    '. ? preciso': '. É preciso', '### ? preciso': '### É preciso',
  })) fixed = fixed.replaceAll(from, to);
  fixed = fixed.replace(/ \?(?=[\s:,.])/g, ' é');
  if (fixed !== original) await writeFile(path, fixed);
}
