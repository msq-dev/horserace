<template>
  <div id="app">
    <div class="horse-container">
      <Horse
        v-for="(horse, index) in Object.keys(horses)"
        :key="horse"
        :horse="horse"
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
    <div
      class="controls-container"
      :class="{'left-handed': leftHanded}"
    >
      <BlockComment
        v-if="horses && commentsOn"
        class="comment"
        :class="{'left-handed': leftHanded}"
        :cardPlayed="cardPlayed"
        :winner="winner"
      />
      <div
        v-if="!winner"
        class="card-played"
        :class="cardPlayedClasses"
        :style="cardPlayedStyle"
      >
        {{ cardPlayed || "♥︎" }}
      </div>

      <div
        v-if="!winner && !isFalterHappening"
        class="card-deck"
        :class="{'left-handed': leftHanded}"
        @click="playCard"
      >
        🂠
      </div>

      <div
        v-if="isFalterHappening"
        class="falter-arrow"
        :class="{'left-handed': leftHanded}"
        @click="executeFalter"
      >
        &larr;
      </div>
    </div>
    <div
      class="settings-container"
      :class="{active: showSettings}"
    >
      <div
        class="settings-trigger"
        @click="showSettings = !showSettings"
      >
        ⚙
      </div>
      <div
        class="settings"
      >
        <div class="checkbox-control">
          <input
            id="comments"
            v-model="commentsOn"
            type="checkbox"
          >
          <label for="comments">Live-Kommentar: {{ commentsOn ? "An" : "Aus" }}</label>
        </div>
        <div class="checkbox-control">
          <input
            id="leftHanded"
            v-model="leftHanded"
            type="checkbox"
          >
          <label for="leftHanded">Händigkeit: {{ leftHanded ? "Links" : "Rechts" }}</label>
        </div>
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
      showSettings: false,
      commentsOn: true,
      leftHanded: false
    }
  },
  computed: {
    ...mapGetters({
      cardPlayed: "getCardPlayed",
      horses: "getTheHorses",
      isFalterHappening: "checkFalterState",
      winner: "getWinner",
    }),
    falterCards() {
      return this.$store.state.falterCards
    },
    cardPlayedClasses() {
      const cardPlayedColor = this.cardPlayed ? this.horses[this.cardPlayed].colorClass : ""
      return {
        "left-handed": this.leftHanded,
        "suit-red": cardPlayedColor === "suit-red",
        "suit-black": cardPlayedColor === "suit-black"
      }
    },
    cardPlayedStyle() {
      if (!this.cardPlayed) return { opacity: 0 }
      return {
        opacity: 1,
        transform: `rotate(${this.rotationAngle}deg)`,
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
          this.$store.dispatch("handleTurn", card)
        })
    },

    executeFalter() {
      this.$store.dispatch("executeFalter")
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
  position: relative;
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
  padding: 2.5em 0 2em;
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
  grid-template-columns: 65vw auto;
  grid-template-rows: repeat(4, 2vmin);
  column-gap: 1em;
  row-gap: 2em;
  padding: 0 2em 0 1em;
  margin: 1em auto;
  line-height: 1.5;
}

.card-played,
.card-deck,
.falter-arrow {
  grid-column: 3;
}

.card-played {
  grid-row: 1 / 3;
  border: 1px solid var(--clr-black);
  border-radius: 0.1em;
  font-size: 2rem;
  text-align: center;
  background-color: var(--clr-card-back);
  transition: opacity 0.5s;
}

.card-deck,
.falter-arrow {
  cursor: pointer;
  grid-row: 3;
}

.falter-arrow {
  font-size: 3rem;
}

.card-deck {
  transform: rotate(-7deg);
  font-size: 4rem;
}

.controls-container.left-handed {
  grid-template-columns: auto 65vw;
  column-gap: 2em;
}

.comment {
  grid-column: 1;
}

.comment.left-handed {
  grid-column: 2;
}

.card-played.left-handed,
.card-deck.left-handed {
  grid-column: 1;
  align-self: left;
}

.settings-container {
  --bg-settings: rgb(128 128 128 / 1);

  position: fixed;
  z-index: 5;
  bottom: 0;
  width: 100%;
  height: 10rem;
  background-color: var(--bg-settings);
  mix-blend-mode: multiply;
  transform: translateY(100%);
  transition: transform 0.5s ease-in-out;
}

.settings-container.active {
  transform: translateY(0);
}

.settings-trigger {
  --fs-trigger: 2rem;

  position: absolute;
  font-size: var(--fs-trigger);
  top: calc(var(--fs-trigger) * -1);
  left: calc(50% - calc(var(--fs-trigger) / 2));
  padding: 0 0.25em;
  background-color: var(--bg-settings);
  border-radius: 0.17em 0.17em 0 0;
  cursor: pointer;
}

.settings {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: fixed;
  padding: 1em 2em 2em;
}

.checkbox-control {
  display: grid;
  grid-template-columns: auto auto;
  grid-auto-rows: 2em;
  align-items: center;
  gap: 1em;
}
</style>
