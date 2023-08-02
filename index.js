const Discord = require("discord.js");
const fs = require("fs");
const fetch = require("cross-fetch");
const moment = require('moment');
const prefix = '%sv';
// Chargez le fichier JSON
const users = JSON.parse(fs.readFileSync("users.json"));

// Créez un client Discord
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.MessageContent
    ]
});

// Définissez une fonction pour faire une requête GET sur l'API Storycraft
const getVote = async (userId) => {
    const url = `https://storycraft.fr/vote/user/${userId}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

const already_send_1 = [];
const already_send_2 = [];

// Définissez une fonction pour envoyer un message au canal Discord
const sendMessage = (user, vote) => {
    if(vote.message == undefined) {
        if (vote.sites['1'] == null && !already_send_1.includes(user.name)) {
            already_send_1.push(user.name)
            client.users.fetch(user.id, false).then((u) => {
                u.send(`${user.name} Vote 1 Prêt`);
            });
        }
    
        if (vote.sites['2'] == null && !already_send_2.includes(user.name)) {
            already_send_2.push(user.name)
            client.users.fetch(user.id, false).then((u) => {
                u.send(`${user.name} Vote 2 Prêt`);
            });
        }
    }
};

// Définissez une fonction pour boucler sur les lignes du fichier JSON et faire une requête GET pour chacune
const loopOverUsers = async () => {
    for (const user of users) {
        const vote = await getVote(user.name);
        sendMessage(user, vote);
    }
};

// Définissez une fonction pour exécuter le bot
const runBot = async () => {
    setInterval(loopOverUsers, 5000);
    client.login('MTEzNjAyNjM3NDIwMTY4MDAyMw.Gnen-z.1ejKAk_4-jU_SQjyM20z2y6FVnU7fAjUL6xkws');
};

runBot();

client.on(Discord.Events.ClientReady, () => {
    console.log('ready');
})

client.on(Discord.Events.MessageCreate, message => {
    if (!message.author.bot) {
        let args = message.content.split(' ')
        if (args[1] == 'notifme') {
            fs.readFile('users.json', (err, data) => {

                let saved = JSON.parse(data)
                saved.push({
                    "id": message.author.id,
                    "name": args[2]
                })

                fs.writeFile('users.json', JSON.stringify(saved), (err, data) => {
                    message.reply('Vous avez été ajouté/e avec succes a la list des notifications')
                })
                
            })
        }
    }

})