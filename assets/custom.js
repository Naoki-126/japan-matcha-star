// alert("テスト");

/* popup
=========================== */
document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById("jm-popup");
  if (!popup) return;

  // 一度表示したら出さない
  // if (localStorage.getItem("jmPopupShown")) return;

  // トップページ限定
  const homeOnly = popup.dataset.homeOnly === "true";
  if (homeOnly && window.location.pathname !== "/") return;

  const delay = Number(popup.dataset.delay || 3) * 1000;

  setTimeout(() => {
    popup.classList.add("is-active");
    popup.setAttribute("aria-hidden", "false");
    localStorage.setItem("jmMailPopupShown", "true");
  }, delay);

  const closeBtn = popup.querySelector(".jm-popup__close");
  const overlay = popup.querySelector(".jm-popup__overlay");

  function closePopup() {
    popup.classList.remove("is-active");
    popup.setAttribute("aria-hidden", "true");
  }

  closeBtn.addEventListener("click", closePopup);
  overlay.addEventListener("click", closePopup);
});


/* FAQ
=========================== */
document.addEventListener('DOMContentLoaded', () => {
  const initFAQ = () => {
    const faq = document.getElementById('js-faq');
    if (!faq) return; // ← FAQページ以外ではスキップ

    faq.querySelectorAll('.jm-accordion__a').forEach(content => {
      content.style.maxHeight = '0px';
      content.style.paddingTop = '0';
      content.style.paddingBottom = '0';
    });

    faq.querySelectorAll('.jm-accordion__q').forEach(trigger => {
      const content = trigger.nextElementSibling;

      trigger.addEventListener('click', function () {
        const isActive = trigger.classList.contains('active');

        if (isActive) {
          trigger.classList.remove('active');
          content.style.maxHeight = '0px';
          content.style.paddingTop = '0';
          content.style.paddingBottom = '0';
        } else {
          trigger.classList.add('active');
          content.style.paddingTop = '14px';
          content.style.paddingBottom = '14px';
          content.style.maxHeight = (content.scrollHeight + 30) + 'px';
        }
      });
    });
  };

  // --------------------------------------------------------
  // 初期化呼び出し（ページ存在チェック付き）
  // --------------------------------------------------------
  initFAQ();
});

/* jm-diagnosis
=========================== */
document.addEventListener('DOMContentLoaded', () => {
  const diagnosis = document.querySelector('.jm-diagnosis');
  if (!diagnosis) return;

  const startBtn = diagnosis.querySelector('[data-action="start"]');
  const questions = diagnosis.querySelectorAll('[data-question]');
  const results = diagnosis.querySelectorAll('[data-result]');

  const answers = {};

  /* -----------------------
    Utility
  ----------------------- */
  const show = (el) => {
    if (!el) return;
    el.classList.add('is-active');
  };

  const disableOptions = (questionEl) => {
    const buttons = questionEl.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.disabled = true;
      btn.style.cursor = 'default';
      btn.style.opacity = '0.6';
    });
  };

  const getQuestion = (id) =>
    diagnosis.querySelector(`[data-question="${id}"]`);

  const getResult = (id) =>
    diagnosis.querySelector(`[data-result="${id}"]`);

  /* -----------------------
    Start
  ----------------------- */
  startBtn.addEventListener('click', () => {
    show(getQuestion('q1'));
    startBtn.disabled = true;
  });

  /* -----------------------
    Answer handling
  ----------------------- */
  questions.forEach(question => {
    question.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn || btn.disabled) return;

      const questionId = question.dataset.question;
      const answer = btn.dataset.answer;

      answers[questionId] = answer;

      disableOptions(question);

      /* ---- Branch logic ---- */
      if (questionId === 'q1') {
        if (answer === 'mix') {
          show(getQuestion('q2'));
        } else {
          show(getQuestion('q3'));
        }
      }

      if (questionId === 'q2') {
        if (answer === 'yes') {
          show(getResult('organic_matcha'));
        } else {
          show(getQuestion('q4'));
        }
      }

      if (questionId === 'q3') {
        if (answer === 'yes') {
          show(getResult('premium_ceremonial'));
        } else {
          show(getQuestion('q4'));
        }
      }

      if (questionId === 'q4') {
        if (answer === 'clear') {
          show(getResult('premium_ceremonial'));
        } else {
          show(getResult('ceremonial'));
        }
      }
    });
  });
});
