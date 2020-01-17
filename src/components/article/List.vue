<template>
  <div>
    <section class="site-section">
      <div class="container">
        <div class="row mb-4">
          <div class="col-md-6">
            <h1 class="mb-4">
              Add Article
              <small>
                <router-link :to="{ name: 'add-article' }" :class="'btn btn-primary btn-xs rounded'">Add</router-link>
              </small>
            </h1>
          </div>
        </div>
        <div class="row blog-entries">
          <div class="col-md-12 col-lg-12 main-content">
            <v-data-table :headers="headers" :items="articles" :search="search" :loading="loading"
              loading-text="Loading... Please wait">
              <template v-slot:item.paid_status="{ item }">
                <span class="text-success" v-if="item.paid_status == 1">
                  Paid
                </span>
                <span class="text-danger" v-else> Unpaid </span>
              </template>
              <template v-slot:item.approve_status="{ item }">
                <span class="text-warning" v-if="item.approve_status == 0">
                  Unapproved
                </span>
                <span class="text-success" v-else-if="item.approve_status == 1">
                  Approved
                </span>
                <span class="text-danger" v-else> Unpublished </span>
              </template>
              <template v-slot:item.action="{ item }">
                <router-link class="btn btn-primary" :to="{ name: 'edit-article', params: { id: item.id } }">
                  <i class="fa fa-edit"></i>
                </router-link>
                <button class="btn btn-danger" @click="deleteArticle(item)">
                  <i class="fa fa-trash"></i>
                </button>
                <button class="btn btn-warning" @click="makeFeatured(item)" v-if="is_admin">
                  <i v-if="item.is_featured" class="fa fa-star"></i>
                  <i v-else class="fa fa-star-o"></i>
                </button>
              </template>
            </v-data-table>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        search: "",
        is_admin: this.$store.state.auth.is_admin,
        headers: [{
            text: "Id",
            value: "id"
          },
          {
            text: "Title",
            value: "title"
          },
          {
            text: "Payment Status",
            value: "paid_status"
          },
          {
            text: "Approve Status",
            value: "approve_status"
          },
          {
            text: "Created By",
            value: "added_by"
          },
          {
            text: "Created On",
            value: "date"
          },
          {
            text: "Action",
            value: "action"
          }
        ],
        articles: [],
        loading: true
      };
    },
    created() {
      this.$store.commit("loading", true);
      this.$http
        .get("article/list")
        .then(response => {
          return response.json();
        })
        .then(data => {
          this.$store.commit("loading", false);
          this.loading = false;
          this.articles = data;
        });
    },
    methods: {
      makeFeatured(item) {
        this.$http
          .get("article/feature/" + item.id)
          .then(response => {
            return response.json();
          })
          .then(data => {
            let message = "";
            let error = data.errFlag;
            if (error == 2) {
              message = "Article was not found";
            } else if (error == 1) {
              message = "There is some error please try again later.";
            } else {
              message = "Successful.";
            }

            alert(message);
            location.reload();
          });
      },
      deleteArticle(item) {
        if (confirm("Are you sure you want to delete this article?")) {
          this.$http
            .get("article/delete/" + item.id)
            .then(response => {
              return response.json();
            })
            .then(data => {
              let message = "";
              let error = data.errFlag;
              if (error == 3) {
                message = "Article was not found";
              } else if (error == 2) {
                message = "You are not authorised for this action.";
              } else if (error == 1) {
                message = "There is some error please try again later.";
              } else {
                message = "Article deleted successfully.";
              }

              alert(message);
              location.reload();
            });
        }
      }
    }
  };

</script>
