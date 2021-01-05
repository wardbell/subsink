const isFunction = (fn: any) => typeof fn === 'function';
export type Nullable<T> = T | null | undefined;

export interface SubscriptionLike {
  sink?: SubscriptionLike;
  unsubscribe(): void;
}

/**
 * Subscription sink that holds Observable subscriptions
 * until you call unsubscribe on it in ngOnDestroy.
 */
export class SubSink {

  protected _subs: Nullable<SubscriptionLike>[] = [];
  protected _subx: { [subId: string]: Nullable<SubscriptionLike> } = {};

  /**
   * Subscription sink that holds Observable subscriptions
   * until you call unsubscribe on it in ngOnDestroy.
   *
   * @example
   * In Angular:
   * ```
   *   private subs = new SubSink();
   *   ...
   *   this.subs.sink = observable$.subscribe(...)
   *   this.subs.add(observable$.subscribe(...));
   *   ...
   *   this.subs.id('my_sub').unsubscribe();
   *   this.subs.id('my_sub').sink = observable$.subscribe(...);
   *   ...
   *   ngOnDestroy() {
   *     this.subs.unsubscribe();
   *   }
   * ```
   */
  constructor() {}

  /**
   * Add subscriptions to the tracked subscriptions
   * @example
   *  this.subs.add(observable$.subscribe(...));
   */
  add(...subscriptions: Nullable<SubscriptionLike>[]) {
    this._subs = this._subs.concat(subscriptions);
  }

  /**
   * Assign subscription to this sink to add it to the tracked subscriptions
   * @example
   *  this.subs.sink = observable$.subscribe(...);
   */
  set sink(subscription: Nullable<SubscriptionLike>) {
    this._subs.push(subscription);
  }

  /**
   * Tracke subscriptions by subId
   * @example
   *  this.subs.id('my_sub').unsubscribe();
   *  this.subs.id('my_sub').sink = observable$.subscribe(...);
   */
  id(subId: string) {
    const subSink: SubscriptionLike = {
      unsubscribe: () => this.unsub(subId),
    };
    Object.defineProperty(subSink, 'sink', {
      set: (subscription: Nullable<SubscriptionLike>) => {
        this.unsub(subId);
        this._subx[subId] = subscription;
      },
      enumerable: true,
      configurable: true,
    });
    return subSink;
  }

  /**
   * Unsubscribe to all subscriptions in ngOnDestroy()
   * @example
   *   ngOnDestroy() {
   *     this.subs.unsubscribe();
   *   }
   */
  unsubscribe() {
    this._subs.forEach(sub => sub && isFunction(sub.unsubscribe) && sub.unsubscribe());
    this._subs = [];
    Object.keys(this._subx).forEach(subId => this.unsub(subId));
    this._subx = {};
  }

  /**
   * Unsubscribe subscription by SubId
   * @param subId 
   */
  private unsub(subId: string) {
    if (this._subx[subId] && isFunction(this._subx[subId].unsubscribe)) {
      this._subx[subId].unsubscribe();
    }
  }
}
