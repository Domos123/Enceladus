const { Command } = require('discord.js-commando');

module.exports = class SetGameCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setgame',
      group: 'util',
      memberName: 'setgame',
      description: 'Set Discord Game Status',
      args: [
        {
          key: 'status',
          prompt: 'What game should we set?',
          type: 'string'
        }
      ]
    });
  }

  run(msg, args){
    msg.delete();
    this.client.user.setPresence({afk: true, game: {name: args['status']}});;
  }

}
