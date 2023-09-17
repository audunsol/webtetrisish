const availableForms = [
  [[1, 1, 1, 1]],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
  [
    [1, 0],
    [1, 1],
    [1, 0],
  ],
];

const pickRandomForm = () => {
  const i = Math.floor(Math.random() * availableForms.length);
  return availableForms[i];
};

const colors = ['red', 'green', 'yellow', 'blue', 'purple'];
const pickRandomColor = () => {
  const i = Math.floor(Math.random() * colors.length);
  return colors[i];
};

export type Form = Array<Array<number>>;

export class Shape {
  ctx: CanvasRenderingContext2D;
  form: Form;
  color: string;
  x: number;
  y: number;
  boxSize = 50;
  maxX: number;
  maxY: number;

  constructor(props: { ctx: CanvasRenderingContext2D, form?: Form, color?: string, x?: number, y?: number }) {
    const {
      ctx,
      form = pickRandomForm(),
      color = pickRandomColor(),
      x = Math.abs(ctx.canvas.width / 2),
      y = 0,
    } = props;
    this.ctx = ctx;
    this.form = form;
    this.color = color;
    this.x = x;
    this.y = y;
    this.maxX = ctx.canvas.width;
    this.maxY = ctx.canvas.height;
  }

  didHit = (stuckShapes: Shape[]) => {
    for (let i = 0; i < this.form.length; i++) {
      for (let j=0; j < this.form[0].length; j++) {
        const e = this.form[i][j];
        if (e && (j * this.boxSize + this.y) > this.maxY) {
          console.log(stuckShapes);
          return true;
        }
      }
    }
    return this.y > this.maxY - this.boxSize;
  }

  step = () => {
    const y = this.y + this.boxSize / 5;
    return new Shape({ ...this, y })
  }

  draw = () => {
    this.ctx.fillStyle = this.color;
    for (let i = 0; i < this.form.length; i++) {
      for (let j = 0; j < this.form[0].length; j++) {
        if (this.form[i][j]) {
          this.ctx.fillRect(
            this.x + this.boxSize * j,
            this.y + this.boxSize * i,
            this.boxSize,
            this.boxSize
          );
        }
      }
    }
  }

  clear = () => {
    for (let i = 0; i < this.form.length; i++) {
      for (let j = 0; j < this.form[0].length; j++) {
        if (this.form[i][j]) {
          this.ctx.clearRect(
            this.x + this.boxSize * j,
            this.y + this.boxSize * i,
            this.boxSize,
            this.boxSize
          );
        }
      }
    }
  }
  rotateLeft = () => {
    //  this.clear();
    const newForm = [];
    for (let i = 0; i < this.form.length; i++) {
      newForm.push([]);
      for (let j = 0; j < this.form[i].length; j++) {
        // newShape[i].push(this.form[j][i]);
        // newShape[j][i] = this.form[i][j];
      }
    }
    return new Shape({ ...this, form: newForm });
  }

  rotateRight = () => {
    //  this.clear();
    const newForm = new Array(this.form[0].length);
    for (let i = this.form.length - 1; i >= 0; i--) {
      newForm[i].push([]);
      for (let j = this.form[i].length - 1; j >= 0; j--) {
        newForm[j][i] = this.form[i][j];
      }
    }
    return new Shape({ ...this, form: newForm });
  }

  moveLeft = () => {
    //  this.clear();
    const x = Math.max(0, this.x - this.boxSize);
    return new Shape({ ...this, x })
  }

  moveRight = () => {
    //  this.clear();
    const x = Math.min(this.x + this.boxSize, this.maxX - this.boxSize);
    return new Shape({ ...this, x });
  }
}
