<template>
  <div
    class="card-falter"
    :style="falterStyle"
    :class="{flipped: isFlipped}"
  >
    <div
      class="falter-front"
      :class="colorClass"
    >
      {{ suit }}
    </div>
    <div class="falter-back">
      <!-- 🂠 -->
    </div>
  </div>
</template>

<script>
export default {
  name: "CardFalter",
  props: {
    suit: String,
    colorClass: String,
    position: Number
  },
  computed: {
    falterStyle() {
      return {
        gridColumn: this.position + 1
      }
    },
    isFlipped() {
      return this.$store.getters.checkFalterPos(this.position)
    }
  }
}
</script>

<style>
.card-falter {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 1.5rem;
  position: relative;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  transition: transform 0.2s;
}

.card-falter.flipped {
  transform: rotateY(180deg);
}

.falter-front,
.falter-back {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  font-size: 1.5rem;
  text-align: center;
  position: absolute;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  background: var(--clr-card-back);
}

.falter-front {
  transform: rotateY(180deg);
  line-height: 1;
}

.falter-back {
  color: var(--clr-black);
  writing-mode: vertical-lr;
  text-orientation: sideways;
}

</style>
