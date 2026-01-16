from PIL import Image
import sys

def remove_white_background(input_path, output_path, threshold=240):
    """Remove white/light background from image"""
    # Open image
    img = Image.open(input_path)
    img = img.convert("RGBA")

    # Get pixel data
    datas = img.getdata()

    new_data = []
    for item in datas:
        # Change all white/light gray pixels to transparent
        # If RGB values are all above threshold, make transparent
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            new_data.append((255, 255, 255, 0))  # Transparent
        else:
            new_data.append(item)

    # Update image data
    img.putdata(new_data)

    # Save as PNG with transparency
    img.save(output_path, "PNG")
    print(f"Saved transparent image to: {output_path}")

if __name__ == "__main__":
    input_file = r"C:\Users\tsaal\Desktop\ChatGPT Image Jan 16, 2026, 11_30_10 PM.png"
    output_file = r"C:\Users\tsaal\AppData\Local\Claude Code\Project 2 (AI BY SEA)\public\logo.png"

    try:
        remove_white_background(input_file, output_file)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
