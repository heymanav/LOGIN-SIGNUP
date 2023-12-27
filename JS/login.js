const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
	container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
	container.classList.remove("sign-up-mode");
});

function validateInput(e) {
	debugger;
}

function generateToken() {
	return "dummyToken";
}

function IsEmail(email) {
	var regex =
		/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}

function IsValidPass(password) {
	var regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
	return regex.test(password);
}

function IsValidUsername(username) {
	var regex = /^([a-zA-Z0-9 _-]+)$/;
	return regex.test(username);
}

$(document).ready(function () {
    const notSameError = $("#notSameError");
    const mobileError = $("#mobileError");
    const emailError = $("#emailError");
    const passError = $("#passError");
    const fNameError = $("#fNameError");
    const userNameError = $("#userNameError");
    const loginError = $("#loginError");
	const registerError = $("#registerError");

    let flag = true;

    function setError($element, message) {
        $element.text(message).addClass("error");
        flag = false;
    }

    function clearError($element) {
        $element.text("").removeClass("error");
        flag = true;
    }

    $("#fullName").keyup(() => {
        const wordInFname = $("#fullName").val().split(" ");
        if (wordInFname.length <= 1) {
            setError(fNameError, "Please enter full name");
        } else {
            clearError(fNameError);
        }
    });

    $("#username").keyup(() => {
        if (!IsValidUsername($("#username").val())) {
            setError(userNameError, "Username should be alphanumeric only");
        } else {
            clearError(userNameError);
        }
    });

    $("#email").keyup(() => {
        if (!IsEmail($("#email").val())) {
            setError(emailError, "Please enter a valid email");
        } else {
            clearError(emailError);
        }
    });

    $("#phone").keyup(() => {
        if ($("#phone").val().length !== 10) {
            setError(mobileError, "Please enter a 10-digit phone number");
        } else {
            clearError(mobileError);
        }
    });

    $("#password").keyup(() => {
        if (!IsValidPass($("#password").val())) {
            setError(passError, "Password must have a special character and a number");
        } else {
            clearError(passError);
        }
    });

    $("#conPassword").keyup(() => {
        if ($("#password").val() !== $("#conPassword").val()) {
            setError(notSameError, "Passwords do not match");
        } else {
            clearError(notSameError);
        }
    });

    $("#signInForm").submit(function (event) {
        event.preventDefault();

        const loginUsername = $("#loginUsername").val();
        const loginPassword = $("#loginPassword").val();

        axios
            .get("http://localhost:3000/users")
            .then((response) => {
                const userFound = response.data.find(
                    (element) => element.username === loginUsername
                );

                if (userFound) {
                    if (userFound.password === loginPassword) {
                        sessionStorage.setItem("fullName", userFound.fname);
                        sessionStorage.setItem("isLogin", true);
                        alert("Login successful");
                        window.location.replace("Home.html");
                    } else {
                        setError(loginError, "Please enter the correct password.");
                        $("#loginPassword").val("");
                    }
                } else {
                    setError(loginError, "Username not found. Please register to login.");
                }
            })
            .catch((error) => {
                console.error("Login failed:", error);
            });
    });

	$("#signUpForm").submit(function (event) {
        event.preventDefault();

        const fname = $("#fullName").val();
        const username = $("#username").val();
        const password = $("#password").val();
        const mobile = $("#phone").val();
        const email = $("#email").val();

        // Check if username or email already exists
        axios.get("http://localhost:3000/users").then((response) => {
            let usernameExists = false;
            let emailExists = false;

            response.data.forEach((element) => {
                if (element.username === username) {
                    usernameExists = true;
                }

                if (element.email === email) {
                    emailExists = true;
                }
            });

            if (usernameExists) {
                setError(registerError, "Username already exists.");
                return;
            } else {
                clearError(registerError);
            }

            if (emailExists) {
                setError(registerError, "Email already exists.");
                return;
            } else {
                clearError(registerError);
            }

            // Continue with the registration logic if username and email are unique
            const token = generateToken();

            if (flag) {
                axios
                    .post("http://localhost:3000/users", {
                        fname,
                        username,
                        password,
                        mobile,
                        email,
                    })
                    .then((response) => {
                        console.log("Registration successful:", response.data);
                        alert("Registration successful. Please log in.");
                        window.location.replace("login.html");
                    })
                    .catch((error) => {
                        console.log("Registration failed:", error);
                        setError(loginError, "Registration failed. Please try again.");
                    });
            }
        }).catch((error) => {
            console.error("Registration check failed:", error);
        });
    });
});
