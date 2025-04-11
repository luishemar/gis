import requests
import string
import json
import random
from datetime import datetime, timedelta

# Función para limpiar el texto y dividirlo en grupos de 10 palabras
def process_text(file_path):
    try:
        with open(file_path, "r", encoding="utf-8-sig") as file:
            text = file.read()
    except FileNotFoundError:
        print(f"Error: El archivo {file_path} no se encontró.")
        return []
    except Exception as e:
        print(f"Error al leer el archivo {file_path}: {e}")
        return []

    text = text.translate(str.maketrans("", "", string.punctuation))
    words = text.split()
    grouped_words = [words[i:i + 10] for i in range(0, len(words), 10)]
    return grouped_words

# Función para generar una fecha y hora aleatoria entre dos fechas
def random_datetime(start, end):
    random_date = start + timedelta(days=random.randint(0, (end - start).days))
    random_hour = random.randint(0, 23)
    random_minute = random.randint(0, 59)
    random_second = random.randint(0, 59)
    return random_date.replace(hour=random_hour, minute=random_minute, second=random_second)

# Función para generar una lista de números de teléfono únicos
def generate_phone_numbers(count):
    phone_numbers = set()
    while len(phone_numbers) < count:
        phone_number = f"600{random.randint(100000, 999999)}"
        phone_numbers.add(phone_number)
    return list(phone_numbers)


# URL del texto de Don Quijote en Proyecto Gutenberg
url = "https://www.gutenberg.org/files/2000/2000-0.txt"

# Hacer la solicitud GET
response = requests.get(url)

# Guardar el contenido en un archivo
with open("don_quijote.txt", "w", encoding="utf-8") as file:
    file.write(response.text)

print("El texto de Don Quijote ha sido descargado.")

# Ruta del archivo de texto
file_path = "don_quijote.txt"

# Procesar el texto
grouped_words = process_text(file_path)
if not grouped_words:
    print("No se pudieron procesar las palabras. Saliendo del programa.")
    exit(1)

# Seleccionar los primeros 35,000 grupos
num_groups = 35000
selected_groups = grouped_words[:num_groups]

# Repetir los grupos 3 veces
repeated_groups = selected_groups * 3

# Crear una lista de diccionarios con el campo "phone", "observaciones", "coordinates" y "timestamp"
json_data = []
start_date = datetime(2025, 4, 1)
end_date = datetime(2025, 4, 15)

# Generar 3000 números de teléfono únicos
phone_numbers = generate_phone_numbers(3000)

for group in repeated_groups:
    # Seleccionar un número de teléfono aleatorio de la lista generada
    phone_number = random.choice(phone_numbers)

    # Crear el string de observaciones
    observations = " ".join(group)
    
    # Generar coordenadas aleatorias entre -5 y +5, redondeadas a 6 decimales
    coordinates = {
        "lon": round(random.uniform(-5, 5), 6),
        "lat": round(random.uniform(-5, 5), 6)
    }
    
    # Generar una fecha y hora aleatoria en formato ISO 8601 (GMT/ZULU)
    random_dt = random_datetime(start_date, end_date)
    timestamp = random_dt.strftime("%Y-%m-%dT%H:%M:%SZ")  # Formato ISO 8601

    # Añadir el diccionario a la lista
    json_data.append({
        "phone": phone_number,
        "observaciones": observations,
        "coordinates": coordinates,
        "timestamp": timestamp
    })

# Guardar en un archivo JSON
output_file = "don_quijote_repeated_with_coordinates_and_timestamps.json"
try:
    with open(output_file, "w", encoding="utf-8") as json_file:
        json.dump(json_data, json_file, ensure_ascii=False, indent=4)
    print(f"Se han guardado {len(json_data)} registros en el archivo {output_file}.")
except Exception as e:
    print(f"Error al guardar el archivo {output_file}: {e}")
