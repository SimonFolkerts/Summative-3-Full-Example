<template>
  <div class="component-root">
    <h3>Create/Edit Post Component</h3>
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
        <input @input="imageSelected" id="image" type="file" ref="fileInput" />
      </div>
      <!-- if not currently uploading, show the uplaod button, otherwise show uploading indicator -->

      <button v-if="!uploadPending" @click="uploadPost" type="button">
        {{ editingPost ? "Update Post" : "Create Post" }}
      </button>
      <p v-else>uploading...</p>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    editingPost: Object,
  },
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
        // ternary operator, if there is aa post to edit then set method to PUT else set it to POST
        method: this.editingPost ? "PUT" : "POST",
        // send the form data. Note lack of application/json header
        body: formData,
      };

      // send the request and data
      const response = await fetch(
        `http://127.0.0.1:3000/posts/${
          // ternary operation, if there is a post to edit then add its id to the url, otherwise add an empty string (i.e. nothing)
          this.editingPost ? this.editingPost._id : ""
        }`,
        config
      );
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
  mounted() {
    if (this.editingPost) {
      this.title = this.editingPost.title;
      this.content = this.editingPost.content;
    }
  },
};
</script>

<style scoped lang="scss"></style>
