<template>
  <div class="col-md-12 col-lg-4 sidebar">
    <div class="sidebar-box" v-if="articles_count">
      <h3 class="heading">Popular Articles</h3>
      <div class="post-entry-sidebar">
        <ul>
          <li v-for="(article, id) in popular_articles" :key="id">
            <router-link
              :to="{ name: 'articleDetail', params: { slug: article.slug } }"
            >
              <img
                :src="article.category_image"
                alt="Image placeholder"
                class="mr-4"
              />

              <div class="text">
                <h4>{{ article.title }}</h4>
                <div class="post-meta">
                  <span class="mr-2">{{ article.date }}</span>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <!-- END sidebar-box -->

    <div class="sidebar-box" v-if="categories_count">
      <h3 class="heading">Categories</h3>
      <ul class="categories">
        <li v-for="(category, id) in active_categories" :key="id">
          <router-link
            :to="{ name: 'categoryDetail', params: { slug: category.slug } }"
          >
            {{ category.name }}
            <span>( {{ category.articles_count }})</span></router-link
          >
        </li>
      </ul>
    </div>
    <!-- END sidebar-box -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      resource: {},
      popular_articles: [],
      active_categories: [],
      categories_count: 0,
      articles_count: 0
    };
  },
  created() {
    this.fetchArticleDetail();
  },
  methods: {
    fetchArticleDetail() {
      this.$http
        .get("sideBar")
        .then(response => {
          return response.json();
        })
        .then(data => {
          const result = data["result"];
          this.popular_articles = result["popular_articles"];
          this.active_categories = result["active_categories"];
          this.categories_count = result["active_categories"].length;
          this.articles_count = result["popular_articles"].length;
        });
    }
  }
};
</script>
