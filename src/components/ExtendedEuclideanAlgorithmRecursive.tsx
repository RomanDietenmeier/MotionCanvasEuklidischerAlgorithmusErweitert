import { Node, Rect, Txt, initial, signal } from "@motion-canvas/2d";
import {
  Reference,
  SimpleSignal,
  all,
  createRef,
  sequence,
  waitFor,
} from "@motion-canvas/core";
import { ExtendedEuclideanAlgorithmProps } from "./ExtendedEuclideanAlgorithmIterative";

type StepValues = {
  a: number;
  b: number;
  aThroughB: number;
  aModuloB: number;
  s: number;
  t: number;
};

export class ExtendedEuclideanAlgorithmRecursive extends Node {
  @initial(2079)
  @signal()
  public declare readonly a: SimpleSignal<number, this>;
  @initial(735)
  @signal()
  public declare readonly b: SimpleSignal<number, this>;

  private readonly rootNodeRef;
  private readonly rectRefs: Array<Reference<Rect>> = [];
  private readonly values: Array<StepValues> = [];

  public constructor(props?: ExtendedEuclideanAlgorithmProps) {
    super({
      ...props,
    });

    this.rootNodeRef = createRef<Node>();

    if (this.b() > this.a()) {
      let temp = this.a();
      this.a(this.b());
      this.b(temp);
    }

    let rows = 1;
    let a = this.a();
    let b = this.b();
    while (true) {
      const stepValues: StepValues = {
        a,
        b,
        aThroughB: Math.floor(a / b),
        aModuloB: a % b,
        s: -1,
        t: -1,
      };
      this.values.push(stepValues);
      let tmp = b;
      b = a % b;
      a = tmp;

      for (let i = 0; i < 7; i++) {
        this.rectRefs.push(createRef<Rect>());
      }
      if (stepValues.aModuloB === 0) {
        break;
      }
    }
    for (let i = 0; i < 7; i++) {
      this.rectRefs.push(createRef<Rect>());
    }

    for (let i = this.values.length - 1; i >= 0; i--) {
      if (i === this.values.length - 1) {
        this.values[i].s = 0;
        this.values[i].t = 1;
        continue;
      }
      this.values[i].s = this.values[i + 1].t;
      this.values[i].t =
        this.values[i + 1].s - this.values[i].aThroughB * this.values[i + 1].t;
    }

    this.add(
      <Node ref={this.rootNodeRef}>
        <>
          <TxtColum ref={this.rectRefs[0]} column={0} row={0}>
            i
          </TxtColum>
          <TxtColum ref={this.rectRefs[1]} column={1} row={0}>
            a
          </TxtColum>
          <TxtColum ref={this.rectRefs[2]} column={2} row={0}>
            b
          </TxtColum>
          <TxtColum ref={this.rectRefs[3]} column={3} row={0}>
            a/b
          </TxtColum>
          <TxtColum ref={this.rectRefs[4]} column={4} row={0}>
            a%b
          </TxtColum>
          <TxtColum ref={this.rectRefs[5]} column={5} row={0}>
            s
          </TxtColum>
          <TxtColum ref={this.rectRefs[6]} column={6} row={0}>
            t
          </TxtColum>
        </>
        <>
          {this.values.map((value, i: number) => {
            i = i + 1;

            return (
              <>
                <TxtColum
                  ref={this.rectRefs[i * 7 + 0]}
                  column={0}
                  row={i}
                >{`${i}`}</TxtColum>
                <TxtColum
                  ref={this.rectRefs[i * 7 + 1]}
                  column={1}
                  row={i}
                >{`${value.a}`}</TxtColum>
                <TxtColum
                  ref={this.rectRefs[i * 7 + 2]}
                  column={2}
                  row={i}
                >{`${value.b}`}</TxtColum>
                <TxtColum
                  ref={this.rectRefs[i * 7 + 3]}
                  column={3}
                  row={i}
                >{`${value.aThroughB}`}</TxtColum>
                <TxtColum
                  ref={this.rectRefs[i * 7 + 4]}
                  column={4}
                  row={i}
                >{`${value.aModuloB}`}</TxtColum>
                <TxtColum
                  ref={this.rectRefs[i * 7 + 5]}
                  column={5}
                  row={i}
                >{`${value.s}`}</TxtColum>
                <TxtColum
                  ref={this.rectRefs[i * 7 + 6]}
                  column={6}
                  row={i}
                >{`${value.t}`}</TxtColum>
              </>
            );
          })}
        </>
      </Node>
    );
  }

  public *show(duration: number, sequenceDelay: number = 0.1, rowDelay = 0.1) {
    yield* all(...this.rectRefs.map((ref) => ref().opacity(0, 0)));
    for (let i = 0; i <= this.rectRefs.length; i += 7) {
      let chunkSize = 7;
      if (i > 0) {
        chunkSize = 5;
      }
      const chunk = this.rectRefs.slice(i, i + chunkSize);
      yield* sequence(
        sequenceDelay,
        ...chunk.map((ref) => ref().opacity(1, duration))
      );
      yield* waitFor(rowDelay);
    }

    for (let i = this.rectRefs.length; i > 0; i -= 7) {
      const chunk = this.rectRefs.slice(i + 5, i + 7);
      yield* sequence(
        sequenceDelay,
        ...chunk.map((ref) => ref().opacity(1, duration))
      );
      if (i == 7) {
        break;
      }
      yield* waitFor(rowDelay);
    }
  }

  public *hide() {
    yield* all(...this.rectRefs.map((ref) => ref().opacity(0, 0)));
  }
}

const TxtColum = function ({ children, column = 0, row = 0, ref }: any) {
  return (
    <TableRect column={column} row={row} ref={ref}>
      <Txt fill={"#fff"} fontWeight={700}>
        {children}
      </Txt>
    </TableRect>
  );
};

const TableRect = function ({ children, column = 0, row = 0, ref }: any) {
  let doubleColumnsInUse = 0;
  if (column > 1) {
    doubleColumnsInUse++;
  }
  if (column > 2) {
    doubleColumnsInUse++;
  }
  if (column > 4) {
    doubleColumnsInUse++;
  }
  return (
    <Rect
      ref={ref}
      stroke={"#fff"}
      lineWidth={1}
      position={{
        x:
          -350 +
          (column + doubleColumnsInUse) * 100 +
          (column == 1 || column == 2 || column == 4 ? 0 : -50),
        y: -250 + row * 100,
      }}
      width={column == 1 || column == 2 || column == 4 ? 200 : 100}
      height={100}
    >
      {children}
    </Rect>
  );
};
