export type EditingIsNotPermittedError = {
  name: 'EditingIsNotPermittedError',
  description?: string,
  type: 'domain-error',
}

export type AddingIsNotPermittedError = {
  name: 'AddingIsNotPermittedError',
  description?: string,
  type: 'domain-error',
}

export type DeletingIsNotPermittedError = {
  name: 'DeletingIsNotPermittedError',
  description?: string,
  type: 'domain-error',
}

export type GettingIsNotPermittedError = {
  name: 'GettingIsNotPermittedError',
  description?: string,
  type: 'domain-error',
}

export type AggregateDoesNotExistError = {
  name: 'AggregateDoesNotExistError',
  description?: string,
  type: 'domain-error',
}
