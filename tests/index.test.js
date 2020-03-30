import { getTypes, getActions, getOperations } from "../src/index";

describe("getTypes test", () => {
  it("Should return empty object", () => expect(getTypes()).toEqual({}));

  it("Should return types without prefixes", () => {
    const typesObject = getTypes(["type1", "type2"]);
    const count = Object.keys(typesObject).length;
    const check1 = typesObject["type1"] === "type1";
    const check2 = typesObject["type2"] === "type2";
    return expect(count === 2 && check1 === true && check2 === true).toEqual(true);
  });

  it("Should return types with prefixes", () => {
    const typesObject = getTypes(["type1", "type2"], "kubric");
    const count = Object.keys(typesObject).length;
    const check1 = typesObject["type1"] === "kubric/type1";
    const check2 = typesObject["type2"] === "kubric/type2";
    return expect(count === 2 && check1 === true && check2 === true).toEqual(true);
  });
});

describe("getActions test", () => {

  it("Should return empty object", () => expect(getActions()).toEqual({}));

  it("Should return proper actions object", () => {
    const typesObject = getTypes(["type1", "type2"], "kubric");
    const actionsObject = getActions(typesObject);
    const count = Object.keys(actionsObject).length;
    const type1ActionObject = actionsObject.type1({
      test: 123
    });
    const type2ActionObject = actionsObject.type2(false);
    return expect({
      count,
      type1: type1ActionObject,
      type2: type2ActionObject
    }).toEqual({
      count: 2,
      type1: {
        type: "kubric/type1",
        payload: {
          test: 123
        }
      },
      type2: {
        type: "kubric/type2",
        payload: false
      }
    });
  });

  it("Should return proper actions object with transform", () => {
    const typesObject = getTypes(["type1", "type2"], "kubric");
    const actionsObject = getActions(typesObject, {
      transform(payload, typeKey, types) {
        if (typeKey === "type1") {
          return 1;
        } else if (types[typeKey] === "kubric/type2") {
          return JSON.stringify(payload);
        }
      }
    });
    const type1ActionObject = actionsObject.type1({
      test: 123
    });
    const type2ActionObject = actionsObject.type2({
      test: 123
    });
    return expect({
      type1: type1ActionObject,
      type2: type2ActionObject
    }).toEqual({
      type1: {
        type: "kubric/type1",
        payload: 1
      },
      type2: {
        type: "kubric/type2",
        payload: "{\"test\":123}"
      }
    });
  });

});

describe("getOperations test", () => {

  it("Should return empty object", () => expect(getOperations()).toEqual({}));

  it("Should return proper operations object", () => {
    const typesObject = getTypes(["type1", "type2"], "kubric");
    const actionsObject = getActions(typesObject);
    const operationsObject = getOperations(actionsObject);
    const count = Object.keys(operationsObject).length;
    const type1Dispatcher = operationsObject.onType1({
      test: 123
    });
    const type2Dispatcher = operationsObject.onType2(false);
    const dispatch = (...args) => args;
    const type1Results = type1Dispatcher(dispatch);
    const type2Results = type2Dispatcher(dispatch);
    return expect({
      count,
      type1: type1Results,
      type2: type2Results
    }).toEqual({
      count: 2,
      type1: [{
        type: "kubric/type1",
        payload: {
          test: 123
        }
      }],
      type2: [{
        type: "kubric/type2",
        payload: false
      }]
    })
  });

  it("Should return proper operations object with extra actions", () => {
    const typesObject = getTypes(["type1", "type2"], "kubric");
    const actionsObject = getActions(typesObject);
    const operationsObject = getOperations(actionsObject, {
      type3: () => ({
        type: "action3",
        payload: 123
      })
    });
    const count = Object.keys(operationsObject).length;
    const type1Dispatcher = operationsObject.onType1({
      test: 123
    });
    const type2Dispatcher = operationsObject.onType2(false);
    const type3Dispatcher = operationsObject.type3(false);
    const dispatch = (...args) => args;
    const type1Results = type1Dispatcher(dispatch);
    const type2Results = type2Dispatcher(dispatch);
    const type3Results = type3Dispatcher(dispatch);
    return expect({
      count,
      type1: type1Results,
      type2: type2Results,
      type3: type3Results
    }).toEqual({
      count: 3,
      type1: [{
        type: "kubric/type1",
        payload: {
          test: 123
        }
      }],
      type2: [{
        type: "kubric/type2",
        payload: false
      }],
      type3: [{
        type: "action3",
        payload: 123
      }]
    })
  });

});