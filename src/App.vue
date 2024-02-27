<template>
  <div id="app">
    <h1>Guess the word!</h1>
    <hr>

    <div class="container-fluid">
      <div class="row">
        <div class="col-md-3">
          <div class="yellow-legend">
          <span
              class="bg-warning"></span><span>Этот цвет означает, что вы правильно нашли и букву, и её
          местоположение</span>
          </div>
          <div class="aqua-legend">
          <span
              class="bg-info"></span><span>Этот цвет означает, что вы правильно нашли букву, но не её
          местоположение</span>
          </div>
        </div>
        <div class="col-md-7">
          <div v-for="(row, i) in field" :key="i" class="form-group">
            <div class="form-row">
              <div v-for="(letter, k) in row" :key="k" class="letter-wrapper">
                <input :ref="'letter-' + i + '_' + k"
                       :class="{
                        'border-info': givenWords[i] === false,
                        'border-default': givenWords[i],
                        'text-info': givenWords[i] && myWord.indexOf(letter) > -1 && myWord.indexOf(letter.toLowerCase()) !== k,
                        'text-warning': givenWords[i] && myWord[k] === letter &&
                        myWord.indexOf(letter.toLowerCase(), k) === k
                       }"
                       :disabled="givenWords[i]"
                       :value="letter"
                       class="border bg-light"
                       maxlength="1"
                       type="text"
                       @input="onInput($event.target, i, k)"
                       @keydown="checkSymbol($event)"
                >
              </div>
              <div class="form-check">
                <input v-model="givenWords[i]" class="d-none" type="checkbox">
                <span class="form-check-input border bg-lite">
              <svg :fill="givenWords[i]  && field[i].join('').length > 0 ? '#20c997' : '#6c757d'" height="40px"
                   viewBox="0 0 24 24"
                   width="40px"
                   xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
              </svg>
            </span>
                <button :ref="'check_' + i"
                        :disabled="givenWords[i]"
                        class="form-check-label btn btn-primary"
                        @click="acceptWord(i)">
                  Check
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-2"></div>
      </div>


      <div v-if="gameHasEnded" class="alert alert-warning">
        <div class="row">
          <strong>Unfortunately, you lose!</strong>
          <button class="btn btn-info" @click="onReset">Reset</button>
        </div>
        <div class="row">
          <button class="btn btn-primary"
                  @click="showDefinition = !showDefinition">
            Show me the word and it's definition
          </button>
          <div v-if="showDefinition" class="definition">
            <div class="card card-body">
              <p>Answer: {{ myWord }}</p>
              <p>{{ wordDefinition }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="gameHasSolved" class="alert alert-success">
        <span>Congratulations, you win!</span>
        <button class="btn btn-info" @click="onReset">Start over</button>
        <hr>
        <div class="row">
          <button class="btn btn-primary"
                  @click="showDefinition = !showDefinition">
            Show me the word and it's definition
          </button>
          <div v-if="showDefinition" class="definition">
            <div class="card card-body">
              <p>Answer: {{ myWord }}</p>
              <p>{{ wordDefinition }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isErrorShown" class="alert alert-danger alert-dismissible fade show" role="alert">
        <span>You haven't filled letters!</span>
        <button aria-label="Close" class="close" data-dismiss="alert" type="button" @click="isErrorShown = false">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import wordsFromDB from '@/assets/json/data.json'

export default {
  name: 'app',
  data() {
    return {
      msg: '',
      field: [
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', '']
      ],
      givenWords: {
        0: false,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
      },
      myWord: 'слива',
      gameHasSolved: false,
      gameHasEnded: false,
      isErrorShown: false,
      wordDefinition: '',
      showDefinition: false
    }
  },
  methods: {
    onInput(target, i, k) {
      this.field[i][k] = target.value;
      if (k < this.field[i].length - 1) {
        this.focusInput('input', i, k + 1);
      } else {
        target.blur();
        this.focusInput('button', i);
      }
    },
    async acceptWord(i) {
      if (this.field[i].join('').length === 5) {
        this.isErrorShown = false;
        this.givenWords[i] = true;

        if (i < this.field.length - 1) {
          this.givenWords[i + 1] = false;
          await this.$nextTick();
          // setTimeout(() => this.focusInput('input', i + 1, 0), 0);
          this.focusInput('input', i + 1, 0)
        }

        if (this.field[i].join('').toLowerCase() === this.myWord) {
          this.gameHasSolved = true;
          this.wordDefinition = getDefinition(this.myWord);
          for (let z = i + 1; z < this.field.length; z++) {
            this.givenWords[z] = true;
          }
        } else {
          if (i === this.field.length - 1) {
            this.gameHasEnded = true;
            this.wordDefinition = getDefinition(this.myWord);
          }
        }
      } else {
        this.isErrorShown = true;
      }

    },
    onReset() {
      this.field = [
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', '']
      ];
      this.gameHasSolved = false;
      this.gameHasEnded = false;
      this.showDefinition = false;
      this.givenWords[0] = false;
      this.myWord = getRandomWord(this.myWord);
      setTimeout(() => this.focusInput('input', 0, 0), 0);
    },

    focusInput(type = 'input', i, k) {
      if (type === 'button') {
        this.$refs[`check_${ i }`][0].focus();
      } else {
        this.$refs[`letter-${ i }_${ k }`][0].focus();
      }
    },

    checkSymbol(ev) {
      const allowedKeys = ['Backspace', 'Shift', 'Tab', 'Delete'];
      if (!ev.key.match(/[а-я]+/ig) && !allowedKeys.includes(ev.key)) {
        ev.preventDefault();
      }
    }
  },
  mounted() {
    this.focusInput('input', 0, 0);
  }
}

function getOnlyFiveLetterWords() {
  const result = [];
  for (const word in wordsFromDB) {
    if (word.length === 5 && !wordsFromDB[word].answerIsProbablyNotNoun) {
      result.push(word);
    }
  }
  return result;
}

function getRandomWord(currentWord) {
  const allWords = getOnlyFiveLetterWords();
  console.log('App. getRandomWord. allWords', allWords);
  const rnd = Math.floor(Math.random() * allWords.length) + 1;
  if (allWords[rnd] === currentWord) {
    const idx = allWords.findIndex(elem => elem === currentWord);
    allWords.splice(idx, 1);
    return getRandomWord(currentWord);
  }
  return allWords[rnd];
}

function getDefinition(word) {
  return wordsFromDB[word].definition;
}


/**
 * доделать
 * 1. если в написанном слове 2 одинаковые буквы, то они обе отмечаются, что вводит пользователя в заблуждение
 * нужно раскрасить только одну букву, а если в слове действительно 2 одинаковые буквы, то нормально
 *
 * 2. все выпавшие слова записать в отдельный массив, и потом по нему удалять из основного массива, чтобы не было
 * повторов
 */
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  min-width: 555px;
}

.form-row {
  justify-content: center;


}

@media (max-width: 767px) {
  .form-row:first-child {
    margin-top: 50px;
  }
}

.letter-wrapper {
  width: 50px;
  height: 50px;
  margin: 10px;
  font-size: 45px;
  line-height: 1;
  text-align: center;
}

.letter-wrapper input {
  width: 100%;
  height: 100%;
  text-align: center;
  user-select: none;
  text-transform: uppercase;
}

.form-check {
  font-size: 25px;
  display: flex;
  align-items: flex-end;
  margin: 10px 10px 10px 50px;
}

.form-check-input {
  width: 40px;
  height: 40px;
}

.form-check-label {
  margin-left: 30px;
}

.alert-warning,
.alert-success {
  width: 50vw;
  margin: auto;
}

.alert-warning .btn-info,
.alert-success .btn-info {
  position: absolute;
  top: 6px;
  right: 10px;
}

.alert-warning .row,
.alert-success .row {
  display: flex;
  min-height: 40px;
}

.alert-warning .row:first-child,
.alert-success .row:first-child {
  flex-flow: row nowrap;
  justify-content: center;
}

.alert-warning .row:last-child,
.alert-success .row:last-child {
  flex-flow: column;
  align-items: center;
}

.definition {
  margin-top: 10px;
}

.col-md-3 .yellow-legend,
.col-md-3 .aqua-legend {
  display: flex;
  flex-flow: row nowrap;
}

.col-md-3 .yellow-legend span:first-child,
.col-md-3 .aqua-legend span:first-child {
  display: inline-flex;
  width: 20px;
  height: 20px;
  margin-right: 15px;
}

.col-md-3 .yellow-legend span:last-child,
.col-md-3 .aqua-legend span:last-child {
  display: inline-flex;
  width: fit-content;
}

</style>
