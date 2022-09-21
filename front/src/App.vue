<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink> |
      <RouterLink to="/about">About</RouterLink> |
      <RouterLink to="/signup">Sign Up</RouterLink> |
      <!-- if a user isn't stored, show login link, else if a user is stored, show the logout button -->
      <RouterLink v-if="!user" to="/login">Log In</RouterLink>
      <a v-else @click="logout" href="#">Log out</a>
    </nav>
    <!-- if a user is stored, then show a welcome message for the user -->
    <h3 v-if="user">Welcome, {{ user.username }}</h3>
  </header>

  <!-- modification of the router view to preserve the state of the home view when navigated away from. This means it doesn't have to reload when switched away from and then back to -->
  <RouterView @user-logged-in="updateUser" v-slot="{ Component }" :user="user">
    <!-- list of components to keep-alive here -->
    <keep-alive include="home">
      <component :is="Component" />
    </keep-alive>
  </RouterView>
</template>

<script>
import { RouterLink, RouterView } from "vue-router";
export default {
  data() {
    return {
      // store the logged in user here
      user: null,
    };
  },
  methods: {
    async checkUser() {
      const response = await fetch("http://127.0.0.1:3000/authenticate", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.username) {
        this.user = data;
      } else {
        this.user = null;
      }
    },
    async logout() {
      const response = await fetch("http://127.0.0.1:3000/logout", {
        credentials: "include",
      });
      const data = await response.json();
      this.user = null;
      this.$router.push("/");
    },

    // when a login event is detected, send the data to be stored as a data property
    updateUser(user) {
      this.user = user;
    },
  },
  mounted() {
    this.checkUser();
  },
};
</script>

<style scoped></style>
