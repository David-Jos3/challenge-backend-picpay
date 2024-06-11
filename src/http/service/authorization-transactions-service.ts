
import axios  from "axios"

export class AuthorizationTransaction {

  async authorize(){
    try {
      const { data } = await axios.get('https://util.devi.tools/api/v2/authorize')
      return data
    }catch(error: unknown) {
      if(error instanceof Error) {
        throw new Error('Failed to load resource:' + {message: error.message})
      }
    }
  }
}