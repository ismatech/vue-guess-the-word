<template>
  <input :class="{
          'border-info': isWordGiven === false,
          'border-default': isWordGiven,
          'text-warning': isWordGiven && myWord[letterIdx] === letter && myWord.indexOf(letter.toLowerCase()) === letterIdx,
          'text-info': isWordGiven && myWord.indexOf(letter) > -1 && myWord.indexOf(letter.toLowerCase()) !== letterIdx
          }"
         :disabled="isWordGiven"
         :value="letter"
         class="border bg-light"
         maxlength="1"
         type="text"
         @input="onInput($event.target, i, letterIdx)"
         @keydown="checkSymbol($event)"
  >
</template>

<script>
export default {
  name: "AppInput",
  props: {
    refName: String,
    isWordGiven: Boolean,
    myWord: String,
    letter: String,
    letterIdx: Number
  },
  methods: {
    onInput() {

    },
    checkSymbol() {

    },
  }
}
</script>

<style scoped>

</style>