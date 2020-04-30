import AuthLocalStorageService from './AuthLocalStorageService'

/**
 * @description 
 * - Auxilia a gravar e ler valores do local storage
 * Quando o objeto não for uma string é necessário o stringify caso contrário não é possível acessar os dados
 * - Caso adicione algo temporário que não deve permanecer salvo quando o aplicativo reiniciar, 
 * adicione um método de remoção no cleanLocalStorageGarbage
 * */
export class LocalStorageService {

    protected get = (key: string) : string | null => (
        localStorage.getItem(key)
    )

    protected set = (key: string, value: string) => {
        if (!key) {
            throw Error("Chave inválida!")
        } else {
            return localStorage.setItem(key, value)
        } 
    }

    protected remove = (key: string) => {
        if (!key) {
            throw Error("Chave inválida!")
        } else {
            return localStorage.removeItem(key)
        } 
    }

    cleanLoginGarbage = () => {
        AuthLocalStorageService.setRefreshRequiredToFalse()
    }

    protected convertStringOrNullToString = (nullableString: string | null): string => (
        nullableString ? nullableString : ''
    )
    
}

export default new LocalStorageService()