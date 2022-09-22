<template>
  <div>
    <h1>Home</h1>
    <CreatePost v-if="user" :user="user" />
    <ListPosts :user="user" />
  </div>
</template>

<script>
import CreatePost from "/src/components/CreatePost.vue";
import ListPosts from "/src/components/ListPosts.vue";
export default {
  name: "home", // set component name for use with keep-alive on the App.vue routerview
  props: { user: Object },
  components: {
    CreatePost,
    ListPosts,
  },
};
</script>

<style scoped></style>
