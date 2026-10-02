// Escopo dos serviços: homepage atual da ReeCell, consultada em 14/09/2026.
// Textos próprios; não atribuir prazo, preço ou garantia sem confirmação.
export const homeServices = [
  {
    id: 'tela', title: 'Tela quebrada ou sem resposta', service: 'Troca de tela',
    description: 'O vidro trincou, a imagem sumiu ou o toque começou a falhar? Informe o modelo e explique o que mudou depois do dano.',
    label: 'Consultar troca de tela', message: 'Olá! Gostaria de consultar a troca de tela do meu celular. O modelo é: ',
  },
  {
    id: 'bateria', title: 'Bateria que não acompanha o dia', service: 'Troca de bateria',
    description: 'A carga acaba cedo ou o aparelho desliga sozinho? Conte como a bateria se comporta e há quanto tempo isso acontece.',
    label: 'Consultar troca de bateria', message: 'Olá! Gostaria de consultar a troca de bateria do meu celular. O modelo é: ',
  },
  {
    id: 'carga', title: 'Celular que não carrega direito', service: 'Conector de carga',
    description: 'O carregamento falha ou só funciona em uma posição? Descreva o problema para conversar sobre a avaliação do aparelho.',
    label: 'Falar sobre carregamento', message: 'Olá! Meu celular está com dificuldade para carregar. O modelo é: ',
  },
  {
    id: 'diagnostico', title: 'Aparelho que parou de funcionar', service: 'Diagnóstico técnico',
    description: 'Não liga, trava ou apresenta uma falha que você não sabe explicar? Comece contando o que aconteceu antes do problema.',
    label: 'Pedir uma avaliação', message: 'Olá! Meu celular parou de funcionar e gostaria de saber sobre a avaliação. O modelo é: ',
  },
  {
    id: 'agua', title: 'Contato com água ou umidade', service: 'Celular molhado',
    description: 'Foi na praia, na piscina ou em outro contato com líquido? Informe quando aconteceu e como o celular está agora.',
    label: 'Pedir orientação', message: 'Olá! Meu celular teve contato com líquido e preciso de orientação. O modelo é: ',
  },
  {
    id: 'acessorios', title: 'Proteção e acessórios para a rotina', service: 'Acessórios',
    description: 'Procura película, capinha, cabo ou carregador? Consulte as opções disponíveis para o seu modelo antes de ir à loja.',
    label: 'Consultar disponibilidade', message: 'Olá! Gostaria de consultar acessórios para meu celular. O modelo é: ',
  },
];

export const homeQuestions = [
  { question: 'Quanto custa consertar meu celular?', answer: 'O orçamento depende do modelo e da falha apresentada. Envie essas informações pelo WhatsApp para iniciar a conversa. Quando a causa não puder ser identificada à distância, será necessária uma avaliação presencial.' },
  { question: 'É possível saber o prazo antes de levar o aparelho?', answer: 'Conte qual é o modelo e o serviço de que precisa. O prazo depende da avaliação e da disponibilidade da peça; confirme essas condições com a equipe antes de programar sua visita.' },
  { question: 'Quais marcas a ReeCell atende?', answer: 'Você pode consultar atendimento para iPhone, Samsung, Motorola, Xiaomi e outros modelos. A possibilidade de reparo deve ser confirmada para o seu aparelho.' },
  { question: 'A avaliação do aparelho tem custo?', answer: 'O valor depende do tipo de avaliação. Pergunte à equipe sobre as condições do diagnóstico antes de deixar o aparelho na loja.' },
  { question: 'Estou de passagem por Bombinhas. Posso entrar em contato?', answer: 'Sim. A loja atende moradores e turistas em Bombas. Informe o problema e o período em que estará na cidade para verificar com a equipe as possibilidades de atendimento.' },
];
