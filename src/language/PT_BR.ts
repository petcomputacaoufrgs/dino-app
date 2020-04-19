import LanguageSet from './LanguageSet'
import LanguageCodeConstants from '../constants/LanguageCodeConstants'

/**
 * @description Conjunto de textos em português brasileiro
 */
export default class PT_BR implements LanguageSet {

    LANGUAGE_CODE = LanguageCodeConstants.PORTUGUESE

    LANGUAGE_PORTUGUESE = 'Português'

    LANGUAGE_ENGLISH = 'Inglês'

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

    LOGIN_REFRESH_ERROR = 'Ocorreu um erro. Precisamos que se autentique novamente, por favor.'

    AVATAR_ALT = 'Imagem de perfil do usuário com as bordas arredondadas.'
    
    LOGOUT_DIALOG_QUESTION = 'Tem certeza que deseja sair do DinoApp?'
    
    LOGOUT_DIALOG_DESCRIPTION = 'Se disser \'SIM\' todos os dados referentes a sua conta serão removidos deste dispositivo.'
    
    AGREEMENT_OPTION_TEXT = 'SIM'
    
    DISAGREEMENT_OPTION_TEXT = 'NÃO'
    
    MENU_HOME = 'Home'
    
    MENU_GAMES = 'Jogos'
    
    MENU_SETTINGS = 'Configurações'
    
    MENU_GLOSSARY = 'Glossário'
    
    MENU_LOGOUT = 'Sair'
    
    SETTINGS_TITLE = 'Configurações'
    
    SETTINGS_LANGUAGE = 'Escolher Idioma'
    
}