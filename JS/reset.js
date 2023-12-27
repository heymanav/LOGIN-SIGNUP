$(document).ready(function () {

    function validatePassword(password) {
        var regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
        return regex.test(password);
    }

    $("#resetPasswordForm").submit(function (event) {
        event.preventDefault();

        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("conPassword").value;
        const token = document.getElementById("token").value;
        const apiUrl = "http://localhost:3000/users";

        if (!validatePassword(newPassword)) {
            alert("Password must have a special character and a number. Please try again.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        const resetToken = sessionStorage.getItem("resetToken");
        const userId = sessionStorage.getItem("userId");

        if (token == resetToken) {
            axios
                .patch(`${apiUrl}/${userId}`, { password: newPassword })
                .then((response) => {
                    console.log("Password updated successfully: ", response.data);
                    // getUserDetails(); // Refresh user details after edit
                    window.location.href = "login.html";
                })
                .catch((error) => {
                    console.error("Error updating username: ", error);
                });
        } else {
            alert("Invalid token. Please try again.");
        }
    });
});
