<template>
  <div>
    <h1>Post Detail</h1>
    <div v-if="post" class="post-content">
      <p>Author: {{ post.author.username }}</p>
      <!-- if there is a user, compare the user id to the post author id which returns either true of false, showing the button if the user is the author, hiding it if not; otherwise if there is no user evaluate to false, hiding the button -->
      <button
        v-if="user ? user._id == post.author._id : false"
        type="button"
        @click="editing = true"
      >
        Edit Post
      </button>
      <div v-if="editing">
        <CreatePost :editingPost="post" :user="user" />
      </div>
      <div v-else>
        <h2>{{ post.title }}</h2>
        <p>{{ post.content }}</p>
        <img
          v-if="post.image"
          :src="`data:image/png;base64,${post.image.data}`"
        />
      </div>
    </div>
    <div v-else class="loading">
      <h3>loading...</h3>
    </div>
  </div>
</template>

<script>
import CreatePost from "../components/CreatePost.vue";
export default {
  props: {
    user: Object,
  },
  components: {
    CreatePost,
  },
  data() {
    return {
      post: null,
      editing: false,
    };
  },
  methods: {
    async fetchPost() {
      const response = await fetch(
        `http://127.0.0.1:3000/posts/${this.$route.params.id}`
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
