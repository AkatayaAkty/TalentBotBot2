import {
  createBot,
  getBotIdFromToken,
  startBot,
  Intents,
  CreateSlashApplicationCommand,
  Bot,
  Interaction,
  InteractionResponseTypes,
} from "@discordeno/mod.ts";

// interface for commands
interface SlashCommand {
  info: CreateSlashApplicationCommand;
  response(bot: Bot, interaction: Interaction): Promise<void>;
}

// トークンを Secrets から取得
const token = Deno.env.get("DISCORD_TOKEN");

export default async function handler(req: Request): Promise<Response> {
  // トークンがなければエラーを返す
  if (!token) {
    console.error("Missing DISCORD_TOKEN");
    return new Response("Missing token", { status: 500 });
  }

  const HelloCommand: SlashCommand = {
    info: {
      name: "hello_world",
      description: "こんにちはと返します。",
    },
    response: async (bot, interaction) => {
      return await bot.helpers.sendInteractionResponse(
        interaction.id,
        interaction.token,
        {
          type: InteractionResponseTypes.ChannelMessageWithSource,
          data: {
            content: "こんにちは",
            flags: 1 << 6,
          },
        },
      );
    },
  };

  const bot = createBot({
    token: token,
    botId: getBotIdFromToken(token) as bigint,
    intents: Intents.Guilds | Intents.GuildMessages,

    events: {
      ready: (_bot, payload) => {
        console.log(`${payload.user.username} is ready!`);
      },
      interactionCreate: async (_bot, interaction) => {
        await HelloCommand.response(bot, interaction);
      },
    },
  });

  bot.helpers.upsertGlobalApplicationCommands([HelloCommand.info]);

  // `startBot` を呼び出して起動
  await startBot(bot);

  return new Response("Bot started successfully");
}
