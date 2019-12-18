<template>
  <div>
    <section class="site-section">
      <div class="container">
        <div class="row mb-4">
          <div class="col-md-6">
            <h1 class="mb-4">Payment Successfull !!!</h1>
          </div>
        </div>

        <div class="row blog-entries">
          <div class="col-md-12 col-lg-12 main-content">
            <div class="alert-box">
              <div class="alert alert-success">
                <div class="alert-icon text-center">
                  <i class="fa fa-check-square-o  fa-3x" aria-hidden="true"></i>
                </div>
                <div class="alert-message text-center">
                  <strong>Payment Success!</strong> Your article is submitted
                  for approval.
                </div>
                <div class="text-center">
                  <small>
                    <router-link :to="{ name: 'view-articles' }">
                      <i class="fa fa-arrow-left" style="font-size:20px;"></i>
                      All Articles
                    </router-link>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
