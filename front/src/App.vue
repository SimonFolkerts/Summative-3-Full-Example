<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink> |
      <RouterLink to="/about">About</RouterLink> |
      <RouterLink to="/signup">Sign Up</RouterLink> |
      <RouterLink to="/login">Log In</RouterLink>
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
</script>

<style scoped></style>
