<template>
  <div class="edit-smoothie container" v-if="smoothie">
    <h2>Edit: {{ smoothie.title }}</h2>
    <form @submit.prevent="updateSmoothie">
      <div class="field title">
        <label for="title">Smoothie title: </label>
        <input type="text" name="title" v-model="smoothie.title" />
      </div>
      <div
        v-for="(ing, index) in smoothie.ingredients"
        :key="index"
        class="field"
      >
        <label for="ingredient">Ingredient: </label>
        <input
          type="text"
          name="ingredient"
          v-model="smoothie.ingredients[index]"
        />
        <i class="material-icons ico-delete" @click="deleteIngredient(index)"
          >delete</i
        >
      </div>
      <div class="field add-ingredient">
        <label for="add-ingredient">Add an ingredient: </label>
        <input
          type="text"
          name="add-ingredient"
          @keydown.enter.prevent="addIngredient"
          v-model="currentIngredient"
        />
      </div>
      <div class="field center-align">
        <p v-if="feedback" class="red-text">{{ feedback }}</p>
        <button class="btn pink">Update Smoothie</button>
      </div>
    </form>
  </div>
</template>

<script>
import db from "@/firebase/init";
import slugify from "slugify";
export default {
  name: "EditSmoothie",
  data() {
    return {
      smoothie: null,
      currentIngredient: null,
      feedback: null
    };
  },

  methods: {
    updateSmoothie() {
      if (this.smoothie.title) {
        this.feedback = null;
        this.smoothie.slug = slugify(this.smoothie.title, {
          replacement: "-",
          remove: /[$*_+~.()'"!\-:@]/g,
          lower: true
        });
        db.collection("smoothies")
          .doc(this.smoothie.id)
          .update({
            title: this.smoothie.title,
            ingredients: this.smoothie.ingredients,
            slug: this.smoothie.slug
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
        this.smoothie.ingredients.push(this.currentIngredient);
        this.currentIngredient = null;
        this.feedback = null;
      } else {
        this.feedback = "You must enter a value to add ingredient";
      }
    },
    deleteIngredient(index) {
      this.smoothie.ingredients.splice(index, 1);
    }
  },

  created() {
    let ref = db
      .collection("smoothies")
      .where("slug", "==", this.$route.params.slug);
    ref.get().then(snapshot => {
      snapshot.forEach(doc => {
        let smoothie = doc.data();
        smoothie.id = doc.id;
        this.smoothie = smoothie;
      });
    });
  }
};
</script>

<style>
.edit-smoothie {
  margin-top: 60px;
  padding: 20px;
  max-width: 500px;
}
.edit-smoothie h2 {
  font-size: 2em;
  margin: 20px auto;
}
.edit-smoothie .field {
  margin: 20px auto;
  position: relative;
}
.edit-smoothie .ico-delete {
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
