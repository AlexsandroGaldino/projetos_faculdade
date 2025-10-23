```markdown
ONG Restaurar

Plataforma web responsiva desenvolvida para uma organização sem fins lucrativos, com o objetivo de **divulgar projetos sociais, captar voluntários e facilitar o cadastro de novos participantes**.  
O projeto faz parte de uma entrega acadêmica focada na aplicação prática de **CSS3, layout responsivo e design system moderno.**

---

Objetivo do Projeto

Transformar a estrutura HTML da primeira entrega em uma **interface visual profissional, acessível e adaptável a diferentes dispositivos**, utilizando **CSS3 avançado**, **Grid**, **Flexbox** e boas práticas de desenvolvimento front-end.

---

Estrutura de Pastas

```

ONG Restaurar/
│
├── CSS/
│   └── style.css
│
├── HTML/
│   ├── index.html
│   ├── projetos.html
│   └── cadastro.html
│
├── ASSETS/
│   ├── imagens/
│   │   ├── equipe1.jpg
│   │   ├── equipe2.jpg
│   │   ├── equipe3.jpg
│   │   ├── equipe4.jpg
│   │   └── equipe5.jpg
│   └── JS/
│       └── main.js

```

---

Design System

O design system do projeto foi desenvolvido com **variáveis CSS customizadas**, permitindo padronização e manutenção facilitada do estilo.

Paleta de Cores (8 cores)

| Função | Cor | Exemplo |
|:-------|:----|:--------|
| Primária | `#1B5E20` | Verde escuro |
| Secundária | `#4CAF50` | Verde médio |
| Destaque | `#81C784` | Verde claro |
| Ação | `#FFC107` | Amarelo |
| Erro | `#D32F2F` | Vermelho |
| Sucesso | `#388E3C` | Verde sucesso |
| Fundo claro | `#F5F5F5` | Cinza claro |
| Texto principal | `#212121` | Preto acinzentado |

---

Tipografia Hierárquica

| Elemento | Tamanho |
|-----------|----------|
| Títulos (h1) | 48px |
| Subtítulos (h2) | 32px |
| Destaques (h3) | 24px |
| Texto padrão | 16px |
| Legendas | 12px |

---

Sistema de Espaçamento Modular

Utiliza múltiplos de 8px:
```

8px, 16px, 24px, 32px, 48px, 64px

````

---

Layout e Responsividade

- **Layout principal:** CSS Grid (sistema de 12 colunas);
- **Alinhamentos internos:** Flexbox;
- **Breakpoints definidos:**
  - 320px (mobile pequeno)
  - 480px (mobile médio)
  - 768px (tablet)
  - 1024px (notebook)
  - 1280px+ (desktop)
- **Layout adaptável:** conteúdo reorganizado e redimensionado de acordo com a tela;
- **Acessibilidade:** contraste de cores, textos legíveis e botões com estados visuais.

---

Navegação Interativa

- **Menu principal responsivo**
- **Scroll suave** entre seções da página;
- **Feedback visual** ao clicar ou navegar.

---

Componentes de Interface

| Componente | Descrição |
|-------------|------------|
|  **Cards de Projetos** | Exibição dinâmica de projetos sociais, com imagens e descrições. |
|  **Botões Interativos** | Estados visuais: `hover`, `focus`, `active`, `disabled`. |
|  **Formulário Estilizado** | Validação visual e máscaras de entrada (CEP, telefone). |
|  **Feedbacks Dinâmicos** | `modals`, `alerts` e `toasts` personalizados com JS. |
|  **Badges e Tags** | Utilizadas para classificação de projetos e status. |

---

Tecnologias Utilizadas

- **HTML5** – Estrutura semântica e acessível.  
- **CSS3** – Design system, Grid, Flexbox e responsividade.  
- **JavaScript (ES6)** – Interatividade e manipulação de DOM.  
- **API ViaCEP** – Preenchimento automático de endereço.  
- **Git & GitHub** – Controle de versão e hospedagem do código.  

---

Funcionalidades Principais

- ✅ Layout responsivo em 5 breakpoints  
- ✅ Menu hambúrguer com dropdown  
- ✅ Sistema de grid com 12 colunas  
- ✅ Cards dinâmicos e adaptáveis  
- ✅ Formulário com validação e feedback visual  
- ✅ Máscara de CEP e integração com API  
- ✅ Modais e alertas personalizados  
- ✅ Design system com variáveis CSS  

---

Como Executar o Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/AlexsandroGaldino/projetos_faculdade.git
````

2. Acesse a pasta:

   ```bash
   cd "ONG Restaurar"
   ```

3. Abra o arquivo principal no navegador:

   ```bash
   open HTML/index.html
   ```

*(ou clique duas vezes em `index.html` para abrir no navegador)*

---

Padrões de Organização

* Estrutura modular de CSS, dividida por seções (base, layout, componentes).
* Separação entre camadas de conteúdo (HTML), estilo (CSS) e comportamento (JS).
* Código indentado e comentado para facilitar manutenção e leitura.

---

 Autor

**Alexsandro Pereira Galdino da Costa**
 Curso: Análise e Desenvolvimento de Sistemas
 Faculdade: *[Cruzeiro do sul]*
 GitHub: [AlexsandroGaldino](https://github.com/AlexsandroGaldino)

---

Licença

Este projeto foi desenvolvido para fins **educacionais e acadêmicos**.
O uso, modificação e compartilhamento são livres, desde que mantidos os devidos créditos.

```
