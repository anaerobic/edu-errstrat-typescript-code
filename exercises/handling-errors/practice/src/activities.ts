import { Address, Bill, Distance, OrderConfirmation } from './shared';
// TODO Part A: Add `ApplicationFailure` from `@temporalio/activity`
import { log } from '@temporalio/activity';

export async function getDistance(address: Address): Promise<Distance> {
  log.info('getDistance invoked; determining distance to customer address');

  // this is a simulation, which calculates a fake (but consistent)
  // distance for a customer address based on its length. The value
  // will therefore be different when called with different addresses,
  // but will be the same across all invocations with the same address.
  let kilometers: number = address.line1.length + address.line2.length - 10;
  if (kilometers < 1) {
    kilometers = 5;
  }

  const distance = {
    kilometers,
  };

  log.info('getDistance complete', { distance });
  return distance;
}

export async function sendBill(bill: Bill): Promise<OrderConfirmation> {
  log.info('sendBill invoked', { Customer: bill.customerID, Amount: bill.amount });

  let chargeAmount = bill.amount;

  // This month's special offer: Get $5 off all orders over $30
  if (bill.amount > 3000) {
    log.info('Applying discount');

    chargeAmount -= 500; // reduce amount charged by 500 cents
  }

  // reject invalid amounts before calling the payment processor
  if (chargeAmount < 0) {
    throw ApplicationFailure.create({
      message: `Invalid charge amount: ${chargeAmount} (must be above zero)`,
      details: [chargeAmount],
      // TODO Part B: Set the nonRetryable key to true.
    });
  }

  // pretend we called a payment processing service here :-)

  const confirmation = {
    orderNumber: bill.orderNumber,
    confirmationNumber: 'AB9923',
    status: 'SUCCESS',
    billingTimestamp: Date.now(),
    amount: chargeAmount,
  };

  log.info('sendBill complete', { confirmation });

  return confirmation;
}

export async function validateCreditCard(creditCardNumber: string): Promise<string> {
  log.info('validateCreditCard invoked', { CreditCardNumber: creditCardNumber });

  // Check if the credit card number has 16 digits
  const isValid = creditCardNumber.length == 16;

  if (!isValid) {
    // TODO Part A: Throw an `ApplicationFailure` if the
    // credit card number does not have 16 digits.
    // Follow the pattern you see for in the error in `sendBill`.
    // TODO Part B: Set the nonRetryable key to true.
  }

  log.info('Credit card validated:', { CreditCardNumber: creditCardNumber });
  return "Order confirmed";
}
