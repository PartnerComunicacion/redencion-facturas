import * as React from "react";

interface EmailTemplateProps {
    name: string;
    email: string;
    message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    name, email, message,
}) => (
    <div>
        <h1>Se ha recibido un reporte de error</h1>
        <p>El nombre del usuario es: {name}</p>
        <p>El correo del usuario es: {email}</p>
        <p>El reporte del usuario es: {message}</p>
    </div>
);

export default EmailTemplate;