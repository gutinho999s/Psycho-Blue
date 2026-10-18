
const demoVideos = [
  {
    user: "@blue.motion",
    name: "Blue Motion",
    avatar: "B",
    caption: "Quando a cidade acende, começa outra história. 🌃",
    tags: "#nightvibes #psychoBlue",
    sound: "Som original · Blue Motion",
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    likes: 1284,
    comments: 86,
    shares: 42,
    following: true
  },
  {
    user: "@pixelwave",
    name: "Pixel Wave",
    avatar: "P",
    caption: "Pequenos detalhes, grandes ideias. Qual é a sua vibe hoje? 💙",
    tags: "#creative #blueaesthetic",
    sound: "Som original · Pixel Wave",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    likes: 927,
    comments: 54,
    shares: 21,
    following: true
  },
  {
    user: "@gusta.clips",
    name: "Gusta Clips",
    avatar: "G",
    caption: "Seu feed, suas descobertas. Bem-vindo ao Psycho Blue. ⚡",
    tags: "#fyp #PsychoBlue",
    sound: "Som original · Gusta Clips",
    src: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    likes: 2310,
    comments: 143,
    shares: 67,
    following: false
  }
];

const feed = document.getElementById("videoFeed");
const title = document.getElementById("feedTitle");
const searchInput = document.getElementById("searchInput");

let currentView = "forYou";
let activeVideos = [...demoVideos];

function formatCount(number) {
  if (number >= 1000) {
    return (
      number / 1000
    ).toFixed(number >= 10000 ? 0 : 1)
      .replace(".", ",") + " mil";
  }

  return String(number);
}

function renderVideos(list) {
  feed.innerHTML = "";

  if (!list.length) {
    feed.innerHTML = `
      <div class="video-card">
        <p>Nenhum vídeo encontrado. Tente outra pesquisa.</p>
      </div>
    `;
    return;
  }

  list.forEach(video => {
    const card = document.createElement("article");
    card.className = "video-card";

    card.innerHTML = `
      <div class="video-wrap">
        <video
          src="${video.src}"
          controls
          loop
          playsinline
          preload="metadata"
          aria-label="Vídeo de ${video.name}"
        ></video>

        <div class="video-shade"></div>

        <div class="video-meta">
          <div class="creator">
            <span class="avatar">${video.avatar}</span>
            <span>${video.user}</span>

            <button class="follow">
              ${video.following ? "Seguindo" : "＋ Seguir"}
            </button>
          </div>

          <p class="caption">${video.caption}</p>
          <div class="tags">${video.tags}</div>
          <div class="sound">♫ ${video.sound}</div>
        </div>
      </div>

      <div class="video-actions">
        <button class="action like-action" aria-label="Curtir vídeo">
          <span class="symbol">♥</span>
          <span class="like-count">${formatCount(video.likes)}</span>
        </button>

        <button class="action comment-action" aria-label="Comentar">
          <span class="symbol">▢</span>
          <span>${formatCount(video.comments)}</span>
        </button>

        <button class="action share-action" aria-label="Compartilhar">
          <span class="symbol">↗</span>
          <span>${formatCount(video.shares)}</span>
        </button>

        <button class="action sound-action" aria-label="Controlar som">
          <span class="symbol">♫</span>
          <span>Som</span>
        </button>
      </div>
    `;

    const player = card.querySelector("video");

    // Curtir e descurtir
    card.querySelector(".like-action")
      .addEventListener("click", event => {
        const button = event.currentTarget;
        const liked = button.classList.toggle("liked");

        video.likes += liked ? 1 : -1;

        button.querySelector(".like-count").textContent =
          formatCount(video.likes);
      });

    // Seguir criadores
    card.querySelector(".follow")
      .addEventListener("click", event => {
        video.following = !video.following;

        event.currentTarget.textContent =
          video.following ? "Seguindo" : "＋ Seguir";
      });

    // Comentar
    card.querySelector(".comment-action")
      .addEventListener("click", () => {
        const comment = prompt("Escreva seu comentário:");

        if (comment && comment.trim()) {
          video.comments++;

          card.querySelector(
            ".comment-action span:last-child"
          ).textContent = formatCount(video.comments);

          alert(
            "Comentário adicionado nesta demonstração: " +
            comment.trim()
          );
        }
      });

    // Compartilhar
    card.querySelector(".share-action")
      .addEventListener("click", async () => {
        const shareData = {
          title: "Psycho Blue",
          text: video.caption,
          url: location.href
        };

        try {
          if (navigator.share) {
            await navigator.share(shareData);
          } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(location.href);
            alert("Link copiado!");
          } else {
            alert("Copie o endereço do site para compartilhar.");
          }
        } catch (error) {
          // O usuário pode cancelar o compartilhamento.
        }
      });

    // Ativar ou desativar o som
    card.querySelector(".sound-action")
      .addEventListener("click", event => {
        player.muted = !player.muted;

        event.currentTarget.querySelector(".symbol").textContent =
          player.muted ? "🔇" : "♫";
      });

    feed.appendChild(card);
  });
}

