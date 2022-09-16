<template>
  <div class="component-root">
    <h3>Create Post Component</h3>
    <form @submit.prevent @reset="resetForm" ref="uploadForm">
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
      <!-- if not currently uploading, show the uplaod button, otherwise show uploading indicator -->
      <button v-if="!uploadPending" @click="uploadPost" type="button">
        Upload
      </button>
      <p v-else>uploading...</p>
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
      uploadPending: false,
    };
  },
  methods: {
    imageSelected(event) {
      this.image = event.target.files[0];
    },
    async uploadPost() {
      this.uploadPending = true;
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
      // clear the form (this only affects the file input as the other fields are bound to data properties. Terefore we use a listener on the reset event to clear them, see the resetForm method below)
      this.$refs.uploadForm.reset();
      // set uploading flag to false
      this.uploadPending = false;
      // this triggers teh view to reload, which also causes the list view to update itself and show the newly updated post
      this.$router.go();
    },
    // reset the v-models too
    resetForm() {
      this.title = null;
      this.content = null;
      this.image = null;
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
