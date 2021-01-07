import { SubSink, SubscriptionLike } from '../src/subsink';

describe('SubSink', () => {
  let mockSubscription: SubscriptionLike;
  let mockSubscription2: SubscriptionLike;
  let subs: SubSink;
  
  beforeEach(() => {
    mockSubscription = {
      unsubscribe: jest.fn()
    };
    mockSubscription2 = {
      unsubscribe: jest.fn()
    };
  
    subs = new SubSink();
  })
  
  
  test('unsubscribes to subscriptions added through method', () => {
    subs.add(mockSubscription);
    subs.unsubscribe();
  
    expect(mockSubscription.unsubscribe).toHaveBeenCalledTimes(1);
  });
  
  test('unsubscribes to subscriptions added through property accessor', () => {
    subs.sink = mockSubscription;
    subs.unsubscribe();
  
    expect(mockSubscription.unsubscribe).toHaveBeenCalledTimes(1);
  });

  test('unsubscribes to subscriptions added through ".id" method accessor', () => {
    subs.id('my_sub').sink = mockSubscription;
    subs.id('my_sub').unsubscribe();
  
    expect(mockSubscription.unsubscribe).toHaveBeenCalledTimes(1);
  });
  
  test('unsubscribes from subscription only once', () => {
    subs.sink = mockSubscription;
  
    subs.unsubscribe();
    subs.unsubscribe();
  
    expect(mockSubscription.unsubscribe).toHaveBeenCalledTimes(1);
  });
  
  test('unsubscribes from subscription only once', () => {
    subs.sink = mockSubscription;
    subs.sink = mockSubscription2;
  
    subs.unsubscribe();
  
    expect(mockSubscription.unsubscribe).toHaveBeenCalledTimes(1);
    expect(mockSubscription2.unsubscribe).toHaveBeenCalledTimes(1);
  });
  
  describe('does throw exception given SubscriptionLike is', () => {
    test('undefined', () => {
      subs.add(undefined);
      expect(() => subs.unsubscribe()).not.toThrow();
    });
  
    test('null', () => {
      subs.add(null);
      expect(() => subs.unsubscribe()).not.toThrow();
    });
  
    test('not a SubscriptionLike', () => {
      subs.add({} as any);
      expect(() => subs.unsubscribe()).not.toThrow();
    });
  
    test('containing a non function member with name unsubscribe', () => {
      subs.add({unsubscribe: '1'} as any);
      expect(() => subs.unsubscribe()).not.toThrow();
    });
  })
})

