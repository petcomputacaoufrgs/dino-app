type filterCallback<T> = (value: T) => boolean

/**
 * @param list Lista a ser filtrada
 * @param filterFn Função filtro
 * 
 * @returns Lista com Lista de items que obedecem o filtro e lista de items que não
 */
function separate<T>(list: T[], filterFn: filterCallback<T>): [T[], T[]] {
    const _in: any[] = []
    const _out: any[] = []
    list.forEach(value => {
        if (filterFn(value)) {
            _in.push(value)
        } else {
            _out.push(value)
        }
    }) 
    return [_in, _out]
}

export default separate