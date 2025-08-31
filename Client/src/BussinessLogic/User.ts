export const borrowerUsers = [
   {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      riskLevel: { risk: "low", subLevel: 10 },
      isVerified: true,
      creditScore: 700,
      loansStat: {
         taken: 3,
         completed: 3,
         default: 3,
         delayed: 3
      },
   },
   {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      riskLevel: { risk: "medium", subLevel: 2 },
      isVerified: false,
      creditScore: 650,
      loansStat: {
         taken: 3,
         completed: 3,
         default: 3,
         delayed: 3

      },
   }
]

export const lenderUsers = [
   {
      id: 1,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      isVerified: true,
      creditScore: 750,
      activeOfferLoans: [
         {
            id: 1,
            amountToLend: 1000,
            interestRate: 5,
            durationInMonths: 12,
            paymentFrequency: "monthly"
         },
         {
            id: 2,
            amountToLend: 2000,
            interestRate: 4.5,
            durationInMonths: 24,
            paymentFrequency: "monthly"
         }
      ],
      loansStat: {
         offered: 5,
         active: 2,
         completed: 3,
         default: 0,
         delayed: 1
      }
   },
   {
      id: 2,
      name: "Bob Brown",
      email: "bob.brown@example.com",
      isVerified: false,
      creditScore: 600,
      activeOfferLoans: [
         {
            id: 1,
            amountToLend: 3000,
            interestRate: 5,
            durationInMonths: 24,
            paymentFrequency: "monthly"
         },
         {
            id: 2,
            amountToLend: 500,
            interestRate: 4.5,
            durationInMonths: 6,
            paymentFrequency: "monthly"
         }
      ],
      loansStat: {
         offered: 2,
         active: 1,
         completed: 1,
         default: 0,
         delayed: 0
      }
   }
];