
/**
 * @description
 */
class StringUtils {

    normalize = (str : string) : string => {

        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    }

}

export default new StringUtils()