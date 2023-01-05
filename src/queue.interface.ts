export interface IQueue<T = any> {
  /**
   * Add an element to the end of the queue
   */
  enqueue: (task: T) => IQueue<T>;
  /**
   * Removes a task from a front of the queue.
   * dequeue: () => IQueue<T>;
   */
  /**
   * Removes an element by a predicate like Array.prototype.filter
   */
  filter: (filterFn: (task: T) => boolean) => IQueue<T>;
  /**
   * returns the number of elements in the queue
   */
  size: () => number;
  /**
   * Provide an `#onDone` callback
   */
  onDone: (listener: () => void) => IQueue<T>;
  /**
   * Provide an `#onProcess` callback
   */
  onProcess: (listener: (task: T, next: () => void) => void) => IQueue<T>;
  /**
   * Provide an `#onEmpty` callback
   */
  onEmpty: (listener: () => void) => IQueue<T>;
  /**
   * Provide a destination Queue.
   * The Task goes to the destination queue after processing.
   */
  pipe: <U>(queue: IQueue<U>) => IQueue<T>;
}
