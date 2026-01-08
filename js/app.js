/* ===== SCROLL FADE-UP ANIMATION ===== */
document.addEventListener("DOMContentLoaded", () => {
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
  if (canvas) {
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
  }

  /* ===== TEXTO DINÂMICO TYPE EFFECT ===== */
  const words = ["vendas", "atendimento", "operações", "processos", "decisões"];
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;
  const dynamicText = document.getElementById("dynamicText");

  function typeEffect() {
    if (!dynamicText) return;
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

  /* ===== BACKGROUND DINÂMICO ===== 
  window.addEventListener("scroll", () => {
    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    document.body.style.background = `radial-gradient(circle at center, rgba(95,124,255,${0.1 + scrollPercent * 0.4}), transparent 70%)`;
  });*/

  /* ===== SCROLL TEXT MORPH ===== */
  const scrollWords = ["vendas", "suporte", "processos", "decisões", "operações"];
  const scrollText = document.getElementById("scrollText");
  window.addEventListener("scroll", () => {
    if (!scrollText) return;
    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const index = Math.floor(scrollPercent * scrollWords.length);
    scrollText.textContent = scrollWords[Math.min(index, scrollWords.length - 1)];
  });

  /* ===== FAQ BUTTON FUNCTIONALITY ===== */
  document.querySelectorAll(".faq-question").forEach(btn => {
    btn.addEventListener("click", () => {
      const parent = btn.closest(".faq-item");
      parent.classList.toggle("active");
    });
  });
});

/* ===== CORREÇÃO DO FLATPICKR - AM/PM E SOMBRA COMPLETA ===== */

function fixFlatpickrStyles() {
  // Aguarda um pouco para garantir que o calendário esteja renderizado
  setTimeout(() => {
    // 1. Corrige AM/PM
    const amPmElements = document.querySelectorAll('.flatpickr-am-pm');
    amPmElements.forEach(el => {
      // Remove classes padrão que deixam branco
      el.classList.remove('flatpickr-am-pm');
      el.classList.add('custom-am-pm');
      
      // Força estilo azul
      el.style.color = '#1e40af';
      el.style.fontWeight = '600';
      el.style.background = 'transparent';
      
      // Adiciona evento para manter azul quando clicado
      el.addEventListener('click', function() {
        this.style.background = 'rgba(30, 64, 175, 0.4)';
        this.style.color = '#3b82f6';
      });
    });
    
    // 2. Corrige hora/minuto para preencher área toda
    const timeInputs = document.querySelectorAll('.flatpickr-hour, .flatpickr-minute');
    timeInputs.forEach(input => {
      // Garante altura e padding para área clicável
      input.style.height = '40px';
      input.style.minWidth = '60px';
      input.style.display = 'flex';
      input.style.alignItems = 'center';
      input.style.justifyContent = 'center';
      input.style.padding = '0 10px';
      
      // Remove estilos padrão que limitam a área
      input.style.border = 'none';
      input.style.outline = 'none';
    });
    
    // 3. Monitora mudanças no calendário
    const calendar = document.querySelector('.calendar');
    if (calendar && calendar._flatpickr) {
      const instance = calendar._flatpickr;
      
      // Override da função que atualiza horas
      const originalSetHours = instance.setHours;
      instance.setHours = function(...args) {
        originalSetHours.apply(this, args);
        
        // Reaplica estilos após mudança
        setTimeout(fixFlatpickrStyles, 50);
      };
      
      // Override da função que atualiza AM/PM
      const originalToggleAmPm = instance.toggleAmPm;
      if (originalToggleAmPm) {
        instance.toggleAmPm = function(...args) {
          originalToggleAmPm.apply(this, args);
          
          // Reaplica estilos após mudança
          setTimeout(fixFlatpickrStyles, 50);
        };
      }
    }
  }, 100);
}

// Executa quando o DOM carrega
document.addEventListener('DOMContentLoaded', function() {
  fixFlatpickrStyles();
  
  // Executa sempre que o calendário abre
  document.querySelectorAll('.calendar').forEach(input => {
    input.addEventListener('click', function() {
      setTimeout(fixFlatpickrStyles, 200);
    });
    
    input.addEventListener('focus', function() {
      setTimeout(fixFlatpickrStyles, 200);
    });
  });
  
  // Monitora mudanças no DOM (para calendário dinâmico)
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        if (document.querySelector('.flatpickr-calendar')) {
          fixFlatpickrStyles();
        }
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
});

// Também executa quando a janela ganha foco (para casos de abas)
window.addEventListener('focus', fixFlatpickrStyles);

/* ===== CORREÇÃO: ÁREA AZUL EM TODOS OS CONTROLES DE HORA ===== */
function fixTimeControlsArea() {
  setTimeout(() => {
    // 1. Adiciona classe focused quando clica
    const hourInputs = document.querySelectorAll('.numInputWrapper');
    hourInputs.forEach(wrapper => {
      const input = wrapper.querySelector('input');
      if (input) {
        // Remove eventos antigos
        input.removeEventListener('focus', handleTimeFocus);
        input.removeEventListener('blur', handleTimeBlur);
        
        // Adiciona novos eventos
        input.addEventListener('focus', handleTimeFocus);
        input.addEventListener('blur', handleTimeBlur);
        
        // Também para clique no wrapper inteiro
        wrapper.addEventListener('click', function(e) {
          if (input) input.focus();
        });
      }
    });
    
    // 2. Para AM/PM
    const amPmElements = document.querySelectorAll('.flatpickr-am-pm');
    amPmElements.forEach(el => {
      el.removeEventListener('click', handleAmPmClick);
      el.addEventListener('click', handleAmPmClick);
      
      // Garante que ocupa área toda
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.width = '80px';
      el.style.height = '46px';
    });
    
  }, 100);
}

function handleTimeFocus(e) {
  const wrapper = e.target.closest('.numInputWrapper');
  if (wrapper) {
    wrapper.classList.add('focused');
  }
}

function handleTimeBlur(e) {
  const wrapper = e.target.closest('.numInputWrapper');
  if (wrapper) {
    wrapper.classList.remove('focused');
  }
}

function handleAmPmClick(e) {
  const amPm = e.target;
  // Remove seleção de outros
  document.querySelectorAll('.flatpickr-am-pm').forEach(el => {
    el.classList.remove('selected');
  });
  // Adiciona seleção neste
  amPm.classList.add('selected');
}

// Executa quando calendário abre
document.addEventListener('DOMContentLoaded', function() {
  // Monitora abertura do calendário
  document.querySelectorAll('.calendar').forEach(input => {
    input.addEventListener('click', function() {
      setTimeout(fixTimeControlsArea, 300);
    });
  });
  
  // Observa mudanças no DOM
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        const hasTimeSection = Array.from(mutation.addedNodes).some(node => {
          return node.querySelector && 
                 (node.querySelector('.flatpickr-time') || 
                  node.classList?.contains('flatpickr-time'));
        });
        
        if (hasTimeSection) {
          setTimeout(fixTimeControlsArea, 150);
        }
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
});

// CSS adicional via JavaScript para garantir
function injectTimeAreaStyles() {
  const styleId = 'time-area-fix';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* GARANTE ÁREA CLICÁVEL COMPLETA */
      .numInputWrapper,
      .flatpickr-am-pm {
        min-width: 80px !important;
        min-height: 46px !important;
        position: relative !important;
      }
      
      /* Área de hover completa */
      .numInputWrapper:hover::before,
      .flatpickr-am-pm:hover::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        background: rgba(30, 64, 175, 0.3) !important;
        border-radius: 8px !important;
        z-index: 1 !important;
      }
      
      /* Área de seleção completa */
      .numInputWrapper.focused::before,
      .flatpickr-am-pm.selected::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        background: rgba(30, 64, 175, 0.4) !important;
        border-radius: 8px !important;
        border: 1px solid #3b82f6 !important;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3) !important;
        z-index: 1 !important;
      }
      
      /* Mantém texto acima do pseudo-elemento */
      .numInputWrapper input,
      .flatpickr-am-pm {
        position: relative !important;
        z-index: 2 !important;
      }
    `;
    document.head.appendChild(style);
  }
}

// Injeta os estilos
injectTimeAreaStyles();

/* ===== ENVIO DO FORMULÁRIO PARA N8N ===== */
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Botão de submit
      const submitBtn = document.getElementById('submitBtn');
      const originalText = submitBtn.textContent;
      
      // Coleta dados do formulário
      const formData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        empresa: document.getElementById('empresa').value || '',
        mensagem: document.getElementById('mensagem').value,
        data_agendamento: document.getElementById('dataAgendamento').value || '',
        data_envio: new Date().toISOString(),
        origem: 'site_nexora',
        pagina: window.location.pathname
      };
      
      // Pega data do calendário se existir
      const calendarInput = document.querySelector('.calendar');
      if (calendarInput && calendarInput.value) {
        formData.data_agendamento = calendarInput.value;
      }
      
      try {
        // Mostra loading
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        // URL do seu webhook do n8n - VOCÊ VAI PRECISAR CRIAR ESTE WEBHOOK
        const n8nWebhookURL = 'https://seu-n8n.com/webhook/nexora-leads';
        
        // Envia para n8n
        const response = await fetch(n8nWebhookURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          // Sucesso
          showMessage('✅ Formulário enviado com sucesso! Entraremos em contato em breve.', 'success');
          contactForm.reset();
          
          // Opcional: Redirecionar ou mostrar confirmação
          setTimeout(() => {
            showMessage('📧 Verifique seu email para confirmação.', 'info');
          }, 2000);
        } else {
          throw new Error('Erro na resposta do servidor');
        }
        
      } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        showMessage('❌ Erro ao enviar. Tente novamente ou entre em contato diretamente.', 'error');
      } finally {
        // Restaura botão
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
  
  // Função para mostrar mensagens
  function showMessage(text, type) {
    const messageDiv = document.getElementById('formMessage');
    if (messageDiv) {
      messageDiv.textContent = text;
      messageDiv.className = `form-message ${type}`;
      messageDiv.style.display = 'block';
      
      // Esconde após alguns segundos (exceto sucesso)
      if (type !== 'success') {
        setTimeout(() => {
          messageDiv.style.display = 'none';
        }, 5000);
      }
    }
    
    // Também mostra no console
    console.log(`Form Message (${type}):`, text);
  }
});

/* ===== ESTILOS PARA MENSAGENS ===== */
// Adicione isso no seu CSS
const messageStyles = `
.form-message {
  margin-top: 15px;
  padding: 12px 15px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  display: none;
}

