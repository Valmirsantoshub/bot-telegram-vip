const TelegramBot = require('node-telegram-bot-api');

// Token do seu bot (NUNCA poste publicamente!)
const token = '7709154246:AAEPG7c9-zkL-GOqZWHKt75FgI3mk7UK-44';

const bot = new TelegramBot(token, { polling: true });

console.log('🤖 Bot rodando...');

// /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `
👋 Olá! Bem-vindo ao atendimento VIP.

💎 Aqui você pode:
1️⃣ Ver os planos disponíveis: /planos  
2️⃣ Realizar o pagamento: /pagamento  
3️⃣ Enviar comprovante: /comprovante
`);
});

// /planos
bot.onText(/\/planos/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `
💎 *Planos VIP* 💎

1 mês – R$37  
3 meses – R$99  
6 meses – R$179  
1 ano – R$299

Pagamento via Pix:  
🔑 *pix@email.com*

Após pagar, envie o comprovante com /comprovante
`, { parse_mode: 'Markdown' });
});

// /pagamento
bot.onText(/\/pagamento/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `
💸 *Seu pagamento será processado em uma área segura fora do Telegram.*

Após pagar, volte aqui e clique em *Efetuei o Pagamento*.

👇 Clique abaixo:
`, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '💳 Realizar Pagamento', url: 'https://pagamento.exemplo.com' }],
        [{ text: '✅ Efetuei o Pagamento', callback_data: 'efetuado' }]
      ]
    }
  });

  setTimeout(() => {
    bot.sendMessage(chatId, `
Para efetuar o pagamento, copie o código abaixo e acesse o app do seu banco.  
Na área *PIX*, selecione "Pix Copia e Cola".

⚠️ *Não use a opção "chave aleatória"!*

📋 Toque no código para copiar:
\`\`\`
00020101021226840014br.gov.bcb.pix256qriugu.com/public/payload/...
\`\`\`

Após pagar, clique no botão acima ⬆️
`, { parse_mode: 'Markdown' });
  }, 1000);
});

// Botão: Efetuei o Pagamento
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;

  if (query.data === 'efetuado') {
    bot.sendMessage(chatId, '✅ Comprovante será verificado manualmente. Aguarde o retorno.');
  }
});

// /comprovante
bot.onText(/\/comprovante/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '📸 Envie a imagem do comprovante aqui neste chat.');
});

// Quando o usuário envia uma imagem
bot.on('photo', (msg) => {
  const chatId = msg.chat.id;
  const nome = msg.from.first_name || msg.from.username;

  bot.sendMessage(chatId, `✅ Comprovante recebido, ${nome}! Em breve será verificado manualmente.`);
});
