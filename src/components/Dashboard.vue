<template>
  <section class="site-section">
    <div class="container">
      <div class="row mb-4">
        <div class="col-md-6">
          <h1 class="mb-4">Dashboard</h1>
        </div>
      </div>
      <div class="row blog-entries">
        <div class="col-md-12 col-lg-8 main-content">
          <p>Hi {{ user.name }}. This is your dashboard.</p>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      user: {
        name: ""
      }
    };
  },
  created() {
    this.$http
      .post("details", this.user)
      .then(response => {
        return response.json();
      })
      .then(data => {
        let res = data.success;
        this.user.name = res.name;
      });
    // .catch(() => alert('You are not authorised for this action.'));
    //  this.$router.push({ name: "login"});
  }
};
</script>
