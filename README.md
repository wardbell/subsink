[![npm](https://img.shields.io/npm/dt/ngx-auto-unsubscribe.svg)]()
[![Build Status](https://semaphoreci.com/api/v1/netanel7799/ngx-auto-unsubscribe/branches/master/badge.svg)](https://semaphoreci.com/netanel7799/ngx-auto-unsubscribe)
[![Build Status](https://travis-ci.org/NetanelBasal/ngx-auto-unsubscribe.svg?branch=master)](https://travis-ci.org/NetanelBasal/ngx-auto-unsubscribe)
[![npm](https://img.shields.io/npm/l/ngx-auto-unsubscribe.svg)]()
[![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/sindresorhus/awesome)

# SubSink
**RxJS subscription sink for unsubscribing gracefully in a component.**

SubSink is a dead simple class to absorb RxJS subscriptions in an array.

Call `unsubscribe()` to unsubscribe all of them, as you would do 
in your component library's `unmount`/`onDestroy` lifecycle event.

## Installation

```bash
npm install subsink --save
```
## Angular examples

There are 2 main ways to use the SubSink: the "easy" way and the "add/array" way.

> RxJS supports adding subscriptions to an array of subscriptions. You can then unsubscribe directly from that array. If this appeals to you, then feel free to use it. If you prefer the technique with SubSink using the setter (aka easy) syntax below, then use that. Either way, no judgments are made. This is entirely up to you to decide.

### Easy Syntax

Example using the `sink` property to collect the subscriptions using a setter.

```ts
export class SomeComponent implements OnDestroy {
  private subs = new SubSink();

  ...
  this.subs.sink = observable$.subscribe(...);
  this.subs.sink = observable$.subscribe(...);
  this.subs.sink = observable$.subscribe(...);
  ...

  // Unsubscribe when the component dies
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
```

### The Array/Add Technique

Example using the `.add` technique. This is similar to what RxJS supports out of the box.

```tsgst
export class SomeComponent implements OnDestroy {
  private subs = new SubSink();

  ...

  this.subs.add(observable$.subscribe(...)); 

  this.subs.add(observable$.subscribe(...)); 

  // Add multiple subscriptions at the same time
  this.subs.add( 
    observable$.subscribe(...),
    anotherObservable$.subscribe(...)
  ); 

  ...

  // Unsubscribe when the component dies
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
```
