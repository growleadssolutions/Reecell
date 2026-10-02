// URLs existentes no WordPress: preservar inclusive a barra final.
export const servicePages = [
  {
    slug: 'troca-de-bateria-de-celular-em-bombinhas', label: 'Troca de bateria', image: 'battery',
    title: 'Troca de bateria de celular em Bombinhas',
    description: 'Celular descarregando rápido ou desligando sozinho? Consulte a ReeCell em Bombas, Bombinhas, para avaliação e troca de bateria.',
    intro: 'A carga já não acompanha o seu dia? Conte o que está acontecendo com o aparelho. A ReeCell orienta a avaliação e verifica a necessidade de trocar a bateria.',
    heading: 'Quando vale avaliar a bateria?',
    symptoms: [ ['Carga dura pouco', 'A autonomia diminuiu e você precisa recarregar o celular várias vezes ao dia.'], ['Desliga sozinho', 'O aparelho desliga mesmo com carga indicada na tela.'], ['Carga instável', 'A porcentagem muda de forma inesperada ou o carregamento não evolui como antes.'] ],
    detailTitle: 'Nem toda falha de carga é a bateria.',
    detail: 'O cabo, o carregador, o conector e o uso do aparelho também podem estar relacionados ao problema. Informe o modelo e quando a falha começou para orientar a avaliação. A indicação da troca depende do diagnóstico do celular.',
    questions: [ ['Quanto custa trocar a bateria?', 'O valor depende do modelo, da peça disponível e da avaliação. Envie o modelo pelo WhatsApp para consultar o orçamento.'], ['A troca pode ser feita no mesmo dia?', 'Confirme o prazo com a loja. Ele depende da disponibilidade da bateria e da avaliação do aparelho.'], ['Vocês avaliam iPhone e Android?', 'Consulte o atendimento para seu modelo de iPhone, Samsung, Motorola, Xiaomi ou outra marca antes de visitar a loja.'] ],
  },
  {
    slug: 'troca-de-tela-de-celular-em-bombinhas', label: 'Troca de tela', image: 'screen',
    title: 'Troca de tela de celular em Bombinhas',
    description: 'Troca de tela de celular em Bombinhas: avaliação de vidro quebrado, manchas e falhas no toque. Consulte modelo, peça e orçamento na ReeCell.',
    intro: 'Tela trincada, manchas ou toque que não responde? Fale com a ReeCell para entender o próximo passo e consultar o reparo para o seu modelo.',
    heading: 'O que aconteceu com a tela?',
    symptoms: [ ['Vidro quebrado', 'Trincas ou rachaduras depois de uma queda ou impacto.'], ['Toque com falhas', 'Partes da tela não respondem ou registram comandos sozinhas.'], ['Manchas ou sem imagem', 'Linhas, manchas ou display apagado, mesmo com o celular dando sinais de funcionamento.'] ],
    detailTitle: 'Vidro, toque e imagem precisam de avaliação.',
    detail: 'Uma tela danificada pode apresentar problemas diferentes no vidro, no touch, no display ou nas conexões internas. A avaliação ajuda a definir o reparo indicado. Envie uma foto e informe se o celular ainda liga e responde ao toque.',
    questions: [ ['É possível trocar só o vidro?', 'A possibilidade depende do modelo e das condições do conjunto da tela. É necessário avaliar o aparelho antes de indicar a solução.'], ['Quanto tempo demora a troca de tela?', 'O prazo depende do modelo, da peça disponível e dos danos encontrados. Consulte a loja antes de levar o aparelho.'], ['Como pedir um orçamento?', 'Envie o modelo, uma foto da tela e descreva se há imagem, manchas ou falhas no toque. A confirmação do reparo depende da avaliação.'] ],
  },
  {
    slug: 'conserto-de-celular-em-bombinhas', label: 'Conserto de celular', image: 'phone',
    title: 'Conserto de celular em Bombinhas',
    description: 'Assistência técnica em Bombas, Bombinhas, para falhas de tela, bateria, carregamento e outros problemas. Fale com a ReeCell e consulte uma avaliação.',
    intro: 'Seu celular parou de funcionar como deveria? Explique o problema pelo WhatsApp e receba orientação sobre a avaliação na ReeCell, em Bombas.',
    heading: 'Um ponto de partida para cada problema.',
    symptoms: [ ['Não carrega ou não liga', 'Mau contato no cabo, carregamento interrompido ou aparelho sem sinal de funcionamento.'], ['Tela ou bateria', 'Tela quebrada, falhas no toque, pouca autonomia ou desligamentos inesperados.'], ['Outras falhas', 'Travamentos, problemas de câmera, som, botões ou contato com líquido precisam de avaliação específica.'] ],
    detailTitle: 'Primeiro, entender a causa. Depois, indicar o reparo.',
    detail: 'Um mesmo sintoma pode ter origens diferentes. Conte se houve queda, contato com água ou uma mudança recente no funcionamento. A avaliação técnica permite conversar sobre o serviço indicado, o orçamento e o prazo para o seu aparelho.',
    questions: [ ['Quais marcas podem ser avaliadas?', 'Fale com a loja sobre seu modelo de iPhone, Samsung, Motorola, Xiaomi ou outra marca. A possibilidade de reparo depende da avaliação e das peças disponíveis.'], ['O diagnóstico é pago?', 'Confirme as condições e eventuais valores da avaliação com a loja antes de deixar o aparelho.'], ['Estou de viagem em Bombinhas. Posso consultar antes de ir?', 'Sim. Envie o modelo e o problema pelo WhatsApp para consultar a disponibilidade de atendimento antes de se deslocar.'] ],
  },
];
export type ServicePage = typeof servicePages[number];
