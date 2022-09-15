<template>
  <div class="component-root">
    <h3>List View Component</h3>
    <button @click="fetchPosts" type="button">GET</button>
    <ul class="post-list">
      <div v-for="post of postList" :key="post._id" class="post-list-item">
        <h3>{{ post.title }}</h3>

        <!-- New button for deletion -->
        <button @click="deletePost" :data-id="post._id" type="button">
          Delete
        </button>

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
    async deletePost(e) {
      const response = await fetch(
        `http://localhost:3000/posts/${e.target.dataset.id}`,
        {
          method: "DELETE",
        }
      );
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
  button {
    align-self: center;
  }
}
</style>
