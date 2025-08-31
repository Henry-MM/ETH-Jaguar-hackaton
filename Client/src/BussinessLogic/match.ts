import { borrowerUsers, lenderUsers } from "./User";

const borrowRequest = {
   amount: 1500,
   preferredMonthlyPayment: 150,
   bank: "BAC"
};

const getLenderLevelByBorrowerRiskLevel = (riskLevel) => {

   if (!riskLevel?.risk || !riskLevel?.subLevel)
      throw new Error("Invalid risk level");

   const lendersLvlbyBorrowerRiskLevels = {
      low: {
         1: 0,
         2: 50,
         3: 100,
         4: 200,
         5: 300,
         6: 400,
         7: 500,
         8: 600,
         9: 700,
         10: 800,
      },
      medium: {
         1: 300,
         2: 400
      },
      high: {
         1: 500,
         2: 600,
         3: 700
      }
   };

   return lendersLvlbyBorrowerRiskLevels[riskLevel?.risk][riskLevel?.subLevel] ?? null;
};

const getServicesFeesByRiskLevel = (riskLevel) => {

   if (!riskLevel?.risk || !riskLevel?.subLevel)
      throw new Error("Invalid risk level");

   const servicesFeesByRiskLevel = {
      low: {
         10: 0.1,
         9: 0.2,
         8: 0.3,
         7: 0.4,
         6: 0.5,
         5: 0.6,
         4: 0.7,
         3: 0.8,
         2: 0.9,
         1: 1,
      },
      medium: {
         2: 1.5,
         1: 2
      },
      high: {
         3: 15,
         2: 10,
         1: 5,
      }
   };

   return servicesFeesByRiskLevel[riskLevel?.risk][riskLevel?.subLevel] ?? null;
}

const createLoanOfferForBorrower = (borrower, borrowRequest, loanDetails) => {

   const servicesFees = getServicesFeesByRiskLevel(borrower.riskLevel);

   const totalToPay = borrowRequest.amount + (borrowRequest.amount * (loanDetails.interestRate / 100));
   const totalToPayWithFees = totalToPay + servicesFees;
   const totalQuantityOfPayments = totalToPayWithFees / loanDetails.durationInMonths;

   return {
      requestedAmount: borrowRequest.amount,
      monthlyPayment: totalQuantityOfPayments,
      totalMonths: loanDetails.durationInMonths,
      fees: servicesFees,
      totalToPay: totalToPay,
      totalToPayPlusFees: totalToPayWithFees
   }
};

export const getMatchingLoanOffers = (borrower, borrowRequest) => {

   // filter lenders by the borrower's risk level
   const lenders = lenderUsers.filter((lender) =>
      lender.creditScore <= getLenderLevelByBorrowerRiskLevel(borrower.riskLevel)
   );

   // find matching loan offers from the lenders
   const matchingOffers = lenders.flatMap((lender) =>
      lender.activeOfferLoans
      .filter(loan => loan.amountToLend >= borrowRequest.amount)
      // filter for preferredMonthlyPayment in the request
      .map((loan) =>
         createLoanOfferForBorrower(borrower, borrowRequest, loan)
      )
   );

   console.log("aaaa", matchingOffers);

   return matchingOffers;
};

getMatchingLoanOffers(borrowerUsers[0], borrowRequest)
