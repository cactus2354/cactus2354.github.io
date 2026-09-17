#!/usr/bin/env python3
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

SEED = 42
COUNT = 16
LONG_EDGE = 1200
JPEG_QUALITY = 82
OUT_DIR = Path(__file__).resolve().parent.parent / "photos"

ASPECT_RATIOS = [
    (4, 5),
    (3, 2),
    (1, 1),
    (16, 9),
    (2, 3),
]

TONE_PAIRS = [
    ((28, 24, 22), (8, 7, 6)),
    ((46, 32, 22), (10, 8, 6)),
    ((22, 28, 32), (6, 8, 10)),
    ((34, 30, 26), (12, 10, 8)),
    ((24, 24, 26), (7, 7, 8)),
]


def make_gradient(size, top, bottom):
    w, h = size
    base = Image.new("RGB", (1, h))
    for y in range(h):
        t = y / max(h - 1, 1)
        r = round(top[0] + (bottom[0] - top[0]) * t)
        g = round(top[1] + (bottom[1] - top[1]) * t)
        b = round(top[2] + (bottom[2] - top[2]) * t)
        base.putpixel((0, y), (r, g, b))
    return base.resize((w, h))


def add_grain(img, rng, amount=10):
    px = img.load()
    w, h = img.size
    for _ in range(int(w * h * 0.02)):
        x = rng.randrange(w)
        y = rng.randrange(h)
        r, g, b = px[x, y]
        delta = rng.randint(-amount, amount)
        px[x, y] = (
            max(0, min(255, r + delta)),
            max(0, min(255, g + delta)),
            max(0, min(255, b + delta)),
        )
    return img


def load_font(size):
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf",
    ]
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    rng = random.Random(SEED)

    for i in range(1, COUNT + 1):
        ratio = ASPECT_RATIOS[(i - 1) % len(ASPECT_RATIOS)]
        if ratio[0] >= ratio[1]:
            w = LONG_EDGE
            h = round(LONG_EDGE * ratio[1] / ratio[0])
        else:
            h = LONG_EDGE
            w = round(LONG_EDGE * ratio[0] / ratio[1])

        top, bottom = TONE_PAIRS[(i - 1) % len(TONE_PAIRS)]
        img = make_gradient((w, h), top, bottom)
        img = add_grain(img, rng)

        draw = ImageDraw.Draw(img)
        label = f"{i:02d}"
        font = load_font(max(18, w // 30))
        pad = max(16, w // 40)
        text_color = tuple(min(255, c + 40) for c in top)
        draw.text((pad, h - pad - font.size), label, font=font, fill=text_color)

        out_path = OUT_DIR / f"photo-{i:02d}.jpg"
        img.save(out_path, "JPEG", quality=JPEG_QUALITY)
        print(f"wrote {out_path} ({w}x{h})")


if __name__ == "__main__":
    main()
