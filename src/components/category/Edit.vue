<template>
  <div>
    <section class="site-section">
      <div class="container">
        <div class="row mb-4">
          <div class="col-md-6">
            <h1 class="mb-4">
              Add Category
              <small>
                <router-link
                  :to="{ name: 'view-category' }"
                  :class="'btn btn-primary btn-xs rounded'"
                  >View</router-link
                >
              </small>
            </h1>
          </div>
        </div>
        <div class="row blog-entries">
          <div class="col-md-12 col-lg-8 main-content">
            <div class="row">
              <ValidationObserver
                ref="observer"
                tag="form"
                @submit.prevent="submit"
                v-slot="{ errors }"
              >
                <div class="row">
                  <div class="col-md-12 form-group">
                    <label for="Category Name">Category Name</label>
                    <ValidationProvider
                      name="name"
                      rules="required"
                      v-slot="{ errors }"
                    >
                      <input
                        type="text"
                        id="name"
                        class="form-control"
                        v-model="category.name"
                      />
                    </ValidationProvider>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 form-group">
                    <input class="btn btn-primary" type="submit" value="Add" />
                  </div>
                </div>
              </ValidationObserver>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";

export default {
  data() {
    return {
      category: {
        name: ""
      },
      status: "",
      submitted: false
    };
  },
  components: {
    ValidationProvider,
    ValidationObserver
  },
  methods: {
    async submit() {
      const valid = await this.$refs.observer.validate();
      if (valid) {
        this.$store.commit("loading", true);
        this.$http
          .put("category/update/" + this.$route.params.id, this.category)
          .then(response => {
            return response.json();
          })
          .then(data => {
            this.$store.commit("loading", false);
            const result = data["result"];
            alert(result.msg);
            this.$router.replace({ name: result.route });
          })
          .catch(() => {
            alert("There is some error please try again later.");
          });
      } else {
        return false;
      }
    }
  },
  created() {
    this.$store.commit("loading", true);
    this.$http
      .get("category/edit/" + this.$route.params.id)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.$store.commit("loading", false);
        this.category = data;
      });
  }
};
</script>
