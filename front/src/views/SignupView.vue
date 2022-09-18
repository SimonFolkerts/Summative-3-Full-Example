<template>
  <div>
    <h1>Signup</h1>
    <form @submit.prevent>
      <div class="form-group">
        <label for="username">User Name</label>
        <input v-model="username" id="username" type="text" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input v-model="password" id="password" type="password" required />
      </div>
      <button @click="signup" type="button">Sign Up</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: null,
      password: null,
    };
  },
  methods: {
    async signup() {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      });
      const data = await response.json();
      console.log(data.message);
    },
  },
};
</script>

<style scoped lang="scss"></style>
