<template>
  <div>
    <section class="site-section py-lg">
      <div class="container">
        <div class="row blog-entries ">
          <div class="col-md-12 col-lg-8 main-content">
            <div class="post-meta">
              <span class="author mr-2"
                ><img
                  src="/src/assets/images/person_1.jpg"
                  :alt="article.added_by"
                  class="mr-2"
                />
                {{ article.added_by }}</span
              >&bullet; <span class="mr-2"> {{ article.date }} </span> &bullet;
              <span class="ml-2"
                ><span class="fa fa-comments"></span> {{ comments_count }}
              </span>
            </div>
            <h1 class="mb-4">{{ article.title }}</h1>
            <div class="post-content-body">
              <span v-html="article.details"></span>
            </div>

            <div class="pt-5">
              <p>
                Categories:
                <router-link
                  v-for="(category, id) in article.categories"
                  :key="id"
                  :to="{
                    name: 'categoryDetail',
                    params: { slug: category.slug }
                  }"
                >
                  {{ category.name }}
                </router-link>
              </p>
            </div>

            <div class="pt-5">
              <h3 class="mb-5">{{ comments_count }} Comments</h3>
              <ul class="comment-list" v-if="comments_count">
                <li
                  class="comment"
                  v-for="(comment, index) in active_comments"
                  :key="index"
                >
                  <div class="vcard">
                    <img
                      :src="'/src/assets/images/person_1.jpg'"
                      alt="Image placeholder"
                    />
                  </div>
                  <div class="comment-body">
                    <h3>{{ comment.name }}</h3>
                    <div class="meta">{{ comment.created_date }}</div>
                    <p v-html="comment.comment"></p>
                    <p><a href="#" class="reply rounded">Reply</a></p>
                  </div>
                </li>
              </ul>
              <!-- END comment-list -->

              <div class="comment-form-wrap pt-5">
                <h3 class="mb-5">Leave a comment</h3>
                <ValidationObserver
                  ref="observer"
                  tag="form"
                  @submit.prevent="submit"
                  v-slot="{ errors }"
                >
                  <div class="row" v-if="!isAuthenicated">
                    <div class="col-md-12 form-group">
                      <label for="name">Name</label>
                      <ValidationProvider
                        name="name"
                        rules="required"
                        v-slot="{ errors }"
                      >
                        <input
                          type="text"
                          id="name"
                          class="form-control"
                          v-model="user.name"
                        />
                      </ValidationProvider>
                    </div>
                    <div class="col-md-12 form-group">
                      <label for="mobile">Mobile</label>
                      <ValidationProvider
                        name="mobile"
                        rules="required|numeric"
                        v-slot="{ errors }"
                        :bails="false"
                      >
                        <div class="input-group">
                          <input
                            type="text"
                            id="mobile"
                            maxlength="10"
                            class="form-control"
                            v-model="user.mobile"
                          />
                          <button
                            class="btn btn-warning btn-sm input-group-btn"
                            @click="verify"
                            type="button"
                          >
                            Send code
                          </button>
                        </div> </ValidationProvider
                      ><span class="alert-info" v-html="status"></span>
                    </div>
                    <div class="col-md-12 form-group">
                      <ValidationProvider
                        name="code"
                        rules="required|min:3"
                        v-slot="{ errors }"
                        :bails="false"
                      >
                        <label for="Verification code">Verification Code</label>
                        <input
                          class="form-control"
                          name="code"
                          type="text"
                          v-model="user.code"
                        />
                      </ValidationProvider>
                    </div>
                    <div class="col-md-12 form-group">
                      <ValidationProvider
                        name="email"
                        rules="required|email"
                        v-slot="{ errors }"
                        :bails="false"
                      >
                        <label for="email">Email</label>
                        <input
                          type="email"
                          id="email"
                          class="form-control"
                          v-model="user.email"
                        />
                      </ValidationProvider>
                    </div>
                  </div>
                  <div class="row">
                    <ValidationProvider
                      name="comment"
                      rules="required"
                      v-slot="{ errors }"
                    >
                      <div class="col-md-12 form-group">
                        <label for="comment">Comment</label>
                        <textarea
                          name="comment"
                          id="comment"
                          class="form-control "
                          cols="100"
                          rows="5"
                          v-model="user.comment"
                        ></textarea>
                      </div>
                    </ValidationProvider>
                  </div>
                  <div class="row">
                    <div class="col-md-6 form-group">
                      <input
                        type="submit"
                        value="Submit"
                        class="btn btn-primary"
                      />
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
          <appSideBar></appSideBar>
          <!-- END main-content -->
        </div>
      </div>
    </section>
    <div class="py-5" v-if="realted_articles_count">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <h2 class="mb-3 ">Related Post</h2>
          </div>
        </div>
        <div class="row">
          <div
            class="col-md-6 col-lg-4"
            v-for="(related, index) in related_articles"
            :key="index"
          >
            <router-link
              class="a-block sm d-flex align-items-center height-md"
              :style="{ 'background-image': 'url(' + related.image + ')' }"
              v-bind:to="{
                name: 'articleDetail',
                params: { slug: related.slug }
              }"
            >
              <div class="text">
                <div class="post-meta">
                  <span class="category">Lifestyle</span>
                  <span class="mr-2">{{ related.created_date }}</span> &bullet;
                  <span class="ml-2"
                    ><span class="fa fa-comments"></span
                    >{{ related.comments_count }}</span
                  >
                </div>
                <h3>{{ related.title }}</h3>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from "../common/SideBar";
import { ValidationProvider, ValidationObserver } from "vee-validate";
export default {
  data() {
    return {
      isAuthenicated: localStorage.getItem("token"),
      resource: {},
      article: [],
      comments: [],
      comments_count: 0,
      related_articles: [],
      realted_articles_count: 0,
      status: "",
      user: {
        name: "",
        email: "",
        mobile: "",
        comment: "",
        code: ""
      }
    };
  },
  components: {
    appSideBar: SideBar,
    ValidationProvider,
    ValidationObserver
  },
  created() {
    this.fetchArticleDetail(this.$route.params.slug);
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchArticleDetail(to.params.slug);
    next();
  },
  methods: {
    fetchArticleDetail(path) {
      this.$store.commit("loading", true);
      this.$http
        .get("article/" + path)
        .then(response => {
          return response.json();
        })
        .then(data => {
          this.$store.commit("loading", false);
          const result = data["result"];
          this.article = result["article"];
          this.active_comments = result["active_comments"];
          this.comments_count = result["active_comments"].length;
          this.related_articles = result["related_articles"];
          this.realted_articles_count = result["related_articles"].length;
        });
    },
    async submit() {
      const valid = await this.$refs.observer.validate();
      if (valid) {
        this.$store.commit("loading", true);
        this.$http
          .post("comment/add/" + this.article.id, this.user)
          .then(
            response => {
              return response.json();
            },
            error => alert(error)
          )
          .then(data => {
            this.$store.commit("loading", false);
            alert(data.msg);
            location.reload();
          });
      } else {
        return false;
      }
    },
    verify() {
      if (this.user.mobile) {
        this.$store.commit("loading", true);
        this.$http
          .get("verify-mobile/" + this.user.mobile)
          .then(response => {
            return response.json();
          })
          .then(data => {
            this.$store.commit("loading", false);
            this.status = data.message;
          });
      } else {
        alert("please enter a valid mobile no");
      }
    }
  }
};
</script>
