<template>
  <div>
    <div v-if="post" class="post-content">
      <h3>Detail View Component</h3>
      <h2>{{ post.title }}</h2>
      <p>{{ post.content }}</p>
      <img :src="`data:image/png;base64,${post.image.data}`" />
    </div>
    <div v-else class="loading">
      <h3>loading...</h3>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      post: null,
    };
  },
  methods: {
    async fetchPost() {
      const response = await fetch(
        `http://localhost:3000/posts/${this.$route.params.id}`
      );
      const data = await response.json();
      this.post = data;
    },
  },
  mounted() {
    this.fetchPost();
  },
};
</script>

<style lang="scss" scoped></style>
