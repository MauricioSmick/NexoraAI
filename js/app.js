document.addEventListener("DOMContentLoaded", () => {

  /* ===== SCROLL FADE-UP ANIMATION ===== */
  const animatedElements = document.querySelectorAll(".fade-up");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.2 });

  animatedElements.forEach(el => observer.observe(el));

  /* ===== NAVBAR SCROLL EFFECT ===== */
  const header = document.querySelector(".header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  /* ===== CARD GLOW SEGUINDO O CURSOR ===== */
  document.querySelectorAll(".feature, .box, .case").forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--y", `${e.clientY - rect.top}px`);
    });
  });

  /* ===== COUNTER ANIMATION ===== */
  const counters = document.querySelectorAll("[data-count]");

  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = +el.dataset.count;
      let current = 0;

      const interval = setInterval(() => {
        current++;
        el.textContent = current;
        if (current >= target) clearInterval(interval);
      }, 20);

      countObserver.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(c => countObserver.observe(c));

  /* ===== PARTICLES IA ===== */
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
  }));

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(95,124,255,0.6)";
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 120) {
          ctx.strokeStyle = "rgba(95,124,255,0.15)";
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  /* ===== TEXTO DINÂMICO TYPE EFFECT ===== */
  const words = ["vendas", "atendimento", "operações", "processos", "decisões"];
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;
  const dynamicText = document.getElementById("dynamicText");

  function typeEffect() {
    const currentWord = words[wordIndex];

    if (!deleting) {
      dynamicText.textContent = currentWord.slice(0, charIndex++);
      if (charIndex > currentWord.length) {
        deleting = true;
        setTimeout(typeEffect, 1200);
        return;
      }
    } else {
      dynamicText.textContent = currentWord.slice(0, charIndex--);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
  }

  setInterval(typeEffect, 120);

  /* ===== SCROLL TEXT MORPH ===== */
  const scrollWords = ["vendas", "suporte", "processos", "decisões", "operações"];
  const scrollText = document.getElementById("scrollText");

  window.addEventListener("scroll", () => {
    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const index = Math.floor(scrollPercent * scrollWords.length);
    scrollText.textContent = scrollWords[Math.min(index, scrollWords.length - 1)];
  });

  /* ===== FAQ COLLAPSE ===== */
  document.querySelectorAll(".faq-question").forEach(btn => {
    btn.addEventListener("click", () => {
      const parent = btn.closest(".faq-item");
      parent.classList.toggle("active");
    });
  });

  /* ===== BACKGROUND DINÂMICO REMOVIDO ===== */
  // Comentado para evitar conflito com o FAQ
});


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
  const SUPABASE_URL = "https://cmouwbtggvbpqabuutmw.supabase.co"; // ex: https://abcdxyz.supabase.co
  const SUPABASE_KEY = "sb_publishable_7EF3izXS0AnZ-FCxtGbKag_hfHAjUHj";          // ex: sua anon public key
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
