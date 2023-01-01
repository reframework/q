import { IQueue } from './queue.interface';

/**
 * The Queue
 */
export class Queue<T = any> implements IQueue<T> {
  /**
   * The array of Tasks
   */
  #entries: T[] = [];

  /**
   * Determines if the queue is busy
   * If `#workInProgress` is `true` means the current Task is still running
   * and the next Task cannot be processed till the current one is completed.
   */
  #workInProgress = false;

  /**
   * Creates a new Queue
   */
  static create<T>() {
    return new Queue<T>();
  }

  /**
   * Adds a new Task to the queue
   */
  public enqueue = (task: T) => {
    this.#entries.push(task);
    this.#next();
    return this;
  };

  /**
   * Removes a task by a predicate.
   * Works like Array.prototype.filter
   */
  public dequeue = (filterFn: (task: T) => boolean) => {
    this.#entries = this.#entries.filter((task) => filterFn(task));
    return this;
  };

  /**
   * Processing the next task in the queue
   */
  #next() {
    if (this.#workInProgress) return;

    if (this.#entries.length === 0) {
      /** Queue is empty */
      return this.#onEmpty?.();
    }

    /** Begin work */
    this.#workInProgress = true;
    const nextTask = this.#entries.shift()!;

    const processTask = () => {
      this.#workInProgress = false;
      this.#onDone?.(nextTask);
      this.#destinationQueue?.enqueue?.(nextTask);
      this.#next();
    };

    /**
     * There might not be provided `#onProcess`, it does'nt make sense though
     */
    if (typeof this.#onProcess !== 'function') {
      // todo: dev warning: You might forget to define an `onProcessing` callback
      processTask();
    } else {
      this.#onProcess(nextTask, processTask);
    }
  }

  /**
   * A callback which runs each time when Queue is got empty
   */
  #onEmpty: () => void = () => undefined;

  /**
   * Defines an `#onEmpty` callback
   */
  onEmpty(listener: () => void) {
    this.#onEmpty = listener;
    return this;
  }

  /**
   * A callback which runs on each task when processing starts.
   */
  #onProcess: ((task: T, next: () => void) => void) | null = null;

  /**
   * Defines an `#onProcess` callback
   */
  onProcess(listener: (task: T, next: () => void) => void) {
    this.#onProcess = listener;
    return this;
  }

  /**
   * A callback which runs on each task when processing is finished.
   */
  #onDone: (task: T) => void = () => undefined;

  /**
   * Defines an `#onDone` callback
   */
  onDone(listener: (task: T) => void) {
    this.#onDone = listener;
    return this;
  }

  /**
   * Destination Queue, see `pipe`.
   */
  #destinationQueue: IQueue<any> | null = null;

  /**
   * Defines a destination Queue.
   * After processing the Task is pushed to the destination queue.
   */
  pipe<U>(queue: IQueue<U>) {
    this.#destinationQueue = queue;
    return this;
  }

  /**
   * A size of entries
   */
  get length() {
    return this.#entries.length;
  }
}
