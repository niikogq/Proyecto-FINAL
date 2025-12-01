from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import os

# Aquí obtenemos la clave de la variable de entorno, NO la clave literal
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise RuntimeError("Variable de entorno OPENAI_API_KEY no está definida")

client = OpenAI(api_key=openai_api_key)

app = FastAPI()

class OrdenTrabajoRequest(BaseModel):
    descripcion: str

@app.post("/api/ia/orden-trabajo")
async def analizar_orden_trabajo(orden: OrdenTrabajoRequest):
    prompt = f"""
Eres un asistente experto en mantenimiento. Analiza esta orden de trabajo de forma breve y precisa:
{orden.descripcion}

Responde con:

1. Puntos críticos (máximo 2 frases).  
2. Posibles problemas (máximo 2 frases).  
3. Prioridad (alta, media o baja).  
4. Sugerencia útil en una sola frase.

No agregues texto extra ni explicaciones largas.
Respuesta:
"""
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.6,
        )
        return {"respuesta_ia": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
