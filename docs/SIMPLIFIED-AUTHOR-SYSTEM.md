# Sistema de Autores Simplificado

## Mudanças Implementadas

O sistema de autores foi simplificado para resolver problemas de conectividade e melhorar a experiência do usuário.

### O que mudou?

1. **Remoção da seleção de autor nos formulários**
   - A aba "Autor" foi removida dos formulários de criação/edição
   - Não é mais necessário selecionar um autor ao criar conteúdo

2. **Autor padrão automático**
   - Todo conteúdo criado sem autor especificado usa automaticamente o autor "Admin"
   - O sistema cria o autor "Admin" automaticamente se não existir

3. **Benefícios**
   - Elimina bugs de seleção de autor
   - Simplifica o fluxo de criação de conteúdo
   - Remove dependência de buscar autores do Supabase
   - Torna o sistema mais robusto e rápido

## Como funciona?

### Criação de Conteúdo

Quando você cria uma review, notícia ou guia:
1. Preenche os campos normais (título, conteúdo, etc.)
2. **NÃO precisa** selecionar um autor
3. O sistema automaticamente atribui o autor "Admin"

### Autor Padrão

O autor "Admin" é criado automaticamente com:
- **Nome**: Admin
- **PSN ID**: PlatinaNews
- **Bio**: Equipe PlatinaNews
- **Role**: admin

### Banco de Dados

O autor padrão é armazenado na tabela `authors` do Supabase:
```sql
-- O sistema cria automaticamente se não existir
INSERT INTO authors (id, name, avatar, psn_id, bio, role)
VALUES (
  'uuid-gerado',
  'Admin',
  '/placeholder.svg?height=100&width=100',
  'PlatinaNews',
  'Equipe PlatinaNews',
  'admin'
);
```

## Adicionando Sistema de Autores Completo (Futuro)

Se você quiser adicionar um sistema de autores completo no futuro:

1. **Reativar a aba "Autor" nos formulários**
   - Descomentar o código em `post-form.tsx` e `guide-form.tsx`
   - Adicionar de volta o `useEffect` que busca autores

2. **Criar página de gerenciamento de autores**
   - Já existe em `/admin/autores`
   - Permite criar, editar e deletar autores

3. **Implementar autenticação por autor**
   - Cada autor tem seu próprio login
   - Autores só podem editar seu próprio conteúdo

## Troubleshooting

### Conteúdo sem autor

Se você tem conteúdo antigo sem autor:
```sql
-- Atualizar todos os posts sem autor para usar o autor padrão
UPDATE reviews SET author_id = (SELECT id FROM authors WHERE name = 'Admin' LIMIT 1) WHERE author_id IS NULL;
UPDATE news SET author_id = (SELECT id FROM authors WHERE name = 'Admin' LIMIT 1) WHERE author_id IS NULL;
UPDATE guides SET author_id = (SELECT id FROM authors WHERE name = 'Admin' LIMIT 1) WHERE author_id IS NULL;
```

### Criar autor padrão manualmente

Se precisar criar o autor padrão manualmente:
```sql
INSERT INTO authors (id, name, avatar, psn_id, bio, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Admin',
  '/placeholder.svg?height=100&width=100',
  'PlatinaNews',
  'Equipe PlatinaNews',
  'admin',
  NOW(),
  NOW()
);
