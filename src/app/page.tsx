import React, { useState } from 'react';

// Definimos el tipo de los datos que esperamos recibir de la API
interface APIResponse {
  response: string;
}

const AssistantClientPage: React.FC = () => {
  const [data, setData] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userInput, setUserInput] = useState<string>(''); // Estado para el input del usuario

  // Función para enviar un comando a la API
  const sendCommand = async (): Promise<void> => {
    if (!userInput) return;

    setLoading(true); // Activar indicador de carga
    try {
      const res = await fetch('/http://127.0.0.1:5000/process_command', { // Cambia a la ruta API de Next.js
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: userInput }), // Enviar el comando ingresado
      });
      if (!res.ok) {
        throw new Error('Error al hacer la petición a la API');
      }
      const result: APIResponse = await res.json();
      setData(result); // Guardar la respuesta de la API
      setError(null); // Reiniciar el estado de error
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message); // Mostrar mensaje de error
      } else {
        setError('Error desconocido al procesar el comando');
      }
    } finally {
      setLoading(false); // Desactivar indicador de carga
    }
  };

  // Función para iniciar el reconocimiento de voz
  const startVoiceRecognition = (): void => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';

    recognition.onresult = async (event: SpeechRecognitionEvent): Promise<void> => {
      const command = event.results[0][0].transcript;
      setUserInput(command); // Actualiza el input del usuario con el comando reconocido
      sendCommand(); // Envía el comando reconocido a la API
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError('Error en el reconocimiento de voz: ' + event.error); // Manejo de errores en el reconocimiento de voz
    };

    recognition.start();
  };

  return (
    <div>
      <h1>¡Bienvenido al Asistente de Tareas!</h1>

      <div id="messages">
        <div className="message assistant">
          ¡Hola! Escribe o usa el comando de voz para agregar, consultar o eliminar tareas.
        </div>
        {data && <div className="message assistant">{data.response}</div>}
        {error && <div className="message error">{error}</div>}
      </div>

      {/* Input para ingresar el comando */}
      <input
        type="text"
        value={userInput} // Vincula el valor del input al estado
        onChange={(e) => setUserInput(e.target.value)} // Actualiza el estado al escribir
        placeholder="Escribe tu comando..."
      />

      {/* Botón para enviar el comando */}
      <button onClick={sendCommand}>Enviar</button>

      {/* Botón para activar el comando de voz */}
      <button id="voiceBtn" onClick={startVoiceRecognition}>Usar comando de voz</button>

      {loading && <p>Cargando...</p>}
    </div>
  );
};

export default AssistantClientPage;
