import type { Review, News, Guide } from "./types"
import { saveReview, saveNews, saveGuide, ensureDataDir } from "./data"

// Autor padrão para os reviews
const defaultAuthor = {
  name: "Lucas Silva",
  avatar: "https://i.pravatar.cc/150?img=12",
  psnId: "PlatinaCaçador",
  instagram: "@platina_hunter",
  twitter: "@platina_hunter",
  bio: "Caçador de troféus desde 2010. Especialista em RPGs e jogos de ação.",
}

// Guia de exemplo para The Last of Us Part 2
export const sampleGuide: Guide = {
  id: "tlou2-guide",
  title: "Guia Completo de Platina",
  slug: "the-last-of-us-part-2-guia-platina",
  content: `The Last of Us Part II é um jogo de ação e aventura desenvolvido pela Naughty Dog e publicado pela Sony Interactive Entertainment. Lançado em 19 de junho de 2020 exclusivamente para PlayStation 4, o jogo é a sequência de The Last of Us (2013).

Este guia irá ajudá-lo a obter todos os troféus e conquistar a platina em The Last of Us Part II. O jogo tem um total de 26 troféus (1 platina, 8 de ouro, 8 de prata e 9 de bronze).

A boa notícia é que não há troféus multijogador, já que o jogo é exclusivamente single-player. Além disso, não há troféus missáveis, pois você pode usar o modo de seleção de capítulos para voltar a qualquer parte do jogo após terminar a história.

A estratégia recomendada é jogar primeiro no modo normal para aproveitar a história, coletando o máximo de itens possível. Depois, use o modo de seleção de capítulos para coletar qualquer item que tenha perdido e completar os troféus restantes.`,
  image:
    "https://assets.reedpopcdn.com/the-last-of-us-part-2-walkthrough-guide-8001-1592495034582.jpg/BROK/thumbnail/1600x900/format/jpg/quality/80/the-last-of-us-part-2-walkthrough-guide-8001-1592495034582.jpg",
  type: "guide",
  createdAt: "2023-07-15T10:00:00.000Z",
  updatedAt: "2023-07-15T10:00:00.000Z",
  gameName: "The Last of Us Part II",
  difficulty: "4",
  estimatedTime: "30-40h",
  tags: ["PS4", "PS5", "Naughty Dog", "Exclusivo Sony", "Ação", "Aventura"],
  author: defaultAuthor,
  steps: [
    {
      title: "Troféu de Platina - Mestre Sobrevivente",
      description:
        "Colete todos os outros troféus para ganhar a platina.\n\nEste troféu será desbloqueado automaticamente quando você conseguir todos os outros troféus do jogo.",
      image: "https://oyster.ignimgs.com/mediawiki/apis.ign.com/the-last-of-us-2/9/9c/Tlou2_plat.png",
    },
    {
      title: "Troféu de Ouro - Que a Luz Guie Você",
      description:
        "Complete a história.\n\nEste troféu será desbloqueado automaticamente quando você terminar o jogo. A história principal leva aproximadamente 25-30 horas para ser concluída.",
      image: "https://oyster.ignimgs.com/mediawiki/apis.ign.com/the-last-of-us-2/a/a3/Tlou2_story.png",
    },
    {
      title: "Troféu de Ouro - Tudo de Nós",
      description:
        "Colete todos os artefatos e registros.\n\nExistem 286 artefatos e registros espalhados pelo jogo. Use o modo de seleção de capítulos para voltar a áreas específicas e coletar os que você perdeu.\n\nDica: No menu de coletáveis, você pode ver quais itens estão faltando em cada capítulo.",
      image: "https://oyster.ignimgs.com/mediawiki/apis.ign.com/the-last-of-us-2/c/c5/Tlou2_artifacts.png",
      video: "https://www.youtube.com/watch?v=vRaOxv-dSLs",
    },
    {
      title: "Troféu de Ouro - Em Memória",
      description:
        "Encontre todas as cartas comerciais.\n\nExistem 48 cartas comerciais espalhadas pelo jogo. Elas geralmente estão escondidas em gavetas, armários ou em locais menos óbvios.\n\nDica: As cartas comerciais emitem um som distinto quando você está próximo delas, facilitando sua localização.",
      image: "https://oyster.ignimgs.com/mediawiki/apis.ign.com/the-last-of-us-2/e/e1/Tlou2_cards.png",
      video: "https://www.youtube.com/watch?v=BOO0XSfEFQg",
    },
    {
      title: "Troféu de Ouro - Mestre Armeiro",
      description:
        "Atualize todas as armas.\n\nVocê precisará coletar muitas peças de armas durante o jogo para conseguir este troféu. Certifique-se de explorar bem cada área e procurar em gavetas, armários e mesas de trabalho.\n\nDica: Algumas atualizações só estarão disponíveis em capítulos específicos, então preste atenção às bancadas de trabalho durante sua jornada.",
      image: "https://oyster.ignimgs.com/mediawiki/apis.ign.com/the-last-of-us-2/c/c9/Tlou2_weapons.png",
    },
    {
      title: "Troféu de Prata - Sobrevivente Experiente",
      description:
        "Atualize todas as habilidades.\n\nVocê precisará coletar muitos suplementos durante o jogo para conseguir este troféu. Certifique-se de explorar bem cada área e procurar em gavetas, armários e banheiros.\n\nDica: Você não conseguirá desbloquear todas as habilidades em uma única jogada, então foque nas árvores de habilidades que combinam melhor com seu estilo de jogo.",
      image: "https://oyster.ignimgs.com/mediawiki/apis.ign.com/the-last-of-us-2/0/0c/Tlou2_skills.png",
    },
    {
      title: "Troféu de Prata - Enciclopédia Ambulante",
      description:
        "Colete todos os manuais de treinamento.\n\nExistem 25 manuais de treinamento espalhados pelo jogo. Eles desbloqueiam novas árvores de habilidades, então são muito importantes para o progresso.\n\nDica: Os manuais geralmente estão em locais mais óbvios que outros coletáveis, frequentemente em mesas ou estantes.",
      image: "https://oyster.ignimgs.com/mediawiki/apis.ign.com/the-last-of-us-2/5/5c/Tlou2_manuals.png",
      video: "https://www.youtube.com/watch?v=I_iU0IPOFq0",
    },
    {
      title: "Troféu de Bronze - Afiada como uma Faca",
      description:
        "Derrote um Shambler (infectado avançado) com uma faca.\n\nOs Shamblers são inimigos infectados que aparecem em áreas com água ou umidade. Eles são reconhecíveis por sua aparência inchada e pela capacidade de liberar uma nuvem de esporos ácidos.\n\nDica: A melhor estratégia é enfraquecer o Shambler com tiros e então finalizar com a faca quando ele estiver com pouca vida.",
      image: "https://oyster.ignimgs.com/mediawiki/apis.ign.com/the-last-of-us-2/a/a8/Tlou2_shambler.png",
    },
    {
      title: "Troféu de Bronze - Dedos Ágeis",
      description:
        "Toque 'Take On Me' na guitarra.\n\nDurante o capítulo 'Seattle Dia 1 - A Estádio', você encontrará uma guitarra em um quarto. Interaja com ela e toque a sequência correta para desbloquear este troféu.\n\nDica: A sequência é: Triângulo, Círculo, Quadrado, X, Direita, Baixo, Esquerda.",
      image: "https://oyster.ignimgs.com/mediawiki/apis.ign.com/the-last-of-us-2/d/d9/Tlou2_guitar.png",
      video: "https://www.youtube.com/watch?v=NKeU1twQYX4",
    },
    {
      title: "Dicas Gerais para Platinar",
      description:
        "1. Jogue primeiro no modo normal para aproveitar a história.\n\n2. Use o modo de seleção de capítulos para voltar e coletar itens perdidos.\n\n3. Utilize guias online para localizar coletáveis específicos.\n\n4. Economize recursos para atualizações de armas e habilidades.\n\n5. Não se preocupe com troféus missáveis, pois todos podem ser obtidos após terminar o jogo.",
      image: "https://cdn.mos.cms.futurecdn.net/2sFGpJFdPHfNKUokiTKtPk.jpg",
    },
  ],
}

