// alert("テスト");

/* popup
=========================== */
document.addEventListener("DOMContentLoaded", function() {
  const popup = document.getElementById("jm-popup");
  if(!popup) return;

  const form = document.getElementById("jm-popupForm");
  const success = document.getElementById("jm-popupSuccess");
  const discountCode = document.getElementById("jm-discountCode");
  const closeBtns = popup.querySelectorAll(".jm-popup__close, #jm-popupAfterSuccess");
  const overlay = popup.querySelector(".jm-popup__overlay");

  // ポップアップ表示遅延
  const delay = parseInt(popup.dataset.delay || 2, 10) * 1000;
  setTimeout(() => {
    popup.setAttribute("aria-hidden", "false");
    popup.style.display = "block";
  }, delay);

  // 閉じるボタンとオーバーレイクリックで閉じる
  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      popup.setAttribute("aria-hidden", "true");
      popup.style.display = "none";
    });
  });
  overlay.addEventListener("click", () => {
    popup.setAttribute("aria-hidden", "true");
    popup.style.display = "none";
  });

  // フォーム送信
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    const emailInput = form.querySelector('input[name="email"]');
    const email = emailInput.value.trim();
    if(!email) return alert("メールアドレスを入力してください");

    // Shopify 連携 or AJAX送信（例として /contact にPOST）
    fetch('/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact: { email: email } })
    })
    .then(res => {
      if(res.ok){
        form.style.display = "none";
        success.style.display = "block";

        // 割引コード表示（動的生成する場合はAPI呼び出しに置換）
        discountCode.textContent = "DISCOUNT10";

        // 必要ならここでクッキーやlocalStorageに登録済フラグを保存して再表示防止
        localStorage.setItem("jmPopupRegistered", "true");
      } else {
        alert("登録に失敗しました。もう一度お試しください。");
      }
    })
    .catch(() => alert("ネットワークエラーです。"));
  });

  // 既に登録済みなら再表示させない
  if(localStorage.getItem("jmPopupRegistered") === "true") {
    popup.style.display = "none";
  }
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


/* ===========================
# jm-diagnosis
=========================== */
document.addEventListener('DOMContentLoaded', () => {
  const diagnosis = document.querySelector('.jm-diagnosis');
  if (!diagnosis) return;

  const startBtn = diagnosis.querySelector('[data-action="start"]');
  const questions = diagnosis.querySelectorAll('[data-question]');
  const results = diagnosis.querySelectorAll('[data-result]');
  const resetBtn = diagnosis.querySelector('[data-action="reset"]');

  const answers = {};

  /* utility
  =========================== */
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

  const resetDiagnosis = () => {
    // answersを空にする
    for (const key in answers) {
      delete answers[key];
    }

    // 質問リセット
    questions.forEach(question => {
      question.classList.remove('is-active');

      const buttons = question.querySelectorAll('button');
      buttons.forEach(btn => {
        btn.disabled = false;
        btn.style.cursor = '';
        btn.style.opacity = '';
      });
    });

    // 結果リセット
    results.forEach(result => {
      result.classList.remove('is-active');
    });

    // Startボタン復活
    startBtn.disabled = false;

    // 上へ戻す（任意）
    diagnosis.scrollIntoView({ behavior: 'smooth' });
  };

  /* start
  =========================== */
  startBtn.addEventListener('click', () => {
    show(getQuestion('q1'));
    startBtn.disabled = true;
  });

  /* answer handling
  =========================== */
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

  /* reset
  =========================== */
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetDiagnosis();
    });
  }

});
