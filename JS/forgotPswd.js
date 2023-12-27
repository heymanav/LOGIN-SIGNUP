function sendResetRequest() {
	const email = document.getElementById("email").value;

	const resetToken = generateResetToken();

	axios
		.get("http://localhost:3000/users")
		.then((response) => {
			var flag = 0;

			response.data.forEach((element) => {
				if (element.email === email) {
					var userId = element.id;
					sessionStorage.setItem("userId", userId);
					sessionStorage.setItem("resetToken", resetToken);
					flag = 1;
					alert("Password reset link sent successfully. Check your email.");
					window.location.replace("reset.html");
				}
			});

			if (flag == 0) {
				alert("Email not found please register");
				return;
			}
		})
		.catch(() => {});
}

function generateResetToken() {
	const randomString = Math.random().toString(36).substr(2, 10);
	return randomString;
}
