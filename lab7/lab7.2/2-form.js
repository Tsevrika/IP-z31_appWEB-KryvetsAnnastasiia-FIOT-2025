let formData = {
    email: "",
    message: ""
};

const FORM_KEY = "feedback-form-state";

const form = document.querySelector(".feedback-form");
const emailInput = form.elements.email;
const messageInput = form.elements.message;

const savedData = localStorage.getItem(FORM_KEY);

if (savedData) {
    const parsed = JSON.parse(savedData);

    formData.email = parsed.email || "";
    formData.message = parsed.message || "";

    emailInput.value = formData.email;
    messageInput.value = formData.message;
}

form.addEventListener("input", event => {
    const { name, value } = event.target;

    formData[name] = value.trim();

    localStorage.setItem(FORM_KEY, JSON.stringify(formData));
});

form.addEventListener("submit", event => {
    event.preventDefault();

    if (formData.email === "" || formData.message === "") {
        alert("Fill please all fields");
        return;
    }

    console.log("Відправлені дані:", formData);

    form.reset();
    localStorage.removeItem(FORM_KEY);

    formData = { email: "", message: "" };
});
