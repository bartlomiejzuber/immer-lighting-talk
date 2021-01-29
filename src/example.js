import produce, { applyPatches } from "immer";

// const changeName = (person, name) => {
//   person.name = name;
//   return person;
// };

// const changeName = (person, name) => {
//   return {
//     ...person,
//     name
//   }
// };

const changeName = (person, name) => {
  return produce(person, (draft) => {
    draft.name = name;
  }, (forwardPatch, reversePatches) => {
    
  });
};

const addPerson = (people, person) => {
  people.push(person);
  return person;
};

const changeStreet = (person, street) => {
  person.address.street = street;
  return person;
};

export { changeName, addPerson, changeStreet };
