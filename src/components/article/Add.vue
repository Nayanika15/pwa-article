<template>
  <div>
    <section class="site-section">
      <div class="container">
        <div class="row mb-4">
          <div class="col-md-6">
            <h1 class="mb-4">
              Add Articles
              <small>
                <router-link
                  :to="{ name: 'view-articles' }"
                  :class="'btn btn-primary btn-xs rounded'"
                  >View</router-link
                >
              </small>
            </h1>
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
                  <label for="title">Title</label>
                  <ValidationProvider
                    name="title"
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <input
                      type="text"
                      id="title"
                      class="form-control"
                      v-model="article.title"
                    />
                  </ValidationProvider>
                </div>
                <div class="col-md-12 form-group">
                  <label for="Category Name">Category Name</label>
                  <ValidationProvider
                    name="categories"
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <select
                      v-model="article.categories"
                      class="form-control"
                      multiple
                    >
                      <option
                        v-for="(category, id) in categories"
                        :value="category.id"
                        :key="id"
                        >{{ category.name }}</option
                      >
                    </select>
                  </ValidationProvider>
                </div>
                <div class="col-md-12 form-group">
                  <label for="details">Details</label>
                  <div>
                    <ValidationProvider
                    name="details"
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
                        <button :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
                          <i class="fa fa-bold" aria-hidden="true"></i>
                        </button>
                    </editor-menu-bar>
                    <editor-content 
                    class="form-control"
                    :editor="editor" />
                  </ValidationProvider>
                </div>
                </div>
                <div class="col-md-12 form-group">
                  <label for="image">Image</label>
                  <ValidationProvider
                    name="image"
                    rules="image"
                    v-slot="{ errors }"
                  >
                    <input type="file" class="form-control" />
                  </ValidationProvider>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 form-group">
                  <input class="btn btn-primary" type="submit" value="Add" />
                </div>
                <span v-show="errors">
                  <ul v-for="(error, id) in errors" :key="id">
                    <li v-for="(err, i) in error" :key="i">{{ err }}</li>
                  </ul>
                </span>
              </div>
            </ValidationObserver>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import { Blockquote, CodeBlock, HardBreak, Heading, OrderedList, BulletList, ListItem, TodoItem, TodoList, Bold, Code, Italic, Link, Strike, Underline, History } from 'tiptap-extensions';

export default {
  data() {
    return {
      article: {
        title: "",
        details: "",
        categories: [],
        image: "",
        status: "",
      },
      status: "",
      submitted: false,
      categories: "",
      categories_count: 0,
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new BulletList(),
          new OrderedList(),
          new ListItem(),
          new TodoItem(),
          new TodoList(),
          new Bold(),
          new Code(),
          new Italic(),
          new Link(),
          new Strike(),
          new Underline(),
          new History(),
        ]
      })
    }
  },
  components: {
    ValidationProvider,
    ValidationObserver,
    EditorMenuBar,
    EditorContent
  },
  methods: {
    fetchActiveCategories() {
      this.$store.commit("loading", true);
      this.$http
        .get("category/active")
        .then(response => {
          return response.json();
        })
        .then(data => {
          this.$store.commit("loading", false);
          this.categories = data;
          this.categories_count = data.length;
        });
    },
    async submit() {
      const valid = await this.$refs.observer.validate();
      if (valid) {
        this.$store.commit("loading", true);
        this.$http
          .post("article/add", this.article)
          .then(response => {
            return response.json();
          })
          .then(data => {
            this.$store.commit("loading", false);
            const result = data["result"];
            if (result.errFlag == 0) {
              if (result.paid_status == 0) {
                this.$router.replace({
                  name: "make-payment",
                  params: { article_id: result.article_id }
                });
                location.reload();
              } else {
                this.$router.replace({ name: "view-articles" });
                location.reload();
              }
            }
          });
      } else {
        return false;
      }
    }
  },
  created() {
    this.fetchActiveCategories();
  },
  mounted() {}
};
</script>
