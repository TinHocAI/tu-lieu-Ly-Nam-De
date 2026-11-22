/**
 * BẢO TÀNG SỐ THU NHỎ: KHÁM PHÁ HÀO KHÍ VẠN XUÂN – HOÀNG ĐẾ LÝ NAM ĐẾ & DI TÍCH ĐỀN MỤC
 * Sản phẩm số của Đội 3 (12A3, 11A3, 10A3, 11A5) – Trường THPT Bộc Bố (2026)
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. HỆ THỐNG ÂM THANH TƯƠNG TÁC (WEB AUDIO API - TÙY CHỌN BẬT/TẮT)
     ========================================================================== */
  let audioEnabled = true;
  let audioCtx = null;

  function playTone(type) {
    if (!audioEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtx) audioCtx = new AudioContextClass();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'correct') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.09); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.18); // G5
        gain.gain.setValueAtTime(0.11, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
        osc.start(now);
        osc.stop(now + 0.38);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.linearRampToValueAtTime(175, now + 0.22);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'fanfare') {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const o = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          o.type = 'triangle';
          o.connect(g);
          g.connect(audioCtx.destination);
          const start = now + idx * 0.11;
          o.frequency.setValueAtTime(freq, start);
          g.gain.setValueAtTime(0.11, start);
          g.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
          o.start(start);
          o.stop(start + 0.35);
        });
      }
    } catch (e) {
      // Bỏ qua nếu trình duyệt chặn tự động phát âm thanh
    }
  }

  const btnAudioToggle = document.getElementById('btn-audio-toggle');
  const audioWaves = document.getElementById('audio-waves');
  if (btnAudioToggle) {
    btnAudioToggle.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      if (audioWaves) {
        audioWaves.style.opacity = audioEnabled ? '1' : '0.2';
      }
      if (audioEnabled) playTone('click');
    });
  }

  /* ==========================================================================
     2. KHO TƯ LIỆU LỊCH SỬ TOÀN TẬP (4 TABS CHUYỂN ĐỔI MƯỢT MÀ)
     ========================================================================== */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  function activateTab(targetPanelId) {
    tabButtons.forEach((btn) => {
      const isMatch = btn.getAttribute('data-tab') === targetPanelId;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    tabPanels.forEach((panel) => {
      const isMatch = panel.id === targetPanelId;
      panel.classList.toggle('active', isMatch);
      if (isMatch) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      activateTab(targetId);
      playTone('click');
    });
  });

  /* ==========================================================================
     3. ĐIỀU HƯỚNG NHANH (STICKY NAVIGATION BAR) & SCROLL SPY
     ========================================================================== */
  const navLinks = document.querySelectorAll('.quick-nav .nav-link');

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const navType = link.getAttribute('data-nav');
      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
      playTone('click');

      // Nếu người dùng bấm "Tiểu sử", mở ngay Tab 1 (Tiểu sử & Thân thế)
      if (navType === 'tieu-su') {
        activateTab('panel-tieusu');
      }
    });
  });

  // Cập nhật mục active khi cuộn trang
  const sectionsToSpy = [
    { id: 'tu-lieu', nav: 'tu-lieu' },
    { id: 'dong-thoi-gian', nav: 'dong-thoi-gian' },
    { id: 'minigame', nav: 'minigame' }
  ];

  window.addEventListener(
    'scroll',
    () => {
      const scrollPos = window.scrollY + 180;
      let currentNav = 'tieu-su';

      sectionsToSpy.forEach((sec) => {
        const el = document.getElementById(sec.id);
        if (el && scrollPos >= el.offsetTop) {
          currentNav = sec.nav;
        }
      });

      // Nếu đang ở khu vực Kho tư liệu và Tab 1 đang mở thì đánh dấu Tiểu sử hoặc Tư liệu hợp lý
      const tieuSuPanel = document.getElementById('panel-tieusu');
      if (currentNav === 'tu-lieu' && tieuSuPanel && !tieuSuPanel.hasAttribute('hidden') && window.scrollY < 750) {
        currentNav = 'tieu-su';
      }

      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('data-nav') === currentNav);
      });
    },
    { passive: true }
  );

  /* ==========================================================================
     4. DÒNG THỜI GIAN TƯƠNG TÁC (TIMELINE THẺ BẤM MỞ RỘNG)
     ========================================================================== */
  const timelineItems = document.querySelectorAll('.timeline-item');
  const btnToggleAllTimeline = document.getElementById('btn-toggle-all-timeline');

  timelineItems.forEach((item) => {
    const headerBtn = item.querySelector('.timeline-card-header');
    if (!headerBtn) return;

    headerBtn.addEventListener('click', () => {
      const isExpanded = item.classList.toggle('expanded');
      headerBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      playTone('click');
      updateTimelineToggleBtnText();
    });
  });

  function updateTimelineToggleBtnText() {
    if (!btnToggleAllTimeline) return;
    const allExpanded = Array.from(timelineItems).every((item) =>
      item.classList.contains('expanded')
    );
    btnToggleAllTimeline.textContent = allExpanded
      ? 'Thu gọn các mốc thời gian'
      : 'Mở rộng tất cả mốc thời gian';
  }

  if (btnToggleAllTimeline) {
    btnToggleAllTimeline.addEventListener('click', () => {
      const allExpanded = Array.from(timelineItems).every((item) =>
        item.classList.contains('expanded')
      );
      timelineItems.forEach((item) => {
        item.classList.toggle('expanded', !allExpanded);
        const btn = item.querySelector('.timeline-card-header');
        if (btn) btn.setAttribute('aria-expanded', !allExpanded ? 'true' : 'false');
      });
      playTone('click');
      updateTimelineToggleBtnText();
    });
  }

  /* ==========================================================================
     5. MINIGAME TRẮC NGHIỆM 5 CÂU HỎI & TÍNH ĐIỂM TRỰC TIẾP
     ========================================================================== */
  const QUIZ_QUESTIONS = [
    {
      id: 1,
      question: 'Câu 1: Lý Bí lên ngôi Hoàng đế và đặt quốc hiệu Vạn Xuân vào năm nào?',
      options: ['Năm 541', 'Năm 542', '544', 'Năm 548'],
      correctIndex: 2,
      explanation:
        'Chính xác! Mùa xuân, tháng Giêng năm Giáp Tý (544), sau khi đánh đuổi quân Lương, Lý Bí lên ngôi Hoàng đế (Lý Nam Đế) và dựng quốc hiệu là Vạn Xuân.'
    },
    {
      id: 2,
      question: 'Câu 2: Niên hiệu của Vua Lý Nam Đế là gì?',
      options: ['Thái Bình', 'Thiên Đức', 'Thuận Thiên', 'Thiên Phúc'],
      correctIndex: 1,
      explanation:
        'Chính xác! Vua Lý Nam Đế đặt niên hiệu là Thiên Đức (Đức lớn của Trời), khẳng định quyền tự chủ độc lập ngang hàng với phương Bắc.'
    },
    {
      id: 3,
      question: 'Câu 3: Ai là hai vị tướng được Lý Nam Đế phong đứng đầu ban văn và ban võ?',
      options: [
        'Tinh Thiều và Phạm Tu',
        'Triệu Túc và Triệu Quang Phục',
        'Tinh Thiều và Triệu Túc',
        'Phạm Tu và Triệu Quang Phục'
      ],
      correctIndex: 0,
      explanation:
        'Chính xác! Khi lập triều đình Vạn Xuân, Hoàng đế Lý Nam Đế trọng dụng Tinh Thiều đứng đầu ban văn và lão tướng Phạm Tu đứng đầu ban võ.'
    },
    {
      id: 4,
      question: 'Câu 4: Di tích lịch sử Quốc gia Đền Mục thờ Lý Nam Đế nằm ở đâu?',
      options: [
        'TP. Thái Nguyên, tỉnh Thái Nguyên',
        'TP. Phổ Yên, tỉnh Thái Nguyên',
        'Huyện Phú Bình, tỉnh Thái Nguyên',
        'Huyện Định Hóa, tỉnh Thái Nguyên'
      ],
      correctIndex: 1,
      explanation:
        'Chính xác! Di tích lịch sử Quốc gia Đền Mục nằm tại phường Tiên Phong, TP. Phổ Yên, tỉnh Thái Nguyên – vùng đất quê hương Hoàng đế Lý Nam Đế.'
    },
    {
      id: 5,
      question:
        'Câu 5: Chủ đề Cuộc thi tìm hiểu văn hóa dân tộc và di sản địa phương THPT Bộc Bố năm 2026 là gì?',
      options: [
        'Tuổi trẻ học đường với lịch sử văn hóa dân tộc',
        'Tự hào bản sắc – Kết nối di sản – Lan tỏa giá trị văn hóa quê hương',
        'Theo dấu chân các bậc tiền nhân dựng nước',
        'Khám phá di sản văn hóa vùng Việt Bắc'
      ],
      correctIndex: 1,
      explanation:
        'Chính xác! Chủ đề chính thức của cuộc thi năm 2026 tại Trường THPT Bộc Bố là: "Tự hào bản sắc – Kết nối di sản – Lan tỏa giá trị văn hóa quê hương".'
    }
  ];

  let currentQuestionIndex = 0;
  // Lưu đáp án người chơi đã chọn cho từng câu (null hoặc index 0..3)
  let userAnswers = new Array(QUIZ_QUESTIONS.length).fill(null);
  let hasTriggeredConfetti = false;

  const pillsContainer = document.getElementById('question-pills');
  const qNumberEl = document.getElementById('quiz-q-number');
  const qTitleEl = document.getElementById('quiz-q-title');
  const optionsListEl = document.getElementById('quiz-options-list');
  const expBoxEl = document.getElementById('quiz-explanation-box');
  const expStatusEl = document.getElementById('quiz-exp-status');
  const expTextEl = document.getElementById('quiz-exp-text');
  const progressTextEl = document.getElementById('quiz-progress-text');
  const progressBarEl = document.getElementById('quiz-progress-bar');
  const scoreTextEl = document.getElementById('quiz-score-text');
  const btnPrevQ = document.getElementById('btn-prev-q');
  const btnNextQ = document.getElementById('btn-next-q');
  const btnResetQuiz = document.getElementById('btn-reset-quiz');

  function calculateQuizStats() {
    let answeredCount = 0;
    let correctCount = 0;
    userAnswers.forEach((ans, idx) => {
      if (ans !== null) {
        answeredCount++;
        if (ans === QUIZ_QUESTIONS[idx].correctIndex) {
          correctCount++;
        }
      }
    });
    return {
      answeredCount,
      correctCount,
      total: QUIZ_QUESTIONS.length,
      points: correctCount * 20
    };
  }

  function getRankTitle(correctCount, answeredCount) {
    if (answeredCount === 0) return 'Danh hiệu: Đại Sứ Di Sản Vạn Xuân';
    if (correctCount === 5) return 'Danh hiệu: Đại Sứ Di Sản Xuất Sắc ★★★★★';
    if (correctCount === 4) return 'Danh hiệu: Sứ Giả Vạn Xuân Thông Thái ★★★★';
    if (correctCount >= 3) return 'Danh hiệu: Người Yêu Lịch Sử Dân Tộc ★★★';
    return 'Danh hiệu: Người Khám Phá Di Sản Vạn Xuân';
  }

  function renderQuestionPills() {
    if (!pillsContainer) return;
    pillsContainer.innerHTML = '';
    QUIZ_QUESTIONS.forEach((q, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'q-pill-btn';
      if (idx === currentQuestionIndex) btn.classList.add('current');

      const ans = userAnswers[idx];
      if (ans !== null) {
        const isCorrect = ans === q.correctIndex;
        btn.classList.add(isCorrect ? 'answered-correct' : 'answered-wrong');
        btn.textContent = `Câu ${idx + 1} ${isCorrect ? '✓' : '✗'}`;
      } else {
        btn.textContent = `Câu ${idx + 1}`;
      }

      btn.addEventListener('click', () => {
        currentQuestionIndex = idx;
        playTone('click');
        renderQuiz();
      });
      pillsContainer.appendChild(btn);
    });
  }

  function renderQuiz() {
    const q = QUIZ_QUESTIONS[currentQuestionIndex];
    const selectedAns = userAnswers[currentQuestionIndex];
    const letters = ['A', 'B', 'C', 'D'];

    renderQuestionPills();

    if (qNumberEl) {
      qNumberEl.textContent = `CÂU HỎI ${currentQuestionIndex + 1} / ${QUIZ_QUESTIONS.length}`;
    }
    if (qTitleEl) {
      qTitleEl.textContent = q.question;
    }

    if (optionsListEl) {
      optionsListEl.innerHTML = '';
      q.options.forEach((optText, optIdx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-option-btn';

        if (selectedAns !== null) {
          btn.disabled = true;
          if (optIdx === q.correctIndex) {
            btn.classList.add('correct');
          } else if (optIdx === selectedAns && selectedAns !== q.correctIndex) {
            btn.classList.add('wrong');
          }
        }

        const letterSpan = document.createElement('span');
        letterSpan.className = 'opt-letter';
        letterSpan.textContent = letters[optIdx];

        const textSpan = document.createElement('span');
        textSpan.textContent = optText;

        btn.appendChild(letterSpan);
        btn.appendChild(textSpan);

        btn.addEventListener('click', () => handleSelectAnswer(optIdx));
        optionsListEl.appendChild(btn);
      });
    }

    // Hiển thị giải thích nếu câu hỏi đã được trả lời
    if (expBoxEl && expStatusEl && expTextEl) {
      if (selectedAns !== null) {
        const isCorrect = selectedAns === q.correctIndex;
        expBoxEl.removeAttribute('hidden');
        expStatusEl.className = 'exp-status ' + (isCorrect ? 'is-correct' : 'is-wrong');
        expStatusEl.textContent = isCorrect
          ? '🎉 Chính xác! Bạn nhận được +20 điểm'
          : `💡 Chưa chính xác! Đáp án đúng là: ${q.options[q.correctIndex]}`;
        expTextEl.textContent = q.explanation;
      } else {
        expBoxEl.setAttribute('hidden', '');
      }
    }

    // Cập nhật điểm số & thanh tiến độ
    const stats = calculateQuizStats();
    if (progressTextEl) {
      progressTextEl.textContent = `${stats.answeredCount} / ${stats.total} câu`;
    }
    if (progressBarEl) {
      progressBarEl.style.width = `${(stats.answeredCount / stats.total) * 100}%`;
    }
    if (scoreTextEl) {
      scoreTextEl.textContent = `${stats.points} / 100`;
    }

    // Cập nhật nút Trước / Tiếp
    if (btnPrevQ) {
      btnPrevQ.disabled = currentQuestionIndex === 0;
    }
    if (btnNextQ) {
      if (currentQuestionIndex === QUIZ_QUESTIONS.length - 1) {
        btnNextQ.textContent = 'Nhận Thẻ Chứng Nhận 🏆';
      } else {
        btnNextQ.textContent = 'Câu tiếp →';
      }
    }

    updateCertificateDisplay();
  }

  function handleSelectAnswer(optIdx) {
    if (userAnswers[currentQuestionIndex] !== null) return;
    userAnswers[currentQuestionIndex] = optIdx;

    const q = QUIZ_QUESTIONS[currentQuestionIndex];
    if (optIdx === q.correctIndex) {
      playTone('correct');
    } else {
      playTone('wrong');
    }

    renderQuiz();

    // Kiểm tra nếu đã hoàn thành cả 5 câu
    const stats = calculateQuizStats();
    if (stats.answeredCount === stats.total && !hasTriggeredConfetti) {
      hasTriggeredConfetti = true;
      playTone('fanfare');
      launchConfetti();

      const statusHeading = document.getElementById('cert-status-heading');
      const statusSub = document.getElementById('cert-status-sub');
      if (statusHeading) {
        statusHeading.textContent = `🎉 Chúc mừng! Bạn đạt ${stats.correctCount}/${stats.total} câu (${stats.points}/100 điểm)`;
      }
      if (statusSub) {
        statusSub.textContent =
          'Hãy nhập tên của bạn bên dưới để lưu tấm "THẺ CHỨNG NHẬN ĐẠI SỨ DI SẢN VẠN XUÂN" về điện thoại!';
      }
    }
  }

  if (btnPrevQ) {
    btnPrevQ.addEventListener('click', () => {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        playTone('click');
        renderQuiz();
      }
    });
  }

  if (btnNextQ) {
    btnNextQ.addEventListener('click', () => {
      playTone('click');
      if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
        currentQuestionIndex++;
        renderQuiz();
      } else {
        const certZone = document.getElementById('certificate-zone');
        if (certZone) {
          certZone.scrollIntoView({ behavior: 'smooth' });
          const nameInput = document.getElementById('player-name-input');
          if (nameInput) setTimeout(() => nameInput.focus(), 450);
        }
      }
    });
  }

  if (btnResetQuiz) {
    btnResetQuiz.addEventListener('click', () => {
      userAnswers = new Array(QUIZ_QUESTIONS.length).fill(null);
      currentQuestionIndex = 0;
      hasTriggeredConfetti = false;
      playTone('click');
      renderQuiz();
    });
  }

  /* ==========================================================================
     6. THẺ CHỨNG NHẬN ĐẠI SỨ DI SẢN VẠN XUÂN & XUẤT ẢNH PNG SẮC NÉT
     ========================================================================== */
  const playerNameInput = document.getElementById('player-name-input');
  const playerClassInput = document.getElementById('player-class-input');
  const certDisplayName = document.getElementById('cert-display-name');
  const certDisplayClass = document.getElementById('cert-display-class');
  const certDisplayScore = document.getElementById('cert-display-score');
  const certDisplayRank = document.getElementById('cert-display-rank');
  const classChips = document.querySelectorAll('.class-chip');
  const btnDownloadCert = document.getElementById('btn-download-cert');
  const btnFullscreenCert = document.getElementById('btn-fullscreen-cert');
  const certCanvas = document.getElementById('certificate-canvas');

  function updateCertificateDisplay() {
    const rawName = playerNameInput ? playerNameInput.value.trim() : '';
    const rawClass = playerClassInput ? playerClassInput.value.trim() : '';
    const displayName = rawName || 'Đại Sứ Di Sản Trẻ';
    const displayClass = rawClass || 'Đội 3 – Trường THPT Bộc Bố';

    const stats = calculateQuizStats();
    const displayCorrect = stats.answeredCount > 0 ? stats.correctCount : 5;
    const displayPoints = stats.answeredCount > 0 ? stats.points : 100;
    const scoreStr = `${displayCorrect}/5 câu (${displayPoints}/100 điểm)`;
    const rankStr = getRankTitle(displayCorrect, stats.answeredCount || 5);

    if (certDisplayName) certDisplayName.textContent = displayName;
    if (certDisplayClass) certDisplayClass.textContent = displayClass;
    if (certDisplayScore) certDisplayScore.textContent = scoreStr;
    if (certDisplayRank) certDisplayRank.textContent = rankStr;

    drawHighResCertificateCanvas(displayName, displayClass, scoreStr, rankStr);
  }

  if (playerNameInput) {
    playerNameInput.addEventListener('input', updateCertificateDisplay);
  }
  if (playerClassInput) {
    playerClassInput.addEventListener('input', updateCertificateDisplay);
  }

  classChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      if (playerClassInput) {
        playerClassInput.value = chip.getAttribute('data-class') || '';
        playTone('click');
        updateCertificateDisplay();
      }
    });
  });

  // Vẽ Thẻ Chứng Nhận lên HTML5 Canvas 1080x1440 để tải ảnh PNG cực nét
  function drawHighResCertificateCanvas(name, unit, scoreStr, rankStr) {
    if (!certCanvas) return;
    const ctx = certCanvas.getContext('2d');
    const W = certCanvas.width;
    const H = certCanvas.height;

    // 1. Nền đỏ sẫm hoàng gia
    const bgGrad = ctx.createRadialGradient(W / 2, 100, 50, W / 2, H / 2, H);
    bgGrad.addColorStop(0, '#9A1111');
    bgGrad.addColorStop(0.55, '#7A0000');
    bgGrad.addColorStop(1, '#3D0000');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Viền vàng kim ngoài
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 10;
    ctx.strokeRect(24, 24, W - 48, H - 48);

    // 2. Nền giấy cổ bên trong
    const paperX = 54;
    const paperY = 54;
    const paperW = W - 108;
    const paperH = H - 108;

    const paperGrad = ctx.createRadialGradient(W / 2, H / 2, 60, W / 2, H / 2, paperW * 0.8);
    paperGrad.addColorStop(0, '#FFFDF8');
    paperGrad.addColorStop(1, '#F5E4C3');
    ctx.fillStyle = paperGrad;
    ctx.fillRect(paperX, paperY, paperW, paperH);

    // Khung viền kép bên trong giấy cổ
    ctx.strokeStyle = '#9B7816';
    ctx.lineWidth = 4;
    ctx.strokeRect(paperX + 16, paperY + 16, paperW - 32, paperH - 32);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(paperX + 26, paperY + 26, paperW - 52, paperH - 52);

    // 3. Họa tiết trống đồng mờ chính giữa
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.strokeStyle = 'rgba(122, 0, 0, 0.06)';
    [140, 210, 280, 350].forEach((r) => {
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.restore();

    // 4. Tiêu đề trường & Đội 3
    ctx.textAlign = 'center';
    ctx.fillStyle = '#7A0000';
    ctx.font = '700 22px "Be Vietnam Pro", sans-serif';
    ctx.fillText('TRƯỜNG THPT BỘC BỐ • ĐỘI 3 (12A3, 11A3, 10A3, 11A5)', W / 2, 145);

    ctx.fillStyle = '#9B7816';
    ctx.font = '600 18px "Be Vietnam Pro", sans-serif';
    ctx.fillText('BẢO TÀNG SỐ: KHÁM PHÁ HÀO KHÍ VẠN XUÂN – HOÀNG ĐẾ LÝ NAM ĐẾ', W / 2, 180);

    // Huy chương tròn Vạn Xuân
    ctx.beginPath();
    ctx.arc(W / 2, 255, 46, 0, Math.PI * 2);
    ctx.fillStyle = '#7A0000';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#D4AF37';
    ctx.stroke();

    ctx.fillStyle = '#FFE89E';
    ctx.font = '700 28px "Playfair Display", Georgia, serif';
    ctx.fillText('544', W / 2, 265);

    // 5. Tiêu đề chính THẺ CHỨNG NHẬN
    ctx.fillStyle = '#7A0000';
    ctx.font = '800 58px "Playfair Display", Georgia, serif';
    ctx.fillText('THẺ CHỨNG NHẬN', W / 2, 375);

    ctx.fillStyle = '#9B7816';
    ctx.font = '700 34px "Playfair Display", Georgia, serif';
    ctx.fillText('ĐẠI SỨ DI SẢN VẠN XUÂN', W / 2, 428);

    // Đường kẻ trang trí
    ctx.beginPath();
    ctx.moveTo(W / 2 - 180, 455);
    ctx.lineTo(W / 2 + 180, 455);
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 6. Tên người nhận
    ctx.fillStyle = '#5C4338';
    ctx.font = 'italic 26px "Playfair Display", Georgia, serif';
    ctx.fillText('Trân trọng trao tặng cho:', W / 2, 520);

    ctx.fillStyle = '#7A0000';
    ctx.font = '800 60px "Playfair Display", Georgia, serif';
    ctx.fillText(name, W / 2, 600);

    // Gạch chân tên
    ctx.beginPath();
    ctx.moveTo(W / 2 - 260, 622);
    ctx.lineTo(W / 2 + 260, 622);
    ctx.strokeStyle = 'rgba(155, 120, 22, 0.55)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#3C2418';
    ctx.font = '600 28px "Be Vietnam Pro", sans-serif';
    ctx.fillText(unit, W / 2, 672);

    // 7. Khung điểm số & Danh hiệu
    const boxX = 140;
    const boxY = 730;
    const boxW = W - 280;
    const boxH = 175;
    ctx.fillStyle = 'rgba(122, 0, 0, 0.06)';
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    ctx.fillStyle = '#26140C';
    ctx.font = '600 30px "Be Vietnam Pro", sans-serif';
    ctx.fillText(`Kết quả thử thách: ${scoreStr}`, W / 2, boxY + 68);

    ctx.fillStyle = '#7A0000';
    ctx.font = '700 30px "Be Vietnam Pro", sans-serif';
    ctx.fillText(rankStr, W / 2, boxY + 125);

    // 8. Thông điệp cuộc thi
    ctx.fillStyle = '#5C4338';
    ctx.font = 'italic 26px "Playfair Display", Georgia, serif';
    ctx.fillText('“Tự hào bản sắc – Kết nối di sản –', W / 2, 985);
    ctx.fillText('Lan tỏa giá trị văn hóa quê hương”', W / 2, 1025);

    // 9. Chân thẻ & Ấn triện đỏ
    ctx.beginPath();
    ctx.moveTo(140, 1100);
    ctx.lineTo(W - 140, 1100);
    ctx.strokeStyle = 'rgba(155, 120, 22, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Cột trái
    ctx.textAlign = 'left';
    ctx.fillStyle = '#5C4338';
    ctx.font = '500 22px "Be Vietnam Pro", sans-serif';
    ctx.fillText('Mã thẻ bảo tàng:', 150, 1170);
    ctx.fillStyle = '#7A0000';
    ctx.font = '700 26px "Be Vietnam Pro", sans-serif';
    ctx.fillText('#VX-2026-544', 150, 1208);

    // Cột phải
    ctx.textAlign = 'right';
    ctx.fillStyle = '#5C4338';
    ctx.font = '500 22px "Be Vietnam Pro", sans-serif';
    ctx.fillText('Đơn vị phát hành:', W - 150, 1170);
    ctx.fillStyle = '#7A0000';
    ctx.font = '700 26px "Be Vietnam Pro", sans-serif';
    ctx.fillText('Đội 3 • THPT Bộc Bố', W - 150, 1208);

    // Ấn vuông đỏ ở giữa
    ctx.save();
    ctx.translate(W / 2, 1200);
    ctx.rotate(-0.08);
    ctx.strokeStyle = '#A81010';
    ctx.lineWidth = 5;
    ctx.strokeRect(-65, -65, 130, 130);
    ctx.lineWidth = 2;
    ctx.strokeRect(-55, -55, 110, 110);
    ctx.fillStyle = 'rgba(168, 16, 16, 0.08)';
    ctx.fillRect(-65, -65, 130, 130);
    ctx.fillStyle = '#A81010';
    ctx.textAlign = 'center';
    ctx.font = '800 22px "Playfair Display", Georgia, serif';
    ctx.fillText('HÀO KHÍ', 0, -10);
    ctx.fillText('VẠN XUÂN', 0, 24);
    ctx.restore();
  }

  // Nút Tải ảnh PNG
  if (btnDownloadCert) {
    btnDownloadCert.addEventListener('click', () => {
      updateCertificateDisplay();
      playTone('fanfare');
      launchConfetti();

      try {
        const dataUrl = certCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        const safeName = (playerNameInput && playerNameInput.value.trim()
          ? playerNameInput.value.trim()
          : 'Dai-Su-Van-Xuan'
        ).replace(/\s+/g, '-');
        link.download = `The-Chung-Nhan-Van-Xuan-${safeName}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        // Fallback mở chế độ toàn màn hình nếu trình duyệt trong ứng dụng chặn tải
        openFullscreenCertModal();
      }
    });
  }

  // Chế độ toàn màn hình để chụp ảnh trên điện thoại
  const certFsModal = document.getElementById('cert-fullscreen-modal');
  const certFsImg = document.getElementById('cert-fs-img');
  const btnCloseFsCert = document.getElementById('btn-close-fs-cert');

  function openFullscreenCertModal() {
    updateCertificateDisplay();
    if (certFsImg && certCanvas) {
      certFsImg.src = certCanvas.toDataURL('image/png');
    }
    if (certFsModal) {
      certFsModal.removeAttribute('hidden');
    }
  }

  if (btnFullscreenCert) {
    btnFullscreenCert.addEventListener('click', () => {
      playTone('click');
      openFullscreenCertModal();
    });
  }

  if (btnCloseFsCert && certFsModal) {
    btnCloseFsCert.addEventListener('click', () => {
      certFsModal.setAttribute('hidden', '');
    });
    certFsModal.addEventListener('click', (e) => {
      if (e.target === certFsModal) certFsModal.setAttribute('hidden', '');
    });
  }

  /* ==========================================================================
     7. HIỆU ỨNG PHÁO HOA (CONFETTI) KHI HOÀN THÀNH MINIGAME
     ========================================================================== */
  const confettiCanvas = document.getElementById('confetti-canvas');
  let confettiParticles = [];
  let confettiAnimId = null;

  function launchConfetti() {
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const colors = ['#D4AF37', '#7A0000', '#FFE89E', '#C92A2A', '#1B6B3A', '#F59F00'];
    confettiParticles = [];

    for (let i = 0; i < 110; i++) {
      confettiParticles.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * -confettiCanvas.height * 0.6,
        w: 7 + Math.random() * 7,
        h: 10 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: 2.5 + Math.random() * 4,
        vx: (Math.random() - 0.5) * 3,
        angle: Math.random() * Math.PI * 2,
        vAngle: (Math.random() - 0.5) * 0.15
      });
    }

    if (confettiAnimId) cancelAnimationFrame(confettiAnimId);

    const startTime = performance.now();
    function step(now) {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      let activeCount = 0;

      confettiParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.vAngle;

        if (p.y < confettiCanvas.height + 20) {
          activeCount++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });

      if (activeCount > 0 && now - startTime < 4500) {
        confettiAnimId = requestAnimationFrame(step);
      } else {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
    }

    confettiAnimId = requestAnimationFrame(step);
  }

  /* ==========================================================================
     8. MODAL MÃ QR BẢO TÀNG SỐ
     ========================================================================== */
  const btnQrModal = document.getElementById('btn-qr-modal');
  const qrModal = document.getElementById('qr-modal');
  const btnCloseQr = document.getElementById('btn-close-qr');
  const qrCanvas = document.getElementById('qr-code-canvas');

  function drawStylizedMuseumQr() {
    if (!qrCanvas) return;
    const ctx = qrCanvas.getContext('2d');
    const size = qrCanvas.width;
    const cells = 21;
    const cellSize = Math.floor((size - 16) / cells);
    const offset = Math.floor((size - cells * cellSize) / 2);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    // Sinh ma trận biểu trưng QR có 3 góc định vị chuẩn + ấn Vạn Xuân ở tâm
    function isFinder(r, c) {
      return (r < 7 && c < 7) || (r < 7 && c >= cells - 7) || (r >= cells - 7 && c < 7);
    }

    function drawFinder(startR, startC) {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          if (isBorder || isInner) {
            ctx.fillStyle = '#7A0000';
            ctx.fillRect(
              offset + (startC + c) * cellSize,
              offset + (startR + r) * cellSize,
              cellSize,
              cellSize
            );
          }
        }
      }
    }

    drawFinder(0, 0);
    drawFinder(0, cells - 7);
    drawFinder(cells - 7, 0);

    // Các điểm dữ liệu
    let seed = 544;
    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        if (isFinder(r, c)) continue;
        if (r >= 8 && r <= 12 && c >= 8 && c <= 12) continue;
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        if (seed % 10 < 5) {
          ctx.fillStyle = '#26140C';
          ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize - 1, cellSize - 1);
        }
      }
    }

    // Ấn trung tâm544
    const center = size / 2;
    ctx.fillStyle = '#7A0000';
    ctx.fillRect(center - 22, center - 22, 44, 44);
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2;
    ctx.strokeRect(center - 20, center - 20, 40, 40);
    ctx.fillStyle = '#FFE89E';
    ctx.textAlign = 'center';
    ctx.font = 'bold 14px "Playfair Display", serif';
    ctx.fillText('544', center, center + 5);
  }

  if (btnQrModal && qrModal) {
    btnQrModal.addEventListener('click', () => {
      playTone('click');
      drawStylizedMuseumQr();
      qrModal.removeAttribute('hidden');
    });
  }

  if (btnCloseQr && qrModal) {
    btnCloseQr.addEventListener('click', () => {
      qrModal.setAttribute('hidden', '');
    });
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) qrModal.setAttribute('hidden', '');
    });
  }

  // Khởi tạo giao diện ban đầu
  renderQuiz();
})();

