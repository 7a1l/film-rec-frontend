type Props = {
    message: string | null | undefined;
}

export function AuthFormErrorAlert ({message}: Props){
    return (
        <p className="text-destructive text-sm" role="alert">
            { message }
        </p>
    )
}
