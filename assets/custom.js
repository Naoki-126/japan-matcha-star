// alert("テスト");

document.addEventListener('DOMContentLoaded', () => {
  /* ===========================
  # pop-up
  =========================== */
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

  /* ===========================
  # FAQアコーディオン
  =========================== */
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
