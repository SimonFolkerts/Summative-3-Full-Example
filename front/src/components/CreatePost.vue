<template>
  <div class="component-root">
    <h3>Create Post Component</h3>
    <form @submit.prevent>
      <div class="form-group">
        <label for="title">Title</label>
        <input v-model="title" id="title" type="text" />
      </div>
      <div class="form-group">
        <label for="content">Content</label>
        <textarea v-model="content" id="content" rows="5"></textarea>
      </div>
      <div class="form-group">
        <label for="image">Image</label>
        <input @input="imageSelected" id="image" type="file" />
      </div>
      <button @click="uploadPost" type="button">Upload</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // each property is now independant
      title: null,
      content: null,
      image: null,
    };
  },
  methods: {
    imageSelected(event) {
      this.image = event.target.files[0];
    },
    async uploadPost(event) {
      const formData = new FormData();
      // manually construct form data so that multer can handle it on the back end
      formData.append("title", this.title);
      formData.append("content", this.content);
      formData.append("image", this.image);

      // prepare request settings and load up the data
      const config = {
        method: "POST",
        // send the form data. Note lack of application/json header
        body: formData,
      };

      // send the request and data
      const response = await fetch("http://127.0.0.1:3000/posts/", config);
      // handle the response
      const data = await response.json();
      // log response
      console.log(data);
    },
  },
};
</script>

<style scoped lang="scss">
form {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  width: 40rem;

  padding: 0.4rem;
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
