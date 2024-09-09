<template>
  <div>
    <button v-if="!user" @click="login">Login</button>
    <div v-else>
      <p>Welcome, {{ user.username }}!</p>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script lang="ts" src="./AuthVue.ts"></script>
