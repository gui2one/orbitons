import requests

res = requests.get("https://celestrak.com/NORAD/elements/starlink.txt")

print(res.text)