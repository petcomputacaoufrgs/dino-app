import { sha3_256 } from 'js-sha3'

class HashUtils {
  async sha256(str: string): Promise<string> {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(str)).then(buf => {
      return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('')
    })
  }  

  sha3of256(str: string) {
    return sha3_256(str)
  }
}

export default new HashUtils()