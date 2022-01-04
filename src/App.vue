<template>
  <div id="app">
    <div class="horse-container">
      <Horse
        v-for="(horse, index) in Object.keys(horses)"
        :key="horse"
        :suit="horse"
        :colorClass="horses[horse].colorClass"
        :lane="index"
        :winner="winner"
      />
    </div>
    <div class="falter-cards-container">
      <FalterCard
        v-for="(falterCard, index) in falterCards"
        :key="falterCard + index"
        :suit="falterCard"
        :colorClass="horses[falterCard].colorClass"
        :position="index + 1"
      />
    </div>
    <div class="controls-container">
      <BlockComment
        v-if="horses"
        :cardPlayed="cardPlayed"
        :winner="winner"
      />
      <div
        class="card-played"
        :class="[cardPlayed ? horses[cardPlayed].colorClass : '']"
        :style="cardPlayedStyle"
      >
        {{ cardPlayed || "♥︎" }}
      </div>
      <div
        v-if="!winner"
        class="card-deck"
        @click="playCard"
      >
        🂠
      </div>
    </div>
  </div>
</template>

<script>
import Horse from "./components/CardHorse.vue"
import FalterCard from "./components/CardFalter.vue"
import BlockComment from "./components/BlockComment.vue"
import { mapGetters } from "vuex"


export default {
  name: "App",
  components: {
    Horse,
    FalterCard,
    BlockComment
  },
  data() {
    return {
      rotationAngle: 0,
    }
  },
  computed: {
    ...mapGetters({
      cardPlayed: "getCardPlayed",
      horses: "getTheHorses",
      winner: "getWinner"
    }),
    falterCards() {
      return this.$store.state.falterCards
    },
    cardPlayedStyle() {
      if (!this.cardPlayed) return { opacity: 0 }
      return {
        opacity: 1,
        transform: `rotate(${this.rotationAngle}deg)`
      }
    },
  },
  mounted() {
    this.$store.dispatch("setupGame")
  },
  methods: {
    playCard() {
      this.rotationAngle = Math.random() * 7 * (Math.random() < 0.5 ? -1 : 1)
      this.$store.dispatch("playCard")
        .then((card) => {
          this.$store.dispatch("moveHorse", card)
        })
    }
  },
}
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  overflow-y: scroll;
  background-color: hsl(50 100% 95% / 1);
}

button {
  font: inherit;
  color: currentColor;
  border: none;
  cursor: pointer;
}

[hidden] {
  display: none;
}

input {
  -webkit-tap-highlight-color: transparent;
}

:root {
  --clr-black: darkslategray;
  --clr-red: tomato;
  --clr-green: forestgreen;
  --clr-card-back: rgb(255 255 255);
  --clr-table: burlywood;
}

.suit-red {
  color: var(--clr-red);
}

.suit-black {
  color: var(--clr-black);
}

#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  touch-action: manipulation;
  font-family: sans-serif;
  max-width: 750px;
  margin: 0 auto;
}

.horse-container,
.falter-cards-container {
  display: grid;
  grid-template-columns: repeat(7, calc(100vw / 7));
  place-items: center;
}

.horse-container {
  grid-template-rows: repeat(auto-fit, 1fr);
  padding: 2em 0;
  margin: calc(1vh + 1rem) auto 0;
  background-color: var(--clr-green);
  row-gap: 0.5em;
}

.falter-cards-container {
  padding: 0.5rem 0;
  grid-template-rows: 2.2em;
  background-color: var(--clr-table);
  height: 3rem;
}

.controls-container {
  display: grid;
  grid-template-columns: repeat(3, );
  grid-template-rows: repeat(4, 2vmin);
  column-gap: 0.7em;
  row-gap: 2em;
  padding: 0 2em 0 1em;
  margin: 1em auto;
  line-height: 1.5;
}

.card-played,
.card-deck {
  grid-column: 3;
}

.card-played {
  min-width: 4.5rem;
  grid-row: span 3;
  border: 1px solid var(--clr-black);
  border-radius: 0.1em;
  font-size: 4rem;
  text-align: center;
  padding: 0 0.2em;
  background-color: var(--clr-card-back);
  transition: opacity 0.5s;
}

.card-deck {
  cursor: pointer;
  transform: rotate(-7deg);
  font-size: 4rem;
  grid-row: -1;
  text-align: right;
}


</style>
