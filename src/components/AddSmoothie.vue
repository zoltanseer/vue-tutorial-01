<template>
  <div class="add-smoothie container">
    <h2 class="center-align indigo-text">Add new smoothie recipe</h2>
    <form @submit.prevent="addSmoothie">
      <div class="field title">
        <label for="title">Smoothie title: </label>
        <input type="text" name="title" v-model="title" />
      </div>
      <div v-for="(ing, index) in ingredients" :key="index" class="field">
        <label for="ingredient">Ingredient: </label>
        <input type="text" name="ingredient" v-model="ingredients[index]" />
        <i class="material-icons ico-delete" @click="deleteIngredient(index)"
          >delete</i
        >
      </div>
      <div class="field add-ingredient">
        <label for="add-ingredient">Add an ingredient: </label>
        <input
          type="text"
          name="add-ingredient"
          @keydown.tab.prevent="addIngredient"
          v-model="currentIngredient"
        />
      </div>
      <div class="field center-align">
        <p v-if="feedback" class="red-text">{{ feedback }}</p>
        <button class="btn pink">Add Smoothie</button>
      </div>
    </form>
  </div>
</template>

<script>
import db from "@/firebase/init";
import slugify from "slugify";

export default {
  name: "AddSmoothie",
  data() {
    return {
      title: null,
      currentIngredient: null,
      ingredients: [],
      feedback: null,
      slug: null
    };
  },
  methods: {
    addSmoothie() {
      if (this.title) {
        this.feedback = null;
        this.slug = slugify(this.title, {
          replacement: "-",
          remove: /[$*_+~.()'"!\-:@]/g,
          lower: true
        });
        db.collection("smoothies")
          .add({
            title: this.title,
            ingredients: this.ingredients,
            slug: this.slug
          })
          .then(() => {
            this.$router.push({ name: "index" });
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.feedback = "Please add a title";
      }
    },
    addIngredient() {
      if (this.currentIngredient) {
        this.ingredients.push(this.currentIngredient);
        this.currentIngredient = null;
        this.feedback = null;
      } else {
        this.feedback = "You must enter a value to add ingredient";
      }
    },
    deleteIngredient(index) {
      this.ingredients.splice(index, 1);
    }
  }
};
</script>

<style>
.add-smoothie {
  margin-top: 60px;
  padding: 20px;
  max-width: 500px;
}
.add-smoothie h2 {
  font-size: 2em;
  margin: 20px auto;
}
.add-smoothie .field {
  margin: 20px auto;
  position: relative;
}
.add-smoothie .ico-delete {
  position: absolute;
  top: 50%;
  right: 0;
  z-index: 2;
  font-size: 1.2em;
  transform: translateY(-50%);
  color: #aaa;
  cursor: pointer;
}
</style>
