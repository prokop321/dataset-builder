<template>
  <div class="select" v-if="selected === ''">
    <h1>train AI</h1>
    <h2>What do you want to rate?</h2>
    <button @click="select('serioznost')">serioznost</button>
    <button @click="select('vtipnost')">vtipnost</button>
  </div>
  <div v-else class="rating">
    <h3>{{ selected }}</h3>
    <img :src="'/images/rating/' + current + '.jpg'" />
    <div class="ui">
      <input type="range" max="15" v-model="rating" />
      <span>{{ Math.floor(rating * (100 / 15)) }}</span>
      <div><button @click="skip">skip</button> <button @click="next">next</button></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { addDocToFirestore, getRatings } from "../utils/fb/add";
const max = 919;
let finalArray: number[] = [];
const selected = ref("");
const rating = ref(0);
const current = ref(0);
const gaps: number[] = [];
let last = 0;
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
};

const findGaps = async () => {
  const rating = await getRatings([selected.value]);
  console.log(rating.length + " imges rated");
  console.log(rating.length / max + "% of dataset is done");
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
  font-family: "arial";
  background-color: rgb(1, 13, 24);
  color: white;
}

.select {
  text-align: center;
  button {
    background-color: #065751;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    margin: 4px;
    cursor: pointer;
  }
}
.rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  .ui {
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 0;
    background-color: rgba(0, 0, 0, 0.2);
  }
  img {
    width: 100%;
    height: 90vh;
    top: 5vh;
    object-fit: contain;
    position: absolute;
  }
  h3 {
    position: absolute;
    font-weight: bold;
    margin: 0.4em;
    background-color: rgba(0, 0, 0, 0.2);
    font-size: 1.5rem;
  }
  input {
    width: 85%;
    accent-color: #1c7ed4;
    max-width: 512px;
  }
  button {
    background-color: #065751;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 16px 24px;
    font-size: 1.4em;
    cursor: pointer;
  }
}
</style>
