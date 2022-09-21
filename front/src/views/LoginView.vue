<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent>
      <div class="form-group">
        <label for="username">User Name</label>
        <input v-model="username" id="username" type="text" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input v-model="password" id="password" type="password" required />
      </div>
      <button @click="login" type="button">Log In</button>
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
    async login() {
      const response = await fetch("http://127.0.0.1:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      });
      const data = await response.json();
      // i fuser data is returned then authentication was a success, save the user data as a data property.
      if (data.username) {
        this.$emit("userLoggedIn", data);
      } else {
        // else if not then it must have failed, log an error message and await retry
        console.log("error");
      }
    },
  },
};
</script>

<style scoped lang="scss"></style>
