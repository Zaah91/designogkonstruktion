<template>
    <v-main class="mainContent">
      <div class="pa-4 flexWrap">
        <h1>Video</h1>
        <video ref="webcam" autoplay playsinline class="webcamVideo"></video>
      </div>
    </v-main>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  
  export default {
    name: "VideoView",
    inject: ["siteInfo"],
    setup() {
      const webcam = ref(null);
  
      const startWebcam = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (webcam.value) {
            webcam.value.srcObject = stream;
          }
        } catch (error) {
          console.error("Error accessing webcam:", error);
        }
      };
  
      onMounted(() => {
        startWebcam();
      });
  
      return {
        webcam
      };
    }
  };
  </script>
  
  <style scoped>
  h1 {
    color: #000000;
  }
  
  .webcamVideo {
    width: 100%;
    max-width: 640px;
    height: auto;
    border: 2px solid #000;
  }
  </style>