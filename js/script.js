// Constants for health insurance premiums and employer contributions
const INDIVIDUAL_PREMIUM_PERCENTAGE = 0.05; // 5% for individual plans
const FAMILY_PREMIUM_PERCENTAGE = 0.15; // 15% for family plans
const EMPLOYER_CONTRIBUTION_PERCENTAGE = 0.09; // 9% of income by employer
const DEPENDENT_MULTIPLIER = 0.02; // 2% additional for each dependent
const CANADA_TAX_INCREASE_PERCENTAGE = 0.07; // Adjust as needed for estimates

// Function to calculate federal tax using a progressive system
function calculateTax(income, brackets) {
    let tax = 0;
    for (let i = 0; i < brackets.length; i++) {
        const { rate, limit } = brackets[i];
        if (income > limit) {
            tax += limit * rate;
            income -= limit;
        } else {
            tax += income * rate;
            break;
        }
    }
    return tax;
}

// Define Canadian and U.S. federal tax brackets
const canadianBrackets = [
    { rate: 0.15, limit: 53359 },
    { rate: 0.205, limit: 53359 },
    { rate: 0.26, limit: 58267 },
    { rate: 0.29, limit: 63423 },
    { rate: 0.33, limit: Infinity } // Remaining income taxed at 33%
];

const usBrackets = [
    { rate: 0.1, limit: 11000 },
    { rate: 0.12, limit: 33725 },
    { rate: 0.22, limit: 50550 },
    { rate: 0.24, limit: 89075 },
    { rate: 0.32, limit: 174525 },
    { rate: 0.35, limit: 200000 },
    { rate: 0.37, limit: Infinity } // Remaining income taxed at 37%
];

// Calculate the difference in take-home pay between U.S. and Canadian systems
function calculateDifference() {
    const income = parseFloat(document.getElementById("income").value);
    const dependents = parseInt(document.getElementById("dependents").value);
    const planType = document.getElementById("planType").value;
    const employerContributionFactor = parseFloat(document.getElementById("employerContribution").value);

    // Calculate U.S. and Canadian taxes
    const canadaTaxIncrease = calculateTax(income, canadianBrackets);
    const usTax = calculateTax(income, usBrackets);

    // Calculate user premium and employer contribution based on income and dependents
    let userPremiumPercentage, employerContribution;
    if (planType === "individual") {
        userPremiumPercentage = income * INDIVIDUAL_PREMIUM_PERCENTAGE * (1 + DEPENDENT_MULTIPLIER * dependents);
    } else {
        userPremiumPercentage = income * FAMILY_PREMIUM_PERCENTAGE * (1 + DEPENDENT_MULTIPLIER * dependents);
    }
    employerContribution = income * EMPLOYER_CONTRIBUTION_PERCENTAGE * (1 + DEPENDENT_MULTIPLIER * dependents);

    // US Take-Home after deducting user healthcare premium
    const usTakeHome = income - usTax - userPremiumPercentage;

    // Canadian Take-Home after tax increase and any employer contribution
    const canadaTakeHome = income - canadaTaxIncrease + (employerContribution * employerContributionFactor);

    // Net Difference in Take-Home Pay between the two systems
    const netDifference = canadaTakeHome - usTakeHome;

    // Display the result
    document.getElementById("result").innerHTML = `
        <p>Current US Take-Home: $${usTakeHome.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        <p>Estimated Canadian Take-Home: $${canadaTakeHome.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        <p>Net Difference in Take-Home Pay: $${netDifference.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        <p>Note: Your employer contributes an estimated $${employerContribution.toLocaleString(undefined, { maximumFractionDigits: 0 })} in the US for your health insurance.</p>
        <p>${netDifference >= 0 ? "You'd take home more under Canadian healthcare!" : "You'd take home less under Canadian healthcare."}</p>
    `;
}
