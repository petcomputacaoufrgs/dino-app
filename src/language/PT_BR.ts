import LanguageSet from './LanguageSet'

/**
 * @description Conjunto de textos em português brasileiro
 */
export default class PT_BR implements LanguageSet {

    NOT_FOUND_MESSAGE = 'Página não encontrada.'

    NOT_FROND_REDIRECT_MESSAGE = 'Redirecionado...'
    
    WELCOME_MESSAGE = 'Bem vindo ao DinoAPP!'

    LOGIN_BUTTON_TEXT = 'Entrar com o Google'

    LOGOUT_BUTTON_DESCRIPTION = 'Imagem de uma porta aberta com uma seta indicando saída.'

    SEARCH_HOLDER = 'Buscar...'

    LOADER_ALT = 'Imagem de círculo girando indicando carregamento.'
    
    LOGIN_FAIL_BY_GOOGLE = 'Erro no login com o Google.'

    LOGIN_FAIL_BY_API = 'Erro no login com o servidor do Dino.'

    LOGIN_CANCELED = 'Login cancelado.'

}