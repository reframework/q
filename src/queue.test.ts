import { Queue } from './queue';

describe('Queue', () => {
  it('should create a new Queue', () => {
    expect(new Queue()).toBeInstanceOf(Queue);
    expect(Queue.create()).toBeInstanceOf(Queue);
  });

  it('should enqueue and run a task immediately', () => {
    const task = {};
    const onProcess = jest.fn();
    Queue.create<typeof task>().onProcess(onProcess).enqueue(task);
    expect(onProcess).toHaveBeenCalledWith(task, expect.any(Function));
  });

  it('should work without onProcess provided', () => {
    const task1 = { theTask: 1 };
    const onDone = jest.fn();
    const onEmpty = jest.fn();

    Queue.create().onDone(onDone).onEmpty(onEmpty).enqueue(task1);

    expect(onDone).toHaveBeenCalled();
    expect(onEmpty).toHaveBeenCalled();
  });

  it('waits for a task to be processed and calls `onDone` and `onEmpty`', () => {
    const task1 = { theTask: 1 };
    const task2 = { theTask: 2 };

    let next = function next() {
      return undefined;
    };

    const onProcess = jest.fn().mockImplementation((_task, _next) => {
      next = _next;
    });

    const onDone = jest.fn();
    const onEmpty = jest.fn();

    Queue.create<typeof task1>()
      .onProcess(onProcess)
      .onDone(onDone)
      .onEmpty(onEmpty)
      .enqueue(task1)
      .enqueue(task2);

    // runs onProcess once the task is enqueued
    expect(onProcess).toHaveBeenLastCalledWith(task1, expect.any(Function));
    // the task is not done yet
    expect(onDone).not.toHaveBeenCalled();
    // finishing the first task
    next();
    // the queue is not empty yet
    expect(onEmpty).not.toHaveBeenCalled();
    // runs onProcess with second task
    expect(onProcess).toHaveBeenLastCalledWith(task2, expect.any(Function));
    // the second task is not done yet
    expect(onDone).toHaveBeenLastCalledWith(task1);
    // the queue is not empty yet
    expect(onEmpty).not.toHaveBeenCalled();
    // finishing the second task
    next();
    expect(onDone).toHaveBeenLastCalledWith(task2);
    // should be empty now!
    expect(onEmpty).toHaveBeenCalledTimes(1);
  });

  it('runs dequeue', () => {
    const task1 = { theTask: 1 };
    const task2 = { theTask: 2 };
    const task3 = { theTask: 3 };
    const task4 = { theTask: 4 };

    let next = function next() {
      return undefined;
    };

    const onProcess = jest.fn().mockImplementation((_task, _next) => {
      next = _next;
    });

    Queue.create<typeof task1>()
      .onProcess(onProcess)
      .enqueue(task1)
      .enqueue(task2)
      .enqueue(task3)
      .enqueue(task4)
      .filter(({ theTask }) => theTask === 1 || theTask === 3);

    // runs four times because four tasks are enqueued
    next();
    next();
    next();
    next();

    expect(onProcess).toHaveBeenCalledTimes(2);
    expect(onProcess).toHaveBeenNthCalledWith(1, task1, expect.any(Function));
    expect(onProcess).toHaveBeenNthCalledWith(2, task3, expect.any(Function));
  });

  it('runs pipe', () => {
    const task1 = { theTask: 1 };
    const task2 = { theTask: 2 };

    let next = function next() {
      return undefined;
    };

    const onProcess = jest.fn().mockImplementation((_task, _next) => {
      next = _next;
    });

    Queue.create()
      // checking onProcess in destination queue
      .pipe(Queue.create().onProcess(onProcess))
      .enqueue(task1)
      .enqueue(task2);

    next();
    next();

    expect(onProcess).toHaveBeenCalledTimes(2);
    expect(onProcess).toHaveBeenNthCalledWith(1, task1, expect.any(Function));
    expect(onProcess).toHaveBeenNthCalledWith(2, task2, expect.any(Function));
  });
});
