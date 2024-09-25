use qrcode::QrCode;
use image::{Luma, ImageBuffer};
use std::io::{self, Write};
use std::path::Path;

fn main() {
    // Demande à l'utilisateur de saisir un lien
    let mut url = String::new();
    print!("Entrez le lien à encoder dans le QR code: ");
    io::stdout().flush().unwrap();
    io::stdin().read_line(&mut url).unwrap();
    let url = url.trim();

    // Demande à l'utilisateur de saisir un nom de fichier
    let mut file_name = String::new();
    print!("Entrez le nom du fichier (sans extension) pour sauvegarder le QR code: ");
    io::stdout().flush().unwrap();
    io::stdin().read_line(&mut file_name).unwrap();
    let file_name = format!("{}.png", file_name.trim());

    // Génère le QR code à partir du lien
    let code = QrCode::new(url).unwrap();
    
    // Taille du QR code
    let image_size = code.width();
    let mut image = ImageBuffer::new(image_size as u32, image_size as u32);

    for y in 0..image_size {
        for x in 0..image_size {
            // Vérifie si le module est noir (Dark) ou blanc (Light)
            let pixel = if code[(x, y)] == qrcode::types::Color::Dark {
                Luma([0u8])  // Noir
            } else {
                Luma([255u8])  // Blanc
            };
            image.put_pixel(x as u32, y as u32, pixel);
        }
    }

    // Sauvegarde l'image en PNG
    image.save(Path::new(&file_name)).unwrap();

    println!("QR code généré et sauvegardé sous le nom '{}'", file_name);
}
