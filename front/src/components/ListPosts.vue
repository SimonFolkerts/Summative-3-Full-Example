<template>
  <div class="component-root">
    <h3>List View Component</h3>
    <!-- if loading flag is false, show the list, otherwise show load screen -->
    <ul v-if="!loading" class="post-list">
      <!--  use prop to send post data through to list items -->
      <ListItemPost
        @deleted="fetchPosts"
        v-for="post of postList"
        :key="post._id"
        :post="post"
        :user="user"
      />

      <p v-if="!postList.length">Nothing to see here, upload a post!</p>
    </ul>
    <p v-else>loading...</p>
  </div>
</template>

<script>
import ListItemPost from "./ListItemPost.vue";
export default {
  props: {
    user: Object,
  },
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
      const response = await fetch("http://127.0.0.1:3000/posts");
      // decode the data
      const data = await response.json();
      // save the data
      this.postList = data;
    },
  },

  // when mounted, show a loading indicator while waiting for the data to load. This only runs when the component is first loaded, so subsequent updates to the list of posts won't trigger the loading indicators. This means the indicators only load when the page is loaded which is a bit more intuitive
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
