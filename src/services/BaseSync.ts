export default interface BaseSync {
  sync: () => Promise<void>
}
