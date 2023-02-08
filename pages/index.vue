<template>
  <div class="score">
    <h1>{{ score }}</h1>
  </div>
  <div class="select" v-if="selected === ''">
    <h1>train AI</h1>
    <h2>What do you want to rate?</h2>
    <button @click="select('serioznost')">serioznost</button>
    <button @click="select('vtipnost')">vtipnost</button>
    <div class="download">
      <button @click="downloadJson">download json</button>
    </div>
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
import { identifier } from "@babel/types";
import { addDocToFirestore, getRatings, FStoJSON } from "../utils/fb/add";
import { fstat } from "fs";

const score = ref(0);
const max = 2000;
let finalArray: number[] = [];
const selected = ref("");
const rating = ref(0);
const current = ref(0);
const gaps: number[] = [];
let last = 0;
let index: number;
const perecent = ref(0);

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
  score.value++;
  localStorage.setItem("score", score.value.toString());
};

const findGaps = async () => {
  const rating = await getRatings([selected.value]);
  console.log(rating.length + " imges rated");
  console.log((rating.length / max) * 100 + "% of dataset is done");
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

const getScore = () => {
  if (localStorage.getItem("score") === null) {
    localStorage.setItem("score", "0");
  }
  score.value = parseInt(localStorage.getItem("score") || "0");
};

onMounted(async () => {
  getScore();
});

const downloadJson = async () => {
  let serioznostData: any = await FStoJSON(["serioznost"]);
  let vtipnostData: any = await FStoJSON(["vtipnost"]);
  serioznostData.forEach((s: any) => {
    s.name = s.id + ".jpg";
    delete s.id;

    s.rating = Math.round(s.rating * 100) / 100;
  });
  vtipnostData.forEach((s: any) => {
    s.name = s.id + ".jpg";
    delete s.id;
    s.rating = Math.round(s.rating * 100) / 100;
  });
  serioznostData = JSON.stringify(serioznostData);
  vtipnostData = JSON.stringify(vtipnostData);
  download(serioznostData, "serioznost.json", "text/plain");
  download(vtipnostData, "vtipnost.json", "text/plain");
};

const download = (content: string, fileName: string, contentType: string) => {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
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
  h4 {
    font-weight: lighter;
    font-size: 0.6em;
  }
}

.download {
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 16px 0;
  display: flex;
  justify-content: center;
}

.score {
  position: fixed;
  top: 0;
  width: 64px;
  height: 64px;
  background-color: #f7dc9e;
  border-radius: 0 0 16px 0;
  display: flex;
  color: black;
  justify-content: center;
  align-items: center;
  z-index: 20;
  h1 {
    margin: 0;
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
