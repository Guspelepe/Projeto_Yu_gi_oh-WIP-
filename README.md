<div align="center">
  <img src="./image_929037.jpg" alt="DuelDex Preview" width="100%">
  
  # 🃏 DuelDex
  **Yu-Gi-Oh! Card Database & Tools**

  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#)
  [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)
  [![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](#)
</div>

<br>

O **DuelDex** (anteriormente Yu-Gi-Oh! Pokedex) é uma aplicação web interativa e completa desenvolvida para os duelistas explorarem, gerenciarem e construírem seus decks. Consumindo a API oficial do YGOPRODeck, o projeto oferece uma experiência visual imersiva e responsiva, com direito a cartas holográficas e sistema avançado de montagem de decks!

## ✨ Funcionalidades Principais

*   **🔍 Busca e Filtros Avançados:** Encontre qualquer carta rapidamente pelo nome ou utilize filtros combinados (Atributo, Tipo e Nível). A paginação fluida e a busca com *debounce* garantem a melhor performance.
*   **🎴 Deck Builder Completo:** 
    *   Crie decks ilimitados com limites oficiais (até 80 cartas).
    *   Defina cartas como "capa" para cada deck.
    *   Acompanhe as estatísticas em tempo real (proporção de Monstros, Magias e Armadilhas).
    *   Ferramentas úteis: Duplicar, Preencher Aleatoriamente e **Exportar** deck (formato de texto para área de transferência).
*   **💖 Sistema de Favoritos:** Salve suas cartas preferidas para acesso rápido. Os dados são persistidos no `localStorage`.
*   **✨ Efeitos Visuais Imersivos:**
    *   **Tilt 3D:** As cartas reagem ao movimento do mouse.
    *   **Holográfico Dinâmico:** Brilho que acompanha o cursor, simulando a raridade Foil/Holo das cartas reais.
    *   **Animações GSAP:** Entradas suaves e em cascata (*stagger*) para as listas de cartas.
*   **🌓 Tema Claro / Escuro:** Alternância de temas salvos localmente, alterando completamente as cores, modais e backgrounds da aplicação.

## 📸 Screenshots

<div align="center">
  <img src="./image_928ff2.jpg" alt="Gerenciador de Decks" width="48%">
  <img src="./image_928fd2.jpg" alt="Deck Builder Interface" width="48%">
</div>

## 🛠️ Tecnologias Utilizadas

*   **Front-end:** HTML5, CSS3, JavaScript (Vanilla ES6 Modules).
*   **Animações:** [GSAP (GreenSock)](https://gsap.com/) para animações de entrada e renderização.
*   **API:** [YGOPRODeck API v7](https://ygoprodeck.com/api-guide/) para os dados atualizados das cartas.
*   **Armazenamento:** `localStorage` do navegador para Decks, Favoritos e preferências de Tema.


Primeiro projeto que eu tentei fazer
No momento o Visual do site está pronto mas as funcionalidades dele estão quebradas

<img width="1920" height="937" alt="image" src="https://github.com/user-attachments/assets/2d59b08a-c94a-4996-bbf1-c8759e2ebac3" />


https://guspelepe.github.io/Projeto_Yu_gi_oh/


## 📁 Estrutura do Projeto

O projeto foi organizado de forma modular para facilitar a manutenção e escalabilidade:

```text
📦 dueldex
 ┣ 📂 api
 ┃ ┗ 📜 yugioh.js           # Lida com as requisições (fetch)
 ┣ 📂 components
 ┃ ┣ 📜 Card.js             # Renderização e efeitos da carta (Tilt/Holo)
 ┃ ┣ 📜 CardList.js         # Lista principal animada com GSAP
 ┃ ┣ 📜 DeckEditorUI.js     # Modal de edição de capas e nomes
 ┃ ┣ 📜 DeckListUI.js       # Gerenciador geral de Decks
 ┃ ┣ 📜 DeckManager.js      # Lógica de manipulação dos arrays de decks
 ┃ ┣ 📜 Favorites.js        # Lógica de filtragem dos favoritos
 ┃ ┣ 📜 Modal.js            # Overlay com detalhes da carta selecionada
 ┃ ┗ 📜 SearchBar.js        # Lógica de input e debounce
 ┣ 📂 src
 ┃ ┗ 📂 css
 ┃   ┣ 📜 deck.css          # Estilos do deck builder
 ┃   ┣ 📜 estilos.css       # Estilos globais
 ┃   ┣ 📜 temas.css         # Variáveis do light/dark mode
 ┃   ┗ ...                  # Outros arquivos de reset e responsividade
 ┣ 📂 utils
 ┃ ┗ 📜 storage.js          # Manipulação do localStorage
 ┣ 📜 index.html            # Estrutura principal
 ┗ 📜 main.js               # Ponto de entrada e inicialização