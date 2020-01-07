<template>
  <div>
    <appSlider></appSlider>
    <!-- END section -->

    <section class="site-section py-sm">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h2 class="mb-4">Latest Posts</h2>
          </div>
        </div>
        <div class="row blog-entries">
          <div class="col-md-12 col-lg-8 main-content">
            <div class="row">
              <div
                class="col-md-6"
                v-for="(article, index) in articles"
                :key="index"
              >
                <router-link
                  :to="{
                    name: 'articleDetail',
                    params: { slug: article.slug }
                  }"
                  class="blog-entry "
                  data-animate-effect="fadeIn"
                >
                  <img :src="article.homepage_image" alt="Image placeholder"/>
                  <div class="blog-content-body">
                    <div class="post-meta">
                      <span class="author mr-2"
                        ><img
                          src="assets/images/person_1.jpg"
                          :alt="article.added_by"
                        />{{ article.added_by }}</span
                      >&bullet;
                      <span class="mr-2">{{ article.date }}</span>
                      &bullet;
                      <span class="ml-2"
                        ><span class="fa fa-comments"></span>
                        {{ article.comments_count }}</span
                      >
                    </div>
                    <h2>{{ article.title }}</h2>
                  </div>
                </router-link>
                <!-- </a> -->
              </div>
            </div>

            <div class="row mt-5">
              <div class="col-md-12 text-center">
                <v-paginator
                  :options="options"
                  :resource_url="resourse_url"
                  @update="updateResource"
                ></v-paginator>
              </div>
            </div>
          </div>
          <appSideBar></appSideBar>
          <!-- END sidebar -->
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import VuePaginator from "vuejs-paginator";
import Slider from "./common/Slider.vue";
import SideBar from "./common/SideBar";
export default {
  data() {
    return {
      resource: {},
      articles: [],
      resourse_url: "article/latest",
      options: {
        remote_data: 'result.data',
      remote_current_page: 'result.current_page',
      remote_last_page: 'result.last_page',
      remote_next_page_url: 'result.next_page_url',
      remote_prev_page_url: 'result.prev_page_url',
      next_button_text: 'Go Next',
      previous_button_text: 'Go Back'
      }
    };
  },
  components: {
    VPaginator: VuePaginator,
    appSlider: Slider,
    appSideBar: SideBar
  },
  created() {
    this.fetchArticles();
  },
  methods: {
    updateResource(data) {
      const resArray = [];
      const dataResult = data;
      for (let key in dataResult) {
        resArray.push(dataResult[key]);
      }
      this.articles = resArray;
    },
    fetchArticles() {
      this.$store.commit("loading", true);
      this.$http
        .get("article/latest")
        .then(response => {
          return response.json();
        })
        .then(data => {
          this.$store.commit("loading", false);
          if (data.result.data.length) {
            const resArray = [];
            const dataResult = data.result.data;
            for (let key in dataResult) {
              resArray.push(dataResult[key]);
            }
            this.articles = resArray;
          }
        });
    }
  }
};
</script>
