export type Success<T> = {
  status: true;
  success: T;
};

export type Failure<E> = {
  status: false;
  failure: E;
};

export type Result<T, E> = Success<T> | Failure<E>;
