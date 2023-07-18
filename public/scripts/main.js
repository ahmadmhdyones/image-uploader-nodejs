/* eslint-disable */

const API_URL = 'http://localhost:8000/api';

Vue.use(Vuetify);

new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: {
    form: {
      image: null,
      imageName: '',
      width: '',
      height: '',
    },
    uploadedImage: '',
    fetchedImage: '',
    isLoading: false,
  },
  methods: {
    uploadImage() {
      const endpoint = `${API_URL}/image/upload`;
      const formData = new FormData();
      formData.append('file', this.form.image);

      this.isLoading = true;
      let alert = {};

      axios
        .post(endpoint, formData)
        .then(({ data: res }) => {
          this.uploadedImage = res.data.image;
          this.form.imageName = this.uploadedImage.originalName;
          this.form.image = null;
          this.form.width = '';
          this.form.height = '';

          alert.status = 'success';
          alert.message = 'Success';
        })
        .catch((error) => {
          console.error('Error uploading image:', error);

          alert.status = 'error';
          alert.message = error.response.data.message;
        })
        .finally(() => {
          this.isLoading = false;
          Swal.fire({
            title: alert.message,
            icon: alert.status === 'success' ? 'success' : 'error',
            toast: true,
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 5000,
            position: 'bottom-end',
          });
        });
    },
    fetchImage() {
      const { imageName, width, height } = this.form;
      const endpoint = `${API_URL}/image/${imageName}`;

      this.isLoading = true;
      let alert = {};

      axios
        .get(endpoint, { params: { w: width, h: height } })
        .then(({ data: res }) => {
          this.fetchedImage = res.data.image;

          alert.status = 'success';
          alert.message = 'Success';
        })
        .catch((error) => {
          console.error('Error fetching image:', error);
          this.fetchedImage = '';

          alert.status = 'error';
          alert.message = error.response.data.message;
        })
        .finally(() => {
          this.isLoading = false;
          Swal.fire({
            title: alert.message,
            icon: alert.status === 'success' ? 'success' : 'error',
            toast: true,
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 5000,
            position: 'bottom-end',
          });
        });
    },
  },
});
