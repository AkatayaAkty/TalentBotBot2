import { createBot, getBotIdFromToken, startBot, Intents, CreateSlashApplicationCommand, Bot, Interaction, InteractionResponseTypes } from "@discordeno/mod.ts";

import "$std/dotenv/load.ts"

interface SlashCommand {
    info: CreateSlashApplicationCommand;
    response(bot: Bot, interaction: Interaction): Promise<void>;
};

// Botのトークンを.envから取得
const BotToken: string = Deno.env.get("BOT_TOKEN")!;

const HelloCommand: SlashCommand = {
    // コマンド情報
    info: {
        name: "hello_world",
        description: "こんにちはと返します。"
    },
    // コマンド内容
    response: async (bot, interaction) => {
        return await bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
                content: "こんにちは",
                // エフェメラルメッセージ (https://discord.com/developers/docs/resources/message#message-object-message-flags)
                flags: 1 << 6
            }
        });
    }
}

// ボットの作成
const bot = createBot({
    token: BotToken,
    botId: getBotIdFromToken(BotToken) as bigint,

    intents: Intents.Guilds | Intents.GuildMessages,

    // イベント発火時に実行する関数など
    events: {
        // 起動時
        ready: (_bot, payload) => {
            console.log(`${payload.user.username} is ready!`);
        },
        interactionCreate:async  (_bot, interaction) => {
            await HelloCommand.response(bot, interaction);
        }
    }
});

// コマンドの作成
bot.helpers.createGlobalApplicationCommand(HelloCommand.info);

// コマンドの登録
bot.helpers.upsertGlobalApplicationCommands([HelloCommand.info]);


await startBot(bot);

Deno.cron("Continuous Request", "*/2 * * * *", () => {
    console.log("running...");
});