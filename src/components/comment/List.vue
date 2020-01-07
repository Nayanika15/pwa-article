<template>
  <div>
    <section class="site-section">
      <div class="container">
        <div class="row mb-4"></div>
        <div class="row blog-entries">
          <div class="col-md-12 col-lg-12 main-content">
            <v-data-table
              :headers="headers"
              :items="comments"
              :items-per-page="5"
              :search="search"
              loading
              loading-text="Loading... Please wait"
            >
              <template v-slot:item.approve_status="{ item }">
                <span class="text-warning" v-if="item.approve_status == 0">
                  Unapproved
                </span>
                <span class="text-success" v-else-if="item.approve_status == 1">
                  Approved
                </span>
              </template>
              <template v-slot:item.action="{ item }">
                <button
                  v-if="item.approve_status == 0"
                  class="btn btn-primary"
                  @click="approveComment(item)"
                >
                  Approve
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
      confirmDialog: false,
      search: "",
      headers: [
        { text: "Id", value: "id" },
        { text: "Comment", value: "comment" },
        { text: "Added on", value: "date" },
        { text: "Added by", value: "added_by" },
        { text: "Status", value: "approve_status" },
        { text: "Action", value: "action" }
      ],
      comments: []
    };
  },
  methods: {
    approveComment(item) {
      if (confirm("Are you sure you want to approve this comment?")) {
        this.$http
          .get("comment/approve/" + item.id)
          .then(response => {
            return response.json();
          })
          .then(data => {
            let message = data.msg;
            alert(message);
            this.$router.replace({ name: "view-comments" });
            location.reload();
          });
      }
    }
  },
  created() {
    this.$http
      .get("comment/list")
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.comments = data;
      });
  }
};
</script>
