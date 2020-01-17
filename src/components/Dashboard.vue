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
				name: ''
			}
		};
	},
	methods: {
		//to convert public key to required format
		urlBase64ToUint8Array(base64String) {
			var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
			var base64 = (base64String + padding)
				.replace(/-/g, '+')
				.replace(/_/g, '/');
			var rawData = window.atob(base64);
			var outputArray = new Uint8Array(rawData.length);

			for (var i = 0; i < rawData.length; ++i) {
				outputArray[i] = rawData.charCodeAt(i);
			}
			return outputArray;
		},
		//store subscription in server
		storePushSubscription(pushSubscription) {
			this.$http
				.post('push', pushSubscription, {
					// headers: {
					//   "Authorization":
					//       "Bearer " + store.state.auth.token
					// }
				})
				.then(res => {
					return res.json();
				})
				.then(res => {
					console.log(res);
				})
				.catch(err => {
					console.log(err);
				});
		}
	},
	created() {
		if (!this.$store.state.auth.token) {
			this.$router.replace({ name: 'login' });
			location.reload();
		}

		this.$http
			.post('details', this.user)
			.then(response => {
				return response.json();
			})
			.then(data => {
				let res = data.success;
				this.user.name = res.name;
			});
		// .catch(() => alert('You are not authorised for this action.'));
		//  this.$router.push({ name: "login"});

		//to subscribe user to push notification
		navigator.serviceWorker.ready
			.then(registration => {
				const subscribeOptions = {
					userVisibleOnly: true,
					applicationServerKey: this.urlBase64ToUint8Array(
						'BPHafgTDdH18kXExQSi_n-L_mIsQqw1DbqsQ5ahb6mYcTX7aQ6keXeZ485fnW384iJaER5aQ8aden-qUMUfBwzA'
					)
				};
				return registration.pushManager.subscribe(subscribeOptions);
			})
			.then(pushSubscription => {
				this.storePushSubscription(pushSubscription);
			});
	}
};
</script>
