import LanguageBase from './LanguageBase'
import LanguageCodeConstants from '../../constants/LanguageCodeConstants'

/**
 * @description Conjunto de textos em português brasileiro
 */
export default class PT implements LanguageBase {
  ISO_LANGUAGE_CODE = 'pt'

  NAVIGATOR_LANGUAGE_CODE = LanguageCodeConstants.PORTUGUESE

  LANGUAGE_PORTUGUESE = 'Português'

  LANGUAGE_ENGLISH = 'Inglês'

  NOT_FOUND_MESSAGE = 'Item não encontrado.'

  NOT_FROND_REDIRECT_MESSAGE = 'Redirecionado...'

  WELCOME_MESSAGE = 'Bem vindo ao DinoAPP!'

  LOGIN_BUTTON_TEXT = 'Entrar com o Google'

  LOGOUT_BUTTON_DESCRIPTION =
    'Imagem de uma porta aberta com uma seta indicando saída.'

  SEARCH_HOLDER = 'Buscar...'

  LOGIN_FAIL_BY_GOOGLE = 'Erro no login com o Google.'

  LOGIN_FAIL_BY_API = 'Erro no login com o servidor do DinoApp.'

  LOGIN_CANCELED = 'Login cancelado.'

  LOGIN_REFRESH_NECESSARY =
    'Ocorreu um erro. Precisamos que se autentique novamente, por favor.'

  AVATAR_ALT = 'Imagem de perfil do usuário com as bordas arredondadas.'

  LOGOUT_DIALOG_QUESTION = 'Tem certeza que deseja sair do DinoApp?'

  LOGOUT_DIALOG_DESCRIPTION =
    "Se disser 'SIM' todos os dados referentes a sua conta serão removidos deste dispositivo."

  AGREEMENT_OPTION_TEXT = 'SIM'

  DISAGREEMENT_OPTION_TEXT = 'NÃO'

  ADD_OPTION_TEXT = 'ADICIONAR'

  CANCEL_OPTION_TEXT = 'CANCELAR'

  EDIT_OPTION_TEXT = 'Editar'

  DELETE_OPTION_TEXT = 'Deletar'

  MENU_HOME = 'Home'

  MENU_GAMES = 'Jogos'

  MENU_SETTINGS = 'Configurações'

  MENU_GLOSSARY = 'Glossário'

  MENU_CONTACTS = 'Contatos'

  MENU_LOGOUT = 'Sair'

  SETTINGS_TITLE = 'Configurações'

  SETTINGS_LANGUAGE = 'Escolher Idioma'

  SETTINGS_SAVE = 'Salvar'

  SETTINGS_SAVE_SUCCESS = 'Configurações salvas.'

  MENU_NOTES = 'Notas'

  MENU_CALENDAR = 'Calendário'

  NOTES_HEADER_IMAGE_DESC =
    'Imagem com um caderno de anotações com uma mão escrevendo.'

  NOTES_ADD_BUTTON = 'Clique para adicionar uma nova anotação.'

  NOTE_STATE_DONE = 'Anotação respondida.'

  NOTE_STATE_NOT_DONE = 'Anotação ainda não possui uma resposta.'

  NOTE_SHOW_ANSWER = 'Clique para ver a resposta desta pergunta logo abaixo.'

  NOTE_EDIT_ANSWER_BUTTON = 'Clique aqui para editar a resposta dessa anotação.'

  NOTE_EDIT_QUESTION_BUTTON =
    'Clique aqui para editar a pergunta desta anotação.'

  NOTE_DELETE_BUTTON = 'Clique aqui para apagar está anotação.'

  QUESTION_NOTE_DIALOG_TITLE = 'Pergunta'

  ANSWER_NOTE_DIALOG_TITLE = 'Resposta'

  NOTE_TAG_LABEL = 'Tags'

  DIALOG_SAVE_BUTTON_LABEL = 'Clique para salvar.'

  DIALOG_SAVE_BUTTON_TEXT = 'Salvar'

