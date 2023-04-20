import { IQueue } from './queue.interface';

/**
 * The Queue
 */
export class Queue<T = any> implements IQueue<T> {
  private _entries: T[] = [];

  /**
   * Determines if the queue is busy
   * If `_workInProgress` is `true` means the current Task is still running
   * and the next Task cannot be processed till the current one is completed.
   */
  private _workInProgress = false;

  static create<T>() {
    return new Queue<T>();
  }

  size() {
    return this._entries.length;
  }

  public enqueue(...tasks: T[]) {
    this._entries.push(...tasks);
    this._next();
    return this;
  }

  // todo tasks cancelling
  public filter(filterFn: (task: T) => boolean) {
    this._entries = this._entries.filter((task) => filterFn(task));
    return this;
  }

  private _next() {
    if (this._workInProgress) return;

    if (this._entries.length === 0) {
      /** Queue is empty */
      return this._onEmpty?.();
    }

    /** Begin work */
    this._workInProgress = true;
    const nextTask = this._entries.shift()!;

    const processTask = () => {
      this._workInProgress = false;
      this._onDone?.(nextTask);
      this._destinationQueue?.enqueue?.(nextTask);
      this._next();
    };

    /**
     * There might not be provided `_onProcess`, it does'nt make sense though
     */
    if (typeof this._onProcess !== 'function') {
      // todo: dev warning: You might forget to define an `onProcessing` callback
      processTask();
    } else {
      try {
        this._onProcess(nextTask, processTask);
      } catch (e) {
        /**
         * todo: handle failures
         */
        this._onFailed?.(e, nextTask);
        this._workInProgress = false;
        this._next();
      }
    }
  }

  private _onEmpty: () => void = () => undefined;

  onEmpty(listener: () => void) {
    this._onEmpty = listener;
    return this;
  }

  private _onProcess: ((task: T, next: () => void) => void) | null = null;

  onProcess(listener: (task: T, next: () => void) => void) {
    this._onProcess = listener;
    return this;
  }

  private _onDone: (task: T) => void = () => undefined;

  onDone(listener: (task: T) => void) {
    this._onDone = listener;
    return this;
  }

  private _onFailed: (e: unknown, task: T) => void = () => undefined;

  onFailed(listener: (e: unknown, task: T) => void) {
    this._onFailed = listener;
    return this;
  }

  private _destinationQueue: IQueue<any> | null = null;

  pipe<U>(queue: IQueue<U>) {
    this._destinationQueue = queue;
    return this;
  }
}
