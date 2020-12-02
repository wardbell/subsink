import { SubSink, SubscriptionLike } from '../src/subsink';

describe('SubSink', () => {
  let mockSubscription: SubscriptionLike;
  let mockSubscription2: SubscriptionLike;
  let sink: SubSink;
  
  beforeEach(() => {
    mockSubscription = {
      unsubscribe: jest.fn()
    };
    mockSubscription2 = {
      unsubscribe: jest.fn()
    };
  
    sink = new SubSink();
  })
  
  
  test('unsubscribes to subscriptions added through method', () => {
    sink.add(mockSubscription);
    sink.unsubscribe();
  
    expect(mockSubscription.unsubscribe).toHaveBeenCalledTimes(1);
  });
  
  test('unsubscribes to subscriptions added through property accessor', () => {
    sink.sink = mockSubscription;
    sink.unsubscribe();
  
    expect(mockSubscription.unsubscribe).toHaveBeenCalledTimes(1);
  });
  
  test('unsubscribes from subscription only once', () => {
    sink.sink = mockSubscription;
  
    sink.unsubscribe();
    sink.unsubscribe();
  
    expect(mockSubscription.unsubscribe).toHaveBeenCalledTimes(1);
  });
  
  test('unsubscribes from subscription only once', () => {
    sink.sink = mockSubscription;
    sink.sink = mockSubscription2;
  
    sink.unsubscribe();
  
    expect(mockSubscription.unsubscribe).toHaveBeenCalledTimes(1);
    expect(mockSubscription2.unsubscribe).toHaveBeenCalledTimes(1);
  });
  
  describe('does throw exception given SubscriptionLike is', () => {
    test('undefined', () => {
      sink.add(undefined);
      expect(() => sink.unsubscribe()).not.toThrow();
    });
  
    test('null', () => {
      sink.add(null);
      expect(() => sink.unsubscribe()).not.toThrow();
    });
  
    test('not a SubscriptionLike', () => {
      sink.add({} as any);
      expect(() => sink.unsubscribe()).not.toThrow();
    });
  
    test('containing a non function member with name unsubscribe', () => {
      sink.add({unsubscribe: '1'} as any);
      expect(() => sink.unsubscribe()).not.toThrow();
    });
  })
})

