# Our Finances - Aplicativo de Controle Financeiro para Casais

Um aplicativo completo de gestão financeira desenvolvido com Next.js, TypeScript e MongoDB, especialmente projetado para casais gerenciarem suas finanças em conjunto.

## 🚀 Funcionalidades

### ✅ Implementadas
- **Dashboard Interativo**: Visão geral completa das finanças com gráficos e métricas
- **Gestão de Transações**: Controle de receitas e despesas com categorização
- **Contas Bancárias**: Gerenciamento de múltiplas contas (corrente, poupança, investimento, dinheiro)
- **Cartões de Crédito**: Controle de cartões com cálculo automático de competência de fatura
- **Investimentos**: Acompanhamento de carteira de investimentos
- **Relatórios**: Análises mensais e por categoria
- **Interface Responsiva**: Design moderno e adaptável para desktop e mobile

### 🔄 Em Desenvolvimento
- Sistema de autenticação com NextAuth.js
- Funcionalidade de parceiros/casais
- Notificações e lembretes
- Exportação de relatórios

## 🛠 Tecnologias

### Frontend
- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Lucide React** - Ícones modernos
- **Recharts** - Gráficos e visualizações

### Backend
- **Next.js API Routes** - APIs RESTful
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **bcryptjs** - Hash de senhas

### Autenticação
- **NextAuth.js** - Autenticação completa
- **MongoDB Adapter** - Persistência de sessões

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── api/               # API Routes
│   │   ├── transactions/  # APIs de transações
│   │   ├── accounts/      # APIs de contas
│   │   ├── credit-cards/  # APIs de cartões
│   │   ├── investments/   # APIs de investimentos
│   │   └── reports/       # APIs de relatórios
│   ├── transactions/      # Página de transações
│   └── page.tsx          # Dashboard principal
├── components/            # Componentes React
│   └── Layout.tsx        # Layout principal
├── models/               # Schemas MongoDB
│   ├── User.ts          # Modelo de usuário
│   ├── Account.ts       # Modelo de conta
│   ├── Transaction.ts   # Modelo de transação
│   ├── CreditCard.ts    # Modelo de cartão
│   └── Investment.ts    # Modelo de investimento
├── lib/                 # Configurações
│   └── dbConnect.ts     # Conexão MongoDB
└── utils/               # Utilitários
    ├── dateUtils.ts     # Funções de data
    └── constants.ts     # Constantes e validações
```

## 🗄 Modelagem de Dados

### Usuário
```typescript
interface User {
  email: string;
  passwordHash: string;
  partnerEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Transação
```typescript
interface Transaction {
  userId: ObjectId;
  accountId?: ObjectId;
  creditCardId?: ObjectId;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description?: string;
  transactionDate: Date;
  invoiceMonth?: string; // Para cartões de crédito
}
```

### Cartão de Crédito
```typescript
interface CreditCard {
  userId: ObjectId;
  name: string;
  limit: number;
  closingDay: number;  // Dia de fechamento
  dueDay: number;      // Dia de vencimento
  currentInvoiceMonth: string;
}
```

## 🔧 Configuração

### Pré-requisitos
- Node.js 18+
- MongoDB Atlas ou instância local
- npm ou pnpm

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd our-finances
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas configurações:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/our-finances
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

4. **Execute o projeto**
```bash
npm run dev
```

Acesse http://localhost:3000

## 📊 Funcionalidades Principais

### Dashboard
- Resumo financeiro mensal
- Gráficos de receitas vs despesas
- Distribuição de gastos por categoria
- Métricas de patrimônio total
- Ações rápidas para nova transação

### Transações
- Cadastro de receitas e despesas
- Suporte a contas bancárias e cartões de crédito
- Categorização automática
- Filtros por período e categoria
- Busca por descrição

### Cartões de Crédito
- Cálculo automático de competência de fatura
- Controle de limite disponível
- Visualização de faturas por mês
- Gestão de múltiplos cartões

### Investimentos
- Acompanhamento de carteira
- Cálculo de rentabilidade
- Suporte a ações, fundos, crypto e previdência
- Histórico de aportes

## 🔐 Regras de Negócio

### Cálculo de Competência de Cartão
```typescript
// Exemplo: Fechamento dia 10
// Compra em 09/junho → fatura de junho
// Compra em 11/junho → fatura de julho
function calculateInvoiceMonth(transactionDate: Date, closingDay: number): string {
  const date = new Date(transactionDate);
  const closingDate = new Date(date.getFullYear(), date.getMonth(), closingDay);
  
  if (date <= closingDate) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  } else {
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    return `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}`;
  }
}
```

## 🎨 Design System

### Cores Principais
- **Azul**: `#3B82F6` - Ações primárias
- **Verde**: `#10B981` - Receitas e positivo
- **Vermelho**: `#EF4444` - Despesas e negativo
- **Roxo**: `#8B5CF6` - Investimentos
- **Cinza**: `#6B7280` - Neutro

### Componentes
- Layout responsivo com sidebar
- Cards informativos com métricas
- Formulários com validação
- Tabelas com paginação
- Gráficos interativos

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Variáveis de Ambiente para Produção
- `MONGODB_URI`: String de conexão MongoDB
- `NEXTAUTH_URL`: URL da aplicação
- `NEXTAUTH_SECRET`: Chave secreta para JWT

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- **Desenvolvedor Principal** - Implementação completa do sistema

## 🔮 Roadmap

- [ ] Sistema de notificações
- [ ] Metas financeiras
- [ ] Integração com bancos (Open Banking)
- [ ] App mobile (React Native)
- [ ] Relatórios avançados
- [ ] Backup automático
- [ ] Modo escuro
- [ ] Múltiplas moedas

---

**Our Finances** - Gerencie suas finanças em casal de forma simples e eficiente! 💰💑

# our-finances
