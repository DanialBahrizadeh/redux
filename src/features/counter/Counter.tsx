import type { AppDispatch, RootState } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, reset, incrementByAmount } from "./counterSlice";
import { ChangeEvent, useState } from "react";

const Counter: React.FC = () => {
  const count = useSelector((state: RootState) => state.counter.count);
  const dispatch = useDispatch<AppDispatch>();
  const [incrementAmount, setIncrementAmount] = useState(0);

  const resetAll = () => {
    setIncrementAmount(0);
    dispatch(reset());
  };
  return (
    <section>
      <p>{count}</p>
      <div>
        <input
          type="number"
          name="amount"
          onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
            const value = !isNaN(Number(target.value))
              ? Number(target.value)
              : 0;
            setIncrementAmount(value);
          }}
          value={incrementAmount}
        />
        <button onClick={() => dispatch(incrementByAmount(incrementAmount))}>
          add
        </button>
        <button onClick={resetAll}>reset</button>
      </div>
    </section>
  );
};
export default Counter;
