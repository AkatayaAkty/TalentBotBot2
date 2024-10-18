import { createBot, getBotIdFromToken, startBot } from "@discordeno/mod.ts";

import "$std/dotenv/load.ts"

// Botのトークンを.envから取得
const BotToken: string = Deno.env.get("BOT_TOKEN")!;

// ボットの作成
const bot = createBot({
    token: BotToken,
    botId: getBotIdFromToken(BotToken),

    // イベント発火時に実行する関数など
    events: {
        // 起動時
        ready: (_bot, payload) => {
            console.log(`${payload.user.username} is ready!`);
        }
    }
});

await startBot(bot);