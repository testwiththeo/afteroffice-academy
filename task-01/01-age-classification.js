// Function to get the age category
function getCategory(age) {
  if (age <= 12) return "Anak-anak";
  if (age <= 17) return "Remaja";
  if (age <= 59) return "Dewasa";
  return "Lansia";
}

// Input data and counters
const ages = [5, 10, 15, 20, 25, 30, 65];
const total = { "Anak-anak": 0, "Remaja": 0, "Dewasa": 0, "Lansia": 0 };

// Count people in each category
for (const age of ages) {
  total[getCategory(age)]++;
}

// Print the results
for (const cat in total) {
  console.log(`${cat}: ${total[cat]} orang`);
}