import { SubSink } from '../src/subsink';

// TODO: Write some tests!

const mockSubscription = {
  unsubscribe: jest.fn()
}

const mockSubscription2 = {
  unsubscribe: jest.fn()
}

describe('SubSink', () => {

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('add()', () => {
    it('should unsubscribe an array of subscriptions', () => {

    });

  });

  describe('sink', () => {
    
  });
});
