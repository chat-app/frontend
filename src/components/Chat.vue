<template>
  <div class="chat">
    <v-layout row wrap justify-space-around>
      <v-flex xs12 class="chats" v-scroll="onScroll" id="style-1">
        <v-list v-scroll="onScroll" two-line >
          <message-block
            v-for="(message, index) in activeChannel.messages"
            :key="index"
            :message="message"
          />
        </v-list>
      </v-flex>
      <v-flex xs11 class="mt-3">
        <v-text-field v-on:keyup.enter="sendMessage" outline v-model="message.content"></v-text-field>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import MessageBlock from "../components/Message";
import { mapGetters } from 'vuex'

export default {
  components: {
    MessageBlock,
  },
  data() {
    return {
      message: {
        author: this.$store.getters.user.username,
        content: ""
      }
    };
  },
  computed: {
    ...mapGetters([
      'findActiveChannel',
      'activeServer'
    ]),
    activeChannel: function() {
      return this.findActiveChannel(this.$route.params.channelID)
    }
  },
  methods: {
    sendMessage: function() {
      if (this.message.content == "") return;
      this.message.timestamp = Date.now();
      this.activeServer.namespace.emit("messageSend", {
        channelID: this.activeChannel._id,
        message: this.message
      });
      this.message.content = "";
    },
    onScroll: function(e) {
      if (e.target.scrollTop !== 0) return
      this.activeServer.namespace.emit('fetchMessages', {
        channelID: this.activeChannel._id,
        lastMesssageTimestamp: this.activeChannel.messages[0].timestamp
      })
      const chatBox = this.$el.querySelector("#style-1");
      chatBox.scrollTop = 175;
    }
  }
};
</script>

<style scoped>
#style-1::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #585858;
}

#style-1::-webkit-scrollbar {
  width: 7px;
  background-color: #707070;
}

#style-1::-webkit-scrollbar-thumb {
  border-radius: 12px;
  -webkit-box-shadow: inset 0 0 6px rgb(0, 197, 187);
  background-color: rgba(152, 252, 255, 0.911);
}

.chat {
  padding-right: 0px;
  border-left: 2px solid gray;
  border-right: 2px solid gray;
}

.typer {
  position: absolute;
  bottom: 0;
  display: block;
  width: 70%;
}

.chats {
  height: 70vh;
  overflow: auto;
  display: flex;
  flex-direction: column-reverse;
}

</style>
