from regex import D
import requests
import json
from dateutil import parser

lat = "48.137154"
lon = "11.576124"
apiKey = "mFKBWnAJtG0ngHshxNhDeH54IceiRo5t"
# https://api.tomorrow.io/v4/timelines?location=-73.98529171943665,40.75872069597532&fields=temperature&timesteps=1h&units=metric&apikey=mFKBWnAJtG0ngHshxNhDeH54IceiRo5t
dat = requests.get(
    f"https://api.tomorrow.io/v4/timelines?location={lat},{lon}&fields=temperature&timesteps=1h&units=metric&apikey={apiKey}").text
parsed = json.loads(dat)
weathers = parsed["data"]["timelines"][0]["intervals"]

dataNow = None
dataTomorow = None
dataAfterTomorow = None

i = 0
for x in weathers:
    if (i == 0):
        dataNow = x["values"]["temperature"]
    if (i == 24):
        dataTomorow = x["values"]["temperature"]
    if (i == 48):
        dataAfterTomorow = x["values"]["temperature"]
    i += 1

print(f"Now: {dataNow}")
print(f"Tomorow: {dataTomorow}")
print(f"AfterTomorow: {dataAfterTomorow}")

"""
Weather codes:

"weatherCode": {
    "0": "Unknown (20)",
    "1000": "Clear, Sunny (1)",
    "1100": "Mostly Clear (2)",
    "1101": "Partly Cloudy (3)",
    "1102": "Mostly Cloudy (4)",
    "1001": "Cloudy (5)",
    "2000": "Fog (7)",
    "2100": "Light Fog (8)",
    "4000": "Drizzle (8)",
    "4001": "Rain (10)",
    "4200": "Light Rain (9)",
    "4201": "Heavy Rain (11)",
    "5000": "Snow (14)",
    "5001": "Flurries (12)",
    "5100": "Light Snow (13)",
    "5101": "Heavy Snow (15)",
    "6000": "Freezing Drizzle (8)",
    "6001": "Freezing Rain (10)",
    "6200": "Light Freezing Rain (9)",
    "6201": "Heavy Freezing Rain (11)",
    "7000": "Ice Pellets (18)",
    "7101": "Heavy Ice Pellets (19)",
    "7102": "Light Ice Pellets (17)",
    "8000": "Thunderstorm (16)"
}
"""
