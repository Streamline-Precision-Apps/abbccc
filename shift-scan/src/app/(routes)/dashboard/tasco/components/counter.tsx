import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import React from "react";

type LoadCounterProps = {
  count: number;
  setCount: (count: number) => void;
  addAction?: () => void;
  removeAction?: () => void;
  allowRemove?: boolean;
};


export default function Counter({ count, setCount, addAction, removeAction, allowRemove }: LoadCounterProps) {

  const AddLoad = () => {
    const newCount = count + 1;
    setCount(newCount);
  };

  const RemoveLoad = () => {
    const newCount = count - 1;
    setCount(newCount);
  };

  return (
    <Holds
      className="w-[90%] items-center my-4"
      background={"darkBlue"}
      position={"center"}
    >
      <div className="flex items-center justify-center  p-4 rounded-lg shadow-lg w-full">
        <Buttons
          onClick={RemoveLoad}
          disabled={count === 0 && !allowRemove}
          className={`text-black font-bold text-4xl w-16 h-16 rounded-lg shadow-lg border-2 border-black transition flex items-center justify-center ${
            count === 0 || count === undefined
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-app-orange"
          }`}
        >
          -
        </Buttons>
        <div className="mx-6 flex items-center justify-center text-black text-3xl font-bold bg-white w-20 h-16 rounded-lg border-2 border-black shadow-lg">
          {count}
        </div>
        <Buttons
          onClick={AddLoad}
          className="bg-app-green text-black font-bold text-4xl w-16 h-16 rounded-lg shadow-lg border-2 border-black"
        >
          +
        </Buttons>
      </div>
    </Holds>
  );
}
