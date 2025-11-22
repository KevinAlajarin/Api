import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

// Configurar SendGrid con la API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Envía un email de confirmación de cita
 * @param {Object} cita - Objeto con los datos de la cita
 * @param {string} cita.nombre - Nombre del paciente
 * @param {string} cita.apellido - Apellido del paciente
 * @param {string} cita.email - Email del paciente
 * @param {string} cita.fecha - Fecha de la cita (YYYY-MM-DD)
 * @param {string} cita.horario - Horario de la cita (HH:MM)
 * @param {string} cita.ObraSocial?.nombre - Nombre de la obra social (opcional)
 */
export const enviarEmailConfirmacion = async (cita) => {
    try {
        const fechaFormateada = new Date(cita.fecha).toLocaleDateString('es-AR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const mensaje = {
            to: cita.email,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject: '✅ Cita Confirmada - Sistema de Citas Médicas',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background-color: #4CAF50;
                            color: white;
                            padding: 20px;
                            text-align: center;
                            border-radius: 5px 5px 0 0;
                        }
                        .content {
                            background-color: #f9f9f9;
                            padding: 30px;
                            border-radius: 0 0 5px 5px;
                        }
                        .info-box {
                            background-color: white;
                            padding: 15px;
                            margin: 15px 0;
                            border-left: 4px solid #4CAF50;
                            border-radius: 4px;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            color: #666;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>✅ Cita Confirmada</h1>
                    </div>
                    <div class="content">
                        <p>Estimado/a <strong>${cita.nombre} ${cita.apellido}</strong>,</p>
                        
                        <p>Nos complace informarle que su cita médica ha sido <strong>confirmada</strong>.</p>
                        
                        <div class="info-box">
                            <h3>📅 Detalles de su cita:</h3>
                            <p><strong>Fecha:</strong> ${fechaFormateada}</p>
                            <p><strong>Horario:</strong> ${cita.horario}</p>
                            ${cita.ObraSocial?.nombre ? `<p><strong>Obra Social:</strong> ${cita.ObraSocial.nombre}</p>` : ''}
                        </div>
                        
                        <p>Por favor, asegúrese de llegar con 10 minutos de anticipación.</p>
                        
                        <p>Si necesita cancelar o reprogramar su cita, por favor contáctenos con la mayor anticipación posible.</p>
                        
                        <p>Saludos cordiales,<br>
                        <strong>Equipo de Administración</strong></p>
                    </div>
                    <div class="footer">
                        <p>Este es un email automático, por favor no responda a este mensaje.</p>
                    </div>
                </body>
                </html>
            `,
            text: `
                Cita Confirmada
            
                Estimado/a ${cita.nombre} ${cita.apellido},
                
                Nos complace informarle que su cita médica ha sido confirmada.
                
                Detalles de su cita:
                - Fecha: ${fechaFormateada}
                - Horario: ${cita.horario}
                ${cita.ObraSocial?.nombre ? `- Obra Social: ${cita.ObraSocial.nombre}` : ''}
                
                Por favor, asegúrese de llegar con 10 minutos de anticipación.
                
                Si necesita cancelar o reprogramar su cita, por favor contáctenos con la mayor anticipación posible.
                
                Saludos cordiales,
                Equipo de Administración
            `
        };

        await sgMail.send(mensaje);
        console.log(`✅ Email de confirmación enviado a ${cita.email}`);
        return true;
    } catch (error) {
        console.error('❌ Error al enviar email de confirmación:', error);
        if (error.response) {
            console.error('Detalles del error:', error.response.body);
        }
        throw error;
    }
};

/**
 * Envía un email de cancelación de cita
 * @param {Object} cita - Objeto con los datos de la cita
 * @param {string} cita.nombre - Nombre del paciente
 * @param {string} cita.apellido - Apellido del paciente
 * @param {string} cita.email - Email del paciente
 * @param {string} cita.fecha - Fecha de la cita (YYYY-MM-DD)
 * @param {string} cita.horario - Horario de la cita (HH:MM)
 * @param {string} cita.ObraSocial?.nombre - Nombre de la obra social (opcional)
 */
export const enviarEmailCancelacion = async (cita) => {
    try {
        const fechaFormateada = new Date(cita.fecha).toLocaleDateString('es-AR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const mensaje = {
            to: cita.email,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject: '❌ Cita Cancelada - Sistema de Citas Médicas',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background-color: #f44336;
                            color: white;
                            padding: 20px;
                            text-align: center;
                            border-radius: 5px 5px 0 0;
                        }
                        .content {
                            background-color: #f9f9f9;
                            padding: 30px;
                            border-radius: 0 0 5px 5px;
                        }
                        .info-box {
                            background-color: white;
                            padding: 15px;
                            margin: 15px 0;
                            border-left: 4px solid #f44336;
                            border-radius: 4px;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            color: #666;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>❌ Cita Cancelada</h1>
                    </div>
                    <div class="content">
                        <p>Estimado/a <strong>${cita.nombre} ${cita.apellido}</strong>,</p>
                        
                        <p>Lamentamos informarle que su cita médica ha sido <strong>cancelada</strong>.</p>
                        
                        <div class="info-box">
                            <h3>📅 Detalles de la cita cancelada:</h3>
                            <p><strong>Fecha:</strong> ${fechaFormateada}</p>
                            <p><strong>Horario:</strong> ${cita.horario}</p>
                            ${cita.ObraSocial?.nombre ? `<p><strong>Obra Social:</strong> ${cita.ObraSocial.nombre}</p>` : ''}
                        </div>
                        
                        <p>Si desea reprogramar su cita, por favor contáctenos para coordinar un nuevo horario.</p>
                        
                        <p>Disculpe las molestias ocasionadas.</p>
                        
                        <p>Saludos cordiales,<br>
                        <strong>Equipo de Administración</strong></p>
                    </div>
                    <div class="footer">
                        <p>Este es un email automático, por favor no responda a este mensaje.</p>
                    </div>
                </body>
                </html>
            `,
            text: `
                Cita Cancelada
            
                Estimado/a ${cita.nombre} ${cita.apellido},
                
                Lamentamos informarle que su cita médica ha sido cancelada.
                
                Detalles de la cita cancelada:
                - Fecha: ${fechaFormateada}
                - Horario: ${cita.horario}
                ${cita.ObraSocial?.nombre ? `- Obra Social: ${cita.ObraSocial.nombre}` : ''}
                
                Si desea reprogramar su cita, por favor contáctenos para coordinar un nuevo horario.
                
                Disculpe las molestias ocasionadas.
                
                Saludos cordiales,
                Equipo de Administración
            `
        };

        await sgMail.send(mensaje);
        console.log(`✅ Email de cancelación enviado a ${cita.email}`);
        return true;
    } catch (error) {
        console.error('❌ Error al enviar email de cancelación:', error);
        if (error.response) {
            console.error('Detalles del error:', error.response.body);
        }
        throw error;
    }
};

