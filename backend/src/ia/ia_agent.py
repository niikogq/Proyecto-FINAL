import sys
import json

def analizar_descripcion(descripcion):
    descripcion = descripcion.lower()
    if "fuga" in descripcion:
        return {
            "tipo_sugerido": "Correctivo",
            "prioridad": "Alta",
            "sugerencia": "Detectada posible fuga. Revisar conexiones y sellos."
        }
    if "temperatura" in descripcion or "calor" in descripcion:
        return {
            "tipo_sugerido": "Inspección",
            "prioridad": "Media",
            "sugerencia": "Puede haber sobrecalentamiento. Chequear ventiladores y sensores."
        }
    if "ruido" in descripcion:
        return {
            "tipo_sugerido": "Inspección",
            "prioridad": "Baja",
            "sugerencia": "Revisar rodamientos y partes móviles."
        }
    return {
        "tipo_sugerido": "General",
        "prioridad": "Baja",
        "sugerencia": "No se detecta un patrón crítico. Análisis manual recomendado."
    }

def sugerir_mantenimiento(historial):
    # historial = [{'desc': str, 'tipo': str, 'estado': str}, ...]
    fugas = sum(1 for h in historial if "fuga" in h['desc'])
    temp = sum(1 for h in historial if "temperatura" in h['desc'] or "calor" in h['desc'])
    if fugas > 2:
        return "Recomendación: Programa una inspección general de hidráulica. Tendencia de fugas detectada."
    if temp > 2:
        return "Recomendación: Priorizar revisión de sistema de refrigeración."
    return "No se detectan patrones de falla recurrente. Mantenimiento rutinario."

def resumir_reporte(resumen):
    if "falla" in resumen or "crítico" in resumen:
        return "Atención: Detectadas incidencias críticas en el periodo reportado. Revisa activos críticos."
    return "No se detectan incidentes críticos en el periodo."

def analizar_ordenes_activos(ordenes, activos):
    comentario = ""
    activos_atencion = [a['nombre'] for a in activos if a['estado'].lower() in ['fuera de servicio', 'en mantenimiento']]
    muchas_ordenes = [o for o in ordenes if o['status'] == 'En Progreso']
    if activos_atencion:
        comentario += f"Atención: Activos en estado crítico/en mantenimiento: {', '.join(activos_atencion)}. "
    if len(muchas_ordenes) > 5:
        comentario += f"Actualmente hay {len(muchas_ordenes)} órdenes 'En Progreso'. Considera revisar recursos/disponibilidad."
    if not comentario:
        comentario = "No se detectan alertas destacadas en órdenes y activos."
    return {"comentario": comentario}

def main():
    entrada = json.loads(sys.stdin.read())
    funcion = entrada.get("funcion")
    if funcion == "analizar_descripcion":
        result = analizar_descripcion(entrada.get("descripcion", ""))
    elif funcion == "sugerir_mantenimiento":
        result = {"recomendacion": sugerir_mantenimiento(entrada.get("historial", []))}
    elif funcion == "resumir_reporte":
        result = {"resumen": resumir_reporte(entrada.get("resumen", ""))}
    elif funcion == "analizar_ordenes_activos":
        result = analizar_ordenes_activos(entrada.get("ordenes", []), entrada.get("activos", []))
    else:
        result = {"error": "Función IA no reconocida"}
    
    print(json.dumps(result))


if __name__ == "__main__":
    main()
