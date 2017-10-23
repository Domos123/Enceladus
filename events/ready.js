module.exports = enceladus => {
  console.log(`Enceladus is ready in ${enceladus.guilds.size} servers! \nServers: ${enceladus.guilds.map(g => g.name).join(', ')}`);
  enceladus.user.setAFK(true);
};
