import React, { useCallback, useRef, useState } from "react";
import produce from "immer";
import { v4 as uuidv4 } from "uuid";

import "./App.css";

const initialState = {
  details: { eventName: "Isengard Party" },
  attendees: [
    { uuid: uuidv4(), name: "Mozfel Life-Drinker", attending: true },
    { uuid: uuidv4(), name: "Sigba the Deathbringer", attending: false },
    { uuid: uuidv4(), name: "Krirborg the JS developer", attending: false },
    { uuid: uuidv4(), name: "Zumug the Corruptor", attending: true },
  ],
};

export const App = () => {
  const [state, setState] = useState(initialState);
  const nameRef = useRef();

  const setEventName = useCallback(
    (value) => {
      setState({ ...state, details: { ...state.details, eventName: value } });

      // setState(
      //   produce((draft) => {
      //     draft.details.eventName = value;
      //   })
      // );
    },
    [state]
  );

  const updateAttending = useCallback(
    (uuid, newAttending) => {
      const updateIndex = state.attendees.findIndex(
        (uruk) => uruk.uuid === uuid
      );
      const urukToUpdate = state.attendees[updateIndex];
      const newArray = [...state.attendees];
      newArray.splice(updateIndex, 1, {
        ...urukToUpdate,
        attending: newAttending,
      });
      setState({
        ...state,
        attendees: newArray,
      });

      // setState(
      //   produce((draft) => {
      //     const uruk = draft.attendees.find((uruk) => uruk.uuid === uuid);
      //     uruk.attending = newAttending;
      //   })
      // );
    },
    [state]
  );

  const addAttendee = useCallback((name) => {
    setState({
      ...state,
      attendees: [
        ...state.attendees,
        { uuid: uuidv4(), attending: false, name },
      ],
    });

    // setState(
    //   produce((draft) => {
    //     draft.attendees.push({ uuid: uuidv4(), attending: false, name });
    //   })
    // );
  }, [state]);

  const removeAttendee = useCallback(
    (uuid) => {
      const newAttendees = state.attendees.filter((uruk) => uruk.uuid !== uuid);
      setState({
        ...state,
        attendees: newAttendees,
      });

      // setState(
    //   produce((draft) => {
    //     draft.attendees.push({ uuid: uuidv4(), attending: false, name });
    //   })
    // );
    },
    [state]
  );

  return (
    <div className="App">
      <input
        onChange={(e) => {
          const value = e.target.value;
          setEventName(value);
        }}
        value={state.details.eventName}
      />
      {state.attendees.map((uruk) => (
        <li key={uruk.uuid}>
          {uruk.name} - {uruk.attending ? "Going" : "Not Going"}
          <button
            onClick={(e) => {
              e.preventDefault();
              updateAttending(uruk.uuid, !uruk.attending);
            }}
          >
            {uruk.attending ? "Not Going" : "Going"}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              removeAttendee(uruk.uuid);
            }}
          >
            Remove
          </button>
        </li>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (nameRef.current.value) {
            addAttendee(nameRef.current.value);
            nameRef.current.value = "";
          }
        }}
      >
        <input ref={nameRef} placeholder="Uruk's name" required />
        <button>Add</button>
      </form>
    </div>
  );
};
