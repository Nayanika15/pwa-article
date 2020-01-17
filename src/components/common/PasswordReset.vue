<template>
	<section class="site-section">
		<div class="container">
			<div class="row mb-4">
				<div class="col-md-6">
					<h1>Password Reset</h1>
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
								<ValidationProvider
									name="mobile"
									rules="required|numeric"
									v-slot="{ errors }"
									:bails="false"
								>
									<label for="mobile">Mobile</label>
									<div class="input-group">
										<input
											type="text"
											id="mobile"
											class="form-control"
											v-model="user.mobile"
										/>
										<button
											class="btn btn-warning btn-sm input-group-btn"
											@click="sendCode"
											type="button"
										>
											Send code
										</button>
									</div>
								</ValidationProvider>
								<span class="alert-info" v-html="status"></span>
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
									name="Password"
									rules="required"
									v-slot="{ errors }"
								>
									<label for="Password">Password</label>
									<input
										minlength="3"
										class="form-control"
										name="password"
										v-model="user.password"
										type="password"
										value=""
									/>
								</ValidationProvider>
							</div>
							<div class="col-md-12 form-group">
								<ValidationProvider
									name="Password confirmation"
									rules="required"
									v-slot="{ errors }"
								>
									<label for="password_confirmation">Confirm Password</label>
									<input
										minlength="3"
										class="form-control"
										name="password_confirmation"
										v-model="user.password_confirmation"
										type="password"
										value=""
									/>
								</ValidationProvider>
							</div>
						</div>
						<div class="row">
							<div class="col-md-6 form-group">
								<input type="submit" value="Submit" class="btn btn-primary" />
							</div>
						</div>
						<span v-show="errors" class="errors">
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
				mobile: '',
				code: '',
				password: '',
				password_confirmation: ''
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
					.post('reset-password', this.user)
					.then(response => {
						return response.json();
					})
					.then(data => {
						this.$store.commit('loading', false);
						alert(data.msg);
						this.$router.replace({ name: data.route });
					})
					.catch(error => {
						this.$store.commit('loading', false);
						alert(error.msg);
					});
			} else {
				return false;
			}
		},
		sendCode() {
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
