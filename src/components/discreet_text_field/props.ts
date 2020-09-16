export default interface DiscreetTextFieldProps {
    text: string
    className?: string
    onChange: (text: string) => void
    error?: boolean
    helperText?: string
}