import { mapValues, capitalize } from "@kubric/litedash";
import { ActionsObject, GetActionsOptions, OperationsObject, TypesObject } from "./types";

/**
 * Converts string in store notation(eg. ATTRIBUTE_SELECTED) to camel case(attributeSelected)
 * @param str
 * @param splitBy
 */
const toCamelCase = (str: string = '', splitBy: string = '_') =>
  str.toLowerCase()
    .split(splitBy)
    .reduce((acc: string, split: string, index: number) =>
      `${acc}${index === 0 ? split : capitalize(split)}`, '');

/**
 * Accepts an array of types and a prefix and returns the types object
 * @param types
 * @param prefix
 */
export const getTypes = (types: string[] = [], prefix: string = ''): TypesObject =>
  types.reduce((acc: TypesObject, type: string) => {
    acc[type] = `${prefix}/${type}`;
    return acc;
  }, {});

/**
 * Accepts an array of types and returns actions object. Every action fn accepts a payload and returns an action object
 * in the format {type: <actionType>, payload: <payload>}
 * The action name will be the last part of the type name, split by _ and joined in camelCase
 * Eg: if the type is kubric/customizationpanel/ATTRIBUTE_SELECTED, the action name will be attributeSelected
 * @param types
 * @param transform
 */
export const getActions = (types: TypesObject = {}, { transform }: GetActionsOptions = {}): ActionsObject =>
  Object.keys(types)
    .reduce((acc: ActionsObject, typeKey: string) => {
      acc[toCamelCase(typeKey)] = payload => ({
        type: types[typeKey],
        payload: transform ? transform(payload) : payload,
      });
      return acc;
    }, {});

/**
 * To auto generate operations
 * @param actions
 * @param extra
 * @returns {*|{}}
 */
export const getOperations = (actions: ActionsObject = {}, extra: ActionsObject = {}): OperationsObject => {
  actions = Object.keys(actions)
    .reduce((acc: ActionsObject, actionName: string) => {
      acc[`on${capitalize(actionName)}`] = actions[actionName];
      return acc;
    }, {});
  return mapValues({
    ...actions,
    ...extra,
  }, (action: Function) => (...args: any[]) => (dispatch: Function) => dispatch(action(...args)));
};