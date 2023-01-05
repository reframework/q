import { IQueue } from './queue.interface';

/**
 * The Queue
 */
export class Queue<T = any> implements IQueue<T> {
  #entries: T[] = [];

  /**
   * Determines if the queue is busy
   * If `#workInProgress` is `true` means the current Task is still running
   * and the next Task cannot be processed till the current one is completed.
   */
  #workInProgress = false;

  static create<T>() {
    return new Queue<T>();
  }

  size() {
    return this.#entries.length;
  }

  public enqueue(...tasks: T[]) {
    this.#entries.push(...tasks);
    this.#next();
    return this;
  }

  // todo tasks cancelling
  public filter(filterFn: (task: T) => boolean) {
    this.#entries = this.#entries.filter((task) => filterFn(task));
    return this;
  }

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
      try {
        this.#onProcess(nextTask, processTask);
      } catch (e) {
        /**
         * todo: handle failures
         */
        this.#onFailed?.(e, nextTask);
        this.#workInProgress = false;
        this.#next();
      }
    }
  }

  #onEmpty: () => void = () => undefined;

  onEmpty(listener: () => void) {
    this.#onEmpty = listener;
    return this;
  }

  #onProcess: ((task: T, next: () => void) => void) | null = null;

  onProcess(listener: (task: T, next: () => void) => void) {
    this.#onProcess = listener;
    return this;
  }

  #onDone: (task: T) => void = () => undefined;

  onDone(listener: (task: T) => void) {
    this.#onDone = listener;
    return this;
  }

  #onFailed: (e: unknown, task: T) => void = () => undefined;

  onFailed(listener: (e: unknown, task: T) => void) {
    this.#onFailed = listener;
    return this;
  }

  #destinationQueue: IQueue<any> | null = null;

  pipe<U>(queue: IQueue<U>) {
    this.#destinationQueue = queue;
    return this;
  }
}
