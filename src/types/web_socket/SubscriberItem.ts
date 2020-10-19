export default interface SubscriberItem {
  path: string
  callback: (data: any) => any
}
