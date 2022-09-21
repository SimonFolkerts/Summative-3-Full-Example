<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink> |
      <RouterLink to="/about">About</RouterLink> |
      <RouterLink to="/signup">Sign Up</RouterLink> |
      <RouterLink to="/login">Log In</RouterLink>
      <a @click="logout" href="#">Log out</a>
    </nav>
  </header>

  <!-- modification of the router view to preserve the state of the home view when navigated away from. This means it doesn't have to reload when switched away from and then back to -->
  <RouterView v-slot="{ Component }">
    <!-- list of components to keep-alive here -->
    <keep-alive include="home">
      <component :is="Component" />
    </keep-alive>
  </RouterView>
</template>

<script>
import { RouterLink, RouterView } from "vue-router";
export default {
  methods: {
    async logout() {
      const response = await fetch("http://127.0.0.1:3000/logout", {
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);
      this.$router.push("/");
    },
  },
};
</script>

<style scoped></style>
