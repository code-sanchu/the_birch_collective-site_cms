import { useState, type ReactElement } from "react";
import { animated, useSpring } from "@react-spring/web";
import { useMeasure } from "react-use";

import { WithTooltip } from "./WithTooltip";
import { Icon } from "./icons";

export const CollapsableSection = ({
  children: sectionContent,
  showSectionText = "Show section",
  margin,
}: {
  children: ReactElement;
  showSectionText?: string;
  margin?: {
    bottom?: {
      open?: number;
      close?: number;
    };
    top?: {
      open?: number;
      close?: number;
    };
  };
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [springAtRest, setSpringAtRest] = useState(true);

  const [sectionContentRef, { height: sectionContentHeight }] =
    useMeasure<HTMLDivElement>();
  const [openSectionTextRef, { height: openSectionTextHeight }] =
    useMeasure<HTMLDivElement>();

  const [springs, api] = useSpring(() => ({
    config: { tension: 280, friction: 70 },
    onChange: () => setSpringAtRest(false),
    onRest: () => setSpringAtRest(true),
  }));

  const openSection = () => {
    api.start({
      from: { height: "0px" },
      to: { height: `${sectionContentHeight + (margin?.bottom?.open || 0)}px` },
    });
    setIsOpen(true);
  };

  const closeSection = () => {
    api.start({
      from: {
        height: `${sectionContentHeight + (margin?.bottom?.open || 0)}px`,
      },
      to: { height: "0px" },
    });
    setIsOpen(false);
  };

  return (
    <div
      className="relative"
      style={{
        minHeight: openSectionTextHeight + (margin?.bottom?.close || 0),
      }}
    >
      <animated.div
        className="z-10"
        style={{ overflowY: "hidden", ...springs }}
      >
        <div ref={sectionContentRef}>{sectionContent}</div>
      </animated.div>
      <div className="group/collapse absolute left-0 top-0">
        <WithTooltip
          text="hide section"
          type="action"
          isDisabled={!isOpen}
          placement="top-start"
        >
          <div
            className="absolute -left-xs top-0 -translate-x-full cursor-pointer text-gray-200 transition-colors duration-75 ease-in-out group-hover/collapse:text-gray-600 hover:!text-gray-600"
            onClick={isOpen ? closeSection : openSection}
          >
            {isOpen ? <Icon.CaretDown /> : <Icon.CaretRight />}
          </div>
        </WithTooltip>
        <div
          className={`-translate-y-[1px] cursor-pointer whitespace-nowrap bg-white text-xs text-gray-300 transition-colors duration-75 ease-in-out group-hover/collapse:text-gray-600 hover:!text-gray-600  ${
            springAtRest && !isOpen
              ? "z-30 opacity-100"
              : "pointer-events-none -z-10 hidden opacity-0"
          }`}
          onClick={openSection}
          ref={openSectionTextRef}
        >
          {showSectionText}
        </div>
      </div>
    </div>
  );
};
