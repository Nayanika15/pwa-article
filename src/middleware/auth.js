export default function auth({
	next,
	router
}) {
	if (!localStorage.getItem("token")) {
		return router.push({
			name: "login"
		});
	} else {
		Vue.http.interceptors.push((request, next) => {
			request.headers.set("Authorization", "Bearer " + localStorage.token);
			request.headers.set("Accept", "application/json");
		});
	}
	return next();
}
