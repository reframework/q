export interface IQueue<T = any> {
  enqueue: (task: T) => void;
  dequeue: (filterFn: (task: T) => boolean) => void;
  onDone: (listener: () => void) => void;
  onProcess: (listener: (task: T, next: () => void) => void) => void;
}

export class Queue<T = any> implements IQueue<T> {
  private queue: T[] = [];

  private workInProgress = false;

  static create<T>() {
    return new Queue<T>();
  }

  public enqueue = (task: T) => {
    this.queue.push(task);
    this.next();
  };

  public dequeue = (filterFn: (task: T) => boolean) => {
    this.queue.filter((task) => filterFn(task));
  };

  private next() {
    if (this.workInProgress) return;

    if (this.queue.length === 0) {
      /** Queue is empty */
      return this._onEmpty?.();
    }

    /** Begin work */
    this.workInProgress = true;
    const nextTask = this.queue.shift()!;

    this._onProcess(nextTask, () => {
      this.workInProgress = false;
      this._onDone?.(nextTask);
      this.destinationQueue?.enqueue?.(nextTask);
      this.next();
    });
  }

  private _onEmpty: () => void = () => {};
  onEmpty(listener: () => void) {
    this._onEmpty = listener;
    return this;
  }

  private _onProcess: (task: T, next: () => void) => void = () => {};
  onProcess(listener: (task: T, next: () => void) => void) {
    this._onProcess = listener;
    return this;
  }

  private _onDone: (task: T) => void = () => {};
  onDone(listener: (task: T) => void) {
    this._onDone = listener;
    return this;
  }

  private destinationQueue: IQueue<any> | null = null;
  pipe<U>(queue: IQueue<U>) {
    this.destinationQueue = queue;
    return this;
  }
}
