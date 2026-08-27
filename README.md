# FinanceTracker

Aplicação de controle financeiro pessoal: cadastro e login de usuário, lançamento de receitas e despesas, categorização, filtros por período/categoria e um dashboard com o resumo financeiro.

## Tecnologias

**Backend** — `backend/FinanceTracker.Api/`
- ASP.NET Core Web API (.NET 10)
- Entity Framework Core + [Npgsql](https://www.npgsql.org/) (PostgreSQL)
- Autenticação JWT (`Microsoft.AspNetCore.Authentication.JwtBearer`)
- Hash de senha via `PasswordHasher<T>` (ASP.NET Core Identity, sem o Identity completo)

**Frontend** — `frontend/`
- React 19 + TypeScript + Vite
- React Router (rotas) e Redux Toolkit (estado compartilhado — sessão do usuário, categorias)
- Tailwind CSS (estilização)
- lucide-react (ícones)

**Banco de dados**: PostgreSQL

## Arquitetura

### Backend — camadas

```
Controllers/   endpoints HTTP — recebem DTO, chamam um Service, devolvem DTO. Sem regra de negócio.
Services/      regras de negócio da aplicação.
Repositories/  acesso a dados via EF Core (AppDbContext).
Models/        entidades de domínio (User, Transaction, Category, TransactionType).
DTOs/          contratos de entrada/saída da API — nunca expõem uma entidade do EF diretamente.
Data/          AppDbContext e mapeamento do EF Core.
Migrations/    histórico de migrations do EF Core.
```

Fluxo de dependência sempre em uma direção: `Controller -> Service -> Repository -> Data`. Um controller nunca acessa `Data`/`Repositories` diretamente.

Autorização: toda rota (exceto `POST /api/auth/register` e `POST /api/auth/login`) exige um JWT válido (`[Authorize]`) e é sempre escopada ao usuário autenticado — cada usuário só vê/edita seus próprios dados.

### Frontend — estrutura

```
pages/        telas (uma por arquivo) — DashboardPage, TransactionsPage (genérica, usada por Expenses e Income), CategoriesPage, LoginPage, RegisterPage.
routes/        AppRoutes.tsx — definição centralizada de todas as rotas.
components/     componentes reutilizáveis, organizados por área (layout/, dashboard/, transactions/, categories/).
store/           Redux Toolkit — um slice por domínio (authSlice, categoriesSlice); estado que só uma tela usa fica local (useState), não vai pro Redux.
services/         uma chamada HTTP nunca fica direto num componente — sempre passa por um service (authService, categoryService, transactionService, dashboardService), que usa o httpClient central.
types/             tipos TypeScript espelhando os DTOs do backend.
lib/                utilitários sem estado (formatação de moeda/data, decodificação de JWT, paleta de gráfico).
```

Autenticação: o token JWT fica no Redux (`authSlice`), persistido em `localStorage`. Rotas protegidas usam o componente `ProtectedRoute`, que redireciona para `/login` quando não há sessão.

## Funcionalidades

- Cadastro e login de usuário (JWT)
- Categorias: criar, listar, editar, excluir (por usuário; nome único por usuário; não é possível excluir uma categoria com transações vinculadas)
- Transações (receitas e despesas): criar, listar, editar, excluir; filtro por período e por categoria
- Dashboard: total de receitas, total de despesas, saldo, taxa de economia, gastos por categoria e lançamentos recentes

## Como rodar o projeto

### Pré-requisitos

- [.NET SDK 10](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) 20+
- PostgreSQL rodando localmente (ou acessível por rede)

### Backend

```bash
cd backend/FinanceTracker.Api

# segredos locais (connection string e chave JWT) — nunca vão pro appsettings.json/git
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=finance_tracker;Username=postgres;Password=<sua-senha>"
dotnet user-secrets set "Jwt:Key" "<uma-string-aleatoria-de-pelo-menos-32-caracteres>"

# aplica as migrations no banco
dotnet tool restore
dotnet tool run dotnet-ef database update

# sobe a API em http://localhost:5147
dotnet run
```

### Frontend

```bash
cd frontend
npm install

# sobe em http://localhost:5173
npm run dev
```

Rode os dois ao mesmo tempo (dois terminais). O frontend aponta para `http://localhost:5147/api` por padrão (`VITE_API_URL` para sobrescrever).

## Configuração

| Chave | Onde fica | Observação |
|---|---|---|
| `ConnectionStrings:DefaultConnection` | `dotnet user-secrets` (local, fora do git) | string de conexão do PostgreSQL |
| `Jwt:Key` | `dotnet user-secrets` (local, fora do git) | chave de assinatura do JWT (HMAC SHA-256) |
| `Jwt:Issuer` / `Jwt:Audience` / `Jwt:ExpiresInMinutes` | `appsettings.json` | não sensíveis, versionadas |
| `Cors:AllowedOrigins` | `appsettings.Development.json` | origem do frontend em desenvolvimento (`http://localhost:5173`) |

Nenhuma credencial real fica em arquivo versionado — segredos de desenvolvimento local sempre via `dotnet user-secrets`.
