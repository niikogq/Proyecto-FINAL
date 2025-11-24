from flask import Flask, request, jsonify

app = Flask(__name__)

# Simulaciones de datos: elimina cuando tengas tu base real
ORDENES_PENDIENTES = [
    {"id": 1, "descripcion": "Reparar bomba", "tecnico": "Juan"},
    {"id": 2, "descripcion": "Mantención panel", "tecnico": "Ana"},
]
TECNICOS = [
    {"nombre": "Juan", "disponible": True},
    {"nombre": "Ana", "disponible": False},
    {"nombre": "Lina", "disponible": True},
]
ACTIVOS = [
    {"id": 101, "nombre": "Bomba industrial"},
    {"id": 102, "nombre": "Panel solar"},
]

@app.route('/api/ia', methods=['POST'])
def ia_endpoint():
    data = request.get_json()
    message = data['message'].lower()
    rol = data.get('rol', 'tecnico').lower()

    # Mensajes de sugerencia por rol
    sugerencias = {
        "admin": "Puedes crear, modificar o eliminar activos, técnicos y supervisores. ¿Quieres ver órdenes de trabajo o cambiar un activo?",
        "supervisor": "Puedes preguntar por técnicos disponibles y órdenes de trabajo asignadas.",
        "tecnico": "Puedes consultar tus órdenes de trabajo pendientes, pedir detalles o solicitar ayuda a un supervisor.",
    }

    # Procesamiento real según mensaje y rol
    if rol == "admin":
        if "crear activo" in message:
            respuesta = "Para crear un activo, dime el nombre y tipo. Ejemplo: 'crear activo bomba industrial'."
        elif "ver activos" in message:
            respuesta = f"Activos del sistema: {[a['nombre'] for a in ACTIVOS]}"
        elif "eliminar" in message:
            respuesta = "Indícame el ID o nombre del activo a eliminar."
        else:
            respuesta = f"[ADMIN] {sugerencias['admin']}"
    elif rol == "supervisor":
        if "tecnico disponible" in message or "técnicos disponibles" in message:
            disponibles = [t["nombre"] for t in TECNICOS if t["disponible"]]
            respuesta = f"Técnicos disponibles: {', '.join(disponibles)}"
        elif "orden" in message or "trabajo" in message:
            respuesta = f"Órdenes de trabajo asignadas: {[o['descripcion'] for o in ORDENES_PENDIENTES]}"
        else:
            respuesta = f"[SUPERVISOR] {sugerencias['supervisor']}"
    elif rol == "tecnico":
        if "pendiente" in message or "mis ordenes" in message:
            respuesta = f"Tus órdenes pendientes: {', '.join([o['descripcion'] for o in ORDENES_PENDIENTES])}"
        elif "ayuda" in message:
            respuesta = "Puedes comunicarte con el supervisor para pedir asistencia."
        else:
            respuesta = f"[TECNICO] {sugerencias['tecnico']}"
    else:
        respuesta = "Rol no reconocido. Contacta al administrador."

    return jsonify({"answer": respuesta})

if __name__ == '__main__':
    app.run(host='localhost', port=5000)
