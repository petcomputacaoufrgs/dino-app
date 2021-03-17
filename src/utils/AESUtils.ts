const CryptoJS = require("crypto-js");

class AESUtils {
	decrypt = async (key: string, iv: string, encryptedData: string) => {
    const keyOf32Bytes = btoa(key.substr(0, 32))
    const base64Key = CryptoJS.enc.Base64.parse(keyOf32Bytes)

    const bytesIV = btoa(iv)
    const base64IV = CryptoJS.enc.Base64.parse(bytesIV)

    const bytes  = CryptoJS.AES.decrypt(encryptedData, base64Key, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: base64IV
    })

    const decryptedData = bytes.toString(CryptoJS.enc.Utf8)

    return decryptedData
	}
}

export default new AESUtils()