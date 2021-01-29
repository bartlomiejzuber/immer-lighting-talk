import React, { useReducer, useRef } from "react";
import produce from "immer";

import "./App.css";

const initialWizardReducerState = {
  wizards: [
    {
      name: "Saruman",
      skills: {},
      rings: 0,
      likesSauron: true,
    },
    {
      name: "Gandalf",
      skills: {
        offensive: {
          youShallNotPass: {
            stats: {
              block: 0,
              attack: 0,
            },
          },
          castingSpells: {
            stats: {},
          },
        },
        defensive: {
          smokingWeedFromPipe: {
            stats: {
              block: -200,
              attack: -500,
            },
          },
        },
      },
      rings: 1,
      likesSauron: false,
    },
  ],
};

const wizardReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_SKILL_STATS":
      const updateIndex = state.wizards.findIndex(
        (wizard) => wizard.name === action.payload.wizardName
      );
      const wizard = state.wizards[updateIndex];
      state.wizards.splice(updateIndex, 1);

      return {
        ...state,
        wizards: [
          ...state.wizards,
          {
            ...wizard,
            skills: {
              ...wizard.skills,
              [action.payload.skillType]: {
                ...wizard.skills[action.payload.skillType],
                [action.payload.skillName]: {
                  ...wizard.skills[action.payload.skillType][
                    action.payload.skillName
                  ],
                  stats: {
                    ...wizard.skills[action.payload.skillType][
                      action.payload.skillName
                    ].stats,
                    [action.payload.statName]: parseInt(
                      action.payload.value,
                      10
                    ),
                  },
                },
              },
            },
          },
        ],
      };
    default:
      return state;
  }
};

const immerWizardReducer = (draft, action) => {
  switch (action.type) {
    case "UPDATE_SKILL_STATS":
      const wizard = draft.wizards.find(
        (wizard) => wizard.name === action.payload.wizardName
      );

      wizard.skills[action.payload.skillType][action.payload.skillName].stats[
        action.payload.statName
      ] = parseInt(action.payload.value, 10);
      return;
    default:
      return;
  }
};

const curriedWizardReducer = produce(immerWizardReducer);

export const App = () => {
  const statTypeRef = useRef();
  const statNameRef = useRef();
  const skillNameRef = useRef();
  const statValueRef = useRef();
  const wizardNameRef = useRef();

  const [reducerState, dispatch] = useReducer(
    curriedWizardReducer,
    initialWizardReducerState
  );

  return (
    <div style={{ padding: 5 }}>
      <h2>Middle-earth wizards data</h2>
      <pre style={{ textAlign: "left", display: "inline-block" }}>
        {JSON.stringify(reducerState, null, "\t")}
      </pre>

      <select ref={wizardNameRef} placeholder="Wizard">
        <option val="Gandalf">Gandalf</option>
        <option val="Saruman">Saruman</option>
      </select>
      <select ref={statTypeRef} placeholder="Stat type">
        <option val="offensive">offensive</option>
        <option val="defensive">defensive</option>
      </select>
      <input ref={skillNameRef} placeholder="Skill name" />
      <input ref={statNameRef} placeholder="Stat name" />
      <input ref={statValueRef} placeholder="Stat value" type="number" />
      <button
        onClick={(ev) => {
          ev.preventDefault();

          dispatch({
            type: "UPDATE_SKILL_STATS",
            payload: {
              wizardName: wizardNameRef.current.value,
              skillType: statTypeRef.current.value,
              skillName: skillNameRef.current.value,
              statName: statNameRef.current.value,
              value: statValueRef.current.value,
            },
          });
        }}
      >
        Update stat
      </button>
    </div>
  );
};
