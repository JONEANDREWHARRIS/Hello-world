#!/usr/bin/env python3
"""
Professional Tech Influencer Profile Photo Generator
=====================================================
Transforms a casual selfie into a professional-looking headshot with:
- Square 1:1 crop (Instagram-optimized)
- Dark gradient background replacement
- Cinematic color grading (cool shadows, warm highlights)
- Face sharpening with soft depth-of-field
- Subtle vignette
- Studio-quality lighting simulation

Usage:
    python3 generate_profile_photo.py input.jpg [output.jpg]
"""

import sys
import math
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw, ImageOps


def detect_face_region(img):
    """
    Estimate face region using skin-tone detection heuristic.
    Returns (center_x, center_y, face_width, face_height) or None.
    """
    width, height = img.size
    pixels = img.load()

    # Scan for skin-tone pixels to find face region
    skin_pixels_x = []
    skin_pixels_y = []

    step = max(1, min(width, height) // 150)  # Sample resolution

    for y in range(0, height, step):
        for x in range(0, width, step):
            r, g, b = pixels[x, y][:3]
            # Skin tone detection heuristic (works across skin tones)
            if (r > 60 and g > 40 and b > 20 and
                r > g and r > b and
                abs(r - g) > 10 and
                r - b > 15 and
                max(r, g, b) - min(r, g, b) > 15 and
                not (r > 220 and g > 210 and b > 200)):  # Exclude near-white
                skin_pixels_x.append(x)
                skin_pixels_y.append(y)

    if len(skin_pixels_x) < 20:
        return None

    # Find the cluster center (face tends to be the largest skin cluster)
    # Use median for robustness against outliers
    skin_pixels_x.sort()
    skin_pixels_y.sort()

    # Take the central 60% of skin pixels to focus on face area
    trim = len(skin_pixels_x) // 5
    if trim > 0:
        core_x = skin_pixels_x[trim:-trim]
        core_y = skin_pixels_y[trim:-trim]
    else:
        core_x = skin_pixels_x
        core_y = skin_pixels_y

    center_x = sum(core_x) // len(core_x)
    center_y = sum(core_y) // len(core_y)

    # Estimate face dimensions from skin pixel spread
    face_w = max(core_x) - min(core_x)
    face_h = max(core_y) - min(core_y)

    # Ensure reasonable face size
    face_w = max(face_w, width // 6)
    face_h = max(face_h, height // 5)

    return (center_x, center_y, face_w, face_h)


def create_dark_gradient_background(size, color_top=(18, 22, 36), color_bottom=(8, 10, 18)):
    """Create a smooth dark gradient background with subtle radial light."""
    w, h = size
    bg = Image.new('RGB', (w, h))
    pixels = bg.load()

    for y in range(h):
        t = y / h
        # Vertical gradient
        r = int(color_top[0] * (1 - t) + color_bottom[0] * t)
        g = int(color_top[1] * (1 - t) + color_bottom[1] * t)
        b = int(color_top[2] * (1 - t) + color_bottom[2] * t)
        for x in range(w):
            # Add subtle radial light from upper-left (key light simulation)
            dx = (x - w * 0.35) / w
            dy = (y - h * 0.3) / h
            dist = math.sqrt(dx * dx + dy * dy)
            radial = max(0, 1 - dist * 1.4)
            radial = radial * radial * 0.15  # Subtle intensity

            pr = min(255, int(r + radial * 60))
            pg = min(255, int(g + radial * 50))
            pb = min(255, int(b + radial * 40))
            pixels[x, y] = (pr, pg, pb)

    return bg


def create_subject_mask(img, face_region):
    """
    Create a mask to separate subject from background using
    luminance/color analysis relative to face region.
    """
    width, height = img.size
    pixels = img.load()
    cx, cy, fw, fh = face_region

    # Create a soft mask based on distance from face center and skin similarity
    mask = Image.new('L', (width, height), 0)
    mask_pixels = mask.load()

    # Sample face colors for reference
    face_colors = []
    sample_radius_x = fw // 3
    sample_radius_y = fh // 3
    for sy in range(max(0, cy - sample_radius_y), min(height, cy + sample_radius_y), 3):
        for sx in range(max(0, cx - sample_radius_x), min(width, cx + sample_radius_x), 3):
            face_colors.append(pixels[sx, sy][:3])

    if not face_colors:
        # Fallback: simple elliptical mask
        for y in range(height):
            for x in range(width):
                dx = (x - cx) / (fw * 1.2)
                dy = (y - cy) / (fh * 1.5)
                dist = math.sqrt(dx * dx + dy * dy)
                val = max(0, min(255, int(255 * (1 - dist))))
                mask_pixels[x, y] = val
        return mask.filter(ImageFilter.GaussianBlur(radius=20))

    avg_r = sum(c[0] for c in face_colors) // len(face_colors)
    avg_g = sum(c[1] for c in face_colors) // len(face_colors)
    avg_b = sum(c[2] for c in face_colors) // len(face_colors)

    # Body is typically below the face and within a certain x-range
    body_center_y = cy + fh
    body_width = fw * 2.5

    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y][:3]

            # Distance from face/body center axis
            dx_face = abs(x - cx) / (fw * 0.8)
            dy_face = (y - cy) / (fh * 0.8)

            # Check if pixel is in the face/head region
            head_dist = math.sqrt((dx_face ** 2) + (max(0, dy_face) ** 2 if dy_face < 0 else 0) + (min(0, dy_face + 0.5) ** 2))

            # Elliptical body region (wider, below face)
            dx_body = abs(x - cx) / (body_width * 0.5)
            dy_body = (y - body_center_y) / (fh * 2.5)
            body_dist = math.sqrt(dx_body ** 2 + dy_body ** 2)

            # Color similarity to face (for skin/clothing detection)
            color_diff = math.sqrt((r - avg_r) ** 2 + (g - avg_g) ** 2 + (b - avg_b) ** 2) / 441.0

            # Combine signals
            # Head region: tight ellipse around face
            head_score = max(0, 1 - max(0, math.sqrt(((x - cx) / (fw * 0.75)) ** 2 + ((y - (cy - fh * 0.15)) / (fh * 0.85)) ** 2)))

            # Upper body region: wider area below face
            body_score = 0
            if y > cy + fh * 0.2:
                body_x_dist = abs(x - cx) / (fw * 1.5)
                body_y_dist = max(0, (y - cy - fh * 0.2)) / (fh * 3.0)
                body_score = max(0, 1 - math.sqrt(body_x_dist ** 2 + body_y_dist ** 2))
                body_score *= 0.9

            # Hair region: above and around face
            hair_score = 0
            if y < cy + fh * 0.1:
                hair_x_dist = abs(x - cx) / (fw * 0.9)
                hair_y_dist = max(0, (cy - fh * 0.6 - y)) / (fh * 0.8)
                hair_score = max(0, 1 - math.sqrt(hair_x_dist ** 2 + hair_y_dist ** 2))
                hair_score *= 0.85

            score = max(head_score, body_score, hair_score)
            score = max(0, min(1, score))

            mask_pixels[x, y] = int(score * 255)

    # Smooth the mask edges
    mask = mask.filter(ImageFilter.GaussianBlur(radius=max(3, min(width, height) // 80)))

    # Strengthen the mask contrast for cleaner edges
    mask = ImageEnhance.Contrast(mask).enhance(1.8)
    mask = mask.filter(ImageFilter.GaussianBlur(radius=max(2, min(width, height) // 120)))

    return mask


def apply_cinematic_color_grading(img):
    """
    Apply cinematic color grading:
    - Cool (blue) shadows
    - Warm (amber) highlights
    - Lifted blacks, compressed whites
    - Slight teal-orange split tone
    """
    width, height = img.size
    pixels = img.load()
    result = img.copy()
    result_pixels = result.load()

    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y][:3]

            # Calculate luminance
            lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0

            # Lift blacks slightly (cinematic look)
            r = int(r + (15 * (1 - lum)))
            g = int(g + (12 * (1 - lum)))
            b = int(b + (20 * (1 - lum)))  # More blue in shadows

            # Warm highlights
            if lum > 0.5:
                highlight_strength = (lum - 0.5) * 2
                r = int(r + 10 * highlight_strength)  # Warm red
                g = int(g + 5 * highlight_strength)   # Slight warm
                b = int(b - 5 * highlight_strength)   # Reduce blue

            # Subtle teal in midtones
            if 0.2 < lum < 0.7:
                mid_strength = 1 - abs(lum - 0.45) / 0.25
                mid_strength = max(0, min(1, mid_strength))
                g = int(g + 3 * mid_strength)
                b = int(b + 5 * mid_strength)

            # Compress dynamic range slightly
            r = int(r * 0.95 + 8)
            g = int(g * 0.95 + 6)
            b = int(b * 0.95 + 8)

            result_pixels[x, y] = (
                max(0, min(255, r)),
                max(0, min(255, g)),
                max(0, min(255, b))
            )

    return result


def apply_studio_lighting(img, face_region):
    """
    Simulate soft studio key light from upper-left and subtle rim light.
    """
    width, height = img.size
    cx, cy, fw, fh = face_region

    # Create lighting overlay
    light = Image.new('RGB', (width, height), (0, 0, 0))
    light_pixels = light.load()

    for y in range(height):
        for x in range(width):
            # Key light: upper-left, warm
            kx = (x - width * 0.25) / width
            ky = (y - height * 0.15) / height
            key_dist = math.sqrt(kx * kx + ky * ky)
            key_intensity = max(0, 1 - key_dist * 1.2) ** 2

            # Rim light: right side, cool
            rx = (x - width * 0.85) / (width * 0.3)
            ry = (y - cy) / (fh * 2)
            rim_dist = math.sqrt(rx * rx + ry * ry)
            rim_intensity = max(0, 1 - rim_dist) ** 3

            # Key light is warm
            kr = int(key_intensity * 30)
            kg = int(key_intensity * 22)
            kb = int(key_intensity * 15)

            # Rim light is cool
            rr = int(rim_intensity * 10)
            rg = int(rim_intensity * 15)
            rb = int(rim_intensity * 25)

            light_pixels[x, y] = (kr + rr, kg + rg, kb + rb)

    # Blend lighting with original using Screen blend mode
    result = img.copy()
    result_pixels = result.load()
    img_pixels = img.load()

    for y in range(height):
        for x in range(width):
            ir, ig, ib = img_pixels[x, y][:3]
            lr, lg, lb = light_pixels[x, y]

            # Screen blend: 1 - (1-a)(1-b)
            nr = int(255 - (255 - ir) * (255 - lr) / 255)
            ng = int(255 - (255 - ig) * (255 - lg) / 255)
            nb = int(255 - (255 - ib) * (255 - lb) / 255)

            result_pixels[x, y] = (
                max(0, min(255, nr)),
                max(0, min(255, ng)),
                max(0, min(255, nb))
            )

    return result


def apply_vignette(img, strength=0.4):
    """Apply a subtle dark vignette around edges."""
    width, height = img.size
    result = img.copy()
    pixels = result.load()

    cx, cy = width / 2, height / 2
    max_dist = math.sqrt(cx * cx + cy * cy)

    for y in range(height):
        for x in range(width):
            dx = (x - cx) / cx
            dy = (y - cy) / cy
            dist = math.sqrt(dx * dx + dy * dy)

            # Smooth vignette falloff
            vignette = 1 - (dist * dist * strength * 0.5)
            vignette = max(0.3, min(1, vignette))

            r, g, b = pixels[x, y][:3]
            pixels[x, y] = (
                int(r * vignette),
                int(g * vignette),
                int(b * vignette)
            )

    return result


def smart_square_crop(img, face_region):
    """
    Crop to 1:1 square ratio, centered on face with good headroom.
    """
    width, height = img.size
    cx, cy, fw, fh = face_region

    # Target: face should be in upper-center third (portrait composition)
    crop_size = min(width, height)

    # Ensure face is nicely positioned (rule of thirds)
    # Face center should be at roughly 40% from top
    ideal_face_y = int(crop_size * 0.38)
    crop_top = cy - ideal_face_y
    crop_left = cx - crop_size // 2

    # Clamp to image bounds
    crop_left = max(0, min(width - crop_size, crop_left))
    crop_top = max(0, min(height - crop_size, crop_top))

    return img.crop((crop_left, crop_top, crop_left + crop_size, crop_top + crop_size))


def sharpen_face_area(img, face_region, img_size):
    """Apply selective sharpening to face area, soft blur elsewhere."""
    cx, cy, fw, fh = face_region
    width, height = img_size

    # Sharpen the whole image
    sharpened = img.filter(ImageFilter.UnsharpMask(radius=2, percent=120, threshold=3))

    # Create a soft background blur
    blurred = img.filter(ImageFilter.GaussianBlur(radius=3))

    # Create face-focused mask
    mask = Image.new('L', (width, height), 0)
    mask_pixels = mask.load()

    for y in range(height):
        for x in range(width):
            dx = (x - cx) / (fw * 0.9)
            dy = (y - cy) / (fh * 1.1)
            dist = math.sqrt(dx * dx + dy * dy)
            val = max(0, min(255, int(255 * max(0, 1 - dist * 0.8))))
            mask_pixels[x, y] = val

    mask = mask.filter(ImageFilter.GaussianBlur(radius=max(5, min(width, height) // 40)))

    # Composite: sharp face, slightly soft background
    result = Image.composite(sharpened, blurred, mask)
    return result


def process_photo(input_path, output_path, output_size=1080):
    """Main processing pipeline."""
    print(f"Loading image: {input_path}")
    img = Image.open(input_path).convert('RGB')
    width, height = img.size
    print(f"  Original size: {width}x{height}")

    # Step 1: Detect face
    print("Detecting face region...")
    face = detect_face_region(img)
    if face is None:
        print("  WARNING: Could not detect face, using center of image")
        face = (width // 2, height // 2, width // 4, height // 3)
    else:
        print(f"  Face detected at ({face[0]}, {face[1]}), size ~{face[2]}x{face[3]}")

    # Step 2: Smart square crop
    print("Cropping to square (1:1)...")
    img = smart_square_crop(img, face)
    sq_size = img.size[0]

    # Recalculate face position after crop
    old_cx, old_cy, fw, fh = face
    # Approximate new face position in cropped image
    new_cx = sq_size // 2
    new_cy = int(sq_size * 0.38)
    face = (new_cx, new_cy, fw, fh)
    print(f"  Cropped to {sq_size}x{sq_size}")

    # Step 3: Create background and composite
    print("Replacing background with dark gradient...")
    bg = create_dark_gradient_background(img.size)
    mask = create_subject_mask(img, face)
    composited = Image.composite(img, bg, mask)

    # Step 4: Apply studio lighting
    print("Applying studio lighting simulation...")
    composited = apply_studio_lighting(composited, face)

    # Step 5: Cinematic color grading
    print("Applying cinematic color grading...")
    composited = apply_cinematic_color_grading(composited)

    # Step 6: Selective sharpening
    print("Applying selective face sharpening...")
    composited = sharpen_face_area(composited, face, composited.size)

    # Step 7: Subtle contrast & saturation boost
    print("Fine-tuning contrast and saturation...")
    composited = ImageEnhance.Contrast(composited).enhance(1.12)
    composited = ImageEnhance.Color(composited).enhance(1.08)
    composited = ImageEnhance.Brightness(composited).enhance(1.03)

    # Step 8: Vignette
    print("Adding subtle vignette...")
    composited = apply_vignette(composited, strength=0.35)

    # Step 9: Resize to final output
    print(f"Resizing to {output_size}x{output_size}...")
    composited = composited.resize((output_size, output_size), Image.LANCZOS)

    # Step 10: Final subtle sharpen after resize
    composited = composited.filter(ImageFilter.UnsharpMask(radius=1, percent=40, threshold=2))

    # Save
    print(f"Saving to: {output_path}")
    composited.save(output_path, 'JPEG', quality=98, subsampling=0)
    print("Done! Professional profile photo generated successfully.")
    print(f"\nOutput: {output_path} ({output_size}x{output_size}, JPEG quality 98)")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 generate_profile_photo.py input.jpg [output.jpg]")
        print("\nThis script transforms a selfie into a professional tech influencer")
        print("profile photo optimized for Instagram.")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'profile_photo_professional.jpg'

    process_photo(input_file, output_file)
