const Discord = require('discord.js');
const fetch = require('node-fetch');
const config = require('./config.json');


config.Battlemetrics.Bots.forEach(async (Bot) => {
    const client = new Discord.Client({
        intents: [
            'GUILDS',
            'DIRECT_MESSAGES',
            'GUILD_MESSAGES',
            'GUILD_MEMBERS'
        ],
        partials: ['MESSAGE', 'CHANNEL']
    });

    

    client.on('ready', async () => {
        console.log(`\n------ [ BOT IS ONLINE ] ------\nLogged in as: ${client.user.tag}\nMade by: Skippy\n-------------------------------`);
    
        // Execute the function immediately and then use setInterval
        (async function fetchData() {
            await fetchDataAndUpdateStatus();
            setInterval(fetchDataAndUpdateStatus, Bot.DISCORD_CONFIG.update_interval * 60 * 1000);
    
            // Set interval.
        })();
    
        // Function to fetch data and update status
        async function fetchDataAndUpdateStatus() {
            try {
                let player_count = 0;
    
                console.log("Part 1");
    
                // Fetch server information from BattleMetrics API
                let response = await fetch(`https://api.battlemetrics.com/servers/${Bot.SERVER_ID}`, { headers: { 'Authorization': `Bearer ${Bot.BATTLEMETRICS_API_KEY}` } });
    
                // Access player count from the fetched data
                let data = await response.json();
                player_count += data['data']['attributes']['players'];
                console.log(player_count); // Add this line to check the API response
    
                // Call a new function within the try block
                processPlayerCount(player_count);
            } catch (error) {
                console.error(`Error fetching server information for bot ${client.user.tag}: ${error.message}`);
            }
        }
    });
    
    async function  processPlayerCount(player_count) { 
        try {
            await client.user.setStatus(Bot.DISCORD_CONFIG.status);
            await client.user.setActivity(`${player_count} Players `, { type: Bot.DISCORD_CONFIG.type });
           await  console.log(Bot.DISCORD_CONFIG.status, player_count, Bot.DISCORD_CONFIG.type );
            
        } catch (error) {
            console.error(`Error setting status: ${error.message}`);
        }
        
    }



    



    client.login(Bot.BOT_TOKEN); // login to all bots if works  
});


