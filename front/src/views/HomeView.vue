<template>
  <div>
    <h2>Home</h2>
    <CreatePost />
    <ListPosts />
  </div>
</template>

<script>
import CreatePost from "/src/components/CreatePost.vue";
import ListPosts from "/src/components/ListPosts.vue";
export default {
  components: {
    CreatePost,
    ListPosts,
  },
};
</script>

<style scoped></style>
