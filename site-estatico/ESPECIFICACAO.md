# Especificação de conteúdo — Site da Logue

Documento **agnóstico de design**: descreve estrutura, conteúdo, componentes e
funcionalidades de cada página. Serve para reconstruir o site em qualquer
design system, framework ou plataforma.

---

## 1. Marca (dados reais)

- **Nome:** Logue | Design & Social Media
- **Posicionamento:** Direção criativa para marcas autênticas e memoráveis.
- **Serviços-núcleo:** Branding, identidade visual, social media, storymaker, direção criativa.
- **Local / desde:** Itabira – MG, desde 2019 (atende o Brasil todo).
- **Fundadora:** Lorenna (@lorennagn).
- **Instagram:** @agencialogue · **Link atual:** msha.ke/logue
- **Contato:** WhatsApp (número a definir), Instagram.
- **Voz:** humana, próxima, profissional, sem hype, sem promessa milagrosa.

---

## 2. Navegação global

**Header (fixo no topo):** logo + menu + botão de destaque "Entrar".
Itens do menu (7): **Início, Sobre, Serviços, Blog, Membros, Freebies, Loja.**
Botão CTA: "Entrar" → Área de Membros. Menu vira hambúrguer no mobile.

**Footer (todas as páginas):**
- Coluna 1: logo + descrição curta da marca.
- Coluna 2: "Navegar" (links das páginas).
- Coluna 3: "Contato" (Instagram @agencialogue, @lorennagn, link, WhatsApp).
- Rodapé inferior: © ano · Itabira/MG + assinatura ("Feito com estratégia").

---

## 3. Páginas e seções

### 3.1 INÍCIO (index)
1. **Hero** — headline "Marcas autênticas. Presença memorável."; subtítulo sobre design/identidade/social; 2 botões (Ver serviços / Área de membros); 3 mini-indicadores (desde 2019 · Itabira · 100% com propósito).
2. **Sobre/Fundadora** — foto da Lorenna + apresentação curta ("Oi, eu sou a Lorenna") + 3 bullets (estratégia, identidade, atendimento) + botão "Conhecer a Logue".
3. **Serviços** — grade de 6 cards: Branding, Identidade visual, Social media, Storymaker, Direção criativa, Conteúdo com IA. Botão "Ver todos os serviços".
4. **Curso "Do Prompt ao Post"** — logo/arte do curso + descrição do passo a passo (ver seção 5) + trilha de etapas + botão "Quero o curso".
5. **Área de Membros (teaser)** — grade de 6 cards (Cursos, Ferramentas, Briefing & onboarding, Pedidos, Campanhas, Entrega de posts) + botão "Acessar a área de membros".
6. **Freebies (teaser)** — 3 cards de materiais gratuitos + link "Ver todos".
7. **Loja (teaser)** — 3 cards de produtos (curso, template, e-book) + link "Ver a loja".
8. **Blog (teaser)** — 3 cards de artigos + link "Ler o blog".
9. **CTA final** — "Vamos criar algo memorável?" + botão WhatsApp.
10. **Footer.**

### 3.2 SOBRE
1. **Hero** — "Marca forte nasce de gosto e método." + parágrafo (Design & Social Media, Itabira, desde 2019).
2. **Fundadora** — foto da Lorenna + história ("Prazer, eu sou a Lorenna", começou em 2019, planejar/criar/posicionar/construir) + botões (@lorennagn, Falar comigo).
3. **Valores** — 4 cards: Estratégia, Estética, Humanidade, Autenticidade.
4. **Info** — 3 cards: Itabira/MG, Desde 2019, Design & Social Media.
5. **CTA** — "Bora construir a sua marca?" + WhatsApp.
6. **Footer.**

### 3.3 SERVIÇOS
1. **Hero** — "Cuidamos da sua marca de ponta a ponta."
2. **Serviços** — 6 cards (mesmos da Início, com descrição um pouco maior).
3. **Como funciona** — 4 passos: Imersão → Estratégia → Criação → Aprovação & no ar.
4. **CTA** — "Quer um orçamento?" + WhatsApp.
5. **Footer.**

### 3.4 BLOG
1. **Hero** — "Ideias sobre marca, design e IA."
2. **Lista de posts** — grade de 6 cards (categoria + título + resumo). Ex.: "Conteúdo não é postar todo dia", "IA sem perder a alma", "A oferta clara vende mais", etc. (Artigos completos a produzir.)
3. **CTA** — seguir @agencialogue.
4. **Footer.**

