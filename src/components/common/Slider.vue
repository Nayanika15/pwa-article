<template>
  <section class="site-section pt-5 pb-5">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <carousel
            v-if="featuredArticles.length"
            :per-page="1"
            :autoplay="true"
          >
            <slide v-for="(article, id) in featuredArticles" :key="id">
              <router-link
                :to="{ name: 'articleDetail', params: { slug: article.slug } }"
                class="a-block d-flex align-items-center height-lg"
                :style="{
                  'background-image': 'url(' + article.slider_image + ')'
                }"
              >
                <div class="text half-to-full">
                  <span
                    class="category mb-5"
                    v-for="(category, id) in article.categories_tagged"
                    :key="id"
                    >{{ category.name }}</span
                  >
                  <div class="post-meta">
                    <span class="author mr-2"
                      ><img
                        src="/src/assets/images/person_1.jpg"
                        :alt="article.added_by"
                      />
                      {{ article.added_by }}</span
                    >&bullet;
                    <span class="mr-2">{{ article.date }} </span> &bullet;
                    <span class="ml-2"
                      ><span class="fa fa-comments"></span>
                      {{ article.comments_count }}
                    </span>
                  </div>
                  <h3>{{ article.title }}</h3>
                  <p v-html="article.excerpt"></p>
                </div>
              </router-link>
            </slide>
          </carousel>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { Carousel, Slide } from "vue-carousel";
export default {
  data() {
    return {
      featuredArticles: []
    };
  },
  components: {
    Carousel,
    Slide
  },
  created() {
    this.$http
      .get("article/featured")
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.featuredArticles = data;
      });
  }
};
</script>
