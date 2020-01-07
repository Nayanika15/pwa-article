<template>
  <section class="site-section pt-5">
    <div class="container">
      <div class="row mb-4">
        <div class="col-md-6">
          <h2 class="mb-4">Category: {{ $route.params.slug }}</h2>
        </div>
      </div>
      <div class="row blog-entries">
        <div class="col-md-12 col-lg-8 main-content">
          <div class="row mb-5 mt-5">
            <div class="col-md-12">
              <div
                class="post-entry-horzontal"
                v-for="(article, id) in articles"
                :key="id"
              >
                <router-link
                  class="image  fadeIn "
                  v-bind:to="{
                    name: 'articleDetail',
                    params: { slug: article.slug }
                  }"
                >
                  <div
                    class="image"
                    data-animate-effect="fadeIn"
                    :style="{
                      'background-image': 'url(' + article.category_image + ')'
                    }"
                  ></div>
                  <span class="text">
                    <div class="post-meta">
                      <span class="author mr-2"
                        ><img
                          src="/assets/images/person_1.jpg"
                          :alt="article.added_by"
                        />
                        {{ article.added_by }}</span
                      >&bullet;
                      <span class="mr-2"> {{ article.date }} </span> &bullet;
                      <span
                        class="mr-2"
                        v-for="(category, id) in article.categories_tagged"
                        :key="id"
                      >
                        {{ category.title }}
                      </span>
                      &bullet;
                    </div>
                    <h2>{{ article.title }}</h2>
                    <p v-html="article.excerpt"></p>
                    <h5 class="button btn btn-info">Read more</h5>
                  </span>
                </router-link>
              </div>
              <!-- END post -->
            </div>
          </div>
          <v-paginator
            :options="options"
            :resource_url="resource_url"
            @update="updateResource"
          ></v-paginator>
        </div>
        <appSideBar></appSideBar>
        <!-- END main-content -->
      </div>
    </div>
  </section>
</template>
<script>
import VuePaginator from "vuejs-paginator";
import SideBar from "../common/SideBar";
export default {
  data() {
    return {
      resource: {},
      articles: {},
      resource_url: "category/" + this.$route.params.slug,
      options: {
        remote_data: "result.articles.data",
        remote_current_page: "result.articles.current_page",
        remote_last_page: "result.articles.last_page",
        remote_next_page_url: "result.articles.next_page_url",
        remote_prev_page_url: "result.articles.prev_page_url",
        next_button_text: "Go Next",
        previous_button_text: "Go Back"
      }
    };
  },
  beforeRouteUpdate(to, from, next) {
    this.resource_url = "category/" + to.params.slug;
    next();
  },
  methods: {
    updateResource(data) {
      this.articles = data;
    }
  },
  components: {
    VPaginator: VuePaginator,
    appSideBar: SideBar
  }
};
</script>
