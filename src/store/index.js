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
        position: 0,
        isMoving: false
      },
      "♥︎": {
        colorClass: "suit-red",
        position: 0,
        isMoving: false
      },
      "♠︎": {
        colorClass: "suit-black",
        position: 0,
        isMoving: false
      },
      "♣︎": {
        colorClass: "suit-black",
        position: 0,
        isMoving: false
      }
    },
    deck: null,
    falterCards: null,
    falterPos: null,
    cardPlayed: null,
    falterHappening: false,
    falteringHorse: null,
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
    changeHorsePosition(state, { horse, direction }) {
      state.horses[horse].position += direction
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
    setFalterState(state, falterState) {
      state.falterHappening = falterState
    },
    setFalteringHorse(state, horse) {
      state.falteringHorse = horse
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
    getPosition: (state) => (horse) => {
      return state.horses[horse].position
    },
    checkMovement: (state) => (horse) => {
      return state.horses[horse].isMoving
    },
    checkFalterPos: (state) => (falterCardPos) => {
      return falterCardPos < state.falterPos
    },
    checkFalterState: (state) => {
      return state.falterHappening
    },
    isTimeForFalter: (state) => {
      const horses = [...Object.keys(state.horses)]
      return horses.every(h => state.horses[h].position > state.falterPos)
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
      return card
    },

    handleTurn({ dispatch, commit }, horse) {

      dispatch("moveHorse", { horse: horse, direction: 1 })
        .then((newPosition) => {
          commit("setHorseMovement", { horse: horse, isMoving: false })

          if (newPosition === this.state.trackLength) {
            commit("setWinner", horse)
          }

          if (this.getters.isTimeForFalter) {
            const falteringHorse = this.state.falterCards[this.state.falterPos - 1]
            commit("incrementFalterPos")
            commit("setFalterState", true)
            commit("setFalteringHorse", falteringHorse)
          }
        })
    },

    moveHorse({ commit }, horse) {
      return new Promise((resolve) => {
        commit("setHorseMovement", { horse: horse.horse, isMoving: true })
        setTimeout(() => {
          commit("changeHorsePosition", horse)
          resolve(this.getters.getPosition(horse.horse))
        }, 30)
      })
    },

    executeFalter({ dispatch, commit }) {
      dispatch("moveHorse", { horse: this.state.falteringHorse, direction: -1 })
        .then(() => {
          commit("setHorseMovement", { horse: this.state.falteringHorse, isMoving: false })
          commit("setFalterState", false)
        })
    }
  },
})
