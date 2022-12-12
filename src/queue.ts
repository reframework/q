export interface IQueue<T = any> {
  enqueue: (task: T) => void;
  dequeue: (filterFn: (task: T) => boolean) => void;
  onDone: (listener: () => void) => void;
  onProcess: (listener: (task: T, next: () => void) => void) => void;
}

/**
 * The Queue
 */
export class Queue<T = any> implements IQueue<T> {
  /**
   * @private
   * The array of Tasks
   */
  #queue: T[] = [];

  /**
   * @private
   * Determines if the queue is busy
   * If `#workInProgress` is `true` means the current Task is still running
   * and next Task cannot be processed until the current one is completed.
   */
  #workInProgress = false;

  /**
   * @static
   * Creates a new Queue
   * Just a factory method for convenience
   */
  static create<T>() {
    return new Queue<T>();
  }

  /**
   * Adds a new Task to the queue
   */
  public enqueue = (task: T) => {
    this.#queue.push(task);
    this.#next();
    return this;
  };

  /**
   * Removes a task by a predicate.
   * Works like Array.prototype.filter
   */
  public dequeue = (filterFn: (task: T) => boolean) => {
    this.#queue = this.#queue.filter((task) => filterFn(task));
    return this;
  };

  /**
   * @private
   * Processing the next task in the queue
   */
  #next() {
    if (this.#workInProgress) return;

    if (this.#queue.length === 0) {
      /** Queue is empty */
      return this.#onEmpty?.();
    }

    /** Begin work */
    this.#workInProgress = true;
    const nextTask = this.#queue.shift()!;

    const processTask = () => {
      this.#workInProgress = false;
      this.#onDone?.(nextTask);
      this.#destinationQueue?.enqueue?.(nextTask);
      this.#next();
    };

    /**
     * There might not be provided `#onProcess`, it does'nt make sense though
     */
    console.log(typeof this.#onProcess, '\n CALLING PROCES');
    if (typeof this.#onProcess !== 'function') {
      // todo: dev warning: You might forget to define an `onProcessing` callback
      processTask();
    } else {
      this.#onProcess(nextTask, processTask);
    }
  }

  /**
   * @private
   * A callback which runs each time when Queue is got empty
   */
  #onEmpty: () => void = () => {};

  /**
   * Defines an `#onEmpty` callback
   * See #onEmpty description for more info.
   */
  onEmpty(listener: () => void) {
    this.#onEmpty = listener;
    return this;
  }

  /**
   *  @private
   * A callback which runs on each task when processing starts.
   */
  #onProcess: ((task: T, next: () => void) => void) | null = null;

  /**
   * Defines an `#onProcess` callback
   * See #onProcess description for more info.
   */
  onProcess(listener: (task: T, next: () => void) => void) {
    this.#onProcess = listener;
    return this;
  }

  /**
   * A callback which runs on each task when processing is finished.
   */
  #onDone: (task: T) => void = () => {};

  /**
   * Defines an `#onDone` callback
   * See `#onDone` description for more info.
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
}
