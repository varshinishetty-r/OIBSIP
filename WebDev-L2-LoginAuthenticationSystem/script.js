async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    return Array.from(new Uint8Array(hashBuffer))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}


function setupPasswordToggle(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);

    if (!input || !button) return;

    button.addEventListener("click", () => {
        if (input.type === "password") {
            input.type = "text";
            button.textContent = "Hide";
        } else {
            input.type = "password";
            button.textContent = "Show";
        }
    });
}


setupPasswordToggle("loginPassword", "loginToggle");
setupPasswordToggle("registerPassword", "registerToggle");


const registerForm = document.getElementById("registerForm");

if (registerForm) {

    const passwordInput = document.getElementById("registerPassword");
    const lengthRule = document.getElementById("lengthRule");
    const numberRule = document.getElementById("numberRule");

    passwordInput.addEventListener("input", () => {

        const password = passwordInput.value;

        if (password.length >= 8) {
            lengthRule.textContent = "✓ At least 8 characters";
        } else {
            lengthRule.textContent = "○ At least 8 characters";
        }

        if (/\d/.test(password)) {
            numberRule.textContent = "✓ Contains at least 1 number";
        } else {
            numberRule.textContent = "○ Contains at least 1 number";
        }
    });


    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const username = document
            .getElementById("username")
            .value
            .trim();

        const email = document
            .getElementById("email")
            .value
            .trim()
            .toLowerCase();

        const password = passwordInput.value;

        const message = document.getElementById("registerMessage");

        if (!username || !email || !password) {
            message.textContent = "Please fill in all fields.";
            message.style.color = "#dc2626";
            return;
        }

        if (password.length < 8 || !/\d/.test(password)) {
            message.textContent =
                "Password must contain 8 characters and at least 1 number.";
            message.style.color = "#dc2626";
            return;
        }

        const users = JSON.parse(
            localStorage.getItem("secureVaultUsers")
        ) || [];

        const duplicate = users.some(user =>
            user.username.toLowerCase() === username.toLowerCase() ||
            user.email.toLowerCase() === email
        );

        if (duplicate) {
            message.textContent =
                "Username or email already exists.";
            message.style.color = "#dc2626";
            return;
        }

        const hashedPassword = await hashPassword(password);

        users.push({
            username: username,
            email: email,
            password: hashedPassword
        });

        localStorage.setItem(
            "secureVaultUsers",
            JSON.stringify(users)
        );

        message.textContent =
            "Account created successfully! Redirecting...";
        message.style.color = "#059669";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1200);
    });
}



const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const loginUser = document
            .getElementById("loginUser")
            .value
            .trim();

        const loginPassword = document
            .getElementById("loginPassword")
            .value;

        const message = document.getElementById("loginMessage");

        if (!loginUser || !loginPassword) {
            message.textContent = "Please fill in all fields.";
            message.style.color = "#dc2626";
            return;
        }

        const users = JSON.parse(
            localStorage.getItem("secureVaultUsers")
        ) || [];

        const hashedPassword = await hashPassword(loginPassword);

        const user = users.find(account =>
            (
                account.username.toLowerCase() ===
                loginUser.toLowerCase() ||
                account.email.toLowerCase() ===
                loginUser.toLowerCase()
            ) &&
            account.password === hashedPassword
        );

        if (!user) {
            message.textContent =
                "Invalid username/email or password.";
            message.style.color = "#dc2626";
            return;
        }

        sessionStorage.setItem(
            "secureVaultSession",
            JSON.stringify({
                username: user.username
            })
        );

        window.location.href = "dashboard.html";
    });
}


if (window.location.pathname.endsWith("dashboard.html")) {

    const session = JSON.parse(
        sessionStorage.getItem("secureVaultSession")
    );

    if (!session) {
        window.location.href = "index.html";
    } else {

        const displayUser =
            document.getElementById("displayUser");

        const accountUsername =
            document.getElementById("accountUsername");

        if (displayUser) {
            displayUser.textContent = session.username;
        }

        if (accountUsername) {
            accountUsername.textContent = session.username;
        }
    }
}



const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        sessionStorage.removeItem("secureVaultSession");

        window.location.href = "index.html";
    });
}
