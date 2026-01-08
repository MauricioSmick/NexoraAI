/* ===============================
   FLATPICKR (CALENDÁRIO)
================================ */
flatpickr(".calendar", {
  enableTime: true,
  dateFormat: "d/m/Y H:i",
  minDate: "today",
  inline: true,
  locale: { firstDayOfWeek: 1 },
  onChange: function(selectedDates, dateStr) {
    document.getElementById("dataAgendamento").value = dateStr;
  }
});

/* ===============================
   FAQ
================================ */
document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.closest(".faq-item").classList.toggle("active");
  });
});

/* ===============================
   ENVIO PARA N8N + SUPABASE
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const messageBox = document.getElementById("formMessage");

  // 🚀 Atualize aqui com a URL gerada pelo ngrok
  const N8N_WEBHOOK_URL = "https://unspent-krishna-ununique.ngrok-free.dev/webhook-test/contact";

  // 🚀 Dados do Supabase - substitua pelos seus!
  const SUPABASE_URL = "https://SEU_PROJETO.supabase.co"; // ex: https://abcdxyz.supabase.co
  const SUPABASE_KEY = "SUA_CHAVE_PUBLICA_ANON";          // ex: sua anon public key
  const SUPABASE_TABLE = "leads";                          // nome da tabela no Supabase

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    const payload = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      empresa: document.getElementById("empresa").value || "",
      mensagem: document.getElementById("mensagem").value,
      data_agendamento: document.getElementById("dataAgendamento").value || "",
      origem: "site_nexora",
      pagina: window.location.href,
      data_envio: new Date().toISOString()
    };

    try {
      // 1️⃣ Envia para n8n
      const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!n8nResponse.ok) throw new Error("Erro ao enviar para n8n");

      // 2️⃣ Envia para Supabase
      const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`
        },
        body: JSON.stringify(payload)
      });
      if (!supabaseResponse.ok) throw new Error("Erro ao enviar para Supabase");

      // ✅ Sucesso
      showMessage("✅ Solicitação enviada com sucesso!", "success");
      form.reset();

    } catch (err) {
      console.error(err);
      showMessage("❌ Erro ao enviar. Tente novamente.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Solicitar Diagnóstico";
    }
  });

  function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = `form-message ${type}`;
    messageBox.style.display = "block";
  }
});

/* ===============================
   MENSAGENS
================================ */
const style = document.createElement("style");
style.textContent = `
.form-message {
  margin-top: 15px;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}
.form-message.success {
  background: rgba(46,204,113,.15);
  border: 1px solid #2ecc71;
  color: #2ecc71;
}
.form-message.error {
  background: rgba(231,76,60,.15);
  border: 1px solid #e74c3c;
  color: #e74c3c;
}
`;
document.head.appendChild(style);
