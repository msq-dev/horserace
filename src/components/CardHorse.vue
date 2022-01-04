<template>
  <div
    class="card-horse"
    :class="horseClasses"
    :style="horseStyle"
  >
    {{ suit }}
  </div>
</template>

<script>
export default {
  name: "CardHorse",
  props: {
    suit: String,
    colorClass: String,
    lane: Number,
    winner: String
  },
  computed: {
    horseClasses() {
      const red = this.colorClass === "suit-red"
      const isWinner = this.suit === this.winner
      return {
        "suit-red": red,
        "suit-black": !red,
        "shrinky": this.isMoving,
        "growy": !this.isMoving,
        "jumpy": isWinner
      }
    },
    isMoving() {
      return this.$store.getters.checkMovement(this.suit)
    },
    horsePosition() {
      return this.$store.getters.checkPosition(this.suit)
    },
    horseStyle() {
      return {
        gridColumn: this.horsePosition + 1,
        gridRow: this.lane + 1,
      }
    },

  }
}
</script>

<style>
.card-horse {
  --duration: 0.3s;

  display: grid;
  align-items: center;
  width: 80%;
  font-size: 1.5rem;
  text-align: center;
  padding: 0.1em 0;
  border-radius: 5px;
  background-color: var(--clr-card-back);
}

.shrinky,
.growy {
  animation-duration: var(--duration);
  animation-fill-mode: forwards;
}

.shrinky {
  transform: scale(1);
  animation-name: shrinky;
}

@keyframes shrinky {
  to {
    transform: scale(0);
  }
}

.growy {
  transform: scale(0);
  animation-name: growy;
}

@keyframes growy {
  to {
    transform: scale(1);
  }
}

.jumpy {
  animation: jumpy 1.2s infinite;
}

@keyframes jumpy {
  0% {
    transform: translate(-25%, -25%) scale(0.75, 0.75);
  }
  50% {
    transform: translate(-25%, -65%) scale(1, 1);
  }
  55% {
    transform: translate(-25%, -65%) rotate(15deg);
  }
  60% {
    transform: translate(-25%, -65%) rotate(-15deg);
  }
  65% {
    transform: translate(-25%, -65%) rotate(15deg);
  }
  70% {
    transform: translate(-25%, -65%) rotate(-15deg);
  }
  100% {
    transform: translate(-25%, -25%) scale(0.75, 0.75);
  }
}

</style>
