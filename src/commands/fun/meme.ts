import type { CommandInteraction } from "discord.js";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Colors, EmbedBuilder } from "discord.js";
import { ButtonComponent, Discord, Slash } from "discordx";
import { Category } from "@discordx/utilities";
import axios from "axios";

@Discord()
@Category("Fun")
export class MemeCommand {
  public static buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setLabel("NEXT").setCustomId("next").setStyle(ButtonStyle.Primary),
  );

  public static async fetchMemes(): Promise<any> {
    const { data } = await axios.get("https://meme-api.herokuapp.com/gimme");
    return data;
  }

  @ButtonComponent({ id: "next" })
  async handler(interaction: ButtonInteraction): Promise<void> {
    await interaction.deferUpdate();
    const data = await MemeCommand.fetchMemes();
    await interaction.editReply({
      embeds: [new EmbedBuilder().setTitle(data.title).setImage(data.url).setURL(data.postLink).setColor(Colors.Green)],
      components: [MemeCommand.buttonRow],
    });
  }

  @Slash({ description: "Get random memes", name: "meme" })
  async meme(interaction: CommandInteraction): Promise<void> {
    const data = await MemeCommand.fetchMemes();
    await interaction.reply({
      embeds: [new EmbedBuilder().setTitle(data.title).setImage(data.url).setURL(data.postLink).setColor(Colors.Green)],
      components: [MemeCommand.buttonRow],
    });
  }
}
