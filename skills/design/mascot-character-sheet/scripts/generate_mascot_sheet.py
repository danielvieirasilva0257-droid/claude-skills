#!/usr/bin/env python3
"""
Generate optimized prompts for mascot character sheets.

This script creates prompts for the specific magazine-style layout:
- Left: Isometric view (40% width, full height)
- Right top: Front, back, side views
- Right bottom: 5 emotion poses

Usage:
    python generate_mascot_sheet.py --character "friendly penguin" --style "flat vector" --colors "blue, white, pink"
"""

import argparse
import sys


def generate_prompt(
    character: str,
    style: str = "Flat vector",
    colors: str = "",
    brand: str = "",
    additional_details: str = "",
) -> str:
    """Generate an optimized character sheet prompt.

    Args:
        character: Character description (e.g., "friendly penguin mascot")
        style: Art style (flat vector, cel-shaded, illustrated)
        colors: Comma-separated color list
        brand: Brand/product context
        additional_details: Any additional specifications

    Returns:
        Optimized prompt string
    """

    # Parse colors
    color_list = [c.strip() for c in colors.split(",") if c.strip()]
    if len(color_list) >= 3:
        primary, secondary, accent = color_list[0], color_list[1], color_list[2]
    elif len(color_list) == 2:
        primary, secondary, accent = color_list[0], color_list[1], color_list[0]
    elif len(color_list) == 1:
        primary, secondary, accent = color_list[0], color_list[0], color_list[0]
    else:
        primary, secondary, accent = "Primary", "Secondary", "Accent"

    # Determine style details
    style_specs = {
        "flat vector": "Flat vector with NO gradients\n  - Bold 3-4px black outlines\n  - Solid colors only\n  - Geometric, simplified shapes",
        "cel-shaded": "Cel-shaded with limited shading\n  - Bold 2-3px outlines\n  - 2-3 tones per color\n  - Some depth without complexity",
        "illustrated": "Detailed illustration\n  - Subtle shading and textures\n  - Refined outlines\n  - Character depth and dimension",
    }
    style_key = style.lower()
    style_detail = style_specs.get(style_key, style_specs["flat vector"])

    brand_context = f" for {brand} mascot" if brand else " mascot"

    prompt = f"""Professional product mascot character reference sheet. {style} illustration.

CHARACTER: {character}{additional_details}

LAYOUT - Magazine-style character sheet on white background with subtle polka dots:

LEFT SECTION (40% width, full height):
Large ISOMETRIC VIEW (3/4 angle) - main character showcase

RIGHT SECTION (60% width, split into two rows):
TOP ROW: Four orthographic views
  - FRONT view | BACK view | LEFT view | RIGHT view (equal sizes)

BOTTOM ROW: Five emotion poses
  - HAPPY (big smile, energetic pose)
  - FRIENDLY (welcoming gesture, warm expression)
  - EXPLAINING (showing/demonstrating something)
  - REASSURING (gentle, calm pose)
  - CELEBRATING (victory/success pose, excited)

STYLE: {style_detail}
  - Color palette: {primary}, {secondary}, {accent}

TYPOGRAPHY: Libre Baskerville font for all panel labels
  - Clean, professional label placement
  - Labels positioned below each panel

BACKGROUND: Clean white with subtle polka dots

Professional character design reference{brand_context}."""

    return prompt


def main():
    parser = argparse.ArgumentParser(
        description="Generate optimized mascot character sheet prompts",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )

    parser.add_argument(
        "--character", "-c",
        required=True,
        help="Character description (e.g., 'friendly penguin wearing a chef hat')"
    )

    parser.add_argument(
        "--style", "-s",
        default="flat vector",
        choices=["flat vector", "cel-shaded", "illustrated"],
        help="Art style (default: flat vector)"
    )

    parser.add_argument(
        "--colors",
        default="",
        help="Comma-separated color list (e.g., 'blue, white, pink')"
    )

    parser.add_argument(
        "--brand", "-b",
        default="",
        help="Brand/product context (e.g., 'ice cream shop')"
    )

    parser.add_argument(
        "--details", "-d",
        default="",
        help="Additional character details"
    )

    parser.add_argument(
        "--output", "-o",
        help="Output file to save prompt (optional, prints to stdout by default)"
    )

    args = parser.parse_args()

    # Generate the prompt
    prompt = generate_prompt(
        character=args.character,
        style=args.style,
        colors=args.colors,
        brand=args.brand,
        additional_details=args.details
    )

    # Output
    if args.output:
        with open(args.output, 'w') as f:
            f.write(prompt)
        print(f"Prompt saved to: {args.output}")
    else:
        print(prompt)

    print("\n" + "="*60, file=sys.stderr)
    print("NEXT STEPS:", file=sys.stderr)
    print("1. Copy the prompt above", file=sys.stderr)
    print("2. Use with gemini-imagegen:", file=sys.stderr)
    print(f"   python .claude/skills/_branding/gemini-imagegen/scripts/generate_image.py \\", file=sys.stderr)
    print(f'     "YOUR_PROMPT" output.png --aspect 16:9', file=sys.stderr)
    print("3. Or paste directly at: https://gemini.google.com", file=sys.stderr)
    print("="*60, file=sys.stderr)


if __name__ == "__main__":
    main()
