import requests
import json

url = "http://127.0.0.1:5000"

def run_tests():
    good_image_upload()

def good_image_upload():
    files = {'file': open('egg.jpg', 'rb')}
    headers = {"Accepts" : "multipart/form-data"}
    r = requests.post(url + "/api/image-upload", files=files, headers=headers)

    output = json.loads(r.text)
    print(output)

def bad_image_upload():
    pass



if __name__ == "__main__":
    run_tests()
