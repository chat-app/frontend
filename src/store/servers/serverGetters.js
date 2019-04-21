const getters = {
  servers: state => state.servers,
  activeServer: state => state.servers.find(server => server.isActive),
  serverUsers: (state, gettersArg) => {
    if (!gettersArg.activeServer) return null;
    return gettersArg.activeServer.users;
  },
  activeChannel: (state, gettersArg) => {
    if (!gettersArg.activeServer) return null;
    return gettersArg.activeServer.channels.find(
      channel => channel.channelName === gettersArg.activeServer.currentChannel
    );
  }
};

export default getters;
