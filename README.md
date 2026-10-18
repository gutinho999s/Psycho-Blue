import os, zipfile, textwrap

base = "/mnt/data/psycho_blue"
os.makedirs(base, exist_ok=True)

files = {
"index.html": r'''<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#07111f">
  <title>Psycho Blue — vídeos que prendem sua atenção</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="topbar">
    <a class="brand" href="#" aria-label="Psycho Blue início">
      <span class="brand-mark">Ψ</span><span>PSYCHO<span class="blue"> BLUE</span></span>
    </a>
    <label class="search">
      <span aria-hidden="true">⌕</span>
      <input id="searchInput" type="search" placeholder="Pesquisar vídeos ou criadores..." aria-label="Pesquisar">
    </label>
    <button class="upload-btn" id="uploadOpen">＋ <span>Publicar</span></button>
  </header>

  <aside class="sidebar">
    <button class="nav-item active" data-view="forYou">⌂ <span>Para você</span></button>
    <button class="nav-item" data-view="following">♡ <span>Seguindo</span></button>
    <button class="nav-item" data-view="discover">⌕ <span>Descobrir</span></button>
    <div class="side-line"></div>
    <p class="side-label">SUA CONTA</p>
    <button class="nav-item" id="profileButton">◉ <span>Meu perfil</span></button>
    <div class="side-card">
      <div class="orb"></div>
      <strong>Entre no clima.</strong>
      <p>Vídeos curtos. Ideias enormes.</p>
      <small>PSYCHO BLUE · BETA</small>
    </div>
  </aside>

  <main class="main">
    <div class="feed-heading">
      <div>
        <p class="eyebrow">SEU PRÓXIMO VÍDEO FAVORITO</p>
        <h1 id="feedTitle">Para você<span>.</span></h1>
      </div>
      <div class="feed-tabs">
        <button class="tab active" data-view="forYou">Em alta</button>
        <button class="tab" data-view="following">Seguindo</button>
      </div>
    </div>
    <div id="videoFeed" class="video-feed" aria-live="polite"></div>
    <p class="footnote">Psycho Blue é um projeto demonstrativo. Os vídeos de exemplo usam arquivos públicos de demonstração.</p>
  </main>

  <div class="modal-backdrop" id="uploadModal" hidden>
    <section class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <button class="modal-close" id="uploadClose" aria-label="Fechar">×</button>
      <p class="eyebrow">CRIE ALGO NOVO</p>
      <h2 id="modalTitle">Publicar vídeo</h2>
      <p class="modal-copy">Escolha um vídeo disponível no seu dispositivo. Esta demonstração reproduz o arquivo localmente; ainda não envia o vídeo para um servidor.</p>
      <label class="field-label" for="videoFile">Arquivo de vídeo</label>
      <input id="videoFile" type="file" accept="video/*">
      <label class="field-label" for="videoCaption">Legenda</label>
      <input id="videoCaption" type="text" maxlength="120" placeholder="Escreva uma legenda...">
      <button class="primary-btn" id="previewUpload">Pré-visualizar publicação</button>
      <p id="uploadMessage" class="upload-message"></p>
    </section>
  </div>

  <nav class="mobile-nav">
    <button class="active" data-view="forYou">⌂<span>Início</span></button>
    <button data-view="discover">⌕<span>Descobrir</span></button>
    <button id="mobileUpload">＋<span>Publicar</span></button>
    <button id="mobileProfile">◉<span>Perfil</span></button>
  </nav>

  <script src="script.js"></script>
</body>
</html>
''',
"style.css": r'''@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

:root{--bg:#070d18;--panel:#0d1727;--panel2:#111f33;--line:#20334c;--text:#eef5ff;--muted:#91a5c1;--blue:#4aa8ff;--cyan:#58e1ff;--pink:#ff4f9a}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:radial-gradient(ellipse at 80% -10%,#132f57 0,transparent 35%),var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;min-height:100vh}
button,input{font:inherit}
button{cursor:pointer}
.topbar{height:76px;position:fixed;inset:0 0 auto;z-index:10;display:flex;align-items:center;gap:30px;padding:0 4.5%;background:rgba(7,13,24,.88);backdrop-filter:blur(18px);border-bottom:1px solid rgba(88,140,200,.15)}
.brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--text);font:700 19px 'Space Grotesk',sans-serif;letter-spacing:1px;white-space:nowrap}
.brand-mark{display:grid;place-items:center;width:36px;height:36px;border-radius:12px;background:linear-gradient(135deg,var(--blue),#3155df);box-shadow:0 0 25px #368fff55;font-size:25px;color:white}
.blue{color:var(--cyan)}
.search{display:flex;align-items:center;gap:10px;width:min(520px,50vw);margin:auto;padding:11px 15px;background:#111d2e;border:1px solid #1d3048;border-radius:14px;color:#8fa8c7}
.search span{font-size:24px;line-height:18px}
.search input{width:100%;background:transparent;border:0;outline:0;color:var(--text)}
.search input::placeholder{color:#7388a4}
.upload-btn,.primary-btn{border:0;background:linear-gradient(100deg,#3e83ff,#35c9f2);color:white;font-weight:700;border-radius:12px;padding:11px 17px;box-shadow:0 7px 22px #248bff25}
.sidebar{position:fixed;top:76px;bottom:0;left:0;width:240px;padding:27px 18px;border-right:1px solid rgba(88,140,200,.15);background:rgba(8,15,27,.68)}
.nav-item{display:flex;align-items:center;gap:15px;width:100%;padding:14px 15px;margin:4px 0;border:0;border-radius:12px;background:transparent;color:#9cb0cb;text-align:left;font-size:15px}
.nav-item:first-letter{font-size:21px}
.nav-item:hover,.nav-item.active{color:white;background:linear-gradient(90deg,#193b64,#11243c)}
.nav-item.active{box-shadow:inset 3px 0 var(--cyan)}
.side-line{height:1px;background:var(--line);margin:23px 8px}
.side-label,.eyebrow{font-size:10px;letter-spacing:2px;color:#6e8caf;font-weight:700}
.side-label{padding-left:14px}
.side-card{position:absolute;left:18px;right:18px;bottom:25px;padding:17px;border:1px solid #23486a;border-radius:16px;background:linear-gradient(145deg,#122d4a,#0b1626);overflow:hidden}
.side-card strong{position:relative;display:block;margin-top:13px;font-family:'Space Grotesk';font-size:16px}
.side-card p{position:relative;font-size:12px;color:#9db2cc;line-height:1.5}
.side-card small{color:#5e9fdc;font-size:9px;letter-spacing:1.4px}
.orb{position:absolute;width:65px;height:65px;right:-12px;top:-20px;border-radius:50%;background:linear-gradient(135deg,#54dfff,#3865ff);filter:blur(1px);opacity:.7;box-shadow:0 0 45px #398cff}
.main{margin-left:240px;padding:108px 30px 60px;max-width:1100px;margin-right:auto}
.feed-heading{display:flex;align-items:end;justify-content:space-between;margin:0 auto 20px;max-width:760px}
.eyebrow{margin:0 0 8px}
h1,h2{font-family:'Space Grotesk',sans-serif;margin:0}
h1{font-size:35px;letter-spacing:-1.3px}
h1 span{color:var(--cyan)}
.feed-tabs{display:flex;gap:5px;background:#0e1928;padding:5px;border:1px solid #1b2d44;border-radius:12px}
.tab{border:0;background:transparent;color:#8197b4;padding:8px 13px;border-radius:8px;font-size:12px}
.tab.active{background:#1c3553;color:white}
.video-feed{display:flex;flex-direction:column;align-items:center;gap:22px}
.video-card{position:relative;display:grid;grid-template-columns:minmax(0,1fr) 64px;gap:14px;width:min(760px,100%);padding:13px;background:linear-gradient(140deg,#0e1a2a,#0a1220);border:1px solid #1c3048;border-radius:20px;box-shadow:0 14px 40px #0002;overflow:hidden}
.video-wrap{position:relative;height:min(64vh,590px);min-height:320px;background:#02050a;border-radius:14px;overflow:hidden;isolation:isolate}
.video-wrap video{width:100%;height:100%;object-fit:cover;display:block;background:#03070e}
.video-shade{position:absolute;inset:35% 0 0;background:linear-gradient(transparent,rgba(2,6,13,.88));pointer-events:none}
.video-meta{position:absolute;left:18px;right:14px;bottom:18px;z-index:2}
.creator{display:flex;align-items:center;gap:9px;font-weight:700;font-size:14px}
.avatar{width:34px;height:34px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(135deg,#4bcaff,#5555ff);font-size:14px;border:1px solid #ffffff55}
.follow{border:1px solid #67c9ff;background:#112d46;color:#aee7ff;padding:5px 10px;border-radius:8px;font-size:11px;margin-left:4px}
.caption{font-size:14px;line-height:1.45;margin:11px 0 8px;text-shadow:0 2px 8px #000}
.tags{font-size:12px;color:#91d9ff}
.sound{margin-top:10px;font-size:11px;color:#d2e2f7}
.video-actions{display:flex;flex-direction:column;align-items:center;justify-content:end;gap:19px;padding-bottom:19px}
.action{display:flex;flex-direction:column;align-items:center;gap:5px;border:0;background:none;color:#a6bad4;font-size:11px}
.action .symbol{display:grid;place-items:center;width:43px;height:43px;border-radius:15px;background:#14243a;border:1px solid #233b58;font-size:21px;transition:.2s}
.action:hover .symbol{transform:translateY(-3px);border-color:#5fcaff;color:white}
.action.liked .symbol{background:#53213f;color:#ff70ae;border-color:#a73872}
.action span:last-child{color:#91a5c1}
.footnote{text-align:center;color:#536985;font-size:11px;margin:24px 0}
.modal-backdrop{position:fixed;inset:0;z-index:30;display:grid;place-items:center;padding:20px;background:#02050bd9;backdrop-filter:blur(8px)}
.modal-backdrop[hidden]{display:none}
.modal{position:relative;width:min(460px,100%);padding:28px;border:1px solid #294767;border-radius:22px;background:#0d1929;box-shadow:0 25px 100px #0008}
.modal h2{font-size:27px;margin-bottom:10px}
.modal-copy{font-size:13px;color:#91a5c1;line-height:1.6}
.modal-close{position:absolute;right:16px;top:12px;border:0;background:none;color:#b9cbe0;font-size:28px}
.field-label{display:block;margin:17px 0 7px;font-size:12px;color:#b7cbe4}
.modal input[type=file],.modal input[type=text]{width:100%;padding:11px;border:1px solid #28415e;border-radius:10px;background:#091321;color:#dceaff}
.primary-btn{width:100%;margin-top:20px}
.upload-message{font-size:12px;color:var(--cyan);line-height:1.5}
.mobile-nav{display:none}
@media(max-width:900px){.sidebar{width:200px}.main{margin-left:200px;padding-left:20px;padding-right:20px}.topbar{padding:0 20px;gap:15px}.brand{font-size:16px}}
@media(max-width:650px){.topbar{height:64px;padding:0 14px;gap:10px}.brand{font-size:14px;gap:7px}.brand-mark{width:31px;height:31px}.search{width:auto;flex:1;padding:9px 10px}.search input{min-width:0;font-size:12px}.upload-btn{padding:10px 11px}.upload-btn span{display:none}.sidebar{display:none}.main{margin:0;padding:88px 10px 85px}.feed-heading{padding:0 5px}.feed-heading h1{font-size:29px}.feed-tabs{display:none}.video-card{grid-template-columns:minmax(0,1fr) 48px;gap:8px;padding:7px;border-radius:15px}.video-wrap{height:67vh;min-height:360px;border-radius:11px}.video-actions{gap:15px;padding-bottom:13px}.action .symbol{width:39px;height:39px;border-radius:13px;font-size:19px}.action{font-size:10px}.video-meta{left:12px;bottom:13px}.caption{font-size:13px}.mobile-nav{position:fixed;z-index:12;bottom:0;left:0;right:0;display:flex;justify-content:space-around;padding:9px 8px calc(9px + env(safe-area-inset-bottom));background:#091321ed;border-top:1px solid #20334c;backdrop-filter:blur(15px)}.mobile-nav button{display:flex;flex-direction:column;align-items:center;gap:3px;background:none;border:0;color:#7188a5;font-size:20px}.mobile-nav button span{font-size:9px}.mobile-nav button.active{color:#69dfff}.footnote{padding:0 15px;line-height:1.5}}
''',
"script.js": r'''const demoVideos = [
  {
    user: "@blue.motion", name: "Blue Motion", avatar: "B",
    caption: "Quando a cidade acende, começa outra história. 🌃",
    tags: "#nightvibes #psychoBlue", sound: "Som original · Blue Motion",
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    likes: 1284, comments: 86, shares: 42, following: true
  },
  {
    user: "@pixelwave", name: "Pixel Wave", avatar: "P",
    caption: "Pequenos detalhes, grandes ideias. Qual é a sua vibe hoje? 💙",
    tags: "#creative #blueaesthetic", sound: "Som original · Pixel Wave",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    likes: 927, comments: 54, shares: 21, following: true
  },
  {
    user: "@gusta.clips", name: "Gusta Clips", avatar: "G",
    caption: "Seu feed, suas descobertas. Bem-vindo ao Psycho Blue. ⚡",
    tags: "#fyp #PsychoBlue", sound: "Som original · Gusta Clips",
    src: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    likes: 2310, comments: 143, shares: 67, following: false
  }
];

const feed = document.getElementById("videoFeed");
const title = document.getElementById("feedTitle");
const searchInput = document.getElementById("searchInput");
let currentView = "forYou";
let activeVideos = [...demoVideos];

function formatCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(".", ",") + " mil";
  return String(n);
}

function renderVideos(list) {
  feed.innerHTML = "";
  if (!list.length) {
    feed.innerHTML = '<div class="video-card"><p>Nenhum vídeo encontrado. Tente outra pesquisa.</p></div>';
    return;
  }
  list.forEach((video, index) => {
    const card = document.createElement("article");
    card.className = "video-card";
    card.innerHTML = `
      <div class="video-wrap">
        <video src="${video.src}" controls loop playsinline preload="metadata" aria-label="Vídeo de ${video.name}"></video>
        <div class="video-shade"></div>
        <div class="video-meta">
          <div class="creator"><span class="avatar">${video.avatar}</span><span>${video.user}</span><button class="follow">${video.following ? "Seguindo" : "＋ Seguir"}</button></div>
          <p class="caption">${video.caption}</p>
          <div class="tags">${video.tags}</div>
          <div class="sound">♫ ${video.sound}</div>
        </div>
      </div>
      <div class="video-actions">
        <button class="action like-action" aria-label="Curtir vídeo"><span class="symbol">♥</span><span class="like-count">${formatCount(video.likes)}</span></button>
        <button class="action comment-action" aria-label="Comentar"><span class="symbol">▢</span><span>${formatCount(video.comments)}</span></button>
        <button class="action share-action" aria-label="Compartilhar"><span class="symbol">↗</span><span>${formatCount(video.shares)}</span></button>
        <button class="action sound-action" aria-label="Ativar ou desativar som"><span class="symbol">♫</span><span>Som</span></button>
      </div>`;
    const vid = card.querySelector("video");
    card.querySelector(".like-action").addEventListener("click", e => {
      const btn = e.currentTarget;
      const liked = btn.classList.toggle("liked");
      video.likes += liked ? 1 : -1;
      btn.querySelector(".like-count").textContent = formatCount(video.likes);
    });
    card.querySelector(".follow").addEventListener("click", e => {
      video.following = !video.following;
      e.currentTarget.textContent = video.following ? "Seguindo" : "＋ Seguir";
    });
    card.querySelector(".comment-action").addEventListener("click", () => {
      const comment = prompt("Escreva seu comentário:");
      if (comment && comment.trim()) {
        video.comments++;
        card.querySelector(".comment-action span:last-child").textContent = formatCount(video.comments);
        alert("Comentário adicionado nesta demonstração: " + comment.trim());
      }
    });
    card.querySelector(".share-action").addEventListener("click", async () => {
      const shareData = { title: "Psycho Blue", text: video.caption, url: location.href };
      try {
        if (navigator.share) await navigator.share(shareData);
        else if (navigator.clipboard) { await navigator.clipboard.writeText(location.href); alert("Link copiado!"); }
        else alert("Copie o endereço do site para compartilhar.");
      } catch (err) { /* compartilhamento cancelado pelo usuário */ }
    });
    card.querySelector(".sound-action").addEventListener("click", e => {
      vid.muted = !vid.muted;
      e.currentTarget.querySelector(".symbol").textContent = vid.muted ? "🔇" : "♫";
    });
    feed.appendChild(card);
  });
}

function setView(view) {
  currentView = view;
  document.querySelectorAll("[data-view]").forEach(btn => btn.classList.toggle("active", btn.dataset.view === view));
  title.innerHTML = (view === "following" ? "Seguindo" : view === "discover" ? "Descobrir" : "Para você") + "<span>.</span>";
  let list = view === "following" ? activeVideos.filter(v => v.following) : activeVideos;
  if (view === "discover") list = [...list].reverse();
  const q = searchInput.value.trim().toLowerCase();
  if (q) list = list.filter(v => `${v.user} ${v.name} ${v.caption} ${v.tags}`.toLowerCase().includes(q));
  renderVideos(list);
}

document.querySelectorAll("[data-view]").forEach(btn => btn.addEventListener("click", () => setView(btn.dataset.view)));
searchInput.addEventListener("input", () => setView(currentView));

const modal = document.getElementById("uploadModal");
const openModal = () => { modal.hidden = false; document.getElementById("videoFile").focus(); };
const closeModal = () => { modal.hidden = true; };
document.getElementById("uploadOpen").addEventListener("click", openModal);
document.getElementById("mobileUpload").addEventListener("click", openModal);
document.getElementById("uploadClose").addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
document.getElementById("profileButton").addEventListener("click", () => alert("Perfil de demonstração — conecte um backend para criar contas reais."));
document.getElementById("mobileProfile").addEventListener("click", () => alert("Perfil de demonstração — conecte um backend para criar contas reais."));

document.getElementById("previewUpload").addEventListener("click", () => {
  const fileInput = document.getElementById("videoFile");
  const captionInput = document.getElementById("videoCaption");
  const message = document.getElementById("uploadMessage");
  const file = fileInput.files[0];
  if (!file) { message.textContent = "Escolha um arquivo de vídeo primeiro."; return; }
  if (!file.type.startsWith("video/")) { message.textContent = "Esse arquivo não parece ser um vídeo."; return; }
  const localUrl = URL.createObjectURL(file);
  activeVideos.unshift({
    user: "@seu.perfil", name: "Seu perfil", avatar: "★",
    caption: captionInput.value.trim() || "Meu novo vídeo no Psycho Blue 💙",
    tags: "#PsychoBlue #meuvideo", sound: "Som original · Seu perfil",
    src: localUrl, likes: 0, comments: 0, shares: 0, following: true
  });
  setView("forYou");
  closeModal();
  fileInput.value = "";
  captionInput.value = "";
  message.textContent = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

renderVideos(activeVideos);
'''
,
"README.md": r'''# Psycho Blue

Protótipo de uma plataforma de vídeos curtos com identidade visual azul, feito com HTML, CSS e JavaScript puro.

## Como abrir
1. Extraia o ZIP.
2. Abra `index.html` em um navegador moderno.
3. Para publicar no GitHub Pages, envie os três arquivos (`index.html`, `style.css`, `script.js`) e este README para o repositório. Em Settings → Pages, escolha a branch principal e a pasta raiz.

## O que já funciona
- Feed de vídeos de demonstração com controles de reprodução.
- Pesquisa por criador, legenda e hashtags.
- Filtros “Para você”, “Seguindo” e “Descobrir”.
- Curtir, seguir, comentar e compartilhar (demonstração no navegador).
- Pré-visualização local de um vídeo selecionado no dispositivo.
- Layout responsivo para computador e celular.

## Limitações importantes
Este projeto é um protótipo front-end. Curtidas, comentários, perfis e vídeos publicados não são salvos em um banco de dados nem compartilhados entre usuários. A publicação usa um arquivo local e não envia o vídeo para a internet. Para um TikTok de verdade, será necessário criar um backend, autenticação, banco de dados, armazenamento de vídeos, moderação e proteção contra abuso.

Os vídeos de exemplo vêm de endereços públicos de demonstração e precisam de internet para carregar.

## E Java?
O site usa **JavaScript**, que roda diretamente no navegador. **Java** é uma linguagem diferente e pode ser usada depois para criar uma API/backend, por exemplo com Spring Boot.
'''
}
for name, content in files.items():
    with open(os.path.join(base, name), "w", encoding="utf-8") as f:
        f.write(content)

zip_path = "/mnt/data/Psycho_Blue_Site.zip"
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    for name in files:
        z.write(os.path.join(base, name), arcname=f"Psycho_Blue/{name}")

print("Arquivos criados:")
for name in files:
    print(os.path.join(base, name))
print(zip_path)
