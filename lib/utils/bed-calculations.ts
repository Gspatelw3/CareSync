// ── Bed Configuration and Calculation Utilities ──
// Single source of truth for all bed-related calculations

export type WardConfig = {
  name: string;
  capacity: number;
};

// Ward capacity configuration - single source of truth
export const WARD_CONFIGS: WardConfig[] = [
  { name: "ICU", capacity: 24 },
  { name: "Emergency", capacity: 18 },
  { name: "General A", capacity: 40 },
  { name: "General B", capacity: 36 },
  { name: "Maternity", capacity: 20 },
  { name: "Pediatrics", capacity: 16 },
  { name: "Isolation", capacity: 8 },
  { name: "Recovery", capacity: 12 },
];

// Get total bed capacity across all wards
export const getTotalBeds = (): number => {
  return WARD_CONFIGS.reduce((sum, ward) => sum + ward.capacity, 0);
};

// Get capacity for a specific ward
export const getWardCapacity = (wardName: string): number => {
  const ward = WARD_CONFIGS.find(w => w.name === wardName);
  return ward?.capacity || 0;
};

// Get all ward names
export const getWardNames = (): string[] => {
  return WARD_CONFIGS.map(w => w.name);
};

// Calculate occupied beds from admissions
export const calculateOccupiedBeds = (admissions: Array<{ ward: string }>): number => {
  return admissions.length;
};

// Calculate available beds
export const calculateAvailableBeds = (totalBeds: number, occupiedBeds: number): number => {
  return totalBeds - occupiedBeds;
};

// Calculate occupancy percentage
export const calculateOccupancyPercentage = (occupiedBeds: number, totalBeds: number): number => {
  if (totalBeds === 0) return 0;
  return Math.round((occupiedBeds / totalBeds) * 100);
};

// Calculate ward-specific statistics
export const calculateWardStats = (
  wardName: string,
  admissions: Array<{ ward: string }>
) => {
  const capacity = getWardCapacity(wardName);
  const occupied = admissions.filter(a => a.ward === wardName).length;
  const available = capacity - occupied;
  const occupancyPct = calculateOccupancyPercentage(occupied, capacity);

  return {
    name: wardName,
    capacity,
    occupied,
    available,
    occupancyPct,
  };
};

// Calculate ICU-specific statistics
export const calculateICUStats = (admissions: Array<{ ward: string }>) => {
  return calculateWardStats("ICU", admissions);
};

// Calculate comprehensive bed statistics
export const calculateBedStatistics = (admissions: Array<{ ward: string }>) => {
  const totalBeds = getTotalBeds();
  const occupiedBeds = calculateOccupiedBeds(admissions);
  const availableBeds = calculateAvailableBeds(totalBeds, occupiedBeds);
  const occupancyRate = calculateOccupancyPercentage(occupiedBeds, totalBeds);
  const icuStats = calculateICUStats(admissions);

  // Calculate ward breakdown
  const wardBreakdown = WARD_CONFIGS.map(config => 
    calculateWardStats(config.name, admissions)
  );

  return {
    totalBeds,
    occupiedBeds,
    availableBeds,
    occupancyRate,
    icuStats,
    wardBreakdown,
  };
};

// Validate bed calculations
export const validateBedCalculations = (admissions: Array<{ ward: string }>): boolean => {
  const stats = calculateBedStatistics(admissions);

  // Validate total beds equals sum of ward capacities
  const sumOfWardCapacities = WARD_CONFIGS.reduce((sum, ward) => sum + ward.capacity, 0);
  if (stats.totalBeds !== sumOfWardCapacities) {
    console.error("Total beds doesn't match sum of ward capacities");
    return false;
  }

  // Validate occupied + available = total
  if (stats.occupiedBeds + stats.availableBeds !== stats.totalBeds) {
    console.error("Occupied + Available doesn't equal Total");
    return false;
  }

  // Validate each ward: occupied + available = capacity
  for (const ward of stats.wardBreakdown) {
    if (ward.occupied + ward.available !== ward.capacity) {
      console.error(`Ward ${ward.name}: Occupied + Available doesn't equal Capacity`);
      return false;
    }
  }

  // Validate occupancy percentage
  if (stats.occupancyRate < 0 || stats.occupancyRate > 100) {
    console.error("Occupancy rate out of range");
    return false;
  }

  return true;
};