export const sampleReviews: Review[] = [
  {
    id: "1",
    title: "Uma obra-prima que redefine o gênero",
    slug: "the-last-of-us-part-2",
    content: `The Last of Us Part II é uma obra-prima que eleva o nível de narrativa nos videogames. Naughty Dog conseguiu criar uma sequência que não apenas honra o original, mas o supera em vários aspectos.

A história continua alguns anos após os eventos do primeiro jogo, com Ellie agora como protagonista principal. Sem entrar em spoilers, a narrativa é emocionalmente impactante e desafiadora, forçando o jogador a questionar suas próprias noções de certo e errado.

A jogabilidade foi refinada, oferecendo mais opções de combate e stealth. Os cenários são incrivelmente detalhados, desde florestas densas até cidades abandonadas reclamadas pela natureza. A direção de arte é simplesmente espetacular.

O sistema de combate é brutal e visceral, com animações realistas que podem até fazer o jogador se sentir desconfortável - e isso é intencional. A IA dos inimigos é impressionante, reagindo de forma inteligente às suas ações.

A trilha sonora, composta por Gustavo Santaolalla, complementa perfeitamente a atmosfera do jogo, intensificando os momentos emocionais e de tensão.

The Last of Us Part II não é apenas um grande jogo, é uma experiência que ficará com você muito tempo depois de terminar. É um exemplo perfeito de como os videogames podem ser uma forma de arte poderosa e emotiva.`,
    image:
      "https://assets.reedpopcdn.com/the-last-of-us-part-2-walkthrough-guide-8001-1592495034582.jpg/BROK/thumbnail/1600x900/format/jpg/quality/80/the-last-of-us-part-2-walkthrough-guide-8001-1592495034582.jpg",
    type: "review",
    createdAt: "2023-06-19T14:23:00.000Z",
    updatedAt: "2023-06-19T14:23:00.000Z",
    rating: "platinum",
    gameName: "The Last of Us Part II",
    genres: ["Ação", "Aventura", "Survival Horror"],
    tags: ["PS4", "PS5", "Naughty Dog", "Exclusivo Sony"],
    author: defaultAuthor,
    platinaGuide: {
      difficulty: "medium",
      timeToPlat: "25-35h",
      missableTrophies: false,
      onlineRequired: false,
      tips: "Jogue primeiro no modo normal para a experiência completa. Depois use o modo fácil com os coletáveis marcados para a segunda run. Não há troféus relacionados à dificuldade.",
    },
    additionalImages: [
      {
        url: "https://cdn.mos.cms.futurecdn.net/2sFGpJFdPHfNKUokiTKtPk.jpg",
        caption: "Os cenários de Seattle são incrivelmente detalhados e atmosféricos.",
      },
      {
        url: "https://cdn.vox-cdn.com/thumbor/GqQVHNvCJ-w_G3QHoGPKPpYOUKs=/1400x0/filters:no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/20030737/TLOUPII_20200605234909.jpg",
        caption: "O sistema de combate é brutal e visceral, com animações realistas.",
      },
      {
        url: "https://www.psu.com/wp/wp-content/uploads/2020/06/the-last-of-us-2-review-ps4-4-1024x576.jpg",
        caption: "A relação entre os personagens é o ponto forte da narrativa.",
      },
    ],
  },
  {
    id: "2",
    title: "Um RPG de mundo aberto que impressiona",
    slug: "elden-ring",
    content: `Elden Ring representa a evolução natural da fórmula Souls que a FromSoftware vem aperfeiçoando ao longo dos anos. A colaboração com George R.R. Martin resultou em um mundo rico e fascinante, repleto de mistérios e histórias para descobrir.

O jogo mantém a dificuldade característica dos títulos da FromSoftware, mas a estrutura de mundo aberto oferece mais liberdade para os jogadores. Se um chefe está muito difícil, você pode simplesmente explorar outras áreas, melhorar seu personagem e voltar mais tarde.

O combate é preciso e recompensador, com uma variedade impressionante de armas, magias e builds possíveis. Cada encontro com inimigos exige atenção e estratégia, tornando cada vitória extremamente satisfatória.

Visualmente, Elden Ring é deslumbrante. As paisagens variam de florestas exuberantes a pântanos tóxicos, castelos imponentes e cavernas sombrias. A direção de arte é impecável, criando cenários que parecem saídos de um pesadelo gótico.

A trilha sonora é épica e atmosférica, intensificando os momentos de tensão, especialmente durante as batalhas contra os chefes memoráveis do jogo.

Elden Ring não é apenas um dos melhores jogos da FromSoftware, mas um dos melhores RPGs de todos os tempos. É um mundo vasto e misterioso que recompensa a exploração e a perseverança.`,
    image: "https://image.api.playstation.com/vulcan/ap/rnd/202108/0410/8ifJaZQQNNi7R7qREi1QlRqD.jpg",
    type: "review",
    createdAt: "2023-02-25T10:15:00.000Z",
    updatedAt: "2023-02-25T10:15:00.000Z",
    rating: "platinum",
    gameName: "Elden Ring",
    genres: ["RPG", "Ação", "Mundo Aberto"],
    tags: ["PS5", "Xbox Series X/S", "PC", "FromSoftware"],
    author: {
      name: "Marina Costa",
      avatar: "https://i.pravatar.cc/150?img=5",
      psnId: "SoulsMaster",
      instagram: "@souls_hunter",
      twitter: "@souls_hunter",
      bio: "Especialista em jogos FromSoftware. Já platinou todos os Souls, Bloodborne e Sekiro.",
    },
    platinaGuide: {
      difficulty: "hard",
      timeToPlat: "80-100h",
      missableTrophies: true,
      onlineRequired: false,
      tips: "Você precisará de pelo menos 3 runs para todos os finais. Use save scumming para economizar tempo. Alguns troféus são missáveis, então use um guia para os finais e armas lendárias.",
    },
    additionalImages: [
      {
        url: "https://cdn.mos.cms.futurecdn.net/hiGdSt6kHxYbpEwCXTYxBE.jpg",
        caption: "O mundo aberto de Elden Ring é vasto e repleto de segredos para descobrir.",
      },
      {
        url: "https://assets.reedpopcdn.com/elden-ring-walkthrough-8042-1645798834267.jpg/BROK/thumbnail/1600x900/quality/100/elden-ring-walkthrough-8042-1645798834267.jpg",
        caption: "Os chefes são desafiadores e exigem estratégia e perseverança.",
      },
      {
        url: "https://cdn.vox-cdn.com/thumbor/SU9YwIR2oClnNEv3j4dyj-7_Vfw=/1400x788/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/23259860/ELDEN_RING_20220223211106.jpg",
        caption: "A direção de arte cria cenários que parecem saídos de um pesadelo gótico.",
      },
      {
        url: "https://www.pcgamesn.com/wp-content/sites/pcgamesn/2022/02/elden-ring-map-size.jpg",
        caption: "O mapa é enorme e diversificado, com biomas distintos para explorar.",
      },
    ],
  },
  {
    id: "3",
    title: "Um bom jogo, mas que não atinge seu potencial",
    slug: "cyberpunk-2077",
    content: `Cyberpunk 2077 é um jogo que carrega o peso de suas próprias ambições. Após anos de hype e promessas, o RPG da CD Projekt RED finalmente chegou, mas não sem controvérsias.

Night City é, sem dúvida, o ponto alto do jogo. A metrópole futurista é impressionantemente detalhada, vibrante e cheia de vida. A direção de arte é excepcional, capturando perfeitamente a estética cyberpunk de neon, tecnologia avançada e desigualdade social extrema.

A narrativa principal é envolvente, com personagens bem desenvolvidos e situações moralmente ambíguas. As missões secundárias também são bem elaboradas, muitas vezes contando histórias mais interessantes que a trama principal.

No entanto, o jogo sofre com problemas técnicos que vão desde bugs menores até falhas que podem interromper o progresso. O combate, embora funcional, não é tão refinado quanto outros aspectos do jogo.

A inteligência artificial dos NPCs deixa a desejar, com comportamentos muitas vezes previsíveis ou ilógicos que quebram a imersão. O sistema de polícia e a física dos veículos também parecem inacabados.

Apesar de seus problemas, Cyberpunk 2077 ainda oferece uma experiência única e memorável. Com atualizações contínuas, o jogo tem melhorado significativamente desde seu lançamento, mas ainda não alcançou todo o seu potencial.`,
    image: "https://image.api.playstation.com/vulcan/ap/rnd/202111/3013/cKz4tKNFj9C7RvtMaFdZP5Mi.jpg",
    type: "review",
    createdAt: "2022-12-10T16:45:00.000Z",
    updatedAt: "2022-12-10T16:45:00.000Z",
    rating: "gold",
    gameName: "Cyberpunk 2077",
    genres: ["RPG", "Ação", "Mundo Aberto"],
    tags: ["PS5", "Xbox Series X/S", "PC", "CD Projekt RED"],
    author: defaultAuthor,
    platinaGuide: {
      difficulty: "medium",
      timeToPlat: "60-80h",
      missableTrophies: true,
      onlineRequired: false,
      tips: "Salve frequentemente antes de missões importantes. Alguns troféus são relacionados a finais específicos e decisões na história. Você precisará completar todas as missões secundárias e gigs para alguns troféus.",
    },
    additionalImages: [
      {
        url: "https://cdn.mos.cms.futurecdn.net/YdoiAKKdVhYBtK8AhKgWFY.jpg",
        caption: "Night City é impressionantemente detalhada e vibrante.",
      },
      {
        url: "https://cdn.vox-cdn.com/thumbor/Qc3WxfBcSPT3uFqLDBhjRQ5Hx_o=/1400x788/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/22158841/Cyberpunk2077_Always_bring_a_gun_to_a_knife_fight_RGB.jpg",
        caption: "O combate oferece várias opções, desde stealth até abordagens mais agressivas.",
      },
      {
        url: "https://www.pcgamesn.com/wp-content/uploads/2020/12/cyberpunk-2077-johnny-silverhand.jpg",
        caption: "Keanu Reeves como Johnny Silverhand é um dos pontos altos da narrativa.",
      },
    ],
  },
  {
    id: "4",
    title: "Um jogo mediano que não inova",
    slug: "saints-row-2022",
    content: `O reboot de Saints Row tenta recapturar a magia da série original, mas acaba se perdendo no processo. O resultado é um jogo de mundo aberto que se sente datado em comparação com outros títulos do gênero.

A nova cidade de Santo Ileso oferece um cenário visualmente interessante, com áreas desérticas e urbanas, mas carece da personalidade e do charme de Steelport ou Stilwater dos jogos anteriores. O mapa é grande, mas muitas áreas parecem vazias ou repetitivas.

A história segue um grupo de jovens que decidem formar sua própria gangue, os Saints. A narrativa é previsível e os personagens, embora carismáticos em alguns momentos, não são tão memoráveis quanto os protagonistas dos jogos anteriores.

A jogabilidade é funcional, mas não traz nada de novo para a série ou para o gênero. Os tiroteios são satisfatórios, mas a mecânica de cobertura é inconsistente. A direção dos veículos melhorou em relação aos jogos anteriores, mas ainda está aquém de outros títulos de mundo aberto.

As missões principais variam em qualidade, com algumas oferecendo momentos divertidos e outras se sentindo como tarefas repetitivas. As atividades secundárias, uma vez marca registrada da série, não são tão criativas ou divertidas quanto nos jogos anteriores.

Saints Row não é um jogo ruim, mas é mediano em quase todos os aspectos. Fãs da série podem encontrar alguma diversão, mas o jogo não consegue se destacar em um gênero cada vez mais competitivo.`,
    image: "https://meups.com.br/wp-content/uploads/2022/08/Saints-Row-2022-900x503.jpg",
    type: "review",
    createdAt: "2022-08-25T09:30:00.000Z",
    updatedAt: "2022-08-25T09:30:00.000Z",
    rating: "silver",
    gameName: "Saints Row (2022)",
    genres: ["Ação", "Aventura", "Mundo Aberto"],
    tags: ["PS5", "Xbox Series X/S", "PC", "Volition"],
    author: {
      name: "Pedro Almeida",
      avatar: "https://i.pravatar.cc/150?img=8",
      psnId: "TrophyMaster_BR",
      instagram: "@trophy_master",
      twitter: "@trophy_master_br",
      bio: "Jogador hardcore com mais de 200 platinas. Especialista em jogos de mundo aberto e FPS.",
    },
    platinaGuide: {
      difficulty: "easy",
      timeToPlat: "30-40h",
      missableTrophies: false,
      onlineRequired: false,
      tips: "A maioria dos troféus é obtida naturalmente jogando a história e completando atividades secundárias. Foque em comprar todos os negócios e completar todas as atividades secundárias para os troféus de completista.",
    },
    additionalImages: [
      {
        url: "https://cdn.mos.cms.futurecdn.net/pJAjCSRFPpNYtECkDQwpMS.jpg",
        caption: "A cidade de Santo Ileso oferece cenários variados, mas carece de personalidade.",
      },
      {
        url: "https://assets.xboxservices.com/assets/a1/a0/a1a0d2c5-fe32-4cf1-8a75-1d0d5a36d3c9.jpg?n=Saints-Row_Gallery_04.jpg",
        caption: "As atividades secundárias não são tão criativas quanto nos jogos anteriores.",
      },
    ],
  },
  {
    id: "5",
    title: "Uma decepção que desperdiça seu potencial",
    slug: "battlefield-2042",
    content: `Battlefield 2042 representa um passo atrás para a franquia que já foi líder no gênero de FPS. O que deveria ser uma evolução ambiciosa acabou se tornando uma experiência frustrante e incompleta.

A decisão de focar exclusivamente no multiplayer, removendo a campanha single-player, poderia ter sido aceitável se o modo online fosse excepcional, mas não é o caso. Os mapas, embora visualmente impressionantes e em escala massiva, sofrem com problemas de design, com áreas abertas demais que favorecem snipers e veículos.

O novo sistema de especialistas, que substitui as classes tradicionais da série, prejudica o trabalho em equipe que sempre foi o coração de Battlefield. Os personagens com habilidades únicas parecem deslocados no universo mais sério que a série tentou construir.

Tecnicamente, o jogo sofreu com inúmeros bugs e problemas de performance no lançamento. Embora muitos tenham sido corrigidos com patches, a impressão inicial foi severamente prejudicada.

O modo Hazard Zone, que tentou capitalizar na popularidade dos jogos de extração, falhou em atrair jogadores e carece de profundidade. O Portal Battlefield, que permite recriar experiências de jogos anteriores, é talvez o único ponto realmente positivo.

Battlefield 2042 tem momentos de diversão, especialmente quando os sistemas funcionam como deveriam, proporcionando aqueles momentos caóticos e cinematográficos que definem a série. No entanto, esses momentos são raros demais para justificar as muitas falhas do jogo.`,
    image: "https://cdn.mos.cms.futurecdn.net/pEjZvBKQRPtZNyKWDFiGfg.jpg",
    type: "review",
    createdAt: "2021-11-20T11:00:00.000Z",
    updatedAt: "2021-11-20T11:00:00.000Z",
    rating: "bronze",
    gameName: "Battlefield 2042",
    genres: ["FPS", "Ação", "Multiplayer"],
    tags: ["PS5", "Xbox Series X/S", "PC", "EA", "DICE"],
    author: defaultAuthor,
    platinaGuide: {
      difficulty: "very-hard",
      timeToPlat: "100-150h",
      missableTrophies: false,
      onlineRequired: true,
      tips: "Prepare-se para um grind intenso. Muitos troféus exigem progressão de nível e conquistas específicas em modos multiplayer. Alguns troféus dependem de trabalho em equipe, então jogue com amigos sempre que possível.",
    },
    additionalImages: [
      {
        url: "https://cdn.mos.cms.futurecdn.net/xFcjwzFGbJkiNJuq8vELs7.jpg",
        caption: "Os mapas são visualmente impressionantes, mas sofrem com problemas de design.",
      },
      {
        url: "https://cdn.mos.cms.futurecdn.net/YYBHCnKbdAEMBcKZLJXpkm.jpg",
        caption: "O sistema de especialistas substitui as classes tradicionais da série.",
      },
      {
        url: "https://www.pcgamesn.com/wp-content/sites/pcgamesn/2021/10/battlefield-2042-specialists.jpg",
        caption: "O Portal Battlefield permite recriar experiências de jogos anteriores da série.",
      },
    ],
  },
]

