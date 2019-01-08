type Node<T extends ArrayLike<any>> = {
  data: T,
  identifier: number,
  prev: Node<T> | null,
  next: Node<T> | null,
};

function createNode<T extends ArrayLike<any>>(
  identifier: number,
  data: T,
): Node<T> {
  const node: Node<T> = Object.create(null);
  node.data = data;
  node.identifier = identifier;

  return node;
}

export class Record<T extends ArrayLike<any>> {
  pattern: T[] = null;
  patternSize: number = 0;

  private count: number = 0;
  private head: Node<T> = null;
  private tail: Node<T> = null;

  constructor(
    public readonly size: number,
    public readonly mapWidth: number,
  ) {}

  add(identifier: number, data: T) {
    const node = createNode(identifier, data);

    if (!this.count) {
      node.prev = node.next = null;
      this.head = this.tail = node;
      this.count++;
      return;
    }

    node.prev = this.tail;
    this.tail.next = node;
    node.next = null;
    this.tail = node;

    if (this.count === this.size) {
      this.head = this.head.next;
      this.head.prev = null;
    } else {
      this.count++;
    }
  }

  getPattern() {
    if (this.pattern) {
      return this.pattern;
    }

    const path: T[] = [];
    const latestID = this.tail.identifier;

    let hasSame = false;
    let node = this.tail.prev;

    while (node) {
      const { identifier, data } = node;

      path.push(data);

      if (latestID === identifier && this.compare(this.tail.data, data)) {
        hasSame = true;
        break;
      }

      node = node.prev;
    }

    if (hasSame) {
      this.pattern = path;
      this.patternSize = path.length;
    }

    return hasSame ? path : null;
  }

  compare(a: T, b: T) {
    const {
      mapWidth,
    } = this;

    for (let y = 0; y < mapWidth; y++) {
      for (let x = 0; x < mapWidth; x++) {
        const idx = y * mapWidth + x;

        if (a[idx] !== b[idx]) {
          return false;
        }
      }
    }

    return true;
  }
}
