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
                let queued_players = 0;
                let maxPlayers = 0;
                let Status = "";
    
                console.log("Part 1");
    
                // Fetch server information from BattleMetrics API
                let response = await fetch(`https://api.battlemetrics.com/servers/${Bot.SERVER_ID}`, { headers: { 'Authorization': `Bearer ${Bot.BATTLEMETRICS_API_KEY}` } });
    
                // Access player count from the fetched data
                let data = await response.json();
                player_count += data['data']['attributes']['players'];
                //console.log(player_count); // Add this line to check the API response
                
                queued_players += data['data']['attributes']['details']['rust_queued_players'];
                //console.log(queued_players); // Add this line to check the API response

                maxPlayers += data['data']['attributes']['maxPlayers'];
                //console.log(maxPlayers); // Add this line to check the API response

                Status += data['data']['attributes']['status'];
                //console.log(Status); // Add this line to check the API response
    
                // Call a new function within the try block
                processPlayerCount(player_count, queued_players, maxPlayers, Status);
            } catch (error) {
                console.error(`Error fetching server information for bot ${client.user.tag}: ${error.message}`);
            }
        }
        
    });
    
   function processPlayerCount(player_count, queued_players, maxPlayers, Status) {
        try {
            // Set Discord bot status
            // Log status, player count, and type
            console.log(player_count, queued_players, maxPlayers, Status);
    
            // Check if queued_players is greater than or equal to 1
            if (queued_players >= 1) {
                client.user.setActivity(`${player_count}/${maxPlayers} ⇋ (${queued_players} Queued!)`, { type: Bot.DISCORD_CONFIG.type });
            } else {
                client.user.setActivity(`${player_count}/${maxPlayers} Online!`, { type: Bot.DISCORD_CONFIG.type });
            }

            if (Status === "offline") {
                 client.user.setStatus("dnd");
                 client.user.setActivity(`offline!`, { type: Bot.DISCORD_CONFIG.type });

        } else if (Status === "online") {
                 client.user.setStatus("online");
            }
        } catch (error) {
            console.error(`Error setting status: ${error.message}`);
        }
    }


    client.login(Bot.BOT_TOKEN); // login to all bots if works  
});


