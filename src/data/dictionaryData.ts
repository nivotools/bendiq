// Conduit Dictionary - Common terms and definitions
export interface DictionaryEntry {
  id: string;
  term: string;
  definition: string;
  category: string;
}

export const dictionaryData: DictionaryEntry[] = [
  // Bend Types
  { id: "1", term: "Offset", definition: "A combination of two bends (equal and opposite angles) that allows conduit to transition from one level to another while maintaining the same direction.", category: "Bend Types" },
  { id: "2", term: "90° Bend", definition: "A single bend that turns the conduit at a right angle. The most common bend type, used for stub-ups and direction changes.", category: "Bend Types" },
  { id: "3", term: "Stub-Up", definition: "A 90° bend where the conduit comes up from a horizontal run to a vertical position, typically to meet a box or panel.", category: "Bend Types" },
  { id: "4", term: "Kick", definition: "A small angle bend (typically 10-15°) used to adjust the path of conduit slightly, often at the base of a stub-up.", category: "Bend Types" },
  { id: "5", term: "3-Point Saddle", definition: "Three bends that go up and over an obstacle. Consists of a center bend (usually 45°) and two outer bends (usually 22.5° each).", category: "Bend Types" },
  { id: "6", term: "4-Point Saddle", definition: "Four bends creating a trapezoidal shape to clear wide obstacles. Better for square or wide obstructions than a 3-point.", category: "Bend Types" },
  { id: "7", term: "Back-to-Back 90", definition: "Two 90° bends forming a U-shape. Used to go around obstacles or change conduit direction 180°.", category: "Bend Types" },
  { id: "8", term: "Segment Bend", definition: "Multiple small-angle bends that together create a larger angle. Reduces stress and improves wire pulling.", category: "Bend Types" },
  { id: "9", term: "Rolling Offset", definition: "An offset that moves in two planes simultaneously - both vertically and horizontally.", category: "Bend Types" },
  { id: "10", term: "Box Offset", definition: "A very small offset (typically 1/2\" to 1\") used to clear raised box edges or small obstructions.", category: "Bend Types" },
  { id: "11", term: "Kick 90", definition: "A combination of a small kick bend followed by a 90° bend, used to clear obstacles at floor/wall junctions.", category: "Bend Types" },
  
  // Measurements
  { id: "12", term: "Take-Up", definition: "The distance from the bend's tangent point to the back of the bend. Must be subtracted from your stub height measurement.", category: "Measurements" },
  { id: "13", term: "Deduct", definition: "The amount subtracted from a measurement when positioning the bender for a specific result.", category: "Measurements" },
  { id: "14", term: "Shrink", definition: "The amount a conduit run shortens when an offset is added. Must be added to your starting mark measurement.", category: "Measurements" },
  { id: "15", term: "Gain", definition: "The distance saved by bending in an arc versus going square around a corner. Pipe uses less length than the measured corner distance.", category: "Measurements" },
  { id: "16", term: "Multiplier", definition: "A factor used to calculate the distance between offset bends. Multiply the offset height by the multiplier for your angle.", category: "Measurements" },
  { id: "17", term: "Travel", definition: "The distance along the conduit between the two bends of an offset, measured along the pipe.", category: "Measurements" },
  { id: "18", term: "Rise", definition: "The vertical distance an offset moves the conduit from one level to another.", category: "Measurements" },
  { id: "19", term: "Run", definition: "The horizontal distance covered by an offset or bend.", category: "Measurements" },
  { id: "20", term: "Developed Length", definition: "The total length of conduit needed for a run including all bends, accounting for arc lengths.", category: "Measurements" },
  { id: "21", term: "Back of Bend", definition: "The outside curve of a bend, opposite the inside radius. Used as a reference point for measurements.", category: "Measurements" },
  { id: "22", term: "Center of Bend", definition: "The middle point of a bend arc. Different from the arrow mark on most benders.", category: "Measurements" },
  
  // Bender Parts
  { id: "23", term: "Shoe", definition: "The curved part of the bender that forms the conduit around the bend. Determines the bend radius.", category: "Bender Parts" },
  { id: "24", term: "Hook", definition: "The part of the bender that grips the conduit during bending. Must be fully engaged to prevent slipping.", category: "Bender Parts" },
  { id: "25", term: "Arrow Mark", definition: "The reference mark on the bender indicating where to place your measurement mark for stub-ups.", category: "Bender Parts" },
  { id: "26", term: "Star Mark", definition: "The 'back of bend' mark on the bender. Used for back-to-back 90s and other measurements.", category: "Bender Parts" },
  { id: "27", term: "Rim Notch", definition: "A notch on the bender rim that helps prevent conduit slipping and marks the back of the bend.", category: "Bender Parts" },
  { id: "28", term: "Foot", definition: "The part of the bender you stand on to apply bending force. Keep pressure centered.", category: "Bender Parts" },
  { id: "29", term: "Degree Scale", definition: "Markings on the bender handle showing common bend angles (30°, 45°, 60°, 90°).", category: "Bender Parts" },
  { id: "30", term: "Handle", definition: "The lever used to apply bending force. Longer handles provide more leverage.", category: "Bender Parts" },
  
  // Problems
  { id: "31", term: "Dog-Leg", definition: "When the two bends of an offset aren't in the same plane, causing a twisted appearance. The pipe won't lay flat.", category: "Problems" },
  { id: "32", term: "Kink", definition: "A sharp crease or buckle in the conduit wall caused by excessive force or too tight a bend.", category: "Problems" },
  { id: "33", term: "Spring-Back", definition: "The tendency of bent conduit to relax slightly after bending, resulting in a smaller angle than intended.", category: "Problems" },
  { id: "34", term: "Flattening", definition: "When the round conduit becomes oval-shaped during bending, usually from excessive or improper force.", category: "Problems" },
  { id: "35", term: "Overshoot", definition: "Bending past the intended angle. Minor corrections possible; severe may require scrapping.", category: "Problems" },
  
  // Conduit Types
  { id: "36", term: "EMT", definition: "Electrical Metallic Tubing. Thin-walled, lightweight conduit. Most common for interior commercial work.", category: "Conduit Types" },
  { id: "37", term: "IMC", definition: "Intermediate Metal Conduit. Thicker walls than EMT, threaded ends. Used where more protection needed.", category: "Conduit Types" },
  { id: "38", term: "RMC", definition: "Rigid Metal Conduit. Heaviest wall thickness, threaded. For maximum protection and exposed locations.", category: "Conduit Types" },
  { id: "39", term: "PVC", definition: "Polyvinyl Chloride conduit. Plastic, non-conductive. Requires heat for bending.", category: "Conduit Types" },
  { id: "40", term: "Flexible Conduit", definition: "Metal or plastic conduit that bends without tools. Used for final connections to equipment.", category: "Conduit Types" },
  
  // Installation Terms
  { id: "41", term: "Concentric Bends", definition: "Multiple parallel pipes bent at the same location, each with progressively larger marks to maintain consistent spacing.", category: "Installation" },
  { id: "42", term: "Rack", definition: "Multiple conduits running parallel, typically mounted on a common support structure.", category: "Installation" },
  { id: "43", term: "Pull Point", definition: "A junction box or access point for pulling wire. Required every 360° of cumulative bends.", category: "Installation" },
  { id: "44", term: "Stagger", definition: "The offset added to each successive pipe's mark in parallel offset bends to keep pipes parallel.", category: "Installation" },
  { id: "45", term: "Coupling", definition: "A fitting that joins two pieces of conduit end-to-end.", category: "Installation" },
  { id: "46", term: "Nipple", definition: "A short piece of conduit, typically 24\" or less, connecting two close boxes or fittings.", category: "Installation" },
  { id: "47", term: "Strap", definition: "A support fitting that holds conduit to a surface. Various types for different applications.", category: "Installation" },
  { id: "48", term: "Story Pole", definition: "A marked stick or pipe used as a consistent measuring reference for repetitive heights.", category: "Installation" },
  
  // Math Terms
  { id: "49", term: "Cosecant", definition: "The trigonometric function whose value equals the multiplier for any given bend angle.", category: "Math" },
  { id: "50", term: "Tangent", definition: "Used in calculating stagger for parallel bends. Stagger = Spacing × tan(Angle/2).", category: "Math" },
  { id: "51", term: "Hypotenuse", definition: "The longest side of a right triangle - the travel distance in an offset is along the hypotenuse.", category: "Math" },
  { id: "52", term: "3-4-5 Rule", definition: "A method to verify right angles: 3 units on one leg, 4 on another, diagonal should equal 5.", category: "Math" },
  
  // Regulatory
  { id: "53", term: "360° Rule", definition: "Maximum cumulative bend degrees allowed between pull points. Exceeding this requires adding a junction box.", category: "Regulatory" },
  { id: "54", term: "Minimum Radius", definition: "The smallest bend radius allowed without damaging wire insulation. Varies by conduit size.", category: "Regulatory" },
  { id: "55", term: "Fill Percentage", definition: "The maximum percentage of conduit internal area that can be filled with wires.", category: "Regulatory" },
  { id: "56", term: "40% Rule", definition: "Maximum conduit fill allowed for 3 or more wires. Less than 3 wires have different percentages.", category: "Regulatory" }
];

export const dictionaryCategories = [...new Set(dictionaryData.map(item => item.category))];
