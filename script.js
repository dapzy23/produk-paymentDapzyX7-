/*
 * DAPZY OFFICIAL — konfigurasi mudah.
 * WA_ADMIN wajib diganti dengan nomor WhatsApp admin format internasional:
 * contoh Indonesia: 6281234567890 (tanpa tanda +, spasi, atau angka 0 di depan).
 * Website statis ini memakai konfirmasi pesanan manual; belum memverifikasi pembayaran otomatis.
 */
const CONFIG = {
  WA_ADMIN: "62881038298178",
  TELEGRAM_URL: "https://t.me/Dapzygens",
  DANA_NAME: "An daffa",
  DANA_NUMBER: "0881037758526",
  CHANNEL_URL: "https://whatsapp.com/channel/0029VbC326uGU3BCA5oFjt0J",
};

const toast = document.getElementById("toast");
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function normalizedWhatsApp() {
  return String(CONFIG.WA_ADMIN || "").replace(/\D/g, "");
}
function openWhatsApp(message) {
  const number = normalizedWhatsApp();
  if (!number || number.includes("GANTI") || number.length < 10) {
    showToast("Admin WhatsApp belum diatur. Buka script.js dan isi WA_ADMIN.");
    return;
  }
  const url = "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
  window.open(url, "_blank", "noopener,noreferrer");
}
function rupiah(value) {
  return new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(value));
}
document.querySelectorAll("[data-buy]").forEach(button => {
  button.addEventListener("click", () => {
    const card = button.closest("[data-product]");
    if (!card) return;
    const product = card.dataset.product;
    const price = Number(card.dataset.price);
    const message = [
      "Halo Admin DAPZY OFFICIAL 👋",
      "",
      "Saya ingin memesan produk:",
      "📦 Produk: " + product,
      "💰 Harga tertera: " + rupiah(price),
      "",
      "Mohon konfirmasi ketersediaan, total pembayaran, dan instruksi pembayaran QRIS/DANA.",
      "Saya memahami pesanan dan pembayaran dikonfirmasi manual oleh admin."
    ].join("\n");
    openWhatsApp(message);
  });
});
// Product card display styles: the visitor can switch the shape without reloading.
(() => {
  const options = document.querySelectorAll('[data-product-shape]');
  if (!options.length) return;
  document.body.dataset.productShape = 'cube';
  options.forEach(button => button.addEventListener('click', () => {
    const shape = button.dataset.productShape;
    document.body.dataset.productShape = shape;
    options.forEach(option => {
      const active = option === button;
      option.classList.toggle('active', active);
      option.setAttribute('aria-pressed', String(active));
    });
  }));
})();

document.querySelectorAll("[data-contact]").forEach(button => {
  button.addEventListener("click", () => openWhatsApp("Halo Admin DAPZY OFFICIAL 👋\nSaya ingin bertanya tentang produk dan layanan."));
});
document.querySelectorAll("[data-copy]").forEach(button => {
  button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copy);
    const value = target ? target.textContent.trim() : "";
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const area = document.createElement("textarea");
        area.value = value; area.style.position = "fixed"; area.style.opacity = "0";
        document.body.appendChild(area); area.select();
        const ok = document.execCommand("copy"); area.remove();
        if (!ok) throw new Error("copy failed");
      }
      showToast("Berhasil disalin: " + value);
    } catch (error) {
      showToast("Salin manual: " + value);
    }
  });
});
const modal = document.getElementById("qrisModal");
document.getElementById("viewQris").addEventListener("click", () => {
  modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
});
document.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", () => {
  modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true");
}));
document.addEventListener("keydown", event => {
  if (event.key === "Escape") { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); }
});
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open"); menuToggle.setAttribute("aria-expanded", "false");
}));
document.getElementById("year").textContent = new Date().getFullYear();

