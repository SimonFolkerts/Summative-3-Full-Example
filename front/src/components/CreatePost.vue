<template>
  <div class="component-root">
    <h3>Create Form Component</h3>
    <form @submit.prevent>
      <div class="form-group">
        <label for="title">Title</label>
        <input v-model="post.title" id="title" type="text" />
      </div>
      <div class="form-group">
        <label for="content">Content</label>
        <textarea v-model="post.content" id="content" rows="10"></textarea>
      </div>
      <div class="form-group">
        <label for="image">Image</label>
        <input @input="imageSelected" id="image" type="file" />
      </div>
      <button type="button">Upload</button>
    </form>
    {{ post.title }}
    {{ post.content }}
    {{ post.image }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      post: {
        title: null,
        content: null,
        image: null,
      },
    };
  },
  methods: {
    imageSelected(event) {
      this.post.image = event.target.files;
    },
  },
};
</script>

<style scoped lang="scss">
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  width: 40rem;

  padding: 1rem;
  border: 1px solid black;

  button {
    align-self: center;
    padding: 1rem 2rem;
  }
}

.form-group {
  display: flex;
  flex-direction: column;

  padding: 1rem;
  border: 1px solid lightgray;
}
</style>
