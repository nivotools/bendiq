// 3-Second Tips - Quick, single-sentence math tricks and rules of thumb
export interface QuickTip {
  id: string;
  tip: string;
  category: string;
}

export const quickTipsData: QuickTip[] = [
  // Multipliers
  { id: "1", tip: "30° multiplier is 2 — just double your offset height.", category: "Multipliers" },
  { id: "2", tip: "45° multiplier is 1.414 — height × 1.4 is close enough.", category: "Multipliers" },
  { id: "3", tip: "22.5° multiplier is 2.6 — height × 2.6 for distance.", category: "Multipliers" },
  { id: "4", tip: "10° multiplier is 6 — height × 6 for distance.", category: "Multipliers" },
  { id: "5", tip: "60° multiplier is 1.2 — for steep, tight offsets.", category: "Multipliers" },
  
  // Shrink
  { id: "6", tip: "30° shrink = 1/4\" per inch of offset height.", category: "Shrink" },
  { id: "7", tip: "45° shrink = 3/8\" per inch of offset height.", category: "Shrink" },
  { id: "8", tip: "22.5° shrink = 3/16\" per inch of offset height.", category: "Shrink" },
  { id: "9", tip: "10° shrink = 1/16\" per inch of offset height.", category: "Shrink" },
  { id: "10", tip: "60° shrink = 1/2\" per inch of offset height.", category: "Shrink" },
  
  // Take-Up
  { id: "11", tip: "1/2\" EMT take-up = 5 inches.", category: "Take-Up" },
  { id: "12", tip: "3/4\" EMT take-up = 6 inches.", category: "Take-Up" },
  { id: "13", tip: "1\" EMT take-up = 8 inches.", category: "Take-Up" },
  { id: "14", tip: "1-1/4\" EMT take-up = 11 inches (hand bender).", category: "Take-Up" },
  { id: "15", tip: "Always verify take-up on your specific bender.", category: "Take-Up" },
  
  // Quick Math
  { id: "16", tip: "Box offset: 10° bends, 6\" apart = ~1\" rise.", category: "Quick Math" },
  { id: "17", tip: "Rolling offset: Rise² + Roll² = True Rise².", category: "Quick Math" },
  { id: "18", tip: "3-4-5 triangle to verify 90° — 3 one way, 4 other, diagonal is 5.", category: "Quick Math" },
  { id: "19", tip: "Gain ≈ Radius × 0.42 for 90° bends.", category: "Quick Math" },
  { id: "20", tip: "Stagger = Spacing × tan(Angle ÷ 2) for parallel offsets.", category: "Quick Math" },
  { id: "21", tip: "Arc length = 2 × π × Radius × (Degrees ÷ 360).", category: "Quick Math" },
  { id: "22", tip: "Segment spacing = Total arc ÷ (segments - 1).", category: "Quick Math" },
  
  // Memory Tricks
  { id: "23", tip: "Shrink per inch pattern: 10°=1/16, 22.5°=3/16, 30°=4/16, 45°=6/16.", category: "Memory Tricks" },
  { id: "24", tip: "Multiplier = 1/sin(angle) — cosecant of the angle.", category: "Memory Tricks" },
  { id: "25", tip: "Larger angle = shorter travel but more shrink.", category: "Memory Tricks" },
  { id: "26", tip: "EMT take-up pattern: 5-6-8-11 for 1/2\" to 1-1/4\".", category: "Memory Tricks" },
  
  // Saddles
  { id: "27", tip: "3-point saddle: 45° center, 22.5° outers.", category: "Saddles" },
  { id: "28", tip: "3-point outer marks: Height × 2.6 from center.", category: "Saddles" },
  { id: "29", tip: "Always bend center first on 3-point saddles.", category: "Saddles" },
  { id: "30", tip: "Add 1/4\" clearance to saddle height for breathing room.", category: "Saddles" },
  
  // Fill Rules
  { id: "31", tip: "3+ wires = 40% conduit fill maximum.", category: "Fill Rules" },
  { id: "32", tip: "2 wires = 31% fill — less than 3 wires!", category: "Fill Rules" },
  { id: "33", tip: "1 wire = 53% fill allowed.", category: "Fill Rules" },
  { id: "34", tip: "Nipple (≤24\") = 60% fill exception.", category: "Fill Rules" },
  { id: "35", tip: "Box fill: All grounds = 1 allowance (largest ground).", category: "Fill Rules" },
  { id: "36", tip: "Device in box = 2× largest wire connected to it.", category: "Fill Rules" },
  
  // Bend Limits
  { id: "37", tip: "Maximum 360° of bends between pull points.", category: "Bend Limits" },
  { id: "38", tip: "More than 270°? Plan a pull box.", category: "Bend Limits" },
  { id: "39", tip: "Each 90° doubles wire pulling difficulty.", category: "Bend Limits" },
  
  // Common Mistakes
  { id: "40", tip: "Dog-leg fix: Lay flat, rotate up, torque back down.", category: "Common Mistakes" },
  { id: "41", tip: "Short offset? You forgot the shrink.", category: "Common Mistakes" },
  { id: "42", tip: "Wrong stub height? Check your take-up value.", category: "Common Mistakes" },
  { id: "43", tip: "Kink prevention: Slow, steady pressure.", category: "Common Mistakes" },
  
  // Pro Shortcuts
  { id: "44", tip: "Star mark = back of bend for back-to-back 90s.", category: "Pro Shortcuts" },
  { id: "45", tip: "Flip the pipe and use star mark for second 90.", category: "Pro Shortcuts" },
  { id: "46", tip: "Over-bent rigid? Bend to ~88° for 90° after spring-back.", category: "Pro Shortcuts" },
  { id: "47", tip: "Test your bender values on scrap before production.", category: "Pro Shortcuts" },
  { id: "48", tip: "Pre-calculate all bends before picking up the bender.", category: "Pro Shortcuts" },
  
  // Quality Checks
  { id: "49", tip: "Offset check: Both ends should touch flat surface.", category: "Quality Checks" },
  { id: "50", tip: "90° check: Torpedo level or square against it.", category: "Quality Checks" },
  { id: "51", tip: "Measure twice, bend once — seriously.", category: "Quality Checks" },
  { id: "52", tip: "Verify angle with protractor if unsure.", category: "Quality Checks" },
  
  // Safety & Best Practices
  { id: "53", tip: "Keep 6\" minimum from conduit end before bending.", category: "Best Practices" },
  { id: "54", tip: "Ream all cut ends — burrs damage wire insulation.", category: "Best Practices" },
  { id: "55", tip: "Keep bender shoe clean and waxed.", category: "Best Practices" },
  { id: "56", tip: "Store bender hung up or flat — protect the shoe.", category: "Best Practices" },
  { id: "57", tip: "Cold metal = more brittle. Slow down in winter.", category: "Best Practices" },
  { id: "58", tip: "Use proper body mechanics — let the bender do the work.", category: "Best Practices" },
  
  // Time Savers
  { id: "59", tip: "Line up multiple pipes, mark across all at once.", category: "Time Savers" },
  { id: "60", tip: "Story pole = consistent heights without measuring each.", category: "Time Savers" },
  { id: "61", tip: "Batch similar bends — setup once, bend many.", category: "Time Savers" },
  { id: "62", tip: "Pre-cut materials before starting bends.", category: "Time Savers" },
  
  // Wire Gauge Reference
  { id: "63", tip: "#14 AWG box fill = 2.0 cubic inches.", category: "Wire Reference" },
  { id: "64", tip: "#12 AWG box fill = 2.25 cubic inches.", category: "Wire Reference" },
  { id: "65", tip: "#10 AWG box fill = 2.5 cubic inches.", category: "Wire Reference" },
  { id: "66", tip: "#8 AWG box fill = 3.0 cubic inches.", category: "Wire Reference" },
  { id: "67", tip: "#6 AWG box fill = 5.0 cubic inches.", category: "Wire Reference" }
];

export const quickTipCategories = [...new Set(quickTipsData.map(item => item.category))];
