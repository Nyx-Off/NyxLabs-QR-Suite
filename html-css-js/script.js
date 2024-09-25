document.getElementById('generate-btn').addEventListener('click', function() {
    let url = document.getElementById('url-input').value;
    if (url === "") {
        alert("Veuillez entrer une URL valide.");
        return;
    }

    // Générer le QR code
    let canvas = document.getElementById('qr-code');
    let qr = new QRious({
        element: canvas,
        value: url,
        size: 200,
        background: '#ffffff',
        foreground: '#121212'
    });

    // Afficher le bouton de téléchargement
    document.getElementById('download-btn').style.display = "inline-block";
});

// Télécharger le QR code
document.getElementById('download-btn').addEventListener('click', function() {
    let canvas = document.getElementById('qr-code');
    let image = canvas.toDataURL("image/png");

    // Demander le nom du fichier à l'utilisateur
    let filename = prompt("Entrez le nom du fichier :", "qrcode");
    if (!filename) return;

    let link = document.createElement('a');
    link.href = image;
    link.download = filename + ".png";
    link.click();
});

// Configuration des particules
particlesJS('particles-js', {
  "particles": {
    "number": {
      "value": 100,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#76ff03"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
    },
    "opacity": {
      "value": 0.5,
      "random": true
    },
    "size": {
      "value": 3,
      "random": true
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#76ff03",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 2,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "bounce",
      "bounce": true,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "retina_detect": true
});
