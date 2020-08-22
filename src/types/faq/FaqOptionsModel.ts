export interface FaqOptionsModel {
    version: number,
    options: FaqTitleOptionsModel[],
}

export interface FaqTitleOptionsModel {
    id: number,
    title: string
}