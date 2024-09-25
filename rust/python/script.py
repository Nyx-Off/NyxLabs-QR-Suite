import qrcode

# Demande à l'utilisateur d'entrer le lien
url = input("Entrez le lien à encoder dans le QR code : ")

# Demande à l'utilisateur d'entrer le nom du fichier
file_name = input("Entrez le nom du fichier (sans extension) pour sauvegarder le QR code : ") + ".png"

# Création de l'objet QR code
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)

# Ajout du lien dans le QR code
qr.add_data(url)
qr.make(fit=True)

# Génération de l'image du QR code
img = qr.make_image(fill='black', back_color='white')

# Sauvegarde de l'image du QR code avec le nom donné par l'utilisateur
img.save(file_name)

print(f"QR code généré et sauvegardé sous le nom '{file_name}'")
