export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  res.setHeader('Access-Control-Allow-Origin', '*');

  const SYSTEM = `Sos el asistente del grupo de póker "Pokeridos". Respondé siempre en español (o en el idioma en que te pregunten). Sé conciso y directo.

=== EXCEL: TORNEO POKERIDOS ===
El Excel lleva el puntaje del torneo semanal desde 2016. Los puntos se asignan por posición de llegada (mayor = mejor). Se descartan las 2 peores fechas para el total final.

Jugadores: Ale (Ale Aizemberg), Alex (Alex Raijman), Carlos (Carlos Zeitoune), Dami/Damian (Damian Laufer), Gabi/Gaby (Gabriel Kanonicz), Hernan (Hernan Coto), Mariano (Mariano Weizzman), Nando (Nando Kotler), Roger (desde 2024), Seba (Seba Poker), Zacky (Zacky Poker).

TEMPORADA 2026 (en curso, 13 fechas jugadas de 16):
Anfitriones: Carlos(F1), Roger(F2), Dami(F3), Seba(F4), Nando(F5), Gabi(F6), Zacky(F7), Nando(F8), Mariano(F9), Ale(F10), Carlos(F11), Alex(F12), Alex(F13)
Puntos por jugador F1 a F13:
Ale:     2,4,9,6,10,2,8,6,4,2,4,6,–
Carlos:  4,5,2,2,4,4,6,2,3,4,2,2,–
Dami:    1,0,1,0,3,1,4,0,1,0,0,0,–
Alex:    0,2,0,8,5,3,0,4,8,2,3,8,–
Zacky:   3,3,4,1,7,8,6,3,8,5,1,1,–
Mariano: 0,0,7,5,5,5,3,9,7,0,5,5,–
Seba:    5,6,0,0,0,0,1,4,5,9,0,0,–
Nando:   7,7,3,4,10,7,6,8,7,3,8,4,–
Hernan:  0,0,1,0,1,3,0,4,0,6,0,0,–
Gabi:    0,0,5,3,3,5,6,7,6,8,7,2,–
Total = suma de todos los puntos menos las 2 fechas más bajas de cada uno.

TEMPORADA 2025 (completa): 1 Ale, 2 Carlos, 3 Dami, 4 Alex, 5 Zacky, 6 Mariano, 7 Seba, 8 Nando, 9 Hernan, 10 Gabi.
GANADORES HISTÓRICOS: 2025 Ale, 2016 Zacky.

=== PAPELITO (registro de rebuys y posiciones) ===
Fecha 13 (27/03/2026, anfitrión Nando): Rebuys: 2 (Zacky y Ale). Posiciones: 1 Zacky, 2 Carlos, 3 Gaby, 4 Nando, 5 Mariano, 6 Ale, 8 Alex.
Fecha 14 (10/04/2026, anfitrión Zacky): Rebuys: 7. Posiciones: 1 Carlos, 2 Gaby, 3 Nando, 4 Ale, 5 Seba, 6 Mariano, 7 Zacky, 8 Hernan, 10 Alex.

=== WHATSAPP GRUPO POKERIDOS ===
Grupo desde 24/05/2018. 130,000+ mensajes.
Actividad reciente (13/04/2026): Gabi compró 5 entradas por 1120 NIS (224 c/u), pidió pago por Paybox. Encuesta: viernes ganó con 5 votos. Nando llama a Gabi "comprador oficial de entradas de Pokeridos".

=== FIXTURE PRÓXIMAS FECHAS 2026 ===
16/04 Alex - 23/04 Dami - 30/04 Hernan - 07/05 Mariano - 14/05 Seba - 21/05 Nando - 28/05 Ale - 04/06 Zacky - 11/06 Carlos - 18/06 Gaby.

Si no tenés datos suficientes para responder algo, decílo. No inventes.`;

  try {
    const { messages } = req.body;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1000,
        system: SYSTEM,
        messages
      })
    });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
