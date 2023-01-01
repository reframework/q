export interface IQueue<T = any> {
  /**
   * Adds a new Task to the queue
   */
  enqueue: (task: T) => IQueue<T>;
  /**
   * Removes a task by a predicate.
   * Works like Array.prototype.filter
   */
  dequeue: (filterFn: (task: T) => boolean) => IQueue<T>;
  /**
   * returns length
   */
  length: number;
  /**
   * Defines an `#onDone` callback
   */
  onDone: (listener: () => void) => IQueue<T>;
  /**
   * Defines an `#onProcess` callback
   */
  onProcess: (listener: (task: T, next: () => void) => void) => IQueue<T>;
  /**
   * Defines an `#onEmpty` callback
   */
  onEmpty: (listener: () => void) => IQueue<T>;
  /**
   * Defines a destination Queue.
   * After processing the Task is pushed to the destination queue.
   */
  pipe: <U>(queue: IQueue<U>) => IQueue<T>;
}
