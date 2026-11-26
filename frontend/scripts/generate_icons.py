
from PIL import Image, ImageDraw
from pathlib import Path

PUBLIC = Path(__file__).resolve().parents[1] / "public"
OUTPUT = PUBLIC / "icons"

OUTPUT.mkdir(parents=True, exist_ok=True)


def generate_icon(size, filename):
    scale = 4
    resolution = size * scale

    image = Image.new(
        "RGB",
        (resolution, resolution),
        "#102e38"
    )

    draw = ImageDraw.Draw(image)

    def p(value):
        return round(value * resolution / 192)

    draw.rounded_rectangle(
        [p(25), p(25), p(167), p(167)],
        radius=p(33),
        fill="#148f85"
    )

    points = [
        (45, 96),
        (70, 96),
        (83, 61),
        (103, 130),
        (119, 96),
        (148, 96)
    ]

    scaled_points = [
        (p(x), p(y)) for x, y in points
    ]

    width = p(9)

    draw.line(
        scaled_points,
        fill="white",
        width=width,
        joint="curve"
    )

    radius = width / 2

    for x, y in scaled_points:
        draw.ellipse(
            [
                x - radius,
                y - radius,
                x + radius,
                y + radius
            ],
            fill="white"
        )

    image = image.resize(
        (size, size),
        Image.Resampling.LANCZOS
    )

    image.save(OUTPUT / filename)

    print(f"Created: {filename}")


generate_icon(192, "icon-192.png")
generate_icon(512, "icon-512.png")
generate_icon(512, "maskable-512.png")
generate_icon(180, "apple-touch-icon.png")
generate_icon(32, "favicon-32.png")

print("All MedQueue HK icons generated.")
