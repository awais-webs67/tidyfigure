<?php
// Will It Fit? Furniture Door Calculator: page content and settings. tool.html is the tool's markup and tool.js its script.
return [
  'name' => 'Will It Fit? Furniture Door Calculator',
  'category' => 'life',
  'order' => 5,
  'icon' => 'sofa',
  'short' => 'Check if a sofa, bed or wardrobe fits through a door and around a hallway corner.',
  'title' => 'Will It Fit Through the Door? Furniture Fit Calculator',
  'description' => <<<'EOT_TF'
Check if a sofa, bed, wardrobe or fridge will fit through a door and around a hallway corner before you buy. Shows which way to carry it. Free.
EOT_TF,
  'related' => ['decision-matrix', 'rent-split-calculator', 'baking-pan-converter'],
  'answer' => <<<'EOT_TF'
A piece of furniture fits through a door if <strong>two of its three measurements fit inside the door opening</strong>; the third one simply goes through. A sofa is usually carried on its side or end so its depth and height face the doorway. Hallway corners are harder: the turn limits how long the piece can be, which this calculator works out for you.
EOT_TF,
  'article' => <<<'EOT_TF'

<h2>How to tell if furniture will fit through a door</h2>
<p>Every piece of furniture has three measurements: width, depth and height. When you carry it through a doorway, one of those measurements goes <em>through</em> the door, and the other two have to fit <em>inside</em> the opening. So the question is never "is the sofa narrower than the door?" but "is there a way to turn it so its two smaller sides fit the door's width and height?"</p>
<p>The calculator tries all three ways of carrying the piece and picks the one with the most room to spare. If nothing fits straight on, it checks whether tilting the piece diagonally inside the frame would work, which uses the door's diagonal like a removal crew does.</p>

<h2>What to measure</h2>
<ul>
<li><strong>Furniture width:</strong> the widest point side to side, usually across the arms.</li>
<li><strong>Furniture depth:</strong> the widest point front to back, including cushions.</li>
<li><strong>Furniture height:</strong> from the floor to the highest point, including legs.</li>
<li><strong>Door width:</strong> inside the frame with the door fully open. A door that only opens to 90° can lose a few centimetres to its own thickness and the hinges.</li>
<li><strong>Door height:</strong> from the floor (or threshold) to the top of the frame.</li>
<li><strong>Hallway widths:</strong> wall to wall, at the narrowest point, before and after the turn.</li>
</ul>

<h2>The maths behind the hallway corner</h2>
<p>Getting around a 90° corner is the classic "moving sofa" problem. When you carry a long object around a corner, at the tightest moment it touches the outside walls at both ends and the inside corner in the middle. The longest object of width <em>w</em> that can make the turn between hallways of widths <em>A</em> and <em>B</em> is:</p>
<div class="formula">Max length = minimum over angle θ of
             A ÷ cos θ + B ÷ sin θ − w ÷ (sin θ × cos θ)</div>
<p>For a thin pole between two hallways 1 metre wide, the answer is about 2.83 metres. A bulky sofa that is 75 cm deep can only make the same turn if it is about 1.33 metres long, unless you stand it on its end so a narrower side faces the walls. The calculator tries every position whose height fits under the ceiling.</p>

<h2>Worked example</h2>
<p>A sofa is 84 × 35 × 30 inches. The front door opening is 32 × 80 inches. Carrying it with the 84-inch width first leaves a 35 × 30 inch profile facing the door, which fits with 2 inches to spare. In a hallway that is 42 inches wide before a right-angle turn and 36 inches after it, the sofa won't turn while upright, but stood on its end (84 inches is less than the 96-inch ceiling) its 35 × 30 inch footprint makes the turn easily.</p>

<h2>If it doesn't fit</h2>
<ul>
<li><strong>Remove the legs.</strong> Most sofa and bed legs unscrew and can save several centimetres of height.</li>
<li><strong>Take the door off its hinges</strong> to gain the door's thickness.</li>
<li><strong>Remove cushions and back pillows.</strong> Many sofas have detachable backs.</li>
<li><strong>Use a window or balcony</strong> for upper floors; removal companies hoist large items.</li>
<li><strong>Ask about modular or flat-pack versions</strong> before you buy.</li>
</ul>
<p>The calculator treats furniture as a box, which is a little cautious: a sofa with sloping arms or a curved back can sometimes be wiggled through gaps a box couldn't. If the result says "tight", measure again carefully before delivery day.</p>
EOT_TF,
  'faqs' => [
    [
      'Will a 36-inch-deep sofa fit through a 32-inch door?',
      <<<'EOT_TF'
Often yes. Depth is not the only measurement that matters. If the sofa’s height is under 32 inches, you can turn it on its back or side so the height goes across the doorway and the depth goes up the door’s height. Enter all three measurements to check.
EOT_TF,
    ],
    [
      'How do you measure a sofa’s diagonal depth?',
      <<<'EOT_TF'
Diagonal depth is used for sofas with tall backs. This calculator doesn’t need it, because it checks every orientation and also tests tilting the piece diagonally through the frame.
EOT_TF,
    ],
    [
      'How wide is a standard door?',
      <<<'EOT_TF'
Interior doors are commonly 28–32 inches (about 70–80 cm) wide, and front doors 32–36 inches (about 80–90 cm). Always measure your own door with it fully open.
EOT_TF,
    ],
    [
      'Will a sofa fit around a corner in my hallway?',
      <<<'EOT_TF'
It depends on the width of both hallways and the size of the sofa’s footprint. The calculator finds the longest piece that can turn the corner in each carrying position and compares it with your furniture.
EOT_TF,
    ],
    [
      'Can I use this for beds, fridges and wardrobes?',
      <<<'EOT_TF'
Yes. It works for any box-shaped item. For a fridge or wardrobe, standing it upright and turning it on its side are both checked.
EOT_TF,
    ],
  ],
];
