<template>
  <div v-if="selected === ''">
    <h1>train AI</h1>
    <h2>What do you want to rate?</h2>
    <button @click="select('serioznost')">serioznost</button>
    <button @click="select('vtipnost')">vtipnost</button>
  </div>
  <div class="rating" v-else>
    <h3>{{ selected }}</h3>
    <img :src="'/images/rating/' + current + '.jpg'" />
    <input type="range" max="15" v-model="rating" />
    <span>{{ Math.floor(rating * (100 / 15)) }}</span>
    <div><button @click="skip">skip</button> <button @click="next">next</button></div>
  </div>
</template>

<script lang="ts" setup>
import { addDocToFirestore, getRatings } from "../utils/fb/add";
const max = 170;
let finalArray: number[] = [];
const selected = ref("");
const rating = ref(0);
const current = ref(0);
const gaps: number[] = [];
let last: number = 0;
let index: number;

const select = async (name: string) => {
  selected.value = name;
  await findGaps();
  genArray();
  getImageID();
};

const genArray = () => {
  finalArray = gaps;
  for (let i = last + 1; i <= max; i++) {
    finalArray.push(i);
  }
};

const setRating = async () => {
  const rate = rating.value / 15;
  const name = current.value.toString();
  await addDocToFirestore([selected.value], { rating: rate, id: parseInt(name) }, name);
  rating.value = 0;
  return;
};

const findGaps = async () => {
  const rating = await getRatings([selected.value]);
  const ids = rating.map((r) => parseInt(r.id));
  if (ids.length === 0) return;
  last = ids[ids.length - 1];
  for (let i = 1; i < last; i++) {
    if (!ids.includes(i)) gaps.push(i);
  }
};

const skip = () => {
  getImageID();
};
const next = async () => {
  await setRating();
  //remove current from array
  finalArray.splice(index, 1);
  getImageID();
};

const getImageID = () => {
  index = Math.floor(Math.random() * finalArray.length);
  current.value = finalArray[index];
  //remove current from array
};
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}
.rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  img {
    width: 100%;
    max-height: 80vh;
    object-fit: contain;
  }
  input {
    width: 95%;
    accent-color: #1c7ed4;
    max-width: 512px;
  }
}
</style>