// Drag/touch rotation for the 3D photo cube.
(() => {
  const scene = document.getElementById('cubeScene');
  const cube = scene && scene.querySelector('.cube');
  if (!scene || !cube) return;
  let rx = -24, ry = 35, dragging = false, lastX = 0, lastY = 0;
  const paint = () => { cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`; };
  scene.addEventListener('pointerdown', e => { dragging = true; lastX = e.clientX; lastY = e.clientY; scene.setPointerCapture(e.pointerId); });
  scene.addEventListener('pointermove', e => { if (!dragging) return; ry += (e.clientX-lastX)*.7; rx -= (e.clientY-lastY)*.55; rx = Math.max(-75, Math.min(75, rx)); lastX=e.clientX; lastY=e.clientY; paint(); });
  const stop = () => { dragging = false; };
  scene.addEventListener('pointerup', stop); scene.addEventListener('pointercancel', stop); paint();
})();

// FUN ZONE: klaim hanya dibuka setelah jawaban benar untuk soal aktif.
(() => {
  const questions = [
    {q:'Bahasa pemrograman yang sering digunakan untuk membuat interaksi website adalah?', a:['javascript','js']},
    {q:'Apa nama tempat untuk menyimpan dan mengelola kode proyek secara online yang digunakan Dapzy?', a:['github','git hub']},
    {q:'Berapa hasil dari 7 × 8?', a:['56']},
    {q:'Apa kepanjangan dari HTML?', a:['hypertext markup language']},
    {q:'Planet apa yang dikenal sebagai Planet Merah?', a:['mars']}
  ];
  const question=document.getElementById('gameQuestion'), answer=document.getElementById('gameAnswer'), check=document.getElementById('checkAnswer'), next=document.getElementById('nextQuestion'), feedback=document.getElementById('gameFeedback'), scoreEl=document.getElementById('gameScore'), claim=document.getElementById('claimPrize');
  if(!question || !answer || !check || !next || !feedback || !claim) return;
  let current=-1, score=0, solved=false;
  const lockClaim=()=>{ claim.hidden=true; claim.removeAttribute('href'); claim.setAttribute('aria-disabled','true'); };
  function newQuestion(){
    let n; do{n=Math.floor(Math.random()*questions.length)}while(n===current && questions.length>1);
    current=n; solved=false; question.textContent=questions[n].q; answer.value=''; answer.disabled=false; check.disabled=false;
    feedback.textContent='Jawab dengan tepat untuk membuka tombol klaim hadiah.'; feedback.className='game-feedback'; lockClaim();
  }
  check.addEventListener('click',()=>{
    if(solved) return;
    const value=answer.value.trim().toLocaleLowerCase('id-ID').replace(/[.!?]/g,'').replace(/\\s+/g,' ');
    if(!value){feedback.textContent='Isi jawaban terlebih dahulu.';feedback.className='game-feedback error';lockClaim();return;}
    if(questions[current].a.includes(value)){
      solved=true;score++;scoreEl.textContent='Skor: '+score;
      feedback.textContent='Benar! Tombol klaim hadiah sudah terbuka. Hubungi owner untuk konfirmasi.';feedback.className='game-feedback success';
      answer.disabled=true;check.disabled=true;
      const msg='Halo Owner DAPZY OFFICIAL! Saya berhasil menjawab soal FUN ZONE dengan benar dan ingin mengklaim hadiah. Skor saya: '+score+'.';
      claim.href='https://wa.me/'+normalizedWhatsApp()+'?text='+encodeURIComponent(msg);
      claim.hidden=false;claim.removeAttribute('aria-disabled');
    } else {
      feedback.textContent='Jawaban belum tepat. Tombol klaim tetap terkunci.';feedback.className='game-feedback error';lockClaim();
    }
  });
  answer.addEventListener('input',()=>{if(!solved) lockClaim();});
  answer.addEventListener('keydown',e=>{if(e.key==='Enter')check.click();});
  next.addEventListener('click',newQuestion);
  claim.addEventListener('click',e=>{if(!solved || claim.hidden || !claim.href || claim.href==='#'){e.preventDefault();lockClaim();}});
  newQuestion();
})();

// Digital clock: follows the visitor's device time and locale.
(() => {
  const clock = document.getElementById('digitalClock');
  const date = document.getElementById('digitalDate');
  if (!clock || !date) return;
  const updateClock = () => {
    const now = new Date();
    clock.textContent = new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(now);
    date.textContent = new Intl.DateTimeFormat('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }).format(now);
  };
  updateClock();
  window.setInterval(updateClock, 1000);
})();

// Theme colors.
(() => {
  const buttons = document.querySelectorAll('[data-theme]');
  buttons.forEach(button => button.addEventListener('click', () => {
    document.body.dataset.theme = button.dataset.theme;
    buttons.forEach(item => item.classList.toggle('active', item === button));
  }));
})();

// Local audio player: tries autoplay, then waits for visitor interaction if blocked.
(() => {
  const audio = document.getElementById('dapzyAudio');
  const toggle = document.getElementById('musicToggle');
  const label = document.getElementById('musicLabel');
  const hint = document.getElementById('musicHint');
  const icon = document.getElementById('musicIcon');
  if (!audio || !toggle) return;

  const update = (playing) => {
    toggle.setAttribute('aria-pressed', String(playing));
    label.textContent = playing ? 'MUSIK AKTIF' : 'PUTAR MUSIK';
    hint.textContent = playing ? 'Sedang diputar' : 'Tekan untuk memutar';
    icon.textContent = playing ? 'Ⅱ' : '▶';
    toggle.classList.toggle('is-playing', playing);
  };

  const playAudio = async () => {
    try {
      await audio.play();
      update(true);
    } catch (error) {
      update(false);
      hint.textContent = 'Autoplay diblokir browser';
    }
  };

  toggle.addEventListener('click', async () => {
    if (audio.paused) {
      await playAudio();
    } else {
      audio.pause();
      update(false);
    }
  });
  audio.addEventListener('play', () => update(true));
  audio.addEventListener('pause', () => update(false));
  audio.addEventListener('ended', () => update(false));

  // Browser may block audible autoplay; the visible Play button remains available.
  playAudio();
})();

// Animated rain overlay.
(() => {
  const canvas = document.getElementById('rainCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let width = 0, height = 0, drops = [];
  const reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(150, Math.max(45, Math.floor(width / 7)));
    drops = Array.from({length: count}, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 9 + Math.random() * 18,
      speed: 3 + Math.random() * 6,
      opacity: 0.12 + Math.random() * 0.22
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;
    for (const drop of drops) {
      ctx.strokeStyle = `rgba(145, 190, 255, ${drop.opacity})`;
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - 2, drop.y + drop.length);
      ctx.stroke();
      drop.y += drop.speed;
      drop.x -= 0.7;
      if (drop.y > height + drop.length) {
        drop.y = -drop.length;
        drop.x = Math.random() * width;
      }
      if (drop.x < -5) drop.x = width + 5;
    }
    if (!reduceMotion) requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize, {passive:true});
  if (reduceMotion) {
    ctx.clearRect(0, 0, width, height);
    return;
  }
  requestAnimationFrame(draw);
})();
