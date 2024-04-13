import { useReducer } from 'react';
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import './App.css';
import './styles.css';


export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }) {
  switch(type) {

    case ACTIONS.ADD_DIGIT:

      if (state.overwrite) {
        return {
          ...state,
          current_operand: payload.digit,
          overwrite: false,
        }
      }

      if (payload.digit === "0" && state.current_operand === "0") {
        return state
      }
      if (payload.digit === "." && state.current_operand.includes(".")) {
        return state
      }

      return {
        ...state,
        current_operand: `${state.current_operand || ""}${payload.digit}`
      }
    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          current_operand: null
        }
      }

      if (state.current_operand == null) return state

      if (state.current_operand.length === 1) {
        return {
          ...state,
          current_operand: null
        }
      }

      return {
        ...state,
        current_operand: state.current_operand.slice(0, -1)
      }
    
    case ACTIONS.CHOOSE_OPERATION:
      if (state.current_operand == null && state.previous_operand == null) {
        return state
      }

      if (state.current_operand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if (state.previous_operand == null) {
        return {
          ...state,
          operation: payload.operation,
          previous_operand: state.current_operand,
          current_operand: null,
        }
      }

      return {
        ...state,
        previous_operand: evaluate(state),
        operation: payload.operation,
        current_operand: null
      }

    case ACTIONS.EVALUATE:
      if (state.operation == null || 
        state.current_operand == null || 
        state.previous_operand == null) {
          return state
      }

      return {
        ...state,
        overwrite: true,
        previous_operand: null,
        operation: null,
        current_operand: evaluate(state)
      }
  }
  
}

function evaluate({ current_operand, previous_operand, operation}) {
  const prev = parseFloat(previous_operand)
  const curent = parseFloat (current_operand)
  if (isNaN(prev) || isNaN(curent)) {
    return ""
  }
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + curent
      break
    case "-":
      computation = prev - curent
      break
    case "*":
      computation = prev * curent
      break
    case "÷":
      computation = prev / curent
      break
  }

  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function format_operand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ current_operand, previous_operand, operation}, dispatch] = useReducer(reducer, {})

  return (
    <div className="calculator-grid">
      <div className="output-line">
        <div className="previous-operand">{format_operand(previous_operand)} {operation}</div>
        <div className="current-operand">{format_operand(current_operand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;