<template>
  <div class="component-root">
    <h3>List View Component</h3>
    <button @click="fetchPosts" type="button">GET</button>
    <ul class="post-list">
      <!-- list rendering for the list of posts. The base64 data for the images is rendered using the special source in the image tag below -->
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
      // data property that stores the fetches list of posts
      postList: [],
    };
  },
  methods: {
    // async method that GETs the list of posts and saves it to the data property
    async fetchPosts() {
      // fetch the data
      const response = await fetch("http://localhost:3000/posts");
      // decode the data
      const data = await response.json();
      // save the data
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
