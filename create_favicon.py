from PIL import Image

# Load the original logo
logo_path = r"C:\Users\tsaal\AppData\Local\Claude Code\Project 2 (AI BY SEA)\public\images\ChatGPT Image Jan 16, 2026, 11_30_10 PM.png"
output_path = r"C:\Users\tsaal\AppData\Local\Claude Code\Project 2 (AI BY SEA)\src\app\favicon.ico"

# Open the logo
img = Image.open(logo_path)

# Convert to RGBA if not already
img = img.convert("RGBA")

# Create multiple sizes for the ICO file (standard favicon sizes)
# Using larger sizes will make it appear sharper
sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]

# Resize and save as ICO with multiple resolutions
img.save(output_path, format='ICO', sizes=sizes)

print(f"Created favicon with multiple sizes at: {output_path}")
