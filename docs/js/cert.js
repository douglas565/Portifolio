// ===== Efeito Matrix colorido no fundo =====
const matrixCanvas = document.getElementById("matrix-bg");
const ctx = matrixCanvas.getContext("2d");

function resizeCanvas() {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Caracteres que vão "cair"
const letters = "アイウエオカキクケコサシスセソ0123456789ABCDEF</>{}$#@".split("");
const fontSize = 16;
let columns = Math.floor(matrixCanvas.width / fontSize);
let drops = Array(columns).fill(1);

// Cores que vão alternando (efeito colorido)
const colors = ["#00ff88", "#00b4ff", "#b400ff", "#ff0080", "#ffea00"];

function drawMatrix() {
    // Rastro semitransparente (dá o efeito de "sumir" devagar)
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        // Cor baseada na coluna, para variar
        ctx.fillStyle = colors[i % colors.length];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reinicia a gota no topo aleatoriamente
        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// Recalcula colunas ao redimensionar
window.addEventListener("resize", () => {
    columns = Math.floor(matrixCanvas.width / fontSize);
    drops = Array(columns).fill(1);
});

setInterval(drawMatrix, 50); // velocidade da chuva (menor = mais rápido)


class Slider {
    constructor(slider) {
        this.slider = slider;
        this.display = slider.querySelector(".image-display");
        this.navButtons = Array.from(slider.querySelectorAll(".nav-button"));
        this.prevButton = slider.querySelector(".prev-button");
        this.nextButton = slider.querySelector(".next-button");
        this.sliderNavigation = slider.querySelector(".slider-navigation");
        this.currentSlideIndex = 0;
        this.preloadedImages = {};
        this.autoPlayDelay = 4000; // tempo em cada slide (4s)
        this.autoPlayTimer = null;
        this.certificates = [
            "assets/pdf/web.pdf",
            "assets/pdf/IC.pdf",
            "assets/pdf/tec.pdf",
            "assets/pdf/sql.pdf",
            "assets/pdf/eng.pdf",
            "assets/pdf/gemini.pdf"
        ];

        this.initialize();
    }

    initialize() {
        this.setupSlider();
        this.preloadImages();
        this.eventListeners();
        this.updateDownloadLink();
        this.startAutoPlay(); // inicia o modo automático
    }

    setupSlider() {
        this.showSlide(this.currentSlideIndex);
    }

    showSlide(index) {
        this.currentSlideIndex = index;
        const navButtonImg = this.navButtons[this.currentSlideIndex].querySelector("img");
        if (navButtonImg) {
            const imgClone = navButtonImg.cloneNode();
            imgClone.classList.add("slide-fade"); // ativa animação de fade
            this.display.replaceChildren(imgClone);
            this.updateDownloadLink();
        }
        this.updateNavButtons();
    }

    updateNavButtons() {
        this.navButtons.forEach((button, buttonIndex) => {
            const isSelected = buttonIndex === this.currentSlideIndex;
            button.setAttribute("aria-selected", isSelected);
        });
    }

    preloadImages() {
        this.navButtons.forEach((button) => {
            const imgElement = button.querySelector("img");
            if (imgElement) {
                const imgSrc = imgElement.src;
                if (!this.preloadedImages[imgSrc]) {
                    this.preloadedImages[imgSrc] = new Image();
                    this.preloadedImages[imgSrc].src = imgSrc;
                }
            }
        });
    }

    createDownloadLink() {
        const downloadLink = document.createElement("a");
        downloadLink.id = "download-link";
        downloadLink.textContent = "Baixar Certificado";
        downloadLink.classList.add("download-button");
        document.body.appendChild(downloadLink);
        return downloadLink;
    }

    updateDownloadLink() {
        const downloadLink = document.getElementById("download-link") || this.createDownloadLink();
        downloadLink.href = this.certificates[this.currentSlideIndex];
        downloadLink.download = this.certificates[this.currentSlideIndex];
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayTimer = setInterval(() => {
            this.handleAction("next");
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.autoPlayTimer) clearInterval(this.autoPlayTimer);
    }

    eventListeners() {
        document.addEventListener("keydown", (event) => {
            this.handleAction(event.key);
            this.startAutoPlay(); // reinicia contagem ao interagir
        });

        this.sliderNavigation.addEventListener("click", (event) => {
            const targetButton = event.target.closest(".nav-button");
            const index = targetButton ? this.navButtons.indexOf(targetButton) : -1;
            if (index !== -1) {
                this.showSlide(index);
                this.startAutoPlay();
            }
        });

        this.prevButton.addEventListener("click", () => {
            this.handleAction("prev");
            this.startAutoPlay();
        });
        this.nextButton.addEventListener("click", () => {
            this.handleAction("next");
            this.startAutoPlay();
        });

        // Pausa quando o mouse está em cima, retoma ao sair
        this.slider.addEventListener("mouseenter", () => this.stopAutoPlay());
        this.slider.addEventListener("mouseleave", () => this.startAutoPlay());
    }

    handleAction(action) {
        if (action === "Home") {
            this.currentSlideIndex = 0;
        } else if (action === "End") {
            this.currentSlideIndex = this.navButtons.length - 1;
        } else if (action === "ArrowRight" || action === "next") {
            this.currentSlideIndex = (this.currentSlideIndex + 1) % this.navButtons.length;
        } else if (action === "ArrowLeft" || action === "prev") {
            this.currentSlideIndex = (this.currentSlideIndex - 1 + this.navButtons.length) % this.navButtons.length;
        }

        this.showSlide(this.currentSlideIndex);
    }
}

const ImageSlider = new Slider(document.querySelector(".image-slider"));
