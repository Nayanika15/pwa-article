<template>
	<div>
		<section class="site-section">
			<div class="container">
				<div class="row mb-4">
					<div class="col-md-6">
						<h1 class="mb-4">
							All Categories
							<small>
								<router-link
									:to="{ name: 'add-category' }"
									:class="'btn btn-primary btn-xs rounded'"
									>Add</router-link
								>
							</small>
						</h1>
					</div>
				</div>
				<div class="row blog-entries">
					<div class="col-md-12 col-lg-12 main-content">
						<v-data-table
							:headers="headers"
							:items="categories"
							:search="search"
							:loading="loading"
							loading-text="Loading... Please wait"
						>
							<template v-slot:item.action="{ item }">
								<router-link
									class="btn btn-primary"
									:to="{ name: 'edit-category', params: { id: item.id } }"
								>
									<i class="fa fa-edit"></i>
								</router-link>
								<button class="btn btn-danger" @click="deleteCategory(item)">
									<i class="fa fa-trash"></i>
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
			search: '',
			headers: [
				{
					text: 'Id',
					value: 'id'
				},
				{
					text: 'Name',
					value: 'name'
				},
				{
					text: 'Action',
					value: 'action'
				}
			],
			categories: [],
			loading: true
		};
	},
	methods: {
		deleteCategory(item) {
			if (confirm('Are you sure you want to delete this Category?')) {
				this.$store.commit('loading', true);
				this.$http
					.get('category/delete/' + item.id)
					.then(response => {
						return response.json();
					})
					.then(data => {
						this.$store.commit('loading', false);
						let message = data.message;
						alert(message);
						location.reload();
					});
			}
		}
	},
	created() {
		this.$store.commit('loading', true);
		this.$http
			.get('category/list')
			.then(response => {
				return response.json();
			})
			.then(data => {
				this.$store.commit('loading', false);
				this.loading = false;
				this.categories = data['data'];
			});
	}
};
</script>
