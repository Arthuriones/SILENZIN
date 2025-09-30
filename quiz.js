<script>
  // Garante que o DOM está pronto mesmo que você coloque no <head> com defer
  (function quizFlow(){
    const root = document.getElementById('quiz-offer');
    if (!root) { console.warn('[QUIZ] #quiz-offer não encontrado'); return; }

    const steps = Array.from(root.querySelectorAll('.qo-step'));
    if (!steps.length) { console.warn('[QUIZ] nenhuma .qo-step encontrada'); return; }

    const prep = root.querySelector('[data-step="prep"]');
    const offer = root.querySelector('.qo-offer');

    // Fallback: se nada estiver ativo por algum motivo, ativa o 1º passo
    if (!root.querySelector('.qo-step.is-active')) {
      steps[0].classList.add('is-active');
    }

    function show(stepEl){
      steps.forEach(s => s.classList.remove('is-active'));
      if (stepEl) stepEl.classList.add('is-active');
    }

    // Delegação de clique para todos botões que tenham data-next
    root.addEventListener('click', (ev) => {
      const btn = ev.target.closest('[data-next]');
      if (!btn) return;

      const current = ev.target.closest('.qo-step');
      if (!current) return;

      const idx = steps.indexOf(current);
      const next = steps[idx + 1];

      // Se o próximo é a tela de preparo ou não existe, vai para "prep"
      if (!next || next === prep) {
        show(prep);
        runPreparing();
      } else {
        show(next);
      }
    });

    function runPreparing() {
      if (!prep) return;
      const fill = prep.querySelector('.qo__bar-fill');
      const timeEl = prep.querySelector('.qo__time');
      const duration = 5; // segundos
      let t = duration;
      timeEl.textContent = `00:0${t}`;
      fill.style.width = '0%';

      const timer = setInterval(() => {
        t--;
        timeEl.textContent = `00:0${Math.max(t,0)}`;
        const pct = ((duration - t) / duration) * 100;
        fill.style.width = Math.min(pct, 100) + '%';

        if (t <= 0) {
          clearInterval(timer);
          // esconde passos e mostra oferta
          show(null);
          if (offer) offer.hidden = false;
          root.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 1000);
    }
  })();
</script>
