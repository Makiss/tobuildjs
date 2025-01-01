export class Dispatcher {
  #subs = {};
  #afterHandlers = [];

  subscribe(commandName, handler) {
    if (!(commandName in this.#subs)) {
      this.#subs[commandName] = [];
    }

    const handlers = this.#subs[commandName];
    if (handlers.includes(handler)) {
      return () => {};
    }

    handlers.push(handler);

    return () => {
      const idx = handlers.indexOf(handler);
      handlers.splice(idx, 1);
    };
  }

  afterEveryCommand(handler) {
    this.#afterHandlers.push(handler);

    return () => {
      const idx = this.#afterHandlers.indexOf(handler);
      this.#afterHandlers.splice(idx, 1);
    };
  }

  dispatch(commandName, payload) {
    if (commandName in this.#subs) {
      this.#subs[commandName].forEach((handler) => handler(payload));
    } else {
      console.warn(`No handlers for command: ${commandName}`);
    }

    this.#afterHandlers.forEach((handler) => handler());
  }
}
