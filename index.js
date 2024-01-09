const Discord = require('discord.js');
const fetch = require('node-fetch');
const fs = require('fs');
const moment = require('moment');
const config = require('./config.json');

config.Battlemetrics.Bots.forEach(Bot => {
    const client = new Discord.Client({
        intents: [
            'GUILDS',
            'DIRECT_MESSAGES',
            'GUILD_MESSAGES',
            'GUILD_MEMBERS'
        ],
        partials: ['MESSAGE', 'CHANNEL']
    });

    client.on('ready', () => {
        console.log(`\n------ [ BOT IS ONLINE ] ------\nLogged in as: ${client.user.tag}\nMade by: Skippy & 17\n-------------------------------`);
    });

    client.login(Bot.BOT_TOKEN); // should login to all bots just need to define eatch bot as itself. above
});
