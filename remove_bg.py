import cv2

from rembg import remove, new_session
from PIL import Image
import sys

input_image_path = sys.argv[1]
output_image_path = sys.argv[2]

session = new_session()

try:
    with open(input_image_path, 'rb') as input_image_file:
        with open(output_image_path, 'wb') as output_image_file:
            image = Image.open(input_image_file)
            output_image = remove(image, session)
            output_image.save(output_image_file) # save result
except Exception as e:
    print("An error occurred:", str(e))
