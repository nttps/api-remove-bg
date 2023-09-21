import cv2

from transparent_background import Remover
from PIL import Image
import sys

input_image_path = sys.argv[1]
output_image_path = sys.argv[2]

remover = Remover() # default setting
remover = Remover(fast=False, jit=False) # custom setting

try:
    with open(input_image_path, 'rb') as input_image_file:
        with open(output_image_path, 'wb') as output_image_file:
            image = Image.open(input_image_file).convert('RGB')
            output_image = remover.process(image)
            Image.fromarray(output_image).save(output_image_file) # save result

    print("Background removed. Output image saved to", output_image_path)
except Exception as e:
    print("An error occurred:", str(e))
