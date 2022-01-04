/* eslint-disable vue/no-v-html */
<template>
  <div
    class="block-comment"
    :style="commentsStyle"
  >
    <h3
      v-if="cardPlayed && !winner"
      class="comment-headline"
    >
      <span v-html="horseHTML(cardPlayed)" />
      {{ accelerationPhrases[phraseIndex] }} und liegt jetzt auf Platz {{ $store.state.trackLength - position(cardPlayed) }}!
    </h3>
    <h1 v-if="winner">
      <span v-html="horseHTML(cardPlayed)" /> GEWINNT!
    </h1>
    <p
      v-if="cardPlayed && !winner"
      class="comment-body"
    >
      <span v-html="renderPositionComment(positionCommentType(cardPlayed), cardPlayed)" />
    </p>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "BlockComment",
  props: {
    cardPlayed: String,
    winner: String,
  },
  data() {
    return {
      accelerationPhrases: [
        "gibt ordentlich Gas",
        "lässt die Hufen qualmen",
        "legt einen Zahn zu",
        "wandert mit großen Schritten Richtung Ziel",
        "prescht nach vorn",
        "sputet sich"
      ],
      phraseIndex: 0,
    }
  },
  computed: {
    ...mapGetters({
      position: "checkPosition",
      horses: "getTheHorses",
      falterPosition: "checkFalterPosition",
      isTimeForFalter: "isTimeForFalter"
    }),
    commentsStyle() {
      if (!this.cardPlayed) return { opacity: 0 }
      return { opacity: 1 }
    }
  },
  updated() {
    this.phraseIndex = Math.floor(Math.random() * this.accelerationPhrases.length)
  },
  methods: {
    horseHTML(horse) {
      return `<span class="${this.horses[horse].colorClass}">${horse}</span>`
    },

    positionCommentType(currentHorse) {
      const horsesAfter = Object.entries(this.horses).filter(([, info]) => {
        return info.position < this.position(currentHorse)
      })
      if (horsesAfter.length === 3) return "isFirst"

      const horsesBefore = Object.entries(this.horses).filter(([, info]) => {
        return info.position > this.position(currentHorse)
      })
      if (horsesBefore.length === 3) return "isLast"

      const horsesSame = Object.entries(this.horses).filter(([horse, info]) => {
        return (info.position === this.position(currentHorse)) &&
        (horse !== currentHorse)
      })
      if (horsesSame.length) return horsesSame
      return "mediocre"
    },

    renderPositionComment(commentType, currentHorse) {
      const comments = {
        isFirst: `Mit einem gewaltigen Sprung setzt sich ${this.horseHTML(currentHorse)} an die Spitze, da können die anderen nur doof gucken!`,
        isLast: `Eieiei, das arme ${this.horseHTML(currentHorse)} liegt auf dem letzten Platz, ob das noch was wird? Wir dürfen gespannt sein!`,
        mediocre: `Im gemütlichen Mittelfeld fühlt sich ${this.horseHTML(currentHorse)} aber zunächst einmal wohl und verfällt in einen entspannten Trab. Viel Spaß im weiteren Rennverlauf, liebes ${this.horseHTML(currentHorse)}!`
      }
      if (typeof(commentType) === "string") return comments[commentType]

      const otherHorses = commentType.map((horse) => this.horseHTML(horse[0])).join(" und ")
      const catchingUp = `Naaa, ${otherHorses}, jetzt heißt es aber die alten Gehstummel in die Hand nehmen, das ${this.horseHTML(currentHorse)} kommt gefährlich nahe!`
      return catchingUp
    }
  }
}
</script>

<style>
.block-comment [class^="suit"] {
  font-size: 130%;
}
</style>
