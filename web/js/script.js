// ============================================
// Configuration
// ============================================
const CONFIG = {
  particleCount: 50,
  messageTimeout: 3000,
  qrCodeSize: 256,
  qrCodeLevel: 'H'
};

const SELECTORS = {
  particlesContainer: '#particles',
  urlInput: '#url-input',
  generateBtn: '#generate-btn',
  downloadBtn: '#download-btn',
  qrcodeDiv: '#qrcode',
  errorMessage: '#error-message',
  successMessage: '#success-message'
};

// ============================================
// Gestion des particules
// ============================================
class ParticleGenerator {
  constructor(containerSelector) {
      this.container = document.querySelector(containerSelector);
  }

  create() {
      if (!this.container) return;

      for (let i = 0; i < CONFIG.particleCount; i++) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          particle.style.left = Math.random() * 100 + '%';
          particle.style.top = Math.random() * 100 + '%';
          particle.style.animationDelay = Math.random() * 6 + 's';
          particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
          this.container.appendChild(particle);
      }
  }
}

// ============================================
// Gestion des messages
// ============================================
class MessageManager {
  constructor(errorSelector, successSelector) {
      this.errorElement = document.querySelector(errorSelector);
      this.successElement = document.querySelector(successSelector);
      this.timeout = null;
  }

  clear() {
      this.errorElement.style.display = 'none';
      this.successElement.style.display = 'none';
      if (this.timeout) clearTimeout(this.timeout);
  }

  show(type, text) {
      this.clear();

      const element = type === 'error' ? this.errorElement : this.successElement;
      element.textContent = text;
      element.style.display = 'block';

      this.timeout = setTimeout(() => {
          element.style.display = 'none';
      }, CONFIG.messageTimeout);
  }

  error(text) {
      this.show('error', text);
  }

  success(text) {
      this.show('success', text);
  }
}

// ============================================
// Validation d'URL
// ============================================
class UrlValidator {
  static format(url) {
      const trimmed = url.trim();
      if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
          return 'https://' + trimmed;
      }
      return trimmed;
  }

  static isValid(url) {
      try {
          new URL(url);
          return true;
      } catch {
          return false;
      }
  }

  static validate(url) {
      if (!url.trim()) {
          return { valid: false, error: 'Veuillez entrer une URL valide.' };
      }

      const formatted = this.format(url);
      if (!this.isValid(formatted)) {
          return { valid: false, error: 'Format d\'URL invalide. Exemple: example.com' };
      }

      return { valid: true, url: formatted };
  }
}

// ============================================
// Gestion du QR Code
// ============================================
class QRCodeManager {
  constructor(containerSelector, downloadBtnSelector) {
      this.container = document.querySelector(containerSelector);
      this.downloadBtn = document.querySelector(downloadBtnSelector);
      this.currentQRCode = null;
  }

  generate(text) {
      try {
          this.clear();
          
          setTimeout(() => {
              this.currentQRCode = new QRCode(this.container, {
                  text: text,
                  width: CONFIG.qrCodeSize,
                  height: CONFIG.qrCodeSize,
                  colorDark: "#000000",
                  colorLight: "#ffffff",
                  correctLevel: QRCode.CorrectLevel[CONFIG.qrCodeLevel]
              });

              this.container.classList.add('show');
              this.downloadBtn.classList.remove('hidden');
          }, 100);

          return true;
      } catch (error) {
          console.error('Erreur QR Code:', error);
          return false;
      }
  }

  clear() {
      this.container.innerHTML = '';
      this.container.classList.remove('show');
      this.currentQRCode = null;
  }

  download(filename = 'qrcode') {
      const img = this.container.querySelector('img');

      if (!img) return false;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const imgObj = new Image();

      imgObj.onload = () => {
          canvas.width = imgObj.width;
          canvas.height = imgObj.height;
          ctx.drawImage(imgObj, 0, 0);

          canvas.toBlob((blob) => {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${filename}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
          });
      };

      imgObj.src = img.src;
      return true;
  }
}

// ============================================
// Application principale
// ============================================
class QRCodeApp {
  constructor() {
      this.particles = new ParticleGenerator(SELECTORS.particlesContainer);
      this.messages = new MessageManager(SELECTORS.errorMessage, SELECTORS.successMessage);
      this.qrCodeManager = new QRCodeManager(SELECTORS.qrcodeDiv, SELECTORS.downloadBtn);
      
      this.urlInput = document.querySelector(SELECTORS.urlInput);
      this.generateBtn = document.querySelector(SELECTORS.generateBtn);
      this.downloadBtn = document.querySelector(SELECTORS.downloadBtn);

      this.init();
  }

  init() {
      this.particles.create();
      this.attachEventListeners();
  }

  attachEventListeners() {
      this.generateBtn.addEventListener('click', () => this.handleGenerate());
      this.urlInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') this.handleGenerate();
      });
      this.downloadBtn.addEventListener('click', () => this.handleDownload());
  }

  handleGenerate() {
      const inputValue = this.urlInput.value;
      const validation = UrlValidator.validate(inputValue);

      if (!validation.valid) {
          this.messages.error(validation.error);
          return;
      }

      if (this.qrCodeManager.generate(validation.url)) {
          this.messages.success('QR Code généré avec succès !');
      } else {
          this.messages.error('Erreur lors de la génération du QR Code.');
      }
  }

  handleDownload() {
      const filename = prompt("Entrez le nom du fichier :", "qrcode") || "qrcode";

      if (this.qrCodeManager.download(filename)) {
          this.messages.success('QR Code téléchargé !');
      } else {
          this.messages.error('Aucun QR Code à télécharger.');
      }
  }
}

// ============================================
// Initialisation
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  new QRCodeApp();
});