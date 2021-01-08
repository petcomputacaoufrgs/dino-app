export default interface SyncState<DATA_TYPE> {
    data: DATA_TYPE | undefined
    isLoading: boolean
}