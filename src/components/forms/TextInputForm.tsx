import { useRef, useState } from "react";
import DOMPurify from "dompurify";
import { useMeasure } from "react-use";

import { WithTooltip } from "../WithTooltip";

import type { MyPick } from "~/types/utilities";

type Props = {
  localStateValue: string | null;
  input?: MyPick<InputProps, "minWidth" | "placeholder" | "styles">;
  onSubmit: (inputValue: string) => void;
  tooltip?: string;
};

export const TextInputForm = (props: Props) => {
  const [inputValue, setInputValue] = useState(props.localStateValue || "");
  const [inputIsFocused, setInputIsFocused] = useState(false);

  const handleSubmit = () => {
    if (!inputValue.length) {
      return;
    }

    const clean = DOMPurify.sanitize(inputValue);

    props.onSubmit(clean);
  };

  return (
    <WithTooltip
      text={props.tooltip || ""}
      isDisabled={!props.tooltip?.length || inputIsFocused}
      placement="top"
    >
      <form
        className="relative inline-block max-w-full"
        onSubmit={(e) => {
          e.preventDefault();

          handleSubmit();
        }}
        onBlur={handleSubmit}
      >
        <div className="form-control">
          <Input
            isFocused={inputIsFocused}
            setIsFocused={setInputIsFocused}
            setValue={setInputValue}
            value={inputValue}
            {...props.input}
          />
        </div>
      </form>
    </WithTooltip>
  );
};

type InputProps = {
  setIsFocused: (value: boolean) => void;
  setValue: (value: string) => void;
  value: string;
  // autoFocus?: boolean;
  isFocused: boolean;
  minWidth?: number;
  placeholder?: string;
  trailingSpace?: number;
  styles?: string;
};

const Input = ({
  // autoFocus = false,
  isFocused,
  minWidth = 50,
  placeholder = "write here",
  setIsFocused,
  setValue,
  styles = "",
  trailingSpace = 20,
  value,
}: InputProps) => {
  const [isBlurredOnInitialRender, setIsBlurredOnInitialRender] =
    useState(false);

  const [dummyInputRef, { width: dummyInputWidth }] =
    useMeasure<HTMLParagraphElement>();

  const inputWidth = dummyInputWidth + (isFocused ? trailingSpace : 0);

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <div
        className={`relative h-full overflow-y-hidden rounded-sm transition-colors duration-75 ease-in-out ${
          isFocused ? "bg-gray-100" : ""
        }`}
      >
        <p
          className={`invisible absolute whitespace-nowrap ${styles}`}
          ref={dummyInputRef}
        >
          {value.length ? value : placeholder}
        </p>
        <input
          className={`z-10 overflow-y-hidden bg-transparent outline-none ${styles} ${
            isFocused ? "pl-1 text-gray-800" : ""
          }`}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          placeholder={placeholder}
          type="text"
          autoComplete="off"
          onFocus={(e) => {
            if (!isBlurredOnInitialRender) {
              // · handle unwanted autofocus (bug?)
              e.currentTarget.blur();
              setIsBlurredOnInitialRender(true);
            } else {
              setIsFocused(true);
            }
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          onClick={(e) => e.currentTarget.focus()}
          style={{
            width: inputWidth > minWidth ? inputWidth : minWidth,
          }}
          // autoFocus={autoFocus}
          autoFocus={false}
          ref={inputRef}
        />
      </div>
    </>
  );
};
