<template>
  <v-main v-if="this.siteInfo.loggedIn" class="mainContent">
    <div class="pa-4">
      <h1>Video</h1>
      <div class="d-flex justify-center align-center flex-column videoContainer" background: black>
        <video ref="webcam" autoplay playsinline class="webcamVideo"></video>
      </div>
    </div>
  </v-main>
</template>

<script> 
export default {
  name: "VideoView",
  inject: ["siteInfo"], // Injekt af sideInfo, "provided" i App.vue's create() lifecycle hook.
  data() {
    return {
      webcam: null, // Webcam reference
    };
  },
  methods: {
    async startWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (this.webcam) {
          this.webcam.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    },
  },
  mounted() {
    // Prøv at starte webcam, når vi kommer ind på siden
    this.webcam = this.$refs.webcam;
    this.startWebcam();
  },
};
</script>

<style scoped>
.userPicture {
  border-radius:0;
  max-width: 20rem;
}
.webcamVideo {
  width: 100%;
  height: auto;
  max-height: 50vh;
}
.videoContainer {
  background: black;
  border-radius: 0.5rem;
  padding: 1rem;
}
</style>
