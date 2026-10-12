import { Result } from './Result';

describe('Result', () => {
  describe('ok', () => {
    it('should create a successful Result', () => {
      const result = Result.ok(42);
      expect(result.isOk()).toBe(true);
      expect(result.isFail()).toBe(false);
      expect(result.value).toBe(42);
      expect(result.error).toBeUndefined();
    });

    it('should work with different types', () => {
      const stringResult = Result.ok('hello');
      expect(stringResult.value).toBe('hello');

      const objectResult = Result.ok({ name: 'John' });
      expect(objectResult.value).toEqual({ name: 'John' });
    });
  });

  describe('fail', () => {
    it('should create a failed Result', () => {
      const error = new Error('Something went wrong');
      const result = Result.fail<number>(error);
      expect(result.isOk()).toBe(false);
      expect(result.isFail()).toBe(true);
      expect(result.error).toBe(error);
      expect(result.value).toBeUndefined();
    });
  });

  describe('isOk', () => {
    it('should return true for successful Results', () => {
      expect(Result.ok(1).isOk()).toBe(true);
    });

    it('should return false for failed Results', () => {
      expect(Result.fail(new Error()).isOk()).toBe(false);
    });
  });

  describe('isFail', () => {
    it('should return false for successful Results', () => {
      expect(Result.ok(1).isFail()).toBe(false);
    });

    it('should return true for failed Results', () => {
      expect(Result.fail(new Error()).isFail()).toBe(true);
    });
  });

  describe('map', () => {
    it('should transform the value if successful', () => {
      const result = Result.ok(5).map(x => x * 2);
      expect(result.isOk()).toBe(true);
      expect(result.value).toBe(10);
    });

    it('should preserve the error if failed', () => {
      const error = new Error('Failed');
      const result = Result.fail<number>(error).map(x => x * 2);
      expect(result.isFail()).toBe(true);
      expect(result.error).toBe(error);
    });
  });

  describe('flatMap', () => {
    it('should chain successful Results', () => {
      const result = Result.ok(5)
        .flatMap(x => Result.ok(x * 2))
        .flatMap(x => Result.ok(x + 1));
      expect(result.isOk()).toBe(true);
      expect(result.value).toBe(11);
    });

    it('should short-circuit on first failure', () => {
      const error = new Error('Failed at step 1');
      const result = Result.ok(5)
        .flatMap(() => Result.fail<number>(error))
        .flatMap(() => Result.ok(100));
      expect(result.isFail()).toBe(true);
      expect(result.error).toBe(error);
      expect(result.value).toBeUndefined();
    });
  });

  describe('onSuccess', () => {
    it('should execute callback on successful Result', () => {
      const callback = jest.fn();
      Result.ok(42).onSuccess(callback);
      expect(callback).toHaveBeenCalledWith(42);
    });

    it('should not execute callback on failed Result', () => {
      const callback = jest.fn();
      Result.fail(new Error()).onSuccess(callback);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should allow chaining', () => {
      const result = Result.ok(5)
        .onSuccess(x => {
          expect(x).toBe(5);
        })
        .map(x => x * 2);
      expect(result.value).toBe(10);
    });
  });

  describe('onFail', () => {
    it('should execute callback on failed Result', () => {
      const callback = jest.fn();
      const error = new Error('Failed');
      Result.fail<number>(error).onFail(callback);
      expect(callback).toHaveBeenCalledWith(error);
    });

    it('should not execute callback on successful Result', () => {
      const callback = jest.fn();
      Result.ok(42).onFail(callback);
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('getOrElse', () => {
    it('should return the value if successful', () => {
      expect(Result.ok(42).getOrElse(0)).toBe(42);
    });

    it('should return the default value if failed', () => {
      expect(Result.fail<number>(new Error()).getOrElse(0)).toBe(0);
    });
  });

  describe('getOrThrow', () => {
    it('should return the value if successful', () => {
      expect(Result.ok(42).getOrThrow()).toBe(42);
    });

    it('should throw the error if failed', () => {
      const error = new Error('Failed');
      expect(() => {
        Result.fail<number>(error).getOrThrow();
      }).toThrow(error);
    });
  });
});
