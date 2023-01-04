<p align="center">
  <img width="300" src="https://user-images.githubusercontent.com/49458012/210445030-69feaadd-fe6a-42f1-9828-d7e954daa63e.png">
</p>

<p align="center">
  <a href="#about">About</a> •
  <a href="#installation">Installation</a> •
  <a href="#example">Example</a> •
  <a href="#api">Api</a> •
  <a href="#license">License</a>
</p>


## About

A simple queue

[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)


A simple queue for the front end.

## Installation

```bash

npm install --save @refamework/q
```

## Example

The queue can be initiated with a static method `create()` instead or `new`
operator:

```ts
import Queue from '@reframework/queue';

const queue = new Queue();
// The same with static method
const queue = Queue.create();
```

## Api

```ts
interface IQueue<Task> {
  enqueue: (task: Task) => IQueue
  dequeue: (filterFn: (task: Task) => boolean) => void;
  onDone: (listener: () => void) => void;
  onProcess: (listener: (task: Task, next: () => void) => void) => void;
  onEmpty: () => void;
  pipe: (queue: IQueue) => IQueue;
}
```
## License

MIT
