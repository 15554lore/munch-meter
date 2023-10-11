import requests
import json
import logging

logging.basicConfig(filename="moderation.txt", filemode="w", format="", level=logging.DEBUG)

def moderate_image(img_url) -> bool:
    params = {
        'models': 'nudity-2.0,wad,offensive,text-content,gore',
        'api_user': '329009777',
        'api_secret': '2hgK8MzS9U6eiBBNnnak'
    }
    files = {'media': open(img_url, 'rb')}
    r = requests.post('https://api.sightengine.com/1.0/check.json', files=files, data=params).json()
    logging.debug(r)
    if r["nudity"]["none"] < 0.25:
        return False
    if r["weapon"] > 0.75:
        return False
    if r["offensive"]["prob"] > 0.75:
        return False
    if r["gore"]["prob"] > 0.75:
        return False
    for prof in r["text"]["profanity"]:
        if prof["intensity"] == "high":
            return False
    return True


if __name__ == "__main__":
    moderate_image("")
    print(moderate_image(""))
