const CryptoJS = require("crypto-js");

class AESUtils {
	decrypt = (key: string, encryptedData: string): string => {
    const text = "1234567812345678dfss"
    const key2 = CryptoJS.enc.Base64.parse("MTIzNDU2NzgxMjM0NTY3OA==")
    console.log(encryptedData)
    const encrypted = CryptoJS.AES.encrypt(text, key2, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    console.log(encrypted.toString())

    const bytes  = CryptoJS.AES.decrypt(encrypted, key2, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    const originalText = bytes.toString(CryptoJS.enc.Utf8)
 
    console.log(originalText)
    /*const decryptedData = CryptoJS.AES.decrypt(encryptedData, parsedBase64Key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })*/

    return ""//decryptedData.toString(CryptoJS.enc.Utf8)
	}
}

export default new AESUtils()