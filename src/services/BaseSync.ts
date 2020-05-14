export default interface BaseSync {
  sync: () => Promise<boolean>
}
