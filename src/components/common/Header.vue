<template>
  <div role="banner">
    <div class="top-bar">
      <div class="container">
        <div class="row">
          <div class="col-9 social">
            <router-link to="login" v-if="!token">Login</router-link>
            <router-link to="register" v-if="!token">Register</router-link>
            <a @click="loggout" v-if="token"> loggout</a>
            <button v-on:click="AuthProvider('google')" v-if="token">
              <span class="fa fa-google"></span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container logo-wrap">
      <div class="row pt-5">
        <div class="col-12 text-center">
          <a
            class="absolute-toggle d-block d-md-none"
            data-toggle="collapse"
            href="#navbarMenu"
            role="button"
            aria-expanded="false"
            aria-controls="navbarMenu"
            ><span class="burger-lines"></span
          ></a>
          <h1 class="site-logo"><router-link to="/">Wordify</router-link></h1>
        </div>
      </div>
    </div>

    <nav class="navbar navbar-expand-md  navbar-light bg-light">
      <div class="container">
        <div class="collapse navbar-collapse" id="navbarMenu">
          <ul class="navbar-nav mx-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>

            <li class="nav-item dropdown" v-if="categories_count">
              <a
                class="nav-link dropdown-toggle"
                href="category.html"
                id="dropdown05"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                >Categories</a
              >
              <div class="dropdown-menu" aria-labelledby="dropdown05">
                <router-link
                  class="dropdown-item"
                  v-for="(category, id) in active_categories"
                  :key="id"
                  :to="{
                    name: 'categoryDetail',
                    params: { slug: category.slug }
                  }"
                >
                  {{ category.name }}
                </router-link>
              </div>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/contact"
                >Contact Us </router-link
              >
            </li>
            <li class="nav-item dropdown" v-if="token">
              <a
                v-if="is_admin"
                class="nav-link dropdown-toggle"
                id="dropdown05"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Admin
              </a>
              <a
                v-else
                class="nav-link dropdown-toggle"
                id="dropdown05"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                User
              </a>
              <div class="dropdown-menu" aria-labelledby="dropdown05">
                <router-link
                  v-if="is_admin"
                  class="dropdown-item"
                  :to="{ name: 'dashboard' }"
                >
                  Dashboard
                </router-link>
                <router-link
                  v-if="is_admin"
                  class="dropdown-item"
                  :to="{ name: 'view-category' }"
                >
                  Category
                </router-link>
                <router-link
                  class="dropdown-item"
                  :to="{ name: 'view-articles' }"
                >
                  Articles
                </router-link>
                <router-link
                  v-if="is_admin"
                  class="dropdown-item"
                  :to="{ name: 'view-comments' }"
                >
                  Comments
                </router-link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      resource: {},
      active_categories: [],
      categories_count: 0
    };
  },
  computed: {
    ...mapState({
      token: state => state.auth.token,
      is_admin: state => state.auth.is_admin
    }),
    isAuthenticated() {
      return this.$store.state.token;
    },
    isAdmin() {
      return this.$store.state.is_admin;
    }
  },
  created() {
    this.fetchActiveCategories();
  },
  methods: {
    fetchActiveCategories() {
      this.$http
        .get("category/active")
        .then(response => {
          return response.json();
        })
        .then(data => {
          this.active_categories = data;
          this.categories_count = data.length;
        });
    },
    loggout() {
      delete localStorage.token;
      //this.$router.redirect({ name: "Home"});
      this.$router.replace({ name: "home" });
      location.reload();
    },
    AuthProvider(provider) {
      this.$auth
        .authenticate(provider)
        .then(response => {
          this.SocialLogin(response);
        })
        .catch(err => {
          console.log({ err: err });
        });
    },
    SocialLogin(response) {
      this.$http
        .post("sociallogin/google", response)
        .then(response => {
          console.log(response);
        })
        // .then(data => {
        //     console.log(data);
        // })
        .catch(err => {
          console.log({ err: err });
        });
    }
  }
};
</script>
