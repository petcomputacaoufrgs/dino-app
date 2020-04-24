import LanguageSet from './LanguageSet'
import LanguageCodeConstants from '../constants/LanguageCodeConstants'

/**
 * @description Conjunto de textos em português brasileiro
 */
export default class PT_BR implements LanguageSet {

    ISO_LANGUAGE_CODE = 'pt'

    NAVIGATOR_LANGUAGE_CODE = LanguageCodeConstants.PORTUGUESE

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
    
    SETTINGS_SAVE = 'Salvar'

    SETTINGS_SAVE_SUCCESS = 'Configurações salvas.'

    MENU_NOTES: string = 'Notas'

    NOTES_HEADER_IMAGE_DESC: string = 'Imagem com um caderno de anotações com uma mão escrevendo.'

    NOTES_ADD_BUTTON: string = 'Clique para adicionar uma nova anotação.'

    NOTE_STATE_DONE: string = 'Anotação respondida.'

    NOTE_STATE_NOT_DONE: string = 'Anotação ainda não possui uma resposta.'

    NOTE_SHOW_ANSWER: string = 'Clique para ver a resposta desta pergunta logo abaixo.'

    NOTE_EDIT_ANSWER_BUTTON: string = 'Clique aqui para editar a resposta dessa anotação.'

    NOTE_EDIT_QUESTION_BUTTON: string = 'Clique aqui para editar a pergunta desta anotação.'

    NOTE_DELETE_BUTTON: string = 'Clique aqui para apagar está anotação.'

    QUESTION_NOTE_DIALOG_TITLE: string = 'Pergunta'

    ANSWER_NOTE_DIALOG_TITLE: string = 'Resposta'

    NOTE_TAG_LABEL: string = 'Tags'

    NOTE_DIALOG_SAVE_BUTTON_LABEL: string = 'Clique para salvar.'

    NOTE_DIALOG_SAVE_BUTTON_TEXT: string = 'Salvar'

    SEARCH_BUTTON_LABEL: string = 'Pesquisar'

}