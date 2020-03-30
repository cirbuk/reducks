export interface TypesObject {
  [index: string]: string
}

export interface Action {
  type: string,
  payload?: any
}

type ActionFunctionType = (payload: any) => Action;

export interface ActionsObject {
  [index: string]: ActionFunctionType
}

export interface GetActionsOptions {
  transform?(payload: any): any
}

type DispatcherFunction = (dispatch: Function) => void;

type OperationFunction = (...args: any[]) => DispatcherFunction;

export type OperationsObject = {
  [index: string]: OperationFunction
}