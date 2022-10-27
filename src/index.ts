import "dotenv/config";
import { Client } from "discordx";
import { dirname, importx } from "@discordx/importer";
import { ActivityType, GatewayIntentBits } from "discord-api-types/v10";
import { debuglog } from "util";
import type { Interaction } from "discord.js";

const NODE_ENV = process.env.NODE_ENV === "production";
const TOKEN = NODE_ENV ? process.env.MOORE_TOKEN : process.env.MOORE_DEV_TOKEN;
const CLIENT_ID = NODE_ENV ? process.env.MOORE_CLIENT_ID : process.env.MOORE_DEV_CLIENT_ID;
const BOT_LOG = debuglog("bot");

export const bot = new Client({
  botId: CLIENT_ID,
  botGuilds: NODE_ENV ? [process.env.GUILD_ID!] : [],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages
  ],
  silent: false,
  simpleCommand: {
    prefix: "mx!",
  },
});

bot.once("ready", async () => {
  await bot.guilds.fetch();
  await bot.initApplicationCommands();

  bot.user?.setActivity(`/help | ${bot.guilds.cache.size} servers`, {
    type: ActivityType.Watching,
  });

  BOT_LOG("Logged in as %s", bot.user?.tag);
});

bot.on("interactionCreate", (interaction: Interaction) => {
  bot.executeInteraction(interaction);
});

async function main() {
  await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

  if (!TOKEN) {
    throw Error("Could not find MOORE_TOKEN or MOORE_DEV_TOKEN in your environment");
  }

  await bot.login(TOKEN);
}

main();