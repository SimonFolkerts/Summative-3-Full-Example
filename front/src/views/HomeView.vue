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
  name: "home", // set component name for use with keep-alive on the App.vue routerview
  components: {
    CreatePost,
    ListPosts,
  },
};
</script>

<style scoped></style>
