<div align="center">
 <img width="1408" height="768" alt="logo" src="https://github.com/user-attachments/assets/26380a41-ba7d-4506-abec-82feaf8af641" />

<br>

O **DuelDex** (anteriormente Yu-Gi-Oh! Pokedex) é uma aplicação web interativa e completa desenvolvida para os duelistas explorarem, gerenciarem e construírem seus decks. Consumindo a API oficial do YGOPRODeck, o projeto oferece uma experiência visual imersiva e responsiva, com direito a cartas holográficas e sistema avançado de montagem de decks!

<img width="1907" height="945" alt="image" src="https://github.com/user-attachments/assets/f635ed83-14dc-46ca-97da-f20576578057" />


## Funcionalidades Principais

*   **Busca e Filtros Avançados:** Encontre qualquer carta rapidamente pelo nome ou utilize filtros combinados (Atributo, Tipo e Nível). A paginação fluida e a busca com *debounce* garantem a melhor performance.

<br>

*   **Deck Builder Completo:** 
    *   Crie decks ilimitados com limites oficiais (até 80 cartas).
    *   Defina cartas como "capa" para cada deck.
    *   Acompanhe as estatísticas em tempo real (proporção de Monstros, Magias e Armadilhas).
    *   Exportar deck: Exporte seu deck em formato de texto para área de transferência
 
<br>

*   **Sistema de Favoritos:** Salve suas cartas preferidas para acesso rápido. Os dados são persistidos no `localStorage`.

<br>

*   **Efeitos Visuais Imersivos:**
    *   **Tilt 3D:** As cartas reagem ao movimento do mouse.
    *   **Holográfico Dinâmico:** Brilho que acompanha o cursor, simulando a raridade Foil/Holo das cartas reais.
    *   **Animações GSAP:** Entradas suaves e em cascata (*stagger*) para as listas de cartas.

##  Screenshots

<div align="center">
  <img width="1281" height="529" alt="image" src="https://github.com/user-attachments/assets/f318baea-3d10-4211-994d-c1875728b180" />

  <img width="1295" height="736" alt="image" src="https://github.com/user-attachments/assets/4a98061a-bfdb-4595-87d4-227ba242e3d9" />

</div>

##  Tecnologias Utilizadas

*   **Front-end:** HTML5, CSS3, JavaScript (Vanilla ES6 Modules).
*   **Animações:** [GSAP (GreenSock)](https://gsap.com/) para animações de entrada e renderização.
*   **API:** [YGOPRODeck API v7](https://ygoprodeck.com/api-guide/) para os dados atualizados das cartas.
*   **Armazenamento:** `localStorage` do navegador para Decks, Favoritos e preferências de Tema.


## Inicio do Projeto

O projeto começou como uma HUD simples para praticar HTML e CSS porém eu decidi aumentar o tamanho e complexidade do projeto

<img width="1920" height="937" alt="image" src="https://github.com/user-attachments/assets/2d59b08a-c94a-4996-bbf1-c8759e2ebac3" />

## Link para testar o site

https://guspelepe.github.io/Projeto_Yu_gi_oh/
