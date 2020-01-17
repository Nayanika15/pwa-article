<template>
	<div>
		<section class="site-section">
			<div class="container">
				<div class="row blog-entries">
					<div class="col-md-12 col-lg-8 main-content">
						<h1>Payment</h1>
						<p>
							To submit your article for approval you need to pay
							<i class="fa fa-inr"></i> 100.
						</p>
						<div class="row">
							<card
								v-if="showStripeForm"
								class="stripe-card"
								:class="{ complete }"
								stripe="pk_test_TevYWFnB8ka1HadPKgOULyqw00lLtU8PUl"
								@change="complete = $event.complete"
							/>
							<button
								class="pay-with-stripe"
								@click="pay"
								:disabled="!complete"
							>
								Pay
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>
<script>
import { Card, createToken } from 'vue-stripe-elements-plus';

export default {
	data() {
		return {
			complete: false,
			stripeToken: '',
			showStripeForm: false
		};
	},

	components: {
		Card
	},
	mounted() {
		//adding script tag for stripe payment
		let stripeScript = document.createElement('script');
		stripeScript.setAttribute('src', 'https://js.stripe.com/v3/');
		document.head.appendChild(stripeScript);
		setTimeout(() => {
			this.showStripeForm = true;
		}, 1000);
	},
	methods: {
		pay() {
			createToken().then(result => {
				this.$http
					.post('doPayment', {
						stripeToken: result.token.id,
						article_id: this.$route.params.article_id
					})
					.then(response => {
						return response.json();
					})
					.then(data => {
						alert(data.msg);
						this.$router.replace({ name: data.route });
						location.reload();
					});
			});
		}
	}
};
</script>
<style>
.stripe-card {
	width: 300px;
	border: 1px solid grey;
}
.stripe-card.complete {
	border-color: green;
}
</style>
