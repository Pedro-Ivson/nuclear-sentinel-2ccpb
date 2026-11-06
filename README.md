# Nuclear Sentinel · MVP acadêmico

Aplicativo mobile demonstrativo desenvolvido para o desafio AMAZUL — Nuclear Sentinel. O MVP registra, consulta e classifica ocorrências em uma instalação fictícia, com navegação por login, listagem, cadastro e detalhes.

> **Simulação acadêmica:** os locais, contas, registros e níveis de alerta são fictícios. Este aplicativo não é conectado a instalações ou sistemas reais e não deve ser usado para operação ou tomada de decisão.

## Funcionalidades

- Autenticação local simulada com perfis de operador e supervisor.
- Sessão e ocorrências persistidas no dispositivo com AsyncStorage.
- Catálogo fictício de ocorrências carregado no primeiro acesso.
- Lista pesquisável, filtros por nível de alerta e resumo dos registros.
- Cadastro com campos obrigatórios e mensagens de validação visíveis.
- Detalhes com local, categoria, severidade, classificação, status e autoria.
- Navegação entre login, listagem, cadastro e detalhes.

## Regra de classificação

O operador seleciona uma severidade no cadastro. O aplicativo atribui automaticamente o alerta:

| Severidade selecionada | Nível de alerta |
| --- | --- |
| Baixa | Normal |
| Média | Atípica |
| Alta | Crítica |

Esta relação é uma regra didática e transparente para demonstrar a funcionalidade do MVP. Ela não representa critérios de segurança nuclear.

## Tecnologias

- React Native
- Expo SDK 57
- TypeScript
- Expo Router
- AsyncStorage

## Estrutura do código

```text
src/
  app/                 Rotas de login, ocorrências, cadastro e detalhes
  components/          Componentes de interface reutilizáveis
  constants/           Paleta visual do aplicativo
  contexts/            Sessão local do usuário
  data/                Catálogo inicial fictício
  services/            Autenticação simulada, classificação e armazenamento
  types/               Tipos de usuário, papel, ocorrência, severidade e status
  utils/               Formatação de data e rótulos
```

## Contas de teste

As duas contas usam a senha `sentinel2026`.

| Perfil | E-mail |
| --- | --- |
| Operador | `operador@nuclearsentinel.app` |
| Supervisor | `supervisor@nuclearsentinel.app` |

A tela de login abre preenchida com a conta de operador para facilitar a demonstração. O papel do supervisor está modelado e aparece na sessão; regras adicionais de autorização podem ser evoluídas em etapas futuras.

## Executar localmente

É necessário ter Node.js instalado. No terminal, dentro da pasta do aplicativo:

```bash
npm install --ignore-scripts
npx expo start
```

Escaneie o QR code com o Expo Go para abrir o app em um celular. Também é possível abrir a versão web pressionando `w` no terminal do Expo. O comando de instalação ignora scripts automáticos das dependências, compatível com a política npm desta máquina. O Expo SDK usado nesta versão permite a demonstração com Expo Go.

## Escopo e limitações

O login é simulado, sem serviço de autenticação remoto. O AsyncStorage é um armazenamento local não criptografado, adequado somente para esta demonstração. O app não envia dados para servidores e não representa um produto operacional.
