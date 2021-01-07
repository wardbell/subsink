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
  protected _subz: { [subId: string]: Nullable<SubscriptionLike> } = {};

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
   *   this.subs.id('my_sub').sink = observable$.subscribe(...);
   *   // Unsubscribe by subId
   *   this.subs.id('my_sub').unsubscribe();
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
   *  this.subs.id('my_sub').sink = observable$.subscribe(...);
   *  // Unsubscribe by subId
   *  this.subs.id('my_sub').unsubscribe();
   */
  id(subId: string, isKeepPrev: boolean = false, isSubz: boolean = false) {
    const subscriptionLike: SubscriptionLike = {
      unsubscribe: () => this.unsub(subId, isSubz),
    };
    Object.defineProperty(subscriptionLike, 'sink', {
      set: (subscription: Nullable<SubscriptionLike>) => {
        if (!isKeepPrev) this.unsub(subId, isSubz);
        (isSubz ? this._subz : this._subx)[subId] = subscription;
      },
      enumerable: true,
      configurable: true,
    });
    return subscriptionLike;
  }

  /**
   * Tracke subscriptions by subId, the subscription will not be unsubscribed by "subs.unsubscribe" method.
   * You should unsubscribe it manually.
   * @example
   *  this.subs.id_('my_sub').sink = observable$.subscribe(...);
   *  // Unsubscribe manually
   *  this.subs.id_('my_sub').unsubscribe();
   */
  id_(subId: string, isKeepPrev: boolean = false) {
    return this.id(subId, isKeepPrev, true);
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
  private unsub(subId: string, isSubz: boolean = false) {
    const subs = isSubz ? this._subz : this._subx;
    if (subs[subId] && isFunction(subs[subId].unsubscribe)) {
      subs[subId].unsubscribe();
    }
  }
}
