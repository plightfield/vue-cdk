type UniqueSelectionDispatcherListener = (id: string, name: string) => void;

export class UniqueSelectionDispatcher {
  private listeners: UniqueSelectionDispatcherListener[] = [];

  notify(id: string, name: string) {
    for (const listener of this.listeners) {
      listener(id, name);
    }
  }

  listen(listener: UniqueSelectionDispatcherListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((registered) => {
        return listener !== registered;
      });
    }
  }

  dispose() {
    this.listeners = [];
  }
}