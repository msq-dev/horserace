<template>
  <div
    class="card-horse"
    :class="horseClasses"
    :style="horseStyle"
  >
    {{ horse }}
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "CardHorse",
  props: {
    horse: String,
    colorClass: String,
    lane: Number,
    winner: String
  },
  computed: {
    ...mapGetters({
      position: "getPosition",
      isMoving: "checkMovement",
    }),
    horseClasses() {
      const red = this.colorClass === "suit-red"
      const isWinner = this.horse === this.winner
      return {
        "suit-red": red,
        "suit-black": !red,
        "shrinky": this.isMoving(this.horse),
        "growy": !this.isMoving(this.horse),
        "jumpy": isWinner
      }
    },
    horseStyle() {
      return {
        gridColumn: this.position(this.horse) + 1,
        gridRow: this.lane + 1,
      }
    },
  },
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
