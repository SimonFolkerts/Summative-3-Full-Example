<template>
  <div class="component-root">
    <h3>List View Component</h3>
    <button @click="fetchPosts" type="button">GET</button>
    <ul class="post-list">
      <div v-for="post of postList" :key="post._id" class="post-list-item">
        <h3>{{ post.title }}</h3>
        <img :src="`data:image/png;base64,${post.image.data}`" />
      </div>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      postList: [],
    };
  },
  methods: {
    async fetchPosts() {
      const response = await fetch("http://localhost:3000/posts");
      const data = await response.json();
      this.postList = data;
    },
  },
};
</script>

<style scoped lang="scss">
.post-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.4rem;
  border: 1px solid black;
}

.post-list-item {
  display: flex;
  justify-content: space-between;
  border: 1px solid lightgray;
  img {
    width: 300px;
    height: 100px;
    object-fit: cover;
  }
}
</style>
