"""Convert white-background logos to transparent PNGs (white -> alpha).

Some icons in the source set are JPEGs or flat PNGs with an opaque white
background. Placed on the dark hero they render as pale squares, so this
estimates per-pixel coverage against the known white backdrop and
un-premultiplies to recover the original colour.

Run with:  python -I scripts/white_to_alpha.py <src.png> <dst.png>
"""
import sys
from PIL import Image


def white_to_alpha(src: str, dst: str, near_white: int = 248) -> None:
    im = Image.open(src).convert("RGBA")
    px = im.load()
    w, h = im.size

    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            lo = min(r, g, b)

            # Fully opaque region: no white contribution at all.
            if lo >= near_white:
                px[x, y] = (255, 255, 255, 0)
                continue

            # Coverage of the original colour: how far the pixel sits from
            # pure white, normalised. Clamped so noise can't exceed full alpha.
            a = 255 - lo
            if a <= 0:
                px[x, y] = (255, 255, 255, 0)
                continue

            # Un-premultiply: P = a*C + (1-a)*W  ->  C = (P - (1-a)*W) / a
            inv = 255 - a
            nr = max(0, min(255, round((r * 255 - inv * 255) / a)))
            ng = max(0, min(255, round((g * 255 - inv * 255) / a)))
            nb = max(0, min(255, round((b * 255 - inv * 255) / a)))
            px[x, y] = (nr, ng, nb, a)

    im.save(dst, "PNG")
    print(f"{src} -> {dst}  {w}x{h}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit("usage: white_to_alpha.py <src> <dst>")
    white_to_alpha(sys.argv[1], sys.argv[2])
