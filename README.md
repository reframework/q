# q

# Introduction

The queue.

## Instalation

```bash
npm install @refamework/q
yarn add @refamework/q
```

## Usage

The queue can be initiated with a static method `create()` instead or `new`
operator:

```ts
import Queue from '@reframework/queue';

const queue = new Queue();
// The same with static method
const queue = Queue.create();
```

## Documentation

```ts
interface IQueue<Task> {
  /**
   * Adds a new item (task) to the queue.
   */
  enqueue: (task: Task) => IQueue;
  /**
   * Removes a task by a predicate.
   * Works like Array.prototype.filter
   */
  dequeue: (filterFn: (task: Task) => boolean) => void;
  /**
   * Defines a callback which runs on each task when it is done.
   */
  onDone: (listener: () => void) => void;
  /**
   * Defines a callback which runs on each task when processing starts.
   */
  onProcess: (listener: (task: Task, next: () => void) => void) => void;
  /**
   * Defines a callback which runs each time when queue is got empty
   */
  onEmpty: () => void;
  /**
   * Defines a destination Queue to which the task is pushed after processing
   */
  pipe: (queue: IQueue) => IQueue;
}
```

## Make it async

```
//
```

## Test

```bash
yarn test
```
