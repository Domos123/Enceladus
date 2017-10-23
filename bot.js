const Commando = require('discord.js-commando');
const path = require('path');
const config = require('./config.json');

const enceladus = new Commando.Client({
  selfbot: true,
  commandPrefix: config.commandPrefix,
  owner: config.ownerID
});

require('./util/eventLoader')(enceladus);

enceladus.registry
    .registerGroups([
        ['info', 'Information Providing Commands'],
        ['util', 'Utility Commands']
    ])
    .registerDefaultGroups()
    .registerDefaultTypes()
    .registerDefaultCommands({
      ping: false,
      prefix: false,
      help:false
    })
    .registerCommandsIn(path.join(__dirname, 'commands'));

enceladus.login(config.token);
