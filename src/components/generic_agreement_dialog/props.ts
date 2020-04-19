export default interface DialogProps {
    question: string
    description: string
    onAgree?: () => void
    onDisagree?: () => void
    agreeOptionText: string
    disagreeOptionText: string
}