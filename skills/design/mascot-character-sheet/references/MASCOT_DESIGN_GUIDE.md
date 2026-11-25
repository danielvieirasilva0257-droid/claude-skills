# Product Mascot Design Guide

Comprehensive guidelines for creating effective, consistent product mascots optimized for character sheets.

## Character Design Principles

### 1. Simplicity and Recognizability

**Key Rule:** A good mascot should be recognizable from a silhouette alone.

**Guidelines:**
- Use distinctive shapes (round, angular, tall, squat)
- Limit detail complexity - fewer elements = stronger recognition
- Ensure key features are visible at small sizes (32px icons)
- Test readability: Can you identify the character at 100px width?

**Examples:**
- ✅ Round penguin with chef hat - distinctive silhouette
- ✅ Tall giraffe with white coat - clear profession indicator
- ❌ Generic dog with no distinguishing features

### 2. Personality Through Design

**Visual Personality Indicators:**

**Friendly/Approachable:**
- Rounded shapes
- Soft curves
- Open posture (arms out, not crossed)
- Large, expressive eyes
- Warm color palette (oranges, yellows, soft blues)

**Professional/Trustworthy:**
- Balanced proportions
- Clear, clean lines
- Appropriate attire (uniform, coat, accessories)
- Confident posture
- Cool or neutral color palette

**Playful/Energetic:**
- Dynamic angles
- Exaggerated features
- Bright, saturated colors
- Active poses
- Asymmetric elements for movement

**Calm/Reassuring:**
- Symmetrical design
- Gentle curves
- Neutral expressions in rest state
- Soothing color palette (pastels, earth tones)
- Stable, grounded posture

### 3. Brand Alignment

**Color Strategy:**
- **Primary brand color:** Use for 60-70% of character
- **Secondary brand color:** 20-30% for accents or clothing
- **Neutral color:** 10% for outlines, details, or balance

**Product Context:**
- **Tech products:** Clean lines, modern shapes, tech accessories (tablets, headphones)
- **Food brands:** Round, friendly shapes, food-related props
- **Healthcare:** Clean, professional appearance, appropriate tools/accessories
- **Children's products:** Bright colors, exaggerated features, playful proportions
- **B2B services:** Professional attire, confident posture, minimal playfulness

## Character Sheet Best Practices

### Consistency Across Views

**Maintaining Proportions:**
1. **Establish a proportion guide** before generating:
   - Head to body ratio (1:2, 1:3, etc.)
   - Limb lengths relative to body
   - Feature sizes (eyes, ears, accessories)

2. **Use reference points:**
   - Mark key proportion points (shoulder width, hip width)
   - Keep feature placement consistent (eye height, ear position)

3. **Cross-check between views:**
   - Front view width should match left/right view depth
   - Height consistent across all four orthographic views (front, back, left, right)
   - Props/accessories same size in all views

**Color Consistency:**
- Use exact hex codes or RGB values
- Specify in prompt: "Sunny yellow (#FFD700), Chocolate brown (#8B4513)"
- Avoid terms like "light blue" - use "Sky blue (#87CEEB)"

### The 5 Emotion Poses

**Purpose of Each Emotion:**

1. **HAPPY - Excitement/Success**
   - Use for: Achievements, positive outcomes, celebrations
   - Visual cues: Wide smile, raised arms, sparkles/stars around
   - Example pose: "Big grin, winking, tablet raised victoriously"

2. **FRIENDLY - Welcoming/Greeting**
   - Use for: First impressions, introductions, customer service
   - Visual cues: Wave, open arms, warm eye contact
   - Example pose: "Welcoming wave with one hand, warm smile, slight lean forward"

3. **EXPLAINING - Communication/Teaching**
   - Use for: Instructions, information sharing, demonstrations
   - Visual cues: Pointing, showing object, engaged expression
   - Example pose: "Showing tablet screen forward, one finger pointing, focused look"

4. **REASSURING - Comfort/Support**
   - Use for: Problem-solving, customer support, calm situations
   - Visual cues: Gentle smile, calm posture, thumbs up
   - Example pose: "Gentle closed-eye smile, one hand on heart, peaceful stance"

5. **CELEBRATING - Achievement/Joy**
   - Use for: Success stories, milestones, victories
   - Visual cues: Both arms raised, excited face, confetti
   - Example pose: "Both arms up in V-shape, huge smile, confetti floating around"

**Pose Design Tips:**
- Make each pose functionally different (not just expression changes)
- Use full-body language, not just facial expressions
- Consider how props/accessories change in each pose
- Ensure poses work at small sizes (64px)

### Typography: Libre Baskerville

**Font Characteristics:**
- **Classification:** Transitional serif
- **Style:** Professional, readable, classical
- **Best for:** Labels, documentation, professional contexts
- **Not ideal for:** Playful children's brands (consider Comic Sans or rounded sans-serif alternatives)

**Usage Guidelines:**
- Specify in prompt: "Libre Baskerville font for all panel labels"
- Label placement:
  - Above panels: Best for tall layouts
  - Below panels: Best for horizontal layouts
  - Corner labels: Use for minimal designs
- Keep labels concise: "FRONT", "ISOMETRIC", "HAPPY" (single words)
- Use uppercase for consistency and readability

**Alternative Fonts by Context:**
- **Playful/Children:** Fredoka One, Baloo, Comic Neue
- **Modern/Tech:** Inter, Roboto, Work Sans
- **Elegant/Luxury:** Playfair Display, Cormorant, Crimson Text

## Art Style Specifications

### Flat Vector Style

