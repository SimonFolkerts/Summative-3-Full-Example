<template>
  <!-- this component shows an individual post item, rather than having them defined in the list view they are now a standalone component that the list view can utilise. It contains the ability to delete itself from the database and has a status indicator that uses to show when a deletion is in progress. This is achieved by setting a flag variable "deletePending" to false and using conditional rendering to hide the delete button and instead show the 'deleting...' message -->
  <div class="post-list-item">
    <h3>{{ post.title }}</h3>

    <!-- button for switching to the detail view -->
    <RouterLink
      id="detail-link"
      :to="{ name: 'postDetail', params: { id: post._id } }"
      ><button type="button">View Post</button></RouterLink
    >
    <div class="delete-items">
      <button v-if="!deletePending" @click="deletePost" type="button">
        Delete
      </button>
      <span v-else>deleting...</span>
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
  align-items: center;
  border: 1px solid lightgray;
  img {
    width: 300px;
    height: 100px;
    object-fit: cover;
  }
}
</style>
