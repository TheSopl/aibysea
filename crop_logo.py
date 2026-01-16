from PIL import Image, ImageChops

def trim_whitespace(image):
    """Remove whitespace/padding from around the image"""
    # Convert to RGBA if needed
    if image.mode != 'RGBA':
        image = image.convert('RGBA')

    # Get the bounding box of non-transparent/non-white pixels
    bg = Image.new(image.mode, image.size, (255, 255, 255, 0))
    diff = ImageChops.difference(image, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()

    if bbox:
        return image.crop(bbox)
    return image

# Load the original logo
logo_path = r"C:\Users\tsaal\AppData\Local\Claude Code\Project 2 (AI BY SEA)\public\images\ChatGPT Image Jan 16, 2026, 11_30_10 PM.png"
output_favicon = r"C:\Users\tsaal\AppData\Local\Claude Code\Project 2 (AI BY SEA)\src\app\favicon.ico"
output_apple = r"C:\Users\tsaal\AppData\Local\Claude Code\Project 2 (AI BY SEA)\src\app\apple-icon.png"

# Open and crop the logo
img = Image.open(logo_path)
img = img.convert("RGBA")

# Trim whitespace
cropped = trim_whitespace(img)

# Add a small margin (5% padding) so it doesn't touch edges
width, height = cropped.size
margin = int(min(width, height) * 0.05)
new_size = (width + margin * 2, height + margin * 2)
padded = Image.new('RGBA', new_size, (255, 255, 255, 0))
padded.paste(cropped, (margin, margin))

# Create favicon with multiple sizes
sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
padded.save(output_favicon, format='ICO', sizes=sizes)

# Save as PNG for apple-icon
padded.save(output_apple, format='PNG')

print(f"Cropped logo and created favicon at: {output_favicon}")
print(f"Created apple-icon at: {output_apple}")
print(f"Original size: {img.size}, Cropped size: {cropped.size}, Final size: {padded.size}")