**When to use:**
- Logos and icons
- Scalable brand assets
- Modern, minimalist brands
- Digital-first products

**Characteristics:**
- NO gradients or shading
- Solid, flat colors only
- Bold outlines (3-5px)
- Geometric, simplified shapes
- Clean, sharp edges

**Prompt Keywords:**
```
"Flat vector illustration with NO gradients. Solid colors only.
Bold 4px black outlines. Geometric simplified shapes."
```

### Cel-Shaded Style

**When to use:**
- Playful brands
- Gaming/entertainment
- Cartoon aesthetic
- Character-driven marketing

**Characteristics:**
- Limited shading (2-3 tones per color)
- Bold outlines (2-3px)
- Some depth without full rendering
- Anime/cartoon influence

**Prompt Keywords:**
```
"Cel-shaded cartoon style. Limited shading with 2-3 tones per color.
Bold 3px outlines. Some depth and dimension."
```

### Illustrated Style

**When to use:**
- Premium products
- Detailed storytelling
- Editorial content
- Character-rich campaigns

**Characteristics:**
- Full shading and textures
- Refined, variable outlines
- Anatomical detail
- Rich color variations

**Prompt Keywords:**
```
"Detailed character illustration. Subtle shading and textures.
Refined outlines. Full character depth and dimension."
```

## Common Pitfalls and Solutions

### Problem: Inconsistent proportions between views

**Solution:**
- Generate isometric view first as the "reference truth"
- In subsequent prompts, reference the isometric view
- Use specific measurements: "Head is 1/3 of total height"
- Generate all views in a single prompt for consistency

### Problem: Emotions too subtle

**Solution:**
- Exaggerate facial expressions (larger smiles, wider eyes)
- Use full-body language, not just face
- Add motion lines, sparkles, or effects
- Test at small size (64px) - if you can't tell, make it bigger

### Problem: Character too complex for small sizes

**Solution:**
- Simplify details - remove unnecessary elements
- Increase outline thickness
- Use high contrast between elements
- Limit color palette to 3-4 main colors

### Problem: Layout not matching specification

**Solution:**
- Add explicit percentage widths in prompt
- Use clear section dividers in prompt formatting
- Try pro model (gemini-3-pro-image-preview) for better instruction following
- Generate individual panels separately and compose manually

## Brand Context Guidelines

### B2C (Consumer Products)

**Characteristics:**
- Friendly, approachable
- Bright, saturated colors
- Playful proportions (big heads, small bodies)
- Emotional expressiveness
- Relatable accessories

**Example Contexts:**
- Food delivery apps
- Consumer electronics
- Entertainment services
- Retail brands

### B2B (Business Products)

**Characteristics:**
- Professional appearance
- Muted, sophisticated colors
- Realistic proportions
- Subtle expressions
- Business-appropriate attire

**Example Contexts:**
- SaaS products
- Productivity tools
- Business services
- Enterprise software

### Healthcare/Medical

**Characteristics:**
- Clean, trustworthy appearance
- Medical attire (coat, scrubs, stethoscope)
- Calming colors (blues, greens, whites)
- Gentle, reassuring expressions
- Professional yet approachable

**Special Considerations:**
- Must convey competence and trust
- Avoid overly playful (except pediatric)
- Cultural sensitivity important
- Accessibility considerations (colorblind-safe)

### Children's Products

**Characteristics:**
- Highly simplified shapes
- Maximum expressiveness
- Bright, primary colors
- Exaggerated proportions
- Safety-conscious (no sharp elements in design)

**Special Considerations:**
- Age-appropriate design
- Gender-neutral when possible
- Educational value
- Parent approval alongside child appeal

## Prompting Strategies

### For Better Consistency

**Technique 1: Detailed Color Specifications**
```
❌ "Blue and yellow"
✅ "Electric blue (#0066FF) and Sunshine yellow (#FFD700)"
```

**Technique 2: Proportional References**
```
❌ "Small robot"
✅ "Compact robot with body 2x height of head, stubby arms at shoulder level"
```

**Technique 3: Feature Inventory**
```
List all features explicitly:
- Round head with antenna
- Two expressive LED eyes
- Rectangular body with screen
- Two hinged arms
- Wheeled base (no legs)
- Holds tablet in right hand
```

### For Better Poses

**Use Action Verbs:**
```
❌ "Happy emotion"
✅ "Jumping with joy, both arms raised in V-shape, confetti falling"
```

**Specify Hand/Arm Positions:**
```
❌ "Waving"
✅ "Right arm raised at 45-degree angle, hand open in friendly wave"
```

## Testing Your Mascot

### Checklist Before Finalizing:

- [ ] **Recognizable at 32px?** Test icon size
- [ ] **Consistent across all views?** Check proportions
- [ ] **Emotions clearly distinct?** Show to someone unfamiliar
- [ ] **Brand colors accurate?** Compare hex codes
- [ ] **Works in grayscale?** Ensure shape/contrast clarity
- [ ] **Scales to different sizes?** Test at 64px, 256px, 1024px
- [ ] **Culturally appropriate?** Check for unintended meanings
- [ ] **Accessible?** Colorblind-friendly palette

### A/B Testing Considerations:

- Test multiple emotion sets
- Try different art styles
- Vary proportions (chibi vs realistic)
- Test with target audience
- Measure emotional response (warmth, trust, excitement)

## Resources

**Further Reading:**
- Brand mascot case studies
- Character design principles
- Color psychology for brands
- Typography in branding

**Tools:**
- Coolors.co - Color palette generator
- ColorBlindSafe - Accessibility checker
- Google Fonts - Libre Baskerville and alternatives
