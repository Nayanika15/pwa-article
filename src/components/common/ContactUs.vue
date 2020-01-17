<template>
	<section class="site-section">
		<div class="container">
			<div class="row mb-4">
				<div class="col-md-6">
					<h1>Contact Me</h1>
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
								<label for="name">Name</label>
								<ValidationProvider
									name="name"
									rules="required"
									v-slot="{ errors }"
								>
									<input
										type="text"
										id="name"
										class="form-control"
										v-model="user.name"
									/>
								</ValidationProvider>
							</div>
							<div class="col-md-12 form-group">
								<label for="mobile">Mobile</label>
								<ValidationProvider
									name="mobile"
									rules="required|numeric"
									v-slot="{ errors }"
									:bails="false"
								>
									<div class="input-group">
										<input
											type="text"
											id="mobile"
											maxlength="10"
											class="form-control"
											v-model="user.mobile"
										/>
										<button
											class="btn btn-warning btn-sm input-group-btn"
											@click="verify"
											type="button"
										>
											Send code
										</button>
									</div> </ValidationProvider
								><span class="alert-info" v-html="status"></span>
							</div>
							<div class="col-md-12 form-group">
								<ValidationProvider
									name="code"
									rules="required|min:3"
									v-slot="{ errors }"
									:bails="false"
								>
									<label for="Verification code">Verification Code</label>
									<input
										class="form-control"
										name="code"
										type="text"
										v-model="user.code"
									/>
								</ValidationProvider>
							</div>
							<div class="col-md-12 form-group">
								<ValidationProvider
									name="email"
									rules="required|email"
									v-slot="{ errors }"
									:bails="false"
								>
									<label for="email">Email</label>
									<input
										type="email"
										id="email"
										class="form-control"
										v-model="user.email"
									/>
								</ValidationProvider>
							</div>
						</div>
						<div class="row">
							<ValidationProvider
								name="message"
								rules="required"
								v-slot="{ errors }"
							>
								<div class="col-md-12 form-group">
									<label for="message">Write Message</label>
									<textarea
										name="message"
										id="message"
										class="form-control "
										cols="100"
										rows="5"
										v-model="user.message"
									></textarea>
								</div>
							</ValidationProvider>
						</div>
						<div class="row">
							<div class="col-md-6 form-group">
								<input
									type="submit"
									value="Send Message"
									class="btn btn-primary"
								/>
							</div>
						</div>
						<span v-show="errors">
							<ul v-for="(error, id) in errors" :key="id">
								<li v-for="(err, i) in error" :key="i">{{ err }}</li>
							</ul>
						</span>
					</ValidationObserver>
				</div>

				<!-- END main-content -->
				<appSideBar></appSideBar>
				<!-- END sidebar -->
			</div>
		</div>
	</section>
</template>
<script>
import SideBar from '../common/SideBar';
import { ValidationProvider, ValidationObserver } from 'vee-validate';

export default {
	data() {
		return {
			user: {
				name: '',
				email: '',
				mobile: '',
				message: '',
				code: ''
			},
			status: '',
			submitted: false
		};
	},
	components: {
		appSideBar: SideBar,
		ValidationProvider,
		ValidationObserver
	},
	methods: {
		async submit() {
			const valid = await this.$refs.observer.validate();
			if (valid) {
				this.$store.commit('loading', true);
				this.$http
					.post('feedback', this.user)
					.then(
						response => {
							return response.json();
						},
						error => alert(error)
					)
					.then(data => {
						this.$store.commit('loading', false);
						alert(data.message);
						this.$router.push({ name: 'Home' });
					});
			} else {
				return false;
			}
		},
		verify() {
			if (this.user.mobile) {
				this.$http
					.get('verify-mobile/' + this.user.mobile)
					.then(response => {
						return response.json();
					})
					.then(data => {
						this.status = data.message;
					});
			} else {
				alert('please enter a valid mobile no');
			}
		}
	}
};
</script>
