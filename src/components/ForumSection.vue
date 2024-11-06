<!-- SectionSelector.vue -->
<template>
  <nav class="ForumSectionNav">
    <button
      :class="{ active: selectedSection === 'sectionOne' }"
      class="NavButtonOne NavButton"      
      @click="selectSection('sectionOne')"
    >
    Svømmeklubben Ishøj
    </button>
    <button
      :class="{ active: selectedSection === 'sectionTwo' }"
      class="NavButton"
      @click="selectSection('sectionTwo')"
    >
      Bage Klubben
    </button>
    <button
      :class="{ active: selectedSection === 'sectionThree' }"
      class="NavButtonThree NavButton"      
      @click="selectSection('sectionThree')"
    >
    Velkommen til Gå-klubben Amager
    </button>
  </nav>
</template>

<script>
export default {
  name: "ForumSection",
  data() {
    return {
      selectedSection: 'sectionOne', 
    };
  },
  methods: {
    selectSection(section) {
      this.selectedSection = section; 
      this.$emit("selectSection", section);
    },
  },
};
</script>

<style scoped>
.ForumSectionNav {
  display: flex;
  justify-content: end;
  flex-wrap: wrap;
  font-size: 18px;
  padding: 24px;
}
.NavButton {
  background-color: #f17c6f;
  padding: 18px;
  font-size: 18px;
}
.NavButtonOne{
  border-top-left-radius: 8px; 
}
.NavButtonThree{
  border-top-right-radius: 8px;
}
.NavButton:hover {
  background-color: #fa8073;
}
.NavButton.active {
  background-color: #AD5950;
}
</style>
