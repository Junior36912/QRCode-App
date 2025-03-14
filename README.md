# QR Code Scanner App

Este é um aplicativo de leitura de QR Code desenvolvido em React Native. O aplicativo permite que os usuários escaneiem códigos QR, visualizem o conteúdo escaneado, salvem os dados escaneados e gerenciem uma lista de códigos escaneados. Além disso, oferece funcionalidades como copiar conteúdo para a área de transferência e deletar dados.

## Funcionalidades

- **Escanear QR Codes**: Utiliza a câmera do dispositivo para escanear códigos QR
- **Salvamento Local**: Armazena dados escaneados usando AsyncStorage
- **Gerenciamento de Lista**: Visualize, copie e exclua itens individualmente
- **Limpeza Total**: Opção para deletar todos os dados de uma vez
- **Alternância de Câmera**: Troque entre câmera frontal e traseira

## Como Usar

### Tela Inicial
- Dois botões: "Escanear" e "Lista dos Escaneados"
- Toque em "Escanear" para iniciar a câmera

### Modo Escaneamento
- Aponte a câmera para um QR Code
- O conteúdo será exibido e salvo automaticamente
- Toque em "Voltar" para retornar à tela inicial

### Lista de Escaneados
- Visualize todos os QR Codes escaneados
- Toque longo em um item para:
  - Copiar conteúdo
  - Excluir item individual
- Botão "Deletar Todos" no topo (com confirmação)

## Estrutura do Código

O projeto está organizado em um único componente principal (`app.tsx`) com:

- Gerenciamento de estado para dados escaneados
- Controle de navegação entre telas
- Lógica de permissões da câmera
- Implementação de menus contextuais

## Dependências

- `expo-camera`: Controle de câmera
- `@react-native-async-storage/async-storage`: Armazenamento local
- `react-native-popup-menu`: Menus contextuais
- `expo-clipboard`: Manipulação de área de transferência

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Junior36912/QRCode-App.git
```

2. Instale as dependências:
```bash
cd qr-code-scanner-app && npm install
```

3. Inicie o servidor:
```bash
npm start
```

4. Escaneie o QR Code com o app Expo Go (dispositivo físico)

## Contribuição
Contribuições são bem-vindas! Reporte issues ou envie pull requests com melhorias.
