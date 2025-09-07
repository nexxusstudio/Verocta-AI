#!/usr/bin/env python3
"""
VeroctaAI Logo Creator
Creates the official VeroctaAI logo for PDF reports and branding
"""

import os
from PIL import Image, ImageDraw, ImageFont
import logging

def create_verocta_logo(output_path="static/assets/images/verocta-logo.png", size=(400, 200)):
    """Create the official VeroctaAI logo"""
    try:
        # Create image with transparent background
        img = Image.new('RGBA', size, (255, 255, 255, 0))
        draw = ImageDraw.Draw(img)
        
        # VeroctaAI brand colors
        primary_blue = '#2E86AB'
        accent_orange = '#F18F01'
        
        # Draw logo elements
        # Background gradient effect (simplified)
        for i in range(size[1]):
            alpha = int(255 * (1 - i / size[1]) * 0.1)
            color = (*tuple(int(primary_blue[1:][j:j+2], 16) for j in (0, 2, 4)), alpha)
            draw.line([(0, i), (size[0], i)], fill=color)
        
        # Draw the "V" symbol
        v_points = [
            (50, 50),
            (100, 150),
            (150, 50)
        ]
        draw.polygon(v_points, fill=primary_blue)
        
        # Add text (simplified - using default font)
        try:
            # Try to use a nice font if available
            font_large = ImageFont.truetype("Arial", 36)
            font_small = ImageFont.truetype("Arial", 18)
        except:
            # Fallback to default font
            font_large = ImageFont.load_default()
            font_small = ImageFont.load_default()
        
        # Draw "VEROCTA" text
        text_bbox = draw.textbbox((0, 0), "VEROCTA", font=font_large)
        text_width = text_bbox[2] - text_bbox[0]
        text_x = (size[0] - text_width) // 2 + 20
        draw.text((text_x, 80), "VEROCTA", fill=primary_blue, font=font_large)
        
        # Draw "AI" text in accent color
        ai_bbox = draw.textbbox((0, 0), "AI", font=font_large)
        ai_width = ai_bbox[2] - ai_bbox[0]
        ai_x = text_x + text_width
        draw.text((ai_x, 80), "AI", fill=accent_orange, font=font_large)
        
        # Draw tagline
        tagline = "Financial Intelligence Platform"
        tagline_bbox = draw.textbbox((0, 0), tagline, font=font_small)
        tagline_width = tagline_bbox[2] - tagline_bbox[0]
        tagline_x = (size[0] - tagline_width) // 2
        draw.text((tagline_x, 130), tagline, fill=primary_blue, font=font_small)
        
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Save logo
        img.save(output_path, 'PNG')
        logging.info(f"VeroctaAI logo created successfully: {output_path}")
        return output_path
        
    except Exception as e:
        logging.error(f"Error creating logo: {str(e)}")
        return None

def create_simple_text_logo(output_path="static/assets/images/verocta-text-logo.png", size=(300, 100)):
    """Create a simple text-based logo"""
    try:
        # Create white background image
        img = Image.new('RGB', size, 'white')
        draw = ImageDraw.Draw(img)
        
        # Colors
        primary_blue = '#2E86AB'
        accent_orange = '#F18F01'
        
        try:
            font = ImageFont.truetype("Arial", 24)
        except:
            font = ImageFont.load_default()
        
        # Draw text
        text = "VeroctaAI"
        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
        
        x = (size[0] - text_width) // 2
        y = (size[1] - text_height) // 2
        
        # Draw "Verocta" in blue
        verocta_bbox = draw.textbbox((0, 0), "Verocta", font=font)
        verocta_width = verocta_bbox[2] - verocta_bbox[0]
        draw.text((x, y), "Verocta", fill=primary_blue, font=font)
        
        # Draw "AI" in orange
        draw.text((x + verocta_width, y), "AI", fill=accent_orange, font=font)
        
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Save logo
        img.save(output_path, 'PNG')
        logging.info(f"Simple text logo created: {output_path}")
        return output_path
        
    except Exception as e:
        logging.error(f"Error creating simple logo: {str(e)}")
        return None

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    
    # Create logos
    print("Creating VeroctaAI logos...")
    
    logo_path = create_verocta_logo()
    if logo_path:
        print(f"✅ Main logo created: {logo_path}")
    
    text_logo_path = create_simple_text_logo()
    if text_logo_path:
        print(f"✅ Text logo created: {text_logo_path}")
    
    print("Logo creation complete!")
