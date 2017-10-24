const { Command } = require('discord.js-commando');
const RichEmbed = require('discord.js').RichEmbed;
const wikipedia = require("node-wikipedia");

module.exports = class WikiCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'wiki',
      group: 'info',
      memberName: 'wiki',
      description: 'Define a term using Wikipedia.',
      args: [
        {
          key: 'topic',
          prompt: 'What do you want to look up?',
          type: 'string'
        }
      ]
    });
  }

  async run(msg, args) {
    msg.delete();
    const topic = args['topic'];
    console.log(`Looking up ${args['topic']} on Wikipedia`);
    wikipedia.page.data(topic,{ content: true },function(response){
      if (response) {
        const parsedPage = parseWikiHTML(response.text['*']);
        const embed = new RichEmbed()
        .setTitle(response.title)
        .setDescription(parsedPage.text)
        .setColor(0x00ced1)
        .setURL(encodeURI(`https:\/\/en.wikipedia.org\/wiki\/${topic}`));
        if (parsedPage.image) {
          embed.setThumbnail(`${parsedPage.image}`);
        }
        msg.channel.send({embed});
      }
    });
  }


};

function parseWikiHTML(s) {
  var parsedPage = {}

  //Extract image
  var imagePattern = new RegExp(/\<img.+?src="(\S*\.(?:jpg|png|jpeg|gif|bmp))"/);
  var matchedImg = imagePattern.exec(s);
  if (matchedImg) {
    parsedPage.image=`https:${matchedImg[1]}`;
  }

  //Extract Text
  var textPattern = new RegExp(/\<p\>(.+?)\<\/p\>(?!(?:\s\S)*?\/td)/);
  var matchedText = textPattern.exec(s);
  if (!matchedText) {
    return null;
  }

  //Parse Text
  parsedPage.text = matchedText[1].replace(/\<\/?i\>/g, "*")    //italics
                                  .replace(/\<\/?b\>/g, "**")   //bold
                                  .replace(/\<\/?.+?\>/g, "")   //strip HTML
                                  .replace(/&#160;/g, " ")      //non breaking space
                                  .replace(/\[[0-9]+?\]/g, ""); //strip citations

  //Deal with Disambig pages
  if (parsedPage.text.indexOf("may refer to:") !== -1){
    var listPattern = new RegExp(/\<li\>(.+?)\<\/li\>/g); //Find all members of lists
    var listMembers = [];

    s.replace(/\<li\>(.+?)\<\/li\>/g, function(str, match){
      listMembers.push(match);
      console.log(`Found disambig member: ${match}`);
    });

    for (var member in listMembers){
      parsedPage.text += `\n${member.replace(/\<\/?.+?\>/g, "")}`; //strip HTML & append to text
    }
  }

  return parsedPage;
}