// Navegação entre seções
function setView(view) {
  currentView = view;

  document.querySelectorAll("[data-view]").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.view === view
    );
  });

  const titles = {
    forYou: "Para você",
    following: "Seguindo",
    discover: "Descobrir"
  };

  title.innerHTML = titles[view] + "<span>.</span>";

  let list = [...activeVideos];

  if (view === "following") {
    list = list.filter(video => video.following);
  }

  if (view === "discover") {
    list.reverse();
  }

  const query = searchInput.value.trim().toLowerCase();

  if (query) {
    list = list.filter(video => {
      const content = [
        video.user,
        video.name,
        video.caption,
        video.tags
      ].join(" ").toLowerCase();

      return content.includes(query);
    });
  }

  renderVideos(list);
}

// Eventos dos menus
document.querySelectorAll("[data-view]").forEach(button => {
  button.addEventListener("click", () => {
    setView(button.dataset.view);
  });
});

// Pesquisa
searchInput.addEventListener("input", () => {
  setView(currentView);
});

// Janela de publicação
const modal = document.getElementById("uploadModal");

function openModal() {
  modal.hidden = false;
  document.getElementById("videoFile").focus();
}

function closeModal() {
  modal.hidden = true;
}

document.getElementById("uploadOpen")
  .addEventListener("click", openModal);

document.getElementById("mobileUpload")
  .addEventListener("click", openModal);

document.getElementById("uploadClose")
  .addEventListener("click", closeModal);

modal.addEventListener("click", event => {
  if (event.target === modal) {
    closeModal();
  }
});

// Perfil de demonstração
function showProfile() {
  alert(
    "Perfil de demonstração. " +
    "Um backend será necessário para criar contas reais."
  );
}

document.getElementById("profileButton")
  .addEventListener("click", showProfile);

document.getElementById("mobileProfile")
  .addEventListener("click", showProfile);

// Pré-visualização de vídeos locais
document.getElementById("previewUpload")
  .addEventListener("click", () => {
    const fileInput = document.getElementById("videoFile");
    const captionInput = document.getElementById("videoCaption");
    const message = document.getElementById("uploadMessage");

    const file = fileInput.files[0];

    if (!file) {
      message.textContent = "Escolha um vídeo primeiro.";
      return;
    }

    if (!file.type.startsWith("video/")) {
      message.textContent = "Selecione um arquivo de vídeo válido.";
      return;
    }

    const localUrl = URL.createObjectURL(file);

    activeVideos.unshift({
      user: "@seu.perfil",
      name: "Seu perfil",
      avatar: "★",
      caption:
        captionInput.value.trim() ||
        "Meu novo vídeo no Psycho Blue 💙",
      tags: "#PsychoBlue #meuvideo",
      sound: "Som original · Seu perfil",
      src: localUrl,
      likes: 0,
      comments: 0,
      shares: 0,
      following: true
    });

    setView("forYou");

    closeModal();

    fileInput.value = "";
    captionInput.value = "";
    message.textContent = "";

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

// Carregar o feed inicial
renderVideos(activeVideos);
