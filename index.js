const discord = require('discord.js');
const client = new discord.Client();
const config = require('./config.json');
const search = require('youtube-search');
const opts = {
    maxResults: 10,
    key: config.youtube_api,
    type: 'video'
}
client.on('ready', () => {
    console.log('Bot Aktif');
});

client.on('message',async message => {
    if(message.author.bot) return;

    if(message.content.toLowerCase()===config.prefix+'p'){
        let embed = new discord.MessageEmbed()
            .setColor('#73ffdc')
            .setDescription("Lütfen aramak istediğiniz kelimeyi yazın.")
            .setTitle("Brokolik.com Music");
        let embedMsg = await message.channel.send(embed);
        
        let filter = m => m.author.id === message.author.id;
        let query = await message.channel.awaitMessages(filter, {max:1});
        
        let  results = await search(query.first().content, opts);
        
        
        if(results){
            let youtubeResults = results.results;
            let i = 0;
            let titles = youtubeResults.map(result => {
                i++;
                return i + ") " + result.title;
            });
            
            let embed = new discord.MessageEmbed()
            .setColor('#73ffdc')
            .setDescription(titles.join("\n"))
            .setTitle("Arama Sonuçları");
            message.channel.send(embed);

            
            
            let filter = m => m.author.id === message.author.id;
            
            let collected = await message.channel.awaitMessages(filter, {max:1});
            

            let selected = youtubeResults[collected.first().content - 1];
            embed = new discord.MessageEmbed()
            .setDescription(selected.description)
            .setThumbnail(selected.thumbnails.default.url)
            .setURL(selected.link)
            .setTitle(selected.link);
            message.channel.send(embed);

            

            
            
        }
    }    
});   

client.login(config.token);

