document.addEventListener("DOMContentLoaded", () => {

    const sendBtn = document.getElementById("sendBtn");
    const userInput = document.getElementById("userInput");
    const chatMessages = document.getElementById("chatMessages");

    const modelBtn = document.getElementById("modelBtn");
    const modelModal = document.getElementById("modelModal");
    const closeModal = document.getElementById("closeModal");
    const themeToggle = document.getElementById("themeToggle");

    let selectedModel = "meta-llama/llama-3-8b-instruct";

    /* ---------------- SEND MESSAGE ---------------- */

    sendBtn.addEventListener("click", sendMessage);

    userInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;

        addMessage(text, "user");
        userInput.value = "";

        const typing = showTyping();

        fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                message: text,
                model: selectedModel
            })
        })
        .then(res => res.json())
        .then(data => {
            typing.remove();
            addMessage(data.reply, "bot");
        });
    }

    function addMessage(text, type) {
        const div = document.createElement("div");
        div.className = `message ${type}`;
        div.innerHTML = `<pre>${text}</pre>`;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTyping() {
        const div = document.createElement("div");
        div.className = "message bot typing";
        div.innerHTML = "<span></span><span></span><span></span>";
        chatMessages.appendChild(div);
        return div;
    }

    /* ---------------- MODEL MODAL ---------------- */

    modelBtn.addEventListener("click", () => {
        modelModal.style.display = "block";
    });

    closeModal.addEventListener("click", () => {
        modelModal.style.display = "none";
    });

    modelModal.addEventListener("click", (e) => {
        if (e.target === modelModal) {
            modelModal.style.display = "none";
        }
    });

    /* -------- MODEL SELECTION -------- */

    document.querySelectorAll(".model-item").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".model-item")
                .forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            if (btn.textContent.includes("8b")) {
                selectedModel = "meta-llama/llama-3-8b-instruct";
            }
            if (btn.textContent.includes("70b")) {
                selectedModel = "meta-llama/llama-3-70b-instruct";
            }
            if (btn.textContent.includes("120b")) {
                selectedModel = "openai/gpt-oss-120b";
            }
            if (btn.textContent.includes("20b")) {
                selectedModel = "openai/gpt-oss-20b";
            }

            modelModal.style.display = "none";
        });
    });

    /* ---------------- THEME TOGGLE ---------------- */

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        document.body.classList.toggle("light");
    });

});
