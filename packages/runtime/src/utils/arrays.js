export function withoutNulls(arr) {
  return arr.filter((item) => item != null);
}

export function arraysDiff(oldArr, newArr) {
  return {
    added: newArr.filter((item) => !oldArr.includes(item)),
    removed: oldArr.filter((item) => !newArr.includes(item)),
  };
}

export const ARRAY_DIFF_OP = {
  ADD: "add",
  REMOVE: "remove",
  MOVE: "move",
  NOOP: "noop",
};

class ArrayWithOriginalIndices {
  #arr = [];
  #originalIndices = [];
  #equalsFn;

  constructor(arr, equalsFn) {
    this.#arr = [...arr];
    this.#originalIndices = arr.map((_, i) => i);
    this.#equalsFn = equalsFn;
  }

  get length() {
    return this.#arr.length;
  }

  isRemoval(index, newArr) {
    if (index >= this.length) {
      return false;
    }

    const item = this.#arr[index];
    const indexInNewArr = newArr.findIndex((newItem) =>
      this.#equalsFn(item, newItem)
    );

    return indexInNewArr === -1;
  }

  removeItem(index) {
    const operation = {
      op: ARRAY_DIFF_OP.REMOVE,
      index,
      item: this.#arr[index],
    };

    this.#arr.splice(index, 1);
    this.#originalIndices.splice(index, 1);

    return operation;
  }

  isNoop(index, newArr) {
    if (index >= this.length) {
      return false;
    }

    const item = this.#arr[index];
    const newItem = newArr[index];

    return this.#equalsFn(item, newItem);
  }

  originalIndexAt(index) {
    return this.#originalIndices[index];
  }

  noopItem(index) {
    return {
      op: ARRAY_DIFF_OP.NOOP,
      originalIndex: this.originalIndexAt(index),
      index,
      item: this.#arr[index],
    };
  }

  isAddition(item, fromIndex) {
    return this.findIndexFrom(item, fromIndex) === -1;
  }

  findIndexFrom(item, fromIndex) {
    for (let i = fromIndex; i < this.length; i++) {
      if (this.#equalsFn(item, this.#arr[i])) {
        return i;
      }
    }

    return -1;
  }

  addItem(item, index) {
    const operation = {
      op: ARRAY_DIFF_OP.ADD,
      index,
      item,
    };

    this.#arr.splice(index, 0, item);
    this.#originalIndices.splice(index, 0, -1);

    return operation;
  }

  moveItem(item, toIndex) {
    const fromIndex = this.findIndexFrom(item, toIndex);

    const operation = {
      op: ARRAY_DIFF_OP.MOVE,
      originalIndex: this.originalIndexAt(fromIndex),
      from: fromIndex,
      index: toIndex,
      item: this.#arr[fromIndex],
    };

    const [_item] = this.#arr.splice(fromIndex, 1);
    this.#arr.splice(toIndex, 0, _item);

    const [originalIndex] = this.#originalIndices.splice(fromIndex, 1);
    this.#originalIndices.splice(toIndex, 0, originalIndex);

    return operation;
  }

  removeItemsAfter(index) {
    const operations = [];

    while (this.length > index) {
      operations.push(this.removeItem(index));
    }

    return operations;
  }
}

export function arraysDiffSequence(
  oldArr,
  newArr,
  equalsFn = (a, b) => a === b
) {
  const sequence = [];

  const arr = new ArrayWithOriginalIndices(oldArr, equalsFn);

  for (let index = 0; index < newArr.length; index++) {
    if (arr.isRemoval(index, newArr)) {
      sequence.push(arr.removeItem(index));
      index--;
      continue;
    }

    if (arr.isNoop(index, newArr)) {
      sequence.push(arr.noopItem(index));
      continue;
    }

    const item = newArr[index];

    if (arr.isAddition(item, index)) {
      sequence.push(arr.addItem(item, index));
      continue;
    }

    sequence.push(arr.moveItem(item, index));
  }

  sequence.push(...arr.removeItemsAfter(newArr.length));

  return sequence;
}
