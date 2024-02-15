import { makeScene2D } from "@motion-canvas/2d";
import { waitFor } from "@motion-canvas/core";
import { ExtendedEuclideanAlgorithm } from "../components/ExtendedEuclideanAlgorithm";

export default makeScene2D(function* (view) {
  view.add(<ExtendedEuclideanAlgorithm a={11} b={7} />);
  yield* waitFor(1);
});
