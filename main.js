// VARIABLES

const successURL = "https://unfccc.int/";
const storedCode = "123456";
const codeArea = document.getElementById("code");
const codeInputs = document.querySelectorAll("#code input");
const feedback = document.getElementById("feedback");
const feedbackImage = document.getElementById("feedbackImage");
const sendButton = document.getElementById("sendButton");
let userCode;

// INITIALIZE

init();

function init() {
    userCode = "";
    codeInputs[0].disabled = false;
    codeInputs[0].focus();
    for (const codeInput of codeInputs) {
        codeInput.value = "";
        codeInput.addEventListener("input", (e) => handleInput(e, codeInput));
    }
}

// HANDLE INPUT

function handleInput(e, codeInput) {
    const val = e.data || "";
    codeInput.value = val;
    const isValid = val.length == 1 && parseInt(val) >= 0 && parseInt(val) < 10;
    if (!isValid) {
        codeInput.classList.add("error");
        return;
    }
    userCode += parseInt(val);
    codeInput.classList.remove("error");
    codeInput.disabled = true;
    const nextInput = codeInput.nextSibling;
    if (nextInput) {
        nextInput.disabled = false;
        nextInput.focus();
    } else {
        codeInput.blur();
        codeArea.classList.add("shrink");
        evaluate(userCode);
    }
}

// EVALUATE INPUT

async function evaluate(code) {
    const isValid = await serverSideValidation(code);
    if (isValid) {
        handleSuccess();
    } else {
        handleError();
    }
}

// HANDLE SUCCESS

function handleSuccess() {
    feedbackImage.src = "/img/success.png";
    feedbackImage.onload = () => {
        feedbackImage.classList.add("grow");
        feedback.style.height = "180px";
        setTimeout(() => {
            window.location = successURL;
        }, 1500);
    };
}

// HANDLE ERROR

function handleError() {
    feedbackImage.src = "/img/error.png";
    feedbackImage.classList.add("grow");
    feedback.style.height = "180px";
    setTimeout(() => {
        sendButton.classList.add("grow");
    }, 300);
}

// SIMULATE SERVER-SIDE VALIDATION

async function serverSideValidation(code) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = code === storedCode;
    return response;
}

// SIMULATE SENDING ANOTHER SMS

sendButton.addEventListener("click", restoreInputs);

function restoreInputs() {
    userCode = "";
    feedbackImage.classList.remove("grow");
    sendButton.classList.remove("grow");
    for (const codeInput of codeInputs) {
        codeInput.value = "";
    }
    codeArea.classList.remove("shrink");
    codeInputs[0].disabled = false;
    codeInputs[0].focus();
    feedback.style.height = "0px";
}
