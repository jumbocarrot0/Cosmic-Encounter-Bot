const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { aliens } = require('../aliens.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('alien')
        .setDescription('Replies with anything!')
        .addStringOption(option =>
            option
                .setName('alien_name')
                .setDescription('The name of the alien to receive')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('alt_timeline')
                .setDescription('Decide whether the alien is an alternate timeline alien or not'))
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Whether to use the original printed text or a revised text.')
                .addChoices(
                    { name: 'Original', value: 'original' },
                    { name: 'Revised', value: 'revised' },
                    { name: 'House Ruled', value: 'homebrew' },
                )),
    async execute(interaction) {
        let results = Object.entries(aliens)
        const type = interaction.options.getString('type')
        results = results.filter((alien) => alien[1].original.name.toLowerCase().includes(interaction.options.getString('alien_name').toLowerCase()) && (alien[1].original.altTimeline == interaction.options.getBoolean('alt_timeline')))
        if (results.length === 1) {
            const alien_id = results[0][0];
            if (type in aliens[alien_id]) {

                const alien = aliens[alien_id][type]
                console.log(alien)

                const colors = { "Green": 0x00FF00, "Yellow": 0xFFFF00, "Red": 0xFF0000 }

                const alienEmbed = new EmbedBuilder()
                    .setColor(colors[alien.alert])
                    .setTitle(alien.name);
                let gameSetup = `\n`
                if (alien.gameSetup) {
                    gameSetup += `**\nGame Setup:** ${alien.gameSetup}\n\n`
                }
                powerMarkup = `**${alien.powerName}** ${alien.powerBody
                    .replace('may use this power', '***may use*** this power')
                    .replace('use this power', '***use*** this power')
                    .replace('this power is used', 'this power is ***used***')
                    }\n\n**${alien.powerSpecialName || "\u200B"}** ${(alien.powerSpecialBody || "\u200B")
                        .replace('may use this power', '***may use*** this power')
                        .replace('use this power', '***use*** this power')
                        .replace('this power is used', 'this power is ***used***')
                    }\n\n`
                powerMarkup = powerMarkup
                    .replace("\u200B", "")
                    .replace("****", "")
                    .replace('\n\n\n\n', '\n\n')
                    .split('\n\n')
                // powerMarkup += `*${alien.history}*`
                // if (alien.altTimeline) {
                //     alienEmbed.setImage(require(`../alien icons/avatar_${alien.name.replace(' ', '_').replace('The_', '')}_AT.png`))
                // } else {
                //     alienEmbed.setImage(require(`../alien icons/avatar_${alien.name.replace(' ', '_').replace('The_', '')}.png`))
                // }
                alienEmbed.addFields(
                    { name: alien.short, value: gameSetup },
                )
                console.log(powerMarkup)
                for (let i = 0; i < powerMarkup.length; i++) {
                    if (powerMarkup[i].length > 2) {
                        alienEmbed.addFields(
                            { name: '\u200B', value: `${powerMarkup[i]}` },
                        )
                    }
                }
                alienEmbed.addFields(
                    { name: '\u200B', value: `*${alien.history}*` },
                    { name: 'Wild', value: `${alien.wildBody}` },
                    { name: 'Super', value: `${alien.superBody}` }
                )

                await interaction.reply({ embeds: [alienEmbed] });
            } else {
                await interaction.reply(`That alien is in my database, but it does not have a ${type} version`);
            }
        } else {
            await interaction.reply(`That is not an alien in my database. Make sure the spelling is correct.\nDid you mean one of: ${results.reduce((accumulator, alien, index) => accumulator + (index === results.length - 1 ? `${alien[1][type].name}` : `${alien[1][type].name}, `), "")}?`);
        }
    },
};
