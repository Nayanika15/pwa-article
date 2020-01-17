<template>
  <div>
    <section class="site-section">
      <div class="container">
        <div class="row mb-4">
          <div class="col-md-6">
            <h1 class="mb-4">
              Add Articles
              <small>
                <router-link :to="{ name: 'view-articles' }" :class="'btn btn-primary btn-xs rounded'">View
                </router-link>
              </small>
            </h1>
          </div>
        </div>
        <div class="row blog-entries">
          <div class="col-md-12 col-lg-8 main-content">
            <ValidationObserver ref="observer" tag="form" @submit.prevent="submit" v-slot="{ errors }">
              <div class="row">
                <div class="col-md-12 form-group">
                  <label for="title">Title</label>
                  <ValidationProvider name="title" rules="required" v-slot="{ errors }">
                    <input type="text" id="title" class="form-control" v-model="article.title" />
                  </ValidationProvider>
                </div>
                <div class="col-md-12 form-group">
                  <label for="Category Name">Category Name</label>
                  <ValidationProvider name="categories" rules="required" v-slot="{ errors }">
                    <v-select v-model="article.categories" :menu-props="{ top: true, offsetY: true }"
                      :items="categories" item-text="name" item-value="id" label="Select" autocomplete multiple>
                    </v-select>
                  </ValidationProvider>
                </div>
                <div class="col-md-12 form-group">
                  <label for="details">Details</label>
                  <ValidationProvider name="details" rules="required" v-slot="{ errors }">
                    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
                      <button :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
                        <i class="fa fa-bold" aria-hidden="true"></i>
                      </button>
                    </editor-menu-bar>
                    <v-flex>
                      <editor-content class="editor__content" :editor="editor" v-model="article.details" />
                    </v-flex>
                  </ValidationProvider>
                </div>
                <div class="col-md-12 form-group">
                  <label for="image">Image</label>
                  <ValidationProvider name="image" rules="image" v-slot="{ errors }">
                    <input type="file" class="form-control" ref="article.image" />
                    <img :src="article.image" alt="Image placeholder" height="300" width="300" />
                  </ValidationProvider>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 form-group">
                  <input class="btn btn-primary" type="submit" value="Update" />
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
  import {
    ValidationProvider,
    ValidationObserver
  } from "vee-validate";
  import {
    Editor,
    EditorContent,
    EditorMenuBar
  } from 'tiptap';
  import {
    Blockquote,
    CodeBlock,
    HardBreak,
    Heading,
    OrderedList,
    BulletList,
    ListItem,
    TodoItem,
    TodoList,
    Bold,
    Code,
    Italic,
    Link,
    Strike,
    Underline,
    History
  } from 'tiptap-extensions';

  export default {
    data() {
      return {
        article: {
          title: "",
          details: "",
          categories: [],
          image: "",
          status: ""
        },
        status: "",
        submitted: false,
        categories: [],
        categories_count: 0,
        editor: new Editor({
          extensions: [
            new Blockquote(),
            new CodeBlock(),
            new HardBreak(),
            new Heading({
              levels: [1, 2, 3]
            }),
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
      };
    },
    components: {
      EditorMenuBar,
      EditorContent,
      ValidationProvider,
      ValidationObserver
    },
    methods: {
      async submit() {
        const valid = await this.$refs.observer.validate();
        if (valid) {
          this.$http
            .put("article/update/" + this.$route.params.id, this.article)
            .then(response => {
              return response.json();
            })
            .then(data => {
              const result = data["result"];
              if (result.errFlag == 0) {
                if (result.paid_status == 0) {
                  this.$router.replace({
                    name: "make-payment",
                    params: {
                      article_id: result.article_id
                    }
                  });
                  location.reload();
                } else {
                  alert(result.msg);
                  this.$router.replace({
                    name: "view-articles"
                  });
                  location.reload();
                }
              }
              // this.$router.replace({ name: result.route });
            });
        } else {
          return false;
        }
      }
    },
    created() {
      this.$store.commit("loading", true);
      this.$http
        .get("article/edit/" + this.$route.params.id)
        .then(response => {
          return response.json();
        })
        .then(data => {
          this.$store.commit("loading", false);
          let error = data.errFlag;
          if (error == 1) {
            alert("Article was not found");
            this.$router.replace({
              name: "view-articles"
            });
            location.reload();
          } else if (error == 2) {
            alert("You are not authorised for this action.");
            this.$router.replace({
              name: "view-articles"
            });
            location.reload();
          } else {
            this.article.title = data.result.title;
            this.article.details = data.result.details;
            this.article.categories = data.result.categories_tagged;
            this.article.image = data.result.detail_image;
            this.article.status = data.result.approve_status;
            this.categories = data.result.all_categories;
            this.categories_count = this.categories.length;
          }
          this.editor.setContent(this.article.details);
        });
    }
  };

</script>
