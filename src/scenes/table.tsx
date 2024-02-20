import { makeScene2D } from "@motion-canvas/2d";
import { createRef, waitFor } from "@motion-canvas/core";
import { ExtendedEuclideanAlgorithmIterative } from "../components/ExtendedEuclideanAlgorithmIterative";
import { ExtendedEuclideanAlgorithmRecursive } from "../components/ExtendedEuclideanAlgorithmRecursive";

export default makeScene2D(function* (view) {
  const euclideanIterativeRef =
    createRef<ExtendedEuclideanAlgorithmIterative>();
  const euclideanRecursiveRef =
    createRef<ExtendedEuclideanAlgorithmRecursive>();

  view.add(
    <>
      <ExtendedEuclideanAlgorithmRecursive
        a={2079}
        b={735}
        ref={euclideanRecursiveRef}
      />
      <ExtendedEuclideanAlgorithmIterative
        a={11}
        b={7}
        ref={euclideanIterativeRef}
      />
    </>
  );
  yield* euclideanIterativeRef().hide();
  yield* euclideanRecursiveRef().show(1, 0.1);
  // yield* euclideanRecursiveRef().hide();
  // yield* euclideanIterativeRef().show(0.1, 0.01);
  yield* waitFor(1);
});
