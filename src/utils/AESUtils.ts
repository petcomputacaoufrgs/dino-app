import HashUtils from "./HashUtils";

const CryptoJS = require("crypto-js");

class AESUtils {
	decrypt = async (key: string, encryptedData: string) => {
    const text = "1234567812345678dfss"
    const hash = HashUtils.sha3of256("1234567812345678")
    const key2 = CryptoJS.enc.Base64.parse(btoa(hash.substr(0, 32)))
    const iv = CryptoJS.enc.Base64.parse(btoa("#base64IV#QQQQQQ"))
    console.log(encryptedData)
    const encrypted = CryptoJS.AES.encrypt(text, key2, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: iv
    })
    console.log(encrypted.toString())

    const bytes  = CryptoJS.AES.decrypt(encrypted, key2, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: iv
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