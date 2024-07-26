export interface EventHandler {
  setupSubscriptions(): void;
  startSubscriber(): void;
}
