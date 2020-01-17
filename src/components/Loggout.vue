<template>
	<div></div>
</template>
<script>
export default {
	mounted() {
		this.$store.dispatch('user_loggout');
		this.$router.replace({ name: 'home' });
		location.reload();
	}
};
</script>
