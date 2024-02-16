import { makeScene2D } from "@motion-canvas/2d";
import { createRef, waitFor } from "@motion-canvas/core";
import { ExtendedEuclideanAlgorithm } from "../components/ExtendedEuclideanAlgorithm";

export default makeScene2D(function* (view) {
  const euclideanRef = createRef<ExtendedEuclideanAlgorithm>();

  view.add(<ExtendedEuclideanAlgorithm a={11} b={7} ref={euclideanRef} />);
  yield* euclideanRef().show(1, 0.1);
  yield* waitFor(1);
});
