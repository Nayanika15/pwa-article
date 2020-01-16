<template>
  <section class="site-section">
    <div class="container">
      <div class="row mb-4">
        <div class="col-md-6">
          <h1 class="mb-4">Login</h1>
        </div>
      </div>
      <div class="row blog-entries">
        <div class="col-md-12 col-lg-8 main-content">
          <ValidationObserver
            ref="observer"
            tag="form"
            @submit.prevent="submit"
            v-slot="{ errors }"
          >
            <div class="row">
              <div class="col-md-12 form-group">
                <label for="E-Mail Address">E-Mail Address</label>
                <ValidationProvider
                  name="email"
                  rules="required|email"
                  v-slot="{ errors }"
                  :bails="false"
                >
                  <input
                    placeholder="Enter email address"
                    maxlength="50"
                    class="form-control"
                    v-model="user.email"
                    type="text"
                  />
                </ValidationProvider>
              </div>
              <div class="col-md-12 form-group">
                <label for="Password">Password</label>
                <ValidationProvider
                  name="password"
                  rules="required"
                  v-slot="{ errors }"
                  :bails="false"
                >
                  <input
                    type="password"
                    placeholder="Enter password"
                    maxlength="50"
                    class="form-control"
                    v-model="user.password"
                  />
                </ValidationProvider>
              </div>
              <div class="col-md-6 form-group">
                <input type="submit" value="Login" class="btn btn-primary" />
                <router-link :to="{ name: 'reset-password' }">
                  Forgot password</router-link
                >
              </div>
            </div>
            <span v-show="errors">
              <ul v-for="(error, id) in errors" :key="id">
                <li v-for="(err, i) in error" :key="i">{{ err }}</li>
              </ul>
            </span>
          </ValidationObserver>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
export default {
  data() {
    return {
      user: {
        email: "",
        password: ""
      }
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
          .post("login", this.user)
          .then(response => {
            return response.json();
          })
          .then(data => {
            this.$store.commit("loading", false);
            const result = data["result"];

            if(result.token) {
              this.$store.dispatch("user_auth", {
                token: result.token,
                is_admin: result.isAdmin
              });
            } else {
              this.loginFailed();
              return;
            }

            this.error = false;
            this.$router.replace({ name: "dashboard" });
            location.reload();
          })
          .catch((error) => {
            this.$store.commit("loading", false);
            console.log(error);
            alert('Login failed');
          });
      } else {
        return false;
      }
    },
    loginFailed() {
      // this.$store.commit("loading", false);
      this.error = "Login failed!";
    },
    
  },
  created() {
    if((this.$store.state.auth.token))
    {
      this.$router.replace({ name: "dashboard" });
      location.reload();
    }
  }
};
</script>
