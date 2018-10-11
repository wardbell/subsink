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

`npm install subsink --save`

## Angular example
```
export class SomeComponent implements OnDestroy {
  private subs = new SubSink();

  ...

  this.subs.sink = observable$.subscribe(...); // easy syntax

  this.subs.add(observable$.subscribe(...)); // if you insist

  this.subs.add( // can add multiple subcriptions
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
