import { Node, NodeProps, Rect, Txt, initial, signal } from "@motion-canvas/2d";
import {
  Reference,
  SignalValue,
  SimpleSignal,
  all,
  createRef,
  sequence,
  waitFor,
} from "@motion-canvas/core";
import _ from "lodash";

export interface ExtendedEuclideanAlgorithmProps extends NodeProps {
  a?: SignalValue<number>;
  b?: SignalValue<number>;
}

export class ExtendedEuclideanAlgorithmIterative extends Node {
  @initial(2079)
  @signal()
  public declare readonly a: SimpleSignal<number, this>;
  @initial(735)
  @signal()
  public declare readonly b: SimpleSignal<number, this>;

  private readonly rootNodeRef;
  private readonly rectRefs: Array<Reference<Rect>> = [];

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
    let remainder = 1;
    while (remainder !== 0) {
      remainder = a % b;
      a = b;
      b = remainder;
      rows++;
    }
    rows++;

    a = this.a();
    b = this.b();

    let lastLastS: number = 0;
    let lastLastT: number = 0;
    let lastS: number = 0;
    let lastT: number = 0;
    let lastAThrougB: number = -1;
    let lastLastAThrougB: number = -1;

    for (let i = 0; i < rows * 7; i++) {
      this.rectRefs.push(createRef<Rect>());
    }

    this.add(
      <Node ref={this.rootNodeRef}>
        {_.times(rows, (i: number) => {
          if (i === 0)
            return (
              <>
                <TxtColum ref={this.rectRefs[i * 7 + 0]} column={0} row={i}>
                  i
                </TxtColum>
                <TxtColum ref={this.rectRefs[i * 7 + 1]} column={1} row={i}>
                  a
                </TxtColum>
                <TxtColum ref={this.rectRefs[i * 7 + 2]} column={2} row={i}>
                  b
                </TxtColum>
                <TxtColum ref={this.rectRefs[i * 7 + 3]} column={3} row={i}>
                  a/b
                </TxtColum>
                <TxtColum ref={this.rectRefs[i * 7 + 4]} column={4} row={i}>
                  a%b
                </TxtColum>
                <TxtColum ref={this.rectRefs[i * 7 + 5]} column={5} row={i}>
                  s
                </TxtColum>
                <TxtColum ref={this.rectRefs[i * 7 + 6]} column={6} row={i}>
                  t
                </TxtColum>
              </>
            );
          let remainder = a % b;
          remainder = isNaN(remainder) ? 0 : remainder;
          let aThrougB = Math.floor(a / b);
          aThrougB = isNaN(aThrougB) || aThrougB > a ? 0 : aThrougB;

          let s = lastLastS + lastS * -lastLastAThrougB;
          let t = lastLastT + lastT * -lastLastAThrougB;

          lastLastAThrougB = lastAThrougB;
          lastAThrougB = aThrougB;

          lastLastS = lastS;
          lastLastT = lastT;
          if (i === 1) {
            s = 1;
            t = 0;
          }
          if (i === 2) {
            s = 0;
            t = 1;
          }

          lastS = s;
          lastT = t;

          const ret = (
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
              >{`${a}`}</TxtColum>
              <TxtColum ref={this.rectRefs[i * 7 + 2]} column={2} row={i}>{`${
                i == rows - 1 ? "-" : b
              }`}</TxtColum>
              <TxtColum ref={this.rectRefs[i * 7 + 3]} column={3} row={i}>{`${
                lastLastAThrougB < 0 || i == rows - 1 ? "-" : lastLastAThrougB
              }`}</TxtColum>
              <TxtColum ref={this.rectRefs[i * 7 + 4]} column={4} row={i}>{`${
                i == rows - 1 ? "-" : remainder
              }`}</TxtColum>
              <TxtColum
                ref={this.rectRefs[i * 7 + 5]}
                column={5}
                row={i}
              >{`${s}`}</TxtColum>
              <TxtColum
                ref={this.rectRefs[i * 7 + 6]}
                column={6}
                row={i}
              >{`${t}`}</TxtColum>
            </>
          );

          a = b;
          b = remainder;
          return ret;
        })}
      </Node>
    );
  }

  public *show(duration: number, sequenceDelay: number = 0.1, rowDelay = 0.1) {
    yield* all(...this.rectRefs.map((ref) => ref().opacity(0, 0)));

    for (let i = 0; i < this.rectRefs.length; i += 7) {
      const chunk = this.rectRefs.slice(i, i + 7);
      yield* sequence(
        sequenceDelay,
        ...chunk.map((ref) => ref().opacity(1, duration))
      );
      if (i == this.rectRefs.length - 7) {
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