  DIALOG_CANCEL_BUTTON_LABEL = 'Clique para cancelar.'

  DIALOG_CANCEL_BUTTON_TEXT = 'Cancelar'

  SEARCH_BUTTON_LABEL = 'Pesquisar'

  ANSWER_DIALOG_LABEL = 'Tela para responder uma questão anotada.'

  FORM_NAME = 'Nome'

  FORM_DESCRIPTION = 'Descrição'

  FORM_TYPE = 'Tipo'

  FORM_PHONE = 'Telefone'

  CONTACTS_ADD_CONTACT = 'Novo Contato'

  CONTACTS_MOBILE_PHONE = 'Telefone Móvel'

  CONTACTS_RESIDENTIAL_PHONE = 'Telefone Fixo'

  CONTACTS_PUBLIC_SERVICE_PHONE = 'Serviço Público'

  NO_AVAILABLE_TEXT = 'Sem Texto Disponível'

  JANUARY = 'Janeiro'

  FEBRUARY = 'Fevereiro'

  MARCH = 'Março'

  APRIL = 'Abril'

  MAY = 'Maio'

  JUNE = 'Junho'

  JULY = 'Julho'

  AUGUST = 'Agosto'

  SEPTEMBER = 'Setembro'

  OCTOBER = 'Outubro'

  NOVEMBER = 'Novembro'

  DECEMBER = 'Dezembro'

  INVALID_MONTH = 'Mês inválido'

  STRING_DATE_FORMAT = 'DD de MM de YYYY'

  DELETE_NOTE_ALERT_TITLE = 'Tem certeza que deseja excluir esta anotação?'

  DELETE_NOTE_ALERT_TEXT =
    'Ao aceitar esta anotação será removida permanentemente.'

  LOADING = 'Carregando...'

  NO_OPTIONS = 'Sem opções'

  EMPTY_FIELD_ERROR = 'Campo não pode ser vazio.'

  QUESTION_ALREADY_EXISTS_ERROR = 'Questão já adicionada.'

  DISCONNECTED_MESSAGE =
    'Você está desconectado da Internet. Para salvar alterações locais conecte-se a Internet.'

  CONNECTED_MESSAGE = 'Agora você está conectado!'

  SYNC_STARTED = 'Sincronizando dados...'

  SYNC_FINISH = 'Dados sincronizados!'

  SYNC_FAIL = 'Sincronização falhou. Iremos tentar novamente...'

  SYNC_CONNECTION_FAIL =
    'Erro de conexão durante a sincronização. Assim que a conexão retornar tentaremos novamente.'

  CANT_LOGIN_DISCONNECTED = 'Conexão com a internet necessária para login'

  DISCONNECTED = 'Desconectado'

  SUNDAY_NAME = 'Domingo'

  MONDAY_NAME = 'Segunda'

  TUESDAY_NAME = 'Terça'

  WEDNESDAY_NAME = 'Quarta'

  THURSDAY_NAME = 'Quinta'

  FRIDAY_NAME = 'Sexta'

  SATURDAY_NAME = 'Sabádo'

  NEXT_BUTTON_TEXT = 'Próximo'

  PREVIOUS_BUTTON_TEXT = 'Anterior'

  CLOSE_ARIA_LABEL = 'Fechar'

  DELETE_ARIA_LABEL = 'Deletar'
  
  EDIT_ARIA_LABEL = 'Editar'

  INVALID_WEEKDAY = 'Dia da semana inválido.'

  TODAY = 'Hoje'

  DATE_FROM = 'De'

  DATE_TO = 'Até'

  MEDICAL_APPOINTMENT_TYPE = 'Consulta médica'

  MEDICINE_TYPE = 'Medicamento'

  INVALID_EVENT_TYPE = 'Tipo de evento inválido'

  MINUTES = 'minutos '
  
  HOURS = 'horas'
  
  DAYS = 'dias'

  AND = 'e'

  BEFORE = 'antes'

  MINUTE = 'minuto'

  HOUR = 'hora'
  
  DAY = 'dia'
}
