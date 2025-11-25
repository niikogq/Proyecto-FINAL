from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "mistral"

# Cambia a la URL de tu backend si no es localhost:3001
BASE_URL = "http://localhost:3001/api"

def consultar_api(ruta, token='', metodo='get', payload=None):
    headers = {}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    url = f"{BASE_URL}{ruta}"
    try:
        if metodo == 'get':
            res = requests.get(url, headers=headers)
        elif metodo == 'post':
            res = requests.post(url, json=payload, headers=headers)
        elif metodo == 'put':
            res = requests.put(url, json=payload, headers=headers)
        elif metodo == 'delete':
            res = requests.delete(url, headers=headers)
        res.raise_for_status()
        return res.json()
    except Exception as e:
        return {"error": str(e), "url": url}

def consulta_ollama(prompt):
    body = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False
    }
    try:
        resp = requests.post(OLLAMA_URL, json=body)
        data = resp.json()
        return data['response'].strip()
    except Exception as ex:
        return f"[ERROR IA] {str(ex)}"

@app.route('/api/ia', methods=['POST'])
def ia_endpoint():
    data = request.get_json()
    mensaje = data.get('message', '')
    rol = data.get('rol', 'tecnico')
    nombre = data.get('nombre', '')
    email = data.get('email', '')
    token = data.get('token', '')

    info_app = ""
    acciones = ""
    if rol == "admin":
        lista_activos = consultar_api('/assets', token)
        lista_users = consultar_api('/users', token)
        lista_reportes = consultar_api('/reportes', token)
        lista_workorders = consultar_api('/workorders', token)
        info_app += f"\nActivos: {lista_activos}\nUsuarios: {lista_users}\nReportes: {lista_reportes}\nÓrdenes: {lista_workorders}\n"
        acciones = "Puedes ver, crear, modificar o eliminar activos, usuarios, reportes y órdenes de trabajo."
    elif rol == "supervisor":
        lista_activos = consultar_api('/assets', token)
        lista_reportes = consultar_api('/reportes', token)
        lista_workorders = consultar_api('/workorders', token)
        info_app += f"\nActivos: {lista_activos}\nReportes: {lista_reportes}\nÓrdenes: {lista_workorders}\n"
        acciones = "Puedes ver activos, reportes y órdenes, y crear reportes, pero no usuarios."
    elif rol == "tecnico":
        lista_mis_ordenes = consultar_api('/workorders', token)
        mis_ordenes = [o for o in lista_mis_ordenes if o.get('assignedTo', '') == email or o.get('assignedTo', '') == nombre]
        info_app += f"\nTus órdenes asignadas: {mis_ordenes}\n"
        acciones = f"Técnico {nombre}: Solo puedes ver y actualizar tus órdenes asignadas."
    else:
        info_app += "Rol no reconocido; acceso mínimo permitido."
        acciones = "Solo puedes consultar información básica."

    prompt = (
        f"Eres el asistente virtual GEMPROTEC. "
        f"Usuario: {nombre} ({email}), Rol: {rol}. "
        f"{acciones}\n"
        f"Resumen de datos visibles según el rol:\n{info_app}\n"
        f"Consulta: {mensaje}\n"
        f"Responde solamente lo permitido para ese rol. Si el usuario quiere crear, modificar o eliminar datos, da instrucciones claras y verifica su permiso."
    )

    respuesta = consulta_ollama(prompt)
    return jsonify({"answer": respuesta})

if __name__ == '__main__':
    app.run(host='localhost', port=5000)
