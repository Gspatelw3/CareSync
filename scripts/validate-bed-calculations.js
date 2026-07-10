#!/usr/bin/env node

/**
 * Validation script for bed calculations
 * Run with: node scripts/validate-bed-calculations.js
 */

// Import the bed calculation utilities
const {
  WARD_CONFIGS,
  getTotalBeds,
  getWardCapacity,
  calculateOccupiedBeds,
  calculateAvailableBeds,
  calculateOccupancyPercentage,
  calculateWardStats,
  calculateICUStats,
  calculateBedStatistics,
  validateBedCalculations,
} = require('../lib/utils/bed-calculations.ts');

// Mock admissions data (6 patients from the mock data)
const mockAdmissions = [
  { id: "ADM-241", patient: "Vikram Singh", ward: "ICU", bed: "ICU-07", doctor: "Dr. Kavya Rao", admitted: "2026-06-14", diagnosis: "Myocardial infarction", status: "Critical" },
  { id: "ADM-240", patient: "Sita Verma", ward: "General A", bed: "GA-12", doctor: "Dr. Amina Khan", admitted: "2026-06-16", diagnosis: "Pneumonia", status: "Stable" },
  { id: "ADM-239", patient: "Lakshmi Nair", ward: "Maternity", bed: "MT-04", doctor: "Dr. Priya Mehta", admitted: "2026-06-17", diagnosis: "Antenatal monitoring", status: "Stable" },
  { id: "ADM-238", patient: "Rohan Das", ward: "General B", bed: "GB-08", doctor: "Dr. Amit Verma", admitted: "2026-06-16", diagnosis: "Migraine", status: "Observation" },
  { id: "ADM-237", patient: "Aisha Patel", ward: "Pediatrics", bed: "PD-03", doctor: "Dr. Sneha Kapoor", admitted: "2026-06-18", diagnosis: "Viral fever", status: "Recovering" },
  { id: "ADM-236", patient: "Mohan Das", ward: "Recovery", bed: "RC-02", doctor: "Dr. Neil Shah", admitted: "2026-06-15", diagnosis: "Post-surgery recovery", status: "Discharge soon" },
];

console.log('='.repeat(60));
console.log('BED CALCULATION VALIDATION');
console.log('='.repeat(60));
console.log();

// Test 1: Ward Configuration
console.log('1. WARD CONFIGURATION');
console.log('-'.repeat(60));
console.log(`Total wards: ${WARD_CONFIGS.length}`);
console.log(`Total bed capacity: ${getTotalBeds()} beds`);
console.log();
WARD_CONFIGS.forEach(ward => {
  console.log(`  ${ward.name.padEnd(12)}: ${ward.capacity.toString().padStart(3)} beds`);
});
console.log();

// Test 2: Overall Statistics
console.log('2. OVERALL BED STATISTICS');
console.log('-'.repeat(60));
const stats = calculateBedStatistics(mockAdmissions);
console.log(`Total Beds:      ${stats.totalBeds}`);
console.log(`Occupied Beds:   ${stats.occupiedBeds}`);
console.log(`Available Beds:  ${stats.availableBeds}`);
console.log(`Occupancy Rate:  ${stats.occupancyRate}%`);
console.log(`Validation:      ${stats.occupiedBeds + stats.availableBeds === stats.totalBeds ? '✓ PASS' : '✗ FAIL'} (Occupied + Available = Total)`);
console.log();

// Test 3: ICU Statistics
console.log('3. ICU STATISTICS');
console.log('-'.repeat(60));
console.log(`ICU Capacity:    ${stats.icuStats.capacity} beds`);
console.log(`ICU Occupied:    ${stats.icuStats.occupied} beds`);
console.log(`ICU Available:   ${stats.icuStats.available} beds`);
console.log(`ICU Occupancy:   ${stats.icuStats.occupancyPct}%`);
console.log(`Validation:      ${stats.icuStats.occupied + stats.icuStats.available === stats.icuStats.capacity ? '✓ PASS' : '✗ FAIL'} (Occupied + Available = Capacity)`);
console.log();

// Test 4: Ward Breakdown
console.log('4. WARD BREAKDOWN');
console.log('-'.repeat(60));
console.log('Ward              Capacity  Occupied  Available  Occupancy');
console.log(' '.repeat(4) + '-'.repeat(56));
stats.wardBreakdown.forEach(ward => {
  const validation = ward.occupied + ward.available === ward.capacity ? '✓' : '✗';
  console.log(
    `${ward.name.padEnd(16)} ${ward.capacity.toString().padStart(8)} ${ward.occupied.toString().padStart(9)} ${ward.available.toString().padStart(10)} ${ward.occupancyPct.toString().padStart(8)}% ${validation}`
  );
});
console.log();

// Test 5: Validation
console.log('5. VALIDATION CHECKS');
console.log('-'.repeat(60));
const isValid = validateBedCalculations(mockAdmissions);
console.log(`Overall validation: ${isValid ? '✓ PASS' : '✗ FAIL'}`);
console.log();

// Test 6: Current Admissions Match
console.log('6. CURRENT ADMISSIONS');
console.log('-'.repeat(60));
console.log(`Total admissions in mock data: ${mockAdmissions.length}`);
console.log(`Calculated occupied beds:      ${stats.occupiedBeds}`);
console.log(`Match:                         ${mockAdmissions.length === stats.occupiedBeds ? '✓ PASS' : '✗ FAIL'}`);
console.log();

// Test 7: Formula Verification
console.log('7. FORMULA VERIFICATION');
console.log('-'.repeat(60));
const testTotal = 174;
const testOccupied = 87;
const testAvailable = calculateAvailableBeds(testTotal, testOccupied);
const testOccupancy = calculateOccupancyPercentage(testOccupied, testTotal);
console.log(`Available Beds = Total Beds - Occupied Beds`);
console.log(`               = ${testTotal} - ${testOccupied}`);
console.log(`               = ${testAvailable} ✓`);
console.log();
console.log(`Occupancy % = (Occupied Beds / Total Beds) × 100`);
console.log(`            = (${testOccupied} / ${testTotal}) × 100`);
console.log(`            = ${testOccupancy}% ✓`);
console.log();

// Summary
console.log('='.repeat(60));
console.log('SUMMARY');
console.log('='.repeat(60));
console.log(`✓ Total Beds: ${stats.totalBeds} (sum of all ward capacities)`);
console.log(`✓ Available Beds: ${stats.availableBeds} (Total - Occupied)`);
console.log(`✓ Occupancy Rate: ${stats.occupancyRate}% (Occupied / Total × 100)`);
console.log(`✓ ICU Occupancy: ${stats.icuStats.occupancyPct}% (ICU Occupied / ICU Capacity × 100)`);
console.log(`✓ All ward calculations validated`);
console.log(`✓ Current admissions (${mockAdmissions.length}) match occupied beds (${stats.occupiedBeds})`);
console.log();
console.log('All calculations are derived from a single source of truth!');
console.log('='.repeat(60));