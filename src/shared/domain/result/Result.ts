/**
 * A Result type that represents either a successful value (Ok) or a failure (Fail).
 * Provides a type-safe way to handle operations that may fail.
 */
export class Result<T> {
  private constructor(
    private readonly _value?: T,
    private readonly _error?: Error,
  ) {}

  /**
   * Creates a successful Result with the given value.
   */
  static ok<U>(value: U): Result<U> {
    return new Result(value);
  }

  /**
   * Creates a failed Result with the given error.
   */
  static fail<U>(error: Error): Result<U> {
    return new Result<U>(undefined, error);
  }

  /**
   * Checks if the Result is successful.
   */
  isOk(): boolean {
    return this._error === undefined;
  }

  /**
   * Checks if the Result is a failure.
   */
  isFail(): boolean {
    return this._error !== undefined;
  }

  /**
   * Returns the value if successful, undefined otherwise.
   */
  get value(): T | undefined {
    return this._value;
  }

  /**
   * Returns the error if failed, undefined otherwise.
   */
  get error(): Error | undefined {
    return this._error;
  }

  /**
   * Maps the value if successful, otherwise returns the same failure.
   */
  map<U>(fn: (value: T) => U): Result<U> {
    if (this.isOk()) {
      return Result.ok(fn(this._value!));
    }
    return Result.fail(this._error!);
  }

  /**
   * Chains Results together, flattening the result.
   */
  flatMap<U>(fn: (value: T) => Result<U>): Result<U> {
    if (this.isOk()) {
      return fn(this._value!);
    }
    return Result.fail(this._error!);
  }

  /**
   * Executes a function for side effects if successful.
   */
  onSuccess(fn: (value: T) => void): Result<T> {
    if (this.isOk()) {
      fn(this._value!);
    }
    return this;
  }

  /**
   * Executes a function for side effects if failed.
   */
  onFail(fn: (error: Error) => void): Result<T> {
    if (this.isFail()) {
      fn(this._error!);
    }
    return this;
  }

  /**
   * Returns the value if successful, otherwise returns the default value.
   */
  getOrElse(defaultValue: T): T {
    return this.isOk() ? this._value! : defaultValue;
  }

  /**
   * Returns the value if successful, otherwise throws the error.
   */
  getOrThrow(): T {
    if (this.isFail()) {
      throw this._error;
    }
    return this._value!;
  }
}
