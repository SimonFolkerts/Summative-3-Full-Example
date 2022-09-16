<template>
  <div class="component-root">
    <h3>List View Component</h3>
    <ul v-if="!loading" class="post-list">
      <ListItemPost
        @deleted="fetchPosts"
        v-for="post of postList"
        :key="post._id"
        :post="post"
      />
    </ul>
    <p v-else>loading...</p>
  </div>
</template>

<script>
import ListItemPost from "./ListItemPost.vue";
export default {
  components: {
    ListItemPost,
  },
  data() {
    return {
      // data property that stores the fetches list of posts
      postList: [],
      loading: false,
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
  async mounted() {
    this.loading = true;
    await this.fetchPosts();
    this.loading = false;
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
</style>