.form-message.success {
  background: rgba(46, 204, 113, 0.15);
  border: 1px solid #2ecc71;
  color: #2ecc71;
}

.form-message.error {
  background: rgba(231, 76, 60, 0.15);
  border: 1px solid #e74c3c;
  color: #e74c3c;
}

.form-message.info {
  background: rgba(52, 152, 219, 0.15);
  border: 1px solid #3498db;
  color: #3498db;
}
`;

// Injeta os estilos
const style = document.createElement('style');
style.textContent = messageStyles;
document.head.appendChild(style);

// Função adicional para enviar ao Supabase
async function sendToSupabase(data) {
  try {
    const supabaseUrl = 'https://seu-projeto.supabase.co';
    const supabaseKey = 'sua-chave-publica';
    
    const response = await fetch(`${supabaseUrl}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify(data)
    });
    
    return response.ok;
  } catch (error) {
    console.error('Erro ao enviar para Supabase:', error);
    return false;
  }
}

// No seu JavaScript, adicione um token
const n8nWebhookURL = 'https://seu-n8n.com/webhook/nexora-leads?token=SEU_TOKEN_SECRETO';
// No n8n, configure o webhook para verificar este token


// Validação básica antes de enviar
function validateForm(data) {
  const errors = [];
  
  if (!data.nome || data.nome.length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres');
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Email inválido');
  }
  
  if (!data.mensagem || data.mensagem.length < 10) {
    errors.push('Mensagem muito curta');
  }
  
  return errors;
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}