# generate_pwa_icons.py
import os

from PIL import Image


def generate_icons(source_image, output_dir="static/pwa/icons"):
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    with Image.open(source_image) as img:
        for size in sizes:
            resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
            resized_img.save(f"{output_dir}/icon-{size}x{size}.png", "PNG")

    print(f"✅ Icônes générées dans {output_dir}")


if __name__ == "__main__":
    generate_icons("/Users/macbookpro/Desktop/ulinka.jpeg")
