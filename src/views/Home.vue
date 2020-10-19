<template>
  <div class="home text-left">
    <p>Name: {{ profile.name }}</p>
    
    <p>Account: C.{{ (profile.account || 0).toLocaleString() }}</p>
    
    <p>Reactor Count: {{ profile.reactorCount }}</p>
  </div>
</template>

<script>
import game from '@/game/game';
// @ is an alias to /src

export default {
  name: 'Home',

  data() {
    return {
      profile: {},
    };
  },

  created() {
    this.profile = game.getProfile();
  }
}
</script>
