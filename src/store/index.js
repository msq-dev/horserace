import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

// courtesy of StackOverflow
// https://stackoverflow.com/a/12646864
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export default new Vuex.Store({
  state: {
    trackLength: 6,
    deckSize: 12,
    horses: {
      "♦︎": {
        colorClass: "suit-red",
        position: null,
        isMoving: false
      },
      "♥︎": {
        colorClass: "suit-red",
        position: null,
        isMoving: false
      },
      "♠︎": {
        colorClass: "suit-black",
        position: null,
        isMoving: false
      },
      "♣︎": {
        colorClass: "suit-black",
        position: null,
        isMoving: false
      }
    },
    deck: null,
    falterCards: null,
    falterPos: null,
    cardPlayed: null,
    winner: null,
  },
  mutations: {
    initGame(state) {
      state.deck = []
      state.falterCards = []
      state.falterPos = 1
      state.cardPlayed = ""
      state.winner = null
    },
    setHorsePos(state, { horse, pos }) {
      state.horses[horse].position = pos
    },
    pushCardToDeck(state, card) {
      state.deck.push(card)
    },
    drawCardFromDeck(state, index) {
      state.deck.splice(index, 1)
    },
    pushFalterCard(state, card) {
      state.falterCards.push(card)
    },
    shuffleDeck(state) {
      state.deck = shuffle(state.deck)
    },
    setHorseMovement(state, { horse, isMoving }) {
      state.horses[horse].isMoving = isMoving
    },
    incrementFalterPos(state) {
      state.falterPos++
    },
    setCardPlayed(state, card) {
      state.cardPlayed = card
    },
    setWinner(state, horse) {
      state.winner = horse
      state.deck = []
    }
  },

  getters: {
    getCardPlayed: (state) => {
      return state.cardPlayed
    },
    checkPosition: (state) => (horse) => {
      return state.horses[horse].position
    },
    checkMovement: (state) => (horse) => {
      return state.horses[horse].isMoving
    },
    checkFalterPos: (state) => (falterCardPos) => {
      return falterCardPos < state.falterPos
    },
    isTimeForFalter: (state) => {
      const horses = [...Object.keys(state.horses)]
      return horses.every((h) => {
        return state.horses[h].position > state.falterPos
      })
    },
    getTheHorses: (state) => {
      return state.horses
    },
    getWinner: (state) => {
      return state.winner
    }
  },

  actions: {
    setupGame({ commit }) {
      commit("initGame")

      const suits = [...Object.keys(this.state.horses)]
      suits.forEach((suit) => {
        commit("setHorsePos", { horse: suit, pos: 0 })

        for (let i = 0; i < this.state.deckSize; i++) {
          commit("pushCardToDeck", suit)
        }
      })

      for (let i = 0; i < this.state.trackLength - 1; i++) {
        const index = Math.floor(Math.random() * this.state.deck.length)
        const card = this.state.deck[index]
        commit("pushFalterCard", card)
        commit("drawCardFromDeck", index)
      }
      commit("shuffleDeck")
    },

    playCard({ commit }) {
      const last = this.state.deck.length - 1
      const card = this.state.deck[last]
      commit("setCardPlayed", card)
      commit("drawCardFromDeck", last)
      commit("setHorseMovement", { horse: card, isMoving: true })
      return card
    },

    moveHorse({ commit }, horse) {
      const horsePosition = this.state.horses[horse].position + 1
      commit("setHorsePos", { horse: horse, pos: horsePosition })
      commit("setHorseMovement", { horse: horse, isMoving: false })

      if (horsePosition === this.state.trackLength) {
        commit("setWinner", horse)
        return horse
      }

      if (this.getters.isTimeForFalter) {
        const falteringHorse = this.state.falterCards[this.state.falterPos - 1]
        const falteringHorsePos = this.state.horses[falteringHorse].position - 1
        commit("setHorseMovement", { horse: falteringHorse, isMoving: true })
        commit("setHorsePos", { horse: falteringHorse, pos: falteringHorsePos })
        commit("setHorseMovement", { horse: falteringHorse, isMoving: false })
        commit("incrementFalterPos")
      }
    },
  },
})
