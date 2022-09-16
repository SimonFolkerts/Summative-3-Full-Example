<template>
  <div class="post-list-item">
    <h3>{{ post.title }}</h3>

    <!-- New button for deletion -->
    <div class="delete-items">
      <button v-if="!deletePending" @click="deletePost" type="button">
        Delete
      </button>
      <p v-else>deleting...</p>
    </div>

    <img :src="`data:image/png;base64,${post.image.data}`" />
  </div>
</template>

<script>
export default {
  props: {
    post: Object,
  },
  data() {
    return {
      deletePending: false,
    };
  },
  methods: {
    async deletePost() {
      console.log("deleting");
      this.deletePending = true;
      const response = await fetch(
        `http://localhost:3000/posts/${this.post._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      this.$emit("deleted");
    },
  },
};
</script>

<style scoped lang="scss">
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
.delete-items {
  align-self: center;
}
</style>
