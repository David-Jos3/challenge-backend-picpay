import axios from "axios"

export interface NotificationRequest {
  from: string
  to: string,
  subject: string,
  text: string,
}


export class NotificationService {

  async notify(requestData: NotificationRequest) {

    try {
      
      const {data} = await axios.post('https://util.devi.tools/api/v1/notify', requestData)
      return data

    } catch (error) {
      if(error instanceof Error) {
        throw new Error('Failed to load resource:' + {message: error.message})
      }
    }
  }
}