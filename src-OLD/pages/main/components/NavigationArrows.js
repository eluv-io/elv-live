import ImageIcon from "Common/ImageIcon";
import LeftArrow from "Icons/left-arrow";
import React from "react";

const ScrollBlocks = (target) => {
  const scrollBlocks = Array.from(document.getElementsByClassName("scroll-block"));

  const current = scrollBlocks.findIndex(element => element.id === target.parentElement.id);

  return {
    previous: scrollBlocks[Math.max(0, current - 1)],
    current: scrollBlocks[current],
    next: scrollBlocks[Math.min(scrollBlocks.length - 1, current + 1)]
  };
};

export const UpArrow = () => {
  return (
    <button
      className="arrow-up"
      onClick={event => {
        const { previous } = ScrollBlocks(event.currentTarget);
        window.scrollTo({
          top: previous.getBoundingClientRect().top + (window.pageYOffset || previous.scrollTop),
          behavior: "smooth"
        });
      }}
    >
      <ImageIcon icon={LeftArrow} label="Previous Section"/>
    </button>
  );
};

export const DownArrow = () => {
  return (
    <button
      className="arrow-down"
      onClick={event => {
        const { next } = ScrollBlocks(event.currentTarget);
        window.scrollTo({
          top: next.getBoundingClientRect().top + (window.pageYOffset || next.scrollTop),
          behavior: "smooth"
        });
      }}
    >
      <ImageIcon icon={LeftArrow} label="Next Section"/>
    </button>
  );
};
