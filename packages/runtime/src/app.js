import { destroyDOM } from "./destroy-dom";
import { mountDOM } from "./mount-dom";
import { Dispatcher } from "./dispatcher";
import { patchDOM } from "./patch-dom";

export function createApp({ state, view, reducers = {} }) {
  let parentEl = null;
  let vdom = null;
  let isMounted = false;
  const dispatcher = new Dispatcher();
  const subscriptions = [dispatcher.afterEveryCommand(renderApp)];

  function emit(eventName, payload) {
    dispatcher.dispatch(eventName, payload);
  }

  for (const actionName in reducers) {
    const reducer = reducers[actionName];

    const subs = dispatcher.subscribe(actionName, (payload) => {
      state = reducer(state, payload);
    });
    subscriptions.push(subs);
  }

  function renderApp() {
    const newVdom = veiw(state, emit);

    vdom = patchDOM(vdom, newVdom, parentEl);
  }

  return {
    mount(_parentEl) {
      if (isMounted) {
        throw new Error("The application is already mounted");
      }

      parentEl = _parentEl;
      vdom = view(state, emit);
      mountDOM(vdom, parentEl);

      isMounted = true;
    },
    unmount() {
      destroyDOM(vdom);
      vdom = null;
      parentEl = null;
      subscriptions.forEach((unsubscribe) => unsubscribe());
    },
  };
}