### 3.5 ÁREA DE MEMBROS (área logada — hoje é vitrine estática)
1. **Hero + Login** — texto ("Sua marca, organizada") + **card de login** (e-mail, senha, botão "Acessar minha área").
2. **O que tem dentro** — grade de 8 cards:
   Cursos · Ferramentas de IA · Formulários de briefing · Onboarding ·
   Pedidos & demandas · Campanhas · Entrega de posts · Arquivos & Drive.
3. **CTA** — "Quer fazer parte?" + WhatsApp.
4. **Footer.**
> **Funcionalidade real a implementar** (back-end/login): autenticação, cursos,
> ferramentas de IA, briefings, onboarding, pedidos, campanhas, aprovação/entrega
> de posts, arquivos. (O projeto Next.js do repositório já tem essa base.)

### 3.6 FREEBIES
1. **Hero** — "Materiais gratuitos pra você começar."
2. **Grade de produtos gratuitos** — cards com: emoji/thumb, categoria (PDF/Template/Planner), título, descrição, selo "Grátis", botão "Baixar". Ex.: 30 ideias de post, Pack de stories, Planner editorial, Fórmulas de legenda, Mini guia de cores, 10 prompts de IA.
3. **CTA** — seguir no Instagram.
4. **Footer.**
> Cada card precisa de um **link de download** real.

### 3.7 LOJA
1. **Hero** — "Aprenda e crie com a Logue."
2. **Curso em destaque** — "Do Prompt ao Post": arte + descrição + trilha de etapas + preço + "Lista de espera".
3. **Grade de produtos** — cards com categoria, título, descrição, preço e ação. Ex.: curso, pack de carrosséis, guia de marca, calendário editorial, pack de reels, biblioteca de prompts.
4. **CTA** — "Dúvida sobre algum produto?" + WhatsApp.
5. **Footer.**
> Precisa de **checkout/entrega** (ex.: Hotmart/Kiwify) e **preços + links** reais.

---

## 4. Componentes reutilizáveis (agnósticos)

- **Header** com menu responsivo (hambúrguer no mobile).
- **Footer** de 3 colunas + faixa inferior.
- **Seção "faixa"** que alterna fundo escuro/claro.
- **Eyebrow** (rótulo pequeno acima do título).
- **Botões**: primário, secundário/contorno, claro (para fundos escuros).
- **Card de conteúdo** (emoji/ícone + título + texto).
- **Card de produto** (thumb + categoria + título + texto + preço + ação).
- **Bloco fundadora** (foto + texto, 2 colunas).
- **Card de login** (form e-mail/senha).
- **Trilha de etapas** (chips em sequência).
- **CTA de largura total** com botão.
- **Lista com marcadores** (emoji + texto).

---

## 5. Curso "Do Prompt ao Post" (descrição)

Curso que leva a pessoa **da ideia até o post publicado**. Jornada:
1. 💡 **Ter a ideia** do que postar (sair do branco).
2. 🧩 **Desenvolver o conteúdo** (estrutura, roteiro, mensagem).
3. 🖌️ **Montar a base no Canva** (layout bonito e organizado).
4. 🤖 **Melhorar com IA** e **gerar elementos no ChatGPT** (imagens, textos, ideias).
5. 🎨 **Finalizar a arte** (acabamento profissional).
6. 📲 **Publicar no Instagram** com a **legenda** certa (gancho, corpo, CTA).

Trilha visual sugerida: Ideia → Conteúdo → Canva → IA → ChatGPT → Arte → Post + legenda.
Pendências: nome oficial, preço, link de inscrição, logo definitiva do curso.

---

## 6. Funcionalidades / interações

- Menu mobile abre/fecha (hambúrguer).
- Animação de entrada das seções ao rolar (opcional).
- Formulário de login (área de membros) — hoje é demonstrativo; precisa de auth real.
- Botões de WhatsApp e Instagram (links externos — números/@ a confirmar).
- Downloads (freebies) e checkout (loja) — a integrar.

---

## 7. Assets usados

- **Logo** (fundo escuro, wordmark "logue." com ponto rosa) — `assets/img/logo-logue.png` e `logo-original.jpg`.
- **Foto da fundadora** — `assets/img/lorenna.jpg`.
- **Arte do curso** — `assets/img/curso-logo.jpg`.
- Demais imagens de portfólio/produtos: **a enviar/aprovar pela Lorenna**.

---

## 8. Tokens a definir no novo design system

Cores (marca: preto, rosa, lilás, verde-limão, off-white), tipografia (títulos +
texto), espaçamentos, raios de borda, estados de botão, e o padrão de
**alternância claro/escuro** entre seções. Substitua livremente — a estrutura de
conteúdo acima permanece a mesma.
