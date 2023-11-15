const { Telegraf } = require('telegraf');
const axios = require('axios');

/**
 * Developer: Hossein Pira
 * Github: https://github.com/ReactMVC
 * Email: h3dev.pira@gmail.com
 * Telegram: @h3dev
**/

const token = 'BOT_TOKEN'; // your telegram bot token

const bot = new Telegraf(token);

bot.start(async (ctx) => {
    const chatId = ctx.chat.id;
    const msg_id = ctx.message.message_id;
    await ctx.reply('سلام! به ربات ما خوش آمدید🙂\n\nاین ربات یک هوش مصنوعی است و شما به کمک آن می توانید به پاسخ سوال هایتان برسید.\n\nیک چیزی رو باید بدونی🤚\nآخرین آمار من تا سال 2021 هست. پس لطفا درباره تاریخ و ساعت و یا قیمت اجناس و... که نیاز به بروز بودن دارند نپرسید.\n\nبرای استفاده از من در گروه باید متن خود را با .gpt یا gpt: آغاز کنید.\n.gpt Hello\ngpt: Hello', {
        reply_to_message_id: msg_id
    });
});

bot.on('text', async (ctx) => {
    if (ctx.chat.type === 'private') {
        const chatId = ctx.chat.id;
        const userText = ctx.message.text;
        const msg_id = ctx.message.message_id;

        const please = await ctx.reply('لطفا کمی صبر کنید...', {
            reply_to_message_id: msg_id
        });

        try {
            const response = await axios.post('https://us-central1-chat-for-chatgpt.cloudfunctions.net/basicUserRequestBeta', {
                data: {
                    message: userText
                },
            }, {
                headers: {
                    Host: "us-central1-chat-for-chatgpt.cloudfunctions.net",
                    Connection: "keep-alive",
                    Accept: "*/*",
                    "User-Agent":
                        "com.tappz.aichat/1.2.2 iPhone/16.3.1 hw/iPhone12_5",
                    "Accept-Language": "en",
                    "Content-Type": "application/json; charset=UTF-8",
                }
            });

            if (response.status === 200) {
                const replyText = response.data.result.choices[0].text;
                await ctx.telegram.editMessageText(chatId, please.message_id, null, replyText, {
                    parse_mode: 'Markdown'
                });
            } else {
                throw new Error('متاسفانه خطایی رخ داده است.');
            }
        } catch (error) {
            await ctx.telegram.editMessageText(chatId, please.message_id, null, 'متاسفانه خطایی رخ داده است.');
        }
    } else if (ctx.chat.type !== 'private' && ctx.message.text.startsWith('gpt:') || ctx.message.text.startsWith('.gpt')) {
        const chatId = ctx.chat.id;
        const userText = ctx.message.text.replace(/^gpt:|^\.gpt/, '').trim();
        const msg_id = ctx.message.message_id;

        const please = await ctx.reply('لطفا کمی صبر کنید...', {
            reply_to_message_id: msg_id
        });

        try {
            const response = await axios.post('https://us-central1-chat-for-chatgpt.cloudfunctions.net/basicUserRequestBeta', {
                data: {
                    message: userText
                },
            }, {
                headers: {
                    Host: "us-central1-chat-for-chatgpt.cloudfunctions.net",
                    Connection: "keep-alive",
                    Accept: "*/*",
                    "User-Agent":
                        "com.tappz.aichat/1.2.2 iPhone/16.3.1 hw/iPhone12_5",
                    "Accept-Language": "en",
                    "Content-Type": "application/json; charset=UTF-8",
                }
            });

            if (response.status === 200) {
                const replyText = response.data.result.choices[0].text;
                await ctx.telegram.editMessageText(chatId, please.message_id, null, replyText, {
                    parse_mode: 'Markdown'
                });
            } else {
                throw new Error('متاسفانه خطایی رخ داده است.');
            }
        } catch (error) {
            await ctx.telegram.editMessageText(chatId, please.message_id, null, 'متاسفانه خطایی رخ داده است.');
        }
    }
});

bot.launch();