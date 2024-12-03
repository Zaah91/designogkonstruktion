<template>
  <v-main class="mainContent">
    <div class="pa-4 flexWrap" v-if="communityId">
      <h1>{{ pageTitle }}</h1>
      <v-btn color="secondary" class="d-block pa-2" :to="{ name: 'Chat', params: { id: communityId } }">Chat</v-btn>
      <v-btn color="secondary" class="d-block mt-8 pa-2" :to="{ name: 'Video', params: { id: communityId } }">Video</v-btn>
      <!-- Hvis nogen er villig til at implementere forum, så skal de være velkomne til det. Dvs. Oprette routes & controllers, samt database tabeller og modeller i koden
      <v-btn color="secondary" class="d-block mt-8 pa-2" :to="{ name: 'Forum', params: { id: community.community_id } }">Forum</v-btn>
      -->
    </div>
  </v-main>
</template>

<script>
import axiosInstance from "@/api/axiosInstance";

export default {
  name: "CommunityView",
  data() {
    return {
      pageTitle: '',
      communityId: null
    }
  },
  methods: {
    // Metode til at hente information fra et community. Eks. En beskrivelse, eller anden relevant data, vi vælger at gemme i community tabellen.
    async fetchCommunity() {
      try {
        const response = await axiosInstance.get("communities/" + this.communityId);
        this.pageTitle = response.data.community_name;
      } catch (error) {
        console.log(error);
      }
    }
  },
  created() {
    this.communityId = this.$route.params.id;
  },
  mounted() {
    this.fetchCommunity();
  }
};
</script>

<style scoped>
.flexWrap {
  width: 20rem;
}
</style>
