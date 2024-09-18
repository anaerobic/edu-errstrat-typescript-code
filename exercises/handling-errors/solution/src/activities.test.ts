import { MockActivityEnvironment } from '@temporalio/testing';
import { ApplicationFailure } from "@temporalio/common"
import { validateCreditCard } from "./activities"

let testEnv: MockActivityEnvironment;

beforeAll(() => {
  testEnv = new MockActivityEnvironment({ attempt: 2, });
})

afterAll(() => {
  testEnv?.cancel();
})

describe('validateCreditCard', () => {

  const creditCardNumber = '123456789012345'

  it('should throw if creditcard not valid (rejects.toThrow)', async () => {

    expect(
      testEnv.run(validateCreditCard, creditCardNumber)
    ).rejects.toThrow(
      ApplicationFailure.create({
        message: `Invalid credit card number: ${creditCardNumber}: (must contain exactly 16 digits)`,
        details: [creditCardNumber],
        nonRetryable: true,
      })
    )
  })

  it('should throw if creditcard not valid (try/catch)', async () => {
    try {
      await testEnv.run(validateCreditCard, creditCardNumber)
    }
    catch (err) {
      expect(err).toBeInstanceOf(ApplicationFailure)

      const appFailure: ApplicationFailure = err as ApplicationFailure;

      expect(appFailure.message).toBe(`Invalid credit card number: ${creditCardNumber}: (must contain exactly 16 digits)`)
      expect(appFailure.details).toEqual([creditCardNumber])
      expect(appFailure.nonRetryable).toBe(true)
    }
  })
})