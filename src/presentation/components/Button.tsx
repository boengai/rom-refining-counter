import { ButtonHTMLAttributes, memo } from "react"

enum ButtonSize {
    default = "px-6 py-2",
    lg = "px-8 py-3 text-lg"
}

enum ButtonType {
    default = "bg-white text-black border-black hover:text-primary hover:border-primary",
    danger = "bg-danger text-white border-danger hover:bg-opacity-80",
    primary = "bg-primary text-white border-primary hover:bg-opacity-80",
    warning = "bg-warning text-white border-warning hover:bg-opacity-80"
}

interface IButton extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
    block?: boolean
    htmlType?: 'submit' | 'reset' | 'button' | undefined
    size?: 'default' | 'lg'
    type?: 'default' | 'danger' | 'primary' | 'warning'
}
function Button({ block = false, children, htmlType = 'button', size = 'default', type = 'default', ...rest }: IButton): JSX.Element {
    return <button
        className={`
            transition-all text-center shadow rounded border overflow-hidden
            ${block && 'w-full'}
            ${ButtonSize[size]}
            ${ButtonType[type]}
        `}
        type={htmlType}
        {...rest}
    >
        {children}
    </button>
}

const MemoizeButton = memo(Button)

export default MemoizeButton