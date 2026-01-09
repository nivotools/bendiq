// Pro Tips - Detailed Q&A explanations for complex problems
export interface ProTip {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const proTipsData: ProTip[] = [
  // Offsets
  {
    id: "1",
    question: "Why does my offset always come up short?",
    answer: "The #1 reason is forgetting to add shrink. When you bend an offset, the pipe travels a longer distance through the angled section (the hypotenuse of the triangle). This 'shrinks' the apparent length. For a 30° offset, add 1/4\" to your starting mark for every inch of offset height. Example: 6\" offset = add 1.5\" shrink. Also verify you're using the correct multiplier and measuring from consistent reference points.",
    category: "Offsets"
  },
  {
    id: "2",
    question: "How do I choose the right offset angle?",
    answer: "Consider three factors: 1) Space available - tight spaces need larger angles (45-60°). 2) Wire pulling - smaller angles (10-22.5°) are easier on wires. 3) Appearance - 30° is the 'standard' look. Quick guide: Less than 4\" rise = 22.5° or 30°. 4-8\" rise = 30° or 45°. Over 8\" rise = consider 45° or segment bends. For parallel runs, always use the same angle on all pipes.",
    category: "Offsets"
  },
  {
    id: "3",
    question: "How do I prevent dog-legs in my offsets?",
    answer: "Dog-legs happen when the pipe rotates between bends. Prevention: 1) Keep the conduit pressed firmly against a flat surface (floor) throughout both bends. 2) Keep your bender handle moving in a single vertical plane. 3) Don't let the pipe rock or shift while bending. 4) Make both bends in quick succession while the pipe position is fresh. To fix a minor dog-leg: lay the pipe flat, identify the twisted section, and use channel locks or the bender handle to torque it back into plane.",
    category: "Offsets"
  },
  {
    id: "4",
    question: "What's the secret to perfect rolling offsets?",
    answer: "A rolling offset goes both up/down AND left/right simultaneously. The key is treating it as a single diagonal movement. Formula: True Rise = √(Vertical Rise² + Horizontal Roll²). Then use your chosen angle's multiplier on this true rise. Example: 4\" up and 3\" over: True Rise = √(16+9) = 5\". At 30°: Travel = 5\" × 2 = 10\" between bends. The shrink also applies to the true rise. Mark and bend just like a regular offset - the 3D diagonal happens automatically.",
    category: "Offsets"
  },
  {
    id: "5",
    question: "How do I keep parallel offsets looking parallel?",
    answer: "Three critical factors: 1) Use identical angles on all pipes. 2) Calculate stagger: Stagger = Pipe Spacing × tan(Angle ÷ 2). For 30° with 2\" spacing: Stagger = 2\" × tan(15°) = 0.54\". 3) Add this stagger to each successive pipe's first mark. So if pipe 1's mark is at 12\", pipe 2 is at 12.54\", pipe 3 is at 13.08\", etc. This keeps the offsets parallel rather than converging or diverging.",
    category: "Offsets"
  },
  
  // Saddles
  {
    id: "6",
    question: "3-Point vs 4-Point Saddle - when to use which?",
    answer: "3-Point Saddle: Best for round or narrow obstacles (pipes, small conduit). Creates a peaked shape that clears a single point. Uses 45° center with 22.5° outer bends. 4-Point Saddle: Best for wide or square obstacles (beams, rectangular ducts, cable trays). Creates a flat top section that bridges across. Uses equal angles at all four bends (commonly 22.5° or 30°). Rule of thumb: If the obstacle is wider than about 6\", consider a 4-point.",
    category: "Saddles"
  },
  {
    id: "7",
    question: "What's the correct bend sequence for a 3-point saddle?",
    answer: "Critical: Bend the CENTER first, then the outers. 1) Mark the center of your obstacle on the pipe. 2) Bend a 45° at the center mark. 3) Calculate outer marks: Distance = Saddle Height × 2.6 (for 22.5° outers). 4) Flip the pipe in the bender, align your outer mark, and bend 22.5°. 5) Repeat for the other side. If you bend the outers first, the center bend becomes very difficult to position correctly. Always center-first.",
    category: "Saddles"
  },
  {
    id: "8",
    question: "How do I calculate saddle dimensions precisely?",
    answer: "For a 3-Point Saddle (45° center, 22.5° outers): Outer mark distance from center = Height × 2.6. Shrink = Height × 3/16\". For a 4-Point Saddle (all bends at same angle): If using 22.5° bends: Travel between bends = Height × 2.6. Add the obstacle width for the flat section. Total shrink = (2 × Height) × 3/16\". Always add 1/4\" to 1/2\" to your height measurement for clearance over the obstacle.",
    category: "Saddles"
  },
  
  // 90° Bends
  {
    id: "9",
    question: "Why are my stub-up heights inconsistent?",
    answer: "Check these common causes: 1) Wrong take-up value - each conduit size has a specific take-up (1/2\" EMT = 5\", 3/4\" = 6\", 1\" = 8\"). 2) Inconsistent measuring reference - always measure to the same point. 3) Not completing the bend to full 90° - check with a level or square. 4) Measuring from different surfaces. Solution: Use a 'story pole' - a marked stick that gives you identical marks every time. Verify take-up with your specific bender on scrap first.",
    category: "90° Bends"
  },
  {
    id: "10",
    question: "How do I make a perfect back-to-back 90?",
    answer: "Method: 1) Make your first 90° normally. 2) Measure from the BACK of the bend to your desired length (this is where the second bend's back will be). 3) Flip the pipe in the bender (upside down from the first bend). 4) Align your mark with the STAR or rim notch (back of bend mark). 5) Bend your second 90°. Key insight: You're measuring back-to-back, not center-to-center. Account for gain if you need the stubs to reach specific points.",
    category: "90° Bends"
  },
  {
    id: "11",
    question: "What is 'gain' and how do I calculate it?",
    answer: "Gain is the amount of pipe 'saved' by bending around a corner in an arc instead of going square. Formula: Gain = Radius × 0.42 (approximately) for 90° bends. Example: A 1/2\" EMT bender with a 4\" radius has about 1.68\" of gain. This means if you need a 90° stub that reaches a point 24\" from the corner, your cut length is 24\" + 24\" - Gain = about 46.3\" instead of 48\". For precision work, always calculate gain.",
    category: "90° Bends"
  },
  
  // Segment Bends
  {
    id: "12",
    question: "When should I use segment bending instead of a single 90°?",
    answer: "Use segment bends when: 1) Wire pulling force will be high (long runs, many wires). 2) Larger conduit sizes (1-1/4\" and above). 3) You need a larger radius than your bender provides. 4) Aesthetics require a sweeping curve. Benefits: Reduces sidewall pressure on conductors during pulling by 30-50%, creates a more gradual transition, and meets special radius requirements. Trade-off: Takes more time and requires more calculations.",
    category: "Segment Bends"
  },
  {
    id: "13",
    question: "How do I calculate spacing for segment bends?",
    answer: "For a segment 90°: 1) Decide number of segments (typically 3-10). 2) Divide 90° by segments for angle per shot (5 segments = 18° each). 3) Calculate arc length: Arc = 2 × π × Radius × (Angle/360). For a 24\" radius 90°: Arc = 2 × 3.14 × 24 × (90/360) = 37.7\". 4) Divide arc by (segments - 1) for spacing: 37.7\" ÷ 4 = 9.4\" between bends. Mark evenly, bend each segment to the calculated angle.",
    category: "Segment Bends"
  },
  {
    id: "14",
    question: "How many segments should I use?",
    answer: "Guidelines by conduit size and purpose: 1/2\" - 3/4\": Usually not needed, 3 segments if required. 1\" - 1-1/4\": 3-5 segments typical. 1-1/2\" - 2\": 5-7 segments recommended. Larger sizes: 7-10 segments. For wire pulling efficiency, more segments = easier pulling. For speed, fewer segments. For specific radius requirements, calculate based on arc length needed. When in doubt, more segments rarely hurt but take more time.",
    category: "Segment Bends"
  },
  
  // Conduit Fill
  {
    id: "15",
    question: "Why is the 2-wire fill percentage lower than 3-wire?",
    answer: "Counter-intuitive but true: 1 wire = 53%, 2 wires = 31%, 3+ wires = 40%. The reasoning: With only 2 wires, they tend to lie side-by-side at the widest points, creating more friction. With 3+ wires, they stack more efficiently and can move around each other during pulling. This is why running a single wire alone is actually the best case - it has maximum freedom of movement. Always check the correct percentage for your wire count.",
    category: "Conduit Fill"
  },
  {
    id: "16",
    question: "What's the short section exception and when can I use it?",
    answer: "If a conduit section is 24 inches or less (called a 'nipple'), you can fill it to 60% instead of the normal 40%. This applies to: Panel-to-panel connections, short jumps between adjacent boxes, and equipment connections. The logic: Over short distances, pulling difficulty and heat dissipation are less critical. Important: Both ends must connect to boxes/enclosures - it can't be part of a longer run. This exception often allows going down one conduit size.",
    category: "Conduit Fill"
  },
  
  // Box Fill
  {
    id: "17",
    question: "What counts toward box fill calculations?",
    answer: "Everything: 1) Each conductor entering the box = 1× volume allowance (based on wire size). 2) Each yoke/device (switch, receptacle) = 2× volume allowance (largest wire connected). 3) ALL ground wires together = 1× volume allowance (largest ground). 4) Internal clamps = 1× volume allowance (largest wire in box). 5) Hickeys/studs for fixtures = 1× each. Note: Pigtails created inside the box don't count. Wires passing through (not spliced) count only once. Always use the largest wire for device/clamp calculations.",
    category: "Box Fill"
  },
  {
    id: "18",
    question: "How do I handle mixed wire sizes in box fill?",
    answer: "When multiple wire sizes enter a box: 1) Count each conductor at its own size's volume allowance. 2) For devices: Use 2× the largest conductor connected to that device. 3) For grounds: All grounds count as ONE allowance, based on the largest ground present. 4) For clamps: Use the largest conductor in the entire box. Example: Box with #14 and #12 wires: #14 = 2.0 cu.in. each, #12 = 2.25 cu.in. each. If a device connects to #12, its allowance is 2 × 2.25 = 4.5 cu.in.",
    category: "Box Fill"
  },
  
  // Troubleshooting
  {
    id: "19",
    question: "How do I fix a bend that's a few degrees off?",
    answer: "For minor corrections (1-3°): Under-bent: Put the pipe back in the bender at the bend and apply a small additional bend. Over-bent: Flip the bender upside down on the bend and apply gentle reverse pressure, OR use a piece of rigid conduit as a lever against the bend. For angles more than 5° off: It's usually better to cut and start fresh. Repeated adjustments weaken the metal and can cause kinks or flattening. Prevention is always better.",
    category: "Troubleshooting"
  },
  {
    id: "20",
    question: "What causes kinks and how do I avoid them?",
    answer: "Kinks happen when: 1) Bending too quickly - the metal can't flow smoothly. 2) Using wrong size bender - too small a shoe for the conduit. 3) Bending past the bender's design limits. 4) Damaged or dirty bender shoe. 5) Already-weakened conduit (dents, previous bends nearby). Prevention: Smooth, steady pressure throughout the bend. Keep the bender shoe clean and waxed. Don't try to tighten bends beyond the shoe's natural curve. If the conduit starts to feel 'crunchy' - stop immediately.",
    category: "Troubleshooting"
  },
  {
    id: "21",
    question: "Why doesn't my calculated measurement match reality?",
    answer: "Common causes: 1) Measuring from different reference points (back vs. center vs. front of bend). 2) Using wrong multiplier or take-up for your bender - verify with actual test bends. 3) Not accounting for spring-back (especially on rigid). 4) Angle isn't exactly what you think - verify with a protractor. 5) Using generic values instead of your specific bender's values. Solution: Make a test bend on scrap, measure everything, and adjust your values accordingly. Every bender is slightly different.",
    category: "Troubleshooting"
  },
  
  // Wire Pulling
  {
    id: "22",
    question: "How do bend angles affect wire pulling?",
    answer: "Wire pulling friction increases exponentially with each bend. The tighter the bend (larger angle), the more friction added. Rough guide for added difficulty: 10° bend = +10% pull force. 30° bend = +30% pull force. 45° bend = +50% pull force. 90° bend = +100% pull force (doubles). This is why staying under 360° total is critical - at 360°, you've potentially 4× your pulling force. For easy pulls: Use smaller angles when possible, use segment bends for 90s in large conduit, and plan pull points strategically.",
    category: "Wire Pulling"
  },
  {
    id: "23",
    question: "How do I plan runs for easier wire pulling?",
    answer: "Planning tips: 1) Start pulling from the hardest point (most bends, longest distance). 2) Keep total bends under 270° when possible - gives margin. 3) Use larger conduit than minimum - friction decreases dramatically with extra space. 4) Position pull boxes at strategic locations (after complex bends). 5) Use sweeping segment bends instead of tight 90s on long runs. 6) Plan box locations so you can push from one end while pulling from another. Good planning can reduce pull force by 50% or more.",
    category: "Wire Pulling"
  },
  
  // Advanced Techniques
  {
    id: "24",
    question: "How do I bend for concentric (parallel) rack corners?",
    answer: "Each pipe in a rack corner needs progressively more material and different marks. For each pipe moving outward: 1) Add (spacing × tan(angle/2)) to the first mark. 2) Add one pipe spacing to the stub-up length (they're all at different heights). 3) Make the same angle on all pipes. Example for 90° corners with 2\" spacing: Outer pipes need marks staggered by about 2\" and stub heights increased by 2\" each. This maintains uniform spacing through the corner.",
    category: "Advanced Techniques"
  },
  {
    id: "25",
    question: "What's the best approach for complex multi-bend runs?",
    answer: "Strategy: 1) Sketch the entire run first - identify every bend. 2) Work backward from the termination point. 3) Identify the most critical bend (hardest to adjust) - make that one first. 4) Check fit after each bend before continuing. 5) Keep a log of cumulative bend degrees. 6) Have a backup plan for if a bend goes wrong. Pro tip: On really complex runs, make a full-size template from cheap material first to verify your calculations before bending the real conduit.",
    category: "Advanced Techniques"
  }
];

export const proTipCategories = [...new Set(proTipsData.map(item => item.category))];
