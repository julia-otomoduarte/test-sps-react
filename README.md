# Documentação da Aplicação de Gestão de Usuários - Teste Técnico SPS-group

Aplicação web desenvolvida como teste técnico para o processo seletivo da **SPS Group**.
A aplicação foi desenvolvida em React.ts para gerenciamento de usuários, integrada à API REST do projeto **test-sps-server**. O sistema oferece autenticação via JWT e um CRUD completo de usuários com controle de permissões por perfil.

## Índice

- [Pré-requisitos](#pré-requisitos)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Stack](#stack)
- [Funcionalidades](#funcionalidades)
- [Controle de Permissões](#controle-de-permissões)
- [Estrutura de Rotas](#estrutura-de-rotas)

---

## Pré-requisitos

- [Yarn](https://yarnpkg.com/)
- **API `test-sps-server` rodando em `http://localhost:3000`** — o front-end depende dela para funcionar. Sem o back-end ativo, login, cadastro e todas as operações de usuário retornarão erro.

---

## Como rodar o projeto

### 1. Clone o repositório e instale as dependências

```bash
git clone <url-do-repositorio>
cd test-sps-react
yarn
```

### 2. Suba o back-end primeiro

Certifique-se de que o servidor `test-sps-server` está rodando em `http://localhost:3000` antes de iniciar o front-end. Consulte o README do repositório da API para instruções.
Link do github da API -> `https://github.com/julia-otomoduarte/sps-test-backend`

### 3. Inicie o front-end

```bash
yarn dev
```

A aplicação estará disponível em `http://localhost:3001`.

---

## Stack

| Tecnologia        | Versão |
| ----------------- | ------ |
| React             | 18     |
| TypeScript        | 5      |
| MUI (Material UI) | 7      |
| React Router DOM  | 6      |
| React Hook Form   | 7      |
| Yup               | 1      |
| Axios             | 1      |
| Notistack         | 3      |
| Framer Motion     | 12     |

---

## Funcionalidades

### Landing Page — `/`

Página de apresentação do sistema com acesso rápido às ações de login e cadastro. Exibe o nome e a identidade visual da SPS Group.

> Usuários já autenticados são redirecionados automaticamente ao dashboard ao tentar acessar rotas de autenticação.

---

### Login — `/auth/login`

Formulário de autenticação com **email** e **senha**. Ao realizar login com sucesso, o token JWT é armazenado no `localStorage` e o usuário é redirecionado ao dashboard.

- Exibe mensagem de erro caso as credenciais sejam inválidas.
- Validação dos campos feita com Yup.

---

### Cadastro — `/auth/register`

Formulário para criação de uma nova conta com **nome**, **email** e **senha**. Após o cadastro, o usuário é redirecionado à tela de login.

- Validação de formato de e-mail e tamanho mínimo de senha.
- Exibe feedback de erro retornado pela API (ex.: e-mail já cadastrado).

---

### Lista de Usuários — `/dashboard`

Tabela paginada com todos os usuários cadastrados no sistema. Cada linha exibe:

- ID, nome, e-mail e tipo (`admin` / `user`) do usuário.
- Clique em qualquer linha navega para o **detalhe** daquele usuário.

Inclui controles de paginação com opções de 10, 25 ou 50 itens por página. O nome e o tipo do usuário autenticado são exibidos na barra superior.

> Rota protegida — requer autenticação.

---

### Detalhe do Usuário — `/dashboard/users/:id/detail`

Exibe as informações completas de um usuário (ID, nome, e-mail, tipo).

Ações disponíveis (visíveis apenas para **admin** ou para o **próprio usuário**):

| Ação             | Descrição                                        |
| ---------------- | ------------------------------------------------ |
| **Editar**       | Navega para o formulário de edição               |
| **Trocar Senha** | Abre um dialog para alterar a senha atual        |
| **Deletar**      | Abre um dialog de confirmação e remove o usuário |

Todas as ações exibem notificações de sucesso ou erro via snackbar.

> Rota protegida — requer autenticação.

---

### Editar Usuário — `/dashboard/users/:id/edit`

Formulário pré-preenchido com os dados atuais do usuário para edição de **nome** e **e-mail**.

- Apenas **admin** ou o **próprio usuário** pode acessar a edição.
- Usuários sem permissão são redirecionados automaticamente.
- Exibe feedback de sucesso ou erro após salvar.

> Rota protegida — requer autenticação.

---

### Página 404 — `/404`

Exibida para qualquer rota inexistente. O botão de retorno redireciona de forma inteligente:

- **Usuário autenticado** → redireciona para a lista de usuários (`/dashboard`).
- **Usuário não autenticado** → redireciona para a landing page (`/`).

---

## Controle de Permissões

O sistema possui dois perfis de usuário:

| Perfil  | Permissões                                                                       |
| ------- | -------------------------------------------------------------------------------- |
| `admin` | Visualiza, edita, troca senha e deleta qualquer usuário                          |
| `user`  | Visualiza todos os usuários, mas só edita, troca senha e deleta o próprio perfil |

A verificação de permissão é feita tanto no front-end (para exibição dos botões) quanto pela API (que retorna `403` para operações não autorizadas).

---

## Estrutura de Rotas

```
/                           → Landing Page
/auth/login                 → Login
/auth/register              → Cadastro
/dashboard                  → Lista de Usuários   (autenticado)
/dashboard/users/:id/detail → Detalhe do Usuário  (autenticado)
/dashboard/users/:id/edit   → Editar Usuário      (autenticado)
/404                        → Página não encontrada
*                           → Redireciona para /404
```
