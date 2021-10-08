"use strict";

// The model of all features
const features = {
  drinksholder: false,
  led: false,
  propeller: false,
  shield: false,
  solarfan: false,
};

window.addEventListener("DOMContentLoaded", start);

function start() {
  console.log("start");
  // register toggle-clicks
  document
    .querySelectorAll(".option")
    .forEach((option) => option.addEventListener("click", toggleOption));
}

function toggleOption(event) {
  const target = event.currentTarget;
  const feature = target.dataset.feature;

  // TODO: Toggle feature in "model"
  features[feature] = !features[feature];

  if (features[feature]) {
    // feature added
    console.log(`Feature ${feature} is turned on!`);

    // If feature is (now) turned on:

    // - mark target as chosen (add class "chosen")
    target.classList.add("chosen");
    // - un-hide the feature-layer(s) in the #product-preview;
    document
      .querySelector(`img[data-feature="${feature}"]`)
      .classList.remove("hide");
    // - create featureElement and append to #selected ul
    document
      .querySelector("#selected ul")
      .appendChild(createFeatureElement(feature));
    // - create FLIP-animation to animate featureElement from img in target, to
    //   its intended position. Do it with normal animation or transition class!
    const elm = document.querySelector(`li[data-feature="${feature}"]`);
    const first = target.querySelector("img").getBoundingClientRect();
    const last = elm.getBoundingClientRect();

    // calculate deltas
    const deltaX = first.left - last.left;
    const deltaY = first.top - last.top;
    const deltaW = first.width / last.width;
    const deltaH = first.height / last.height;
    console.log(deltaX, deltaY);

    const keyframes = [
      {
        transformOrigin: "top left",
        transform: `
        translate(${deltaX}px, ${deltaY}px)
        scale(${deltaW}, ${deltaH})`,
      },
      {
        transformOrigin: "top left",
        transform: "none",
      },
    ];

    const properties = {
      duration: 700,
      easing: "ease-in-out",
      fill: "both",
    };

    elm.animate(keyframes, properties);

    // TODO: More code
  } else {
    // feature removed
    console.log(`Feature ${feature} is turned off!`);

    // Else - if the feature (became) turned off:

    // - no longer mark target as chosen
    target.classList.remove("chosen");

    // - hide the feature-layer(s) in the #product-preview
    document
      .querySelector(`img[data-feature="${feature}"]`)
      .classList.add("hide");

    // - find the existing featureElement in #selected ul
    const featureElement = document.querySelector(
      `li[data-feature="${feature}"]`
    );
    // - create FLIP-animation to animate featureElement to img in target
    // - when animation is complete, remove featureElement from the DOM
    const elm = document.querySelector(`li[data-feature="${feature}"]`);
    const first = elm.getBoundingClientRect();
    const last = target.querySelector("img").getBoundingClientRect();

    // calculate deltas
    const deltaX = last.left - first.left;
    const deltaY = last.top - first.top;
    const deltaW = last.width / first.width;
    const deltaH = last.height / first.height;

    const keyframes = [
      {
        transformOrigin: "top left",
        transform: `
        translate(${deltaX}px, ${deltaY}px)
        scale(${deltaW}, ${deltaH})`,
      },
      {
        transformOrigin: "top left",
        transform: "none",
      },
    ];

    const properties = {
      duration: 700,
      easing: "ease-in-out",
      fill: "both",
      direction: "reverse",
    };

    const slide = elm.animate(keyframes, properties);
    slide.onfinish = function () {
      elm.remove();
    };

    // TODO: More code
  }
}

// Create featureElement to be appended to #selected ul - could have used a <template> instead
function createFeatureElement(feature) {
  const li = document.createElement("li");
  li.dataset.feature = feature;

  const img = document.createElement("img");
  img.src = `images/feature_${feature}.png`;
  img.alt = capitalize(feature);

  li.append(img);

  return li;
}

function capitalize(text) {
  return text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase();
}