export const sampleNews: News[] = [
  {
    id: "1",
    title: "GTA 6 tem primeiro trailer oficial revelado pela Rockstar Games",
    slug: "gta-6-primeiro-trailer-oficial",
    content: `A Rockstar Games finalmente revelou o primeiro trailer oficial de Grand Theft Auto VI (GTA 6), um dos jogos mais aguardados de todos os tempos. O vídeo confirma o retorno a Vice City, a versão ficcional de Miami que apareceu pela primeira vez em GTA: Vice City de 2002.

O trailer mostra uma cidade vibrante e detalhada, com praias ensolaradas, vida noturna agitada e os pântanos da Flórida nos arredores. A qualidade gráfica representa um salto significativo em relação a GTA V, com iluminação, texturas e modelagem de personagens impressionantes.

Confirmando rumores anteriores, o jogo terá dois protagonistas: um homem e uma mulher, que parecem formar uma dupla no estilo Bonnie e Clyde. Esta será a primeira vez desde GTA V que o jogo terá múltiplos protagonistas, e a primeira vez na história principal da série que teremos uma protagonista feminina.

O trailer também dá pistas sobre a ambientação temporal, que parece ser nos dias atuais, com forte presença de redes sociais e cultura de influenciadores digitais, contrastando com o submundo do crime que sempre foi central na série.

A Rockstar confirmou que GTA 6 será lançado no outono de 2025 (primavera no hemisfério sul) para PlayStation 5 e Xbox Series X|S. A versão para PC deve chegar posteriormente, seguindo o padrão de lançamentos anteriores da empresa.

Fãs já começaram a analisar cada frame do trailer, descobrindo referências a jogos anteriores e possíveis pistas sobre a história e mecânicas de jogo. A expectativa é que mais detalhes sejam revelados ao longo de 2024.`,
    image: "https://sm.ign.com/ign_br/screenshot/default/gta-6-trailer-1-lucia-jason-beach_1y3p.jpg",
    type: "news",
    createdAt: "2023-12-05T18:00:00.000Z",
    updatedAt: "2023-12-05T18:00:00.000Z",
    author: defaultAuthor,
  },
  {
    id: "2",
    title: "PlayStation 5 Pro deve ser anunciado em breve, segundo rumores",
    slug: "playstation-5-pro-anuncio-rumores",
    content: `Rumores cada vez mais fortes indicam que a Sony está se preparando para anunciar o PlayStation 5 Pro nos próximos meses. Segundo fontes da indústria, o console mais potente deve chegar ao mercado no final de 2024, aproximadamente quatro anos após o lançamento do PS5 original.

De acordo com informações vazadas, o PS5 Pro contará com uma GPU significativamente mais potente, capaz de renderizar jogos em 4K a 60fps de forma mais consistente, além de oferecer melhor desempenho em ray tracing. O console também deve incluir uma CPU ligeiramente mais rápida e 16GB de RAM GDDR6, um aumento em relação aos 12GB do modelo atual.

Analistas especulam que o PS5 Pro será posicionado como a plataforma definitiva para jogos de realidade virtual, coincidindo com o lançamento do PlayStation VR2, que exige hardware mais potente para experiências imersivas de alta fidelidade.

A Sony não comentou oficialmente sobre esses rumores, mas o padrão de meio de ciclo estabelecido com o PS4 Pro sugere que um anúncio pode estar próximo. Desenvolvedores já estariam recebendo kits de desenvolvimento para otimizar seus jogos para o novo hardware.

Quanto ao preço, espera-se que o PS5 Pro seja lançado por aproximadamente US$ 599, posicionando-se como uma opção premium acima do PS5 padrão, cujo preço deve ser reduzido quando o novo modelo chegar às lojas.

Jogos como o próximo God of War, Horizon Zero Dawn 3 e o rumored novo Uncharted seriam os carros-chefe para demonstrar o poder do novo console.`,
    image: "https://files.tecnoblog.net/wp-content/uploads/2020/06/playstation-5-produto-700x700.png",
    type: "news",
    createdAt: "2024-03-15T14:30:00.000Z",
    updatedAt: "2024-03-15T14:30:00.000Z",
    author: {
      name: "Ana Beatriz Mendes",
      avatar: "https://i.pravatar.cc/150?img=23",
      psnId: "AnaBeatrizGamer",
      instagram: "@anabeatriz_games",
      twitter: "@anabeatriz_games",
      bio: "Jornalista especializada em games há 8 anos. Cobre principalmente notícias sobre PlayStation e Nintendo.",
    },
  },
  {
    id: "3",
    title: "Nintendo anuncia sucessor do Switch para 2025",
    slug: "nintendo-anuncia-sucessor-switch-2025",
    content: `A Nintendo finalmente quebrou o silêncio e anunciou oficialmente que está trabalhando no sucessor do Nintendo Switch. Durante uma apresentação financeira, o presidente da empresa, Shuntaro Furukawa, confirmou que o novo console será revelado ainda este ano, com lançamento previsto para o primeiro semestre de 2025.

Embora poucos detalhes técnicos tenham sido compartilhados, Furukawa afirmou que o novo hardware manterá o conceito híbrido que fez do Switch um sucesso, permitindo jogar tanto na TV quanto em modo portátil. No entanto, ele prometeu "inovações significativas" que irão além do design atual.

Rumores da indústria sugerem que o console, provisoriamente chamado de "Switch 2", contará com uma tela OLED maior e de maior resolução, processador NVIDIA mais potente com suporte a DLSS, e retrocompatibilidade com jogos do Switch original.

A Nintendo também mencionou que está trabalhando com desenvolvedores terceirizados para garantir um forte lineup de lançamento, além de novos títulos de franquias populares como Mario, Zelda e Metroid.

Analistas especulam que o novo console poderá ter recursos expandidos de realidade aumentada, após o sucesso de Pokémon GO e as experiências com Nintendo Labo e Mario Kart Live: Home Circuit.

O anúncio vem em um momento estratégico para a Nintendo, com o Switch original se aproximando de seu sétimo ano no mercado, tendo vendido mais de 130 milhões de unidades mundialmente, tornando-se um dos consoles mais bem-sucedidos da história da empresa.`,
    image: "https://sm.ign.com/ign_br/screenshot/default/nintendo-switch-2-rumor-2023-1_rvqz.jpg",
    type: "news",
    createdAt: "2024-02-20T09:45:00.000Z",
    updatedAt: "2024-02-20T09:45:00.000Z",
    author: defaultAuthor,
  },
  {
    id: "4",
    title: "Silksong finalmente ganha data de lançamento após anos de espera",
    slug: "silksong-data-lancamento-anunciada",
    content: `Após anos de espera e especulações, a Team Cherry finalmente anunciou a data de lançamento de Hollow Knight: Silksong. O aguardado sequel do aclamado metroidvania chegará às plataformas em 12 de junho de 2024, quase seis anos após seu anúncio inicial.

O anúncio veio através de um novo trailer que mostrou mais da protagonista Hornet explorando o reino de Pharloom, com novos inimigos, áreas e habilidades. A Team Cherry também revelou que o jogo será significativamente maior que seu predecessor, com mais de 150 novos inimigos e chefes.

Silksong será lançado simultaneamente para PC, Nintendo Switch, PlayStation 5, PlayStation 4, Xbox Series X|S e Xbox One. Além disso, estará disponível no Xbox Game Pass desde o primeiro dia.

Os desenvolvedores explicaram que o longo período de desenvolvimento se deveu à expansão do escopo do projeto, que inicialmente era planejado como um DLC para Hollow Knight, mas cresceu para um jogo completo com seu próprio mundo, mecânicas e história.

"Queríamos garantir que Silksong não apenas atendesse às expectativas dos fãs, mas as superasse", disse Ari Gibson, co-fundador da Team Cherry. "Isso significou retrabalhar vários aspectos do jogo várias vezes até ficarmos satisfeitos."

A trilha sonora, novamente composta por Christopher Larkin, terá mais de 90 faixas originais, quase o dobro do jogo original. Uma edição de colecionador física também foi anunciada, incluindo um livro de arte, mapa do mundo e uma estatueta de Hornet.`,
    image: "https://cdn.akamai.steamstatic.com/steam/apps/1030300/header.jpg",
    type: "news",
    createdAt: "2024-04-01T16:20:00.000Z",
    updatedAt: "2024-04-01T16:20:00.000Z",
    author: {
      name: "Rafael Oliveira",
      avatar: "https://i.pravatar.cc/150?img=33",
      psnId: "RafaelGamer_BR",
      instagram: "@rafael_indie_games",
      twitter: "@rafael_games",
      bio: "Especialista em jogos indie e metroidvanias. Completou Hollow Knight com 112% três vezes.",
    },
  },
  {
    id: "5",
    title: "Microsoft anuncia novo Xbox Game Pass Ultimate+ com acesso a lançamentos no dia 1",
    slug: "microsoft-xbox-game-pass-ultimate-plus",
    content: `A Microsoft anunciou hoje uma nova camada premium para seu serviço de assinatura: o Xbox Game Pass Ultimate+. O novo plano, que custará US$ 19,99 por mês, incluirá todos os benefícios do Game Pass Ultimate atual, além de acesso garantido a todos os jogos first-party da Microsoft no dia do lançamento, sem período de espera.

A novidade surge após a recente mudança na política da empresa, que passou a lançar alguns títulos exclusivos no Game Pass regular apenas alguns meses após o lançamento inicial. Com o Ultimate+, os assinantes terão acesso imediato a todos os grandes lançamentos da Xbox Game Studios e Bethesda.

Além disso, o novo plano incluirá benefícios adicionais como:

- Acesso antecipado de 3 dias a títulos selecionados
- Conteúdo cosmético exclusivo para jogos populares
- Descontos maiores na Microsoft Store (20% em vez dos 10% atuais)
- Créditos mensais para uso em microtransações em jogos selecionados
- Acesso a uma biblioteca rotativa de jogos clássicos do Xbox Original e Xbox 360

Sarah Bond, presidente da Xbox, explicou que o novo plano visa "oferecer ainda mais valor para nossos jogadores mais dedicados, enquanto mantemos as opções existentes para aqueles que estão satisfeitos com o modelo atual".

O Xbox Game Pass Ultimate+ estará disponível a partir de 1º de junho em todos os mercados onde o Game Pass já é oferecido. Os planos existentes (Game Pass para Console, PC Game Pass e Game Pass Ultimate) continuarão disponíveis sem alterações em seus preços ou benefícios.`,
    image: "https://sm.ign.com/ign_br/screenshot/default/xbox-game-pass-logo-1_xyj8.jpg",
    type: "news",
    createdAt: "2024-04-15T10:00:00.000Z",
    updatedAt: "2024-04-15T10:00:00.000Z",
    author: defaultAuthor,
  },
]

export function seedDatabase() {
  ensureDataDir()

  // Adicionar reviews de exemplo
  sampleReviews.forEach((review) => {
    saveReview(review)
  })

  // Adicionar notícias de exemplo
  sampleNews.forEach((news) => {
    saveNews(news)
  })

  // Adicionar guia de exemplo
  saveGuide(sampleGuide)

  console.log("Banco de dados populado com dados de exemplo!")
}
