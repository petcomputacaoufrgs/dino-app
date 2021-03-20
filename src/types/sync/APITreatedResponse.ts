import APITreatedResponseStatus from "./APITreatedResponseStatus"

export default interface APITreatedResponse<DATA_TYPE> {
  data?: DATA_TYPE
  status: APITreatedResponseStatus
}