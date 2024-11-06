<!-- SectionContent.vue -->
<template>
  <section class="WindowSection" v-if="section">
    <div class="WindowSectionMain">
      <h2>{{ section.mainTitle }}</h2>
      <div class="TextSection">
        <h3>{{ section.title }}</h3>
        <p>{{ section.text1 }}</p>
        <p>{{ section.text2 }}</p>
        <button class="Button" @click.prevent>Join Forum</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ChatWindow",
  props: {
    section: Object,
  },
};
</script>

<style scoped>
.WindowSection {
  background-color: #ad5950;
  position: absolute;
  right: 0;
  bottom: 0;
  top: 80px;
  width: 64%;
  padding: 20px;
  border-radius: 14px;
}
.WindowSectionMain{
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 14px;
}
.WindowSectionMain h2{
  font-size: 28px;
  margin-bottom: 18px;
}
.TextSection > * {
  margin-bottom: 16px;
  width: 80%;
}
.TextSection h3{
  font-size: 24px;
}
.TextSection p{
  font-size: 20px;
}
.Button{
  padding: 12px;
  background-color: #f17c6f;
  margin: 20px;
  border-radius: 18px;
  width: 160px;
}
</style>
