
/**
 * @description
 */
class StringUtils {

    normalizeString = (oldString : string) : string => {

        return oldString.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    }

}

export default new StringUtils()