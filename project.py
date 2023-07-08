import os
import tensorflow as tf
from object_detection.utils import label_map_util
from object_detection.utils import visualization_utils as viz_utils
from object_detection.builders import model_builder
from object_detection.utils import config_util
import cv2 
import numpy as np
import time
import pytesseract
from PIL import Image


# files and paths

CUSTOM_MODEL_NAME = 'my_ssd_mobnet' 
PRETRAINED_MODEL_NAME = 'ssd_mobilenet_v2_fpnlite_320x320_coco17_tpu-8'
PRETRAINED_MODEL_URL = 'http://download.tensorflow.org/models/object_detection/tf2/20200711/ssd_mobilenet_v2_fpnlite_320x320_coco17_tpu-8.tar.gz'
TF_RECORD_SCRIPT_NAME = 'generate_tfrecord.py'
LABEL_MAP_NAME = 'label_map.pbtxt'

paths = {
    'WORKSPACE_PATH': os.path.join('Tensorflow', 'workspace'),
    'SCRIPTS_PATH': os.path.join('Tensorflow','scripts'),
    'APIMODEL_PATH': os.path.join('Tensorflow','models'),
    'ANNOTATION_PATH': os.path.join('Tensorflow', 'workspace','annotations'),
    'IMAGE_PATH': os.path.join('Tensorflow', 'workspace','images'),
    'MODEL_PATH': os.path.join('Tensorflow', 'workspace','models'),
    'PRETRAINED_MODEL_PATH': os.path.join('Tensorflow', 'workspace','pre-trained-models'),
    'CHECKPOINT_PATH': os.path.join('Tensorflow', 'workspace','models',CUSTOM_MODEL_NAME), 
    'OUTPUT_PATH': os.path.join('Tensorflow', 'workspace','models',CUSTOM_MODEL_NAME, 'export'), 
    'TFJS_PATH':os.path.join('Tensorflow', 'workspace','models',CUSTOM_MODEL_NAME, 'tfjsexport'), 
    'TFLITE_PATH':os.path.join('Tensorflow', 'workspace','models',CUSTOM_MODEL_NAME, 'tfliteexport'), 
    'PROTOC_PATH':os.path.join('Tensorflow','protoc')
 }


files = {
    'PIPELINE_CONFIG':os.path.join('Tensorflow', 'workspace','models', CUSTOM_MODEL_NAME, 'pipeline.config'),
    'TF_RECORD_SCRIPT': os.path.join(paths['SCRIPTS_PATH'], TF_RECORD_SCRIPT_NAME), 
    'LABELMAP': os.path.join(paths['ANNOTATION_PATH'], LABEL_MAP_NAME)
}

# Load pipeline config and build a detection model
configs = config_util.get_configs_from_pipeline_file(files['PIPELINE_CONFIG'])
detection_model = model_builder.build(model_config=configs['model'], is_training=False)

# Restore checkpoint
ckpt = tf.compat.v2.train.Checkpoint(model=detection_model)
ckpt.restore(os.path.join(paths['CHECKPOINT_PATH'], 'ckpt-11')).expect_partial()


# detection function
@tf.function
def detect_fn(image):
    image, shapes = detection_model.preprocess(image)
    prediction_dict = detection_model.predict(image, shapes)
    detections = detection_model.postprocess(prediction_dict, shapes)
    return detections

category_index = label_map_util.create_category_index_from_labelmap(files['LABELMAP'])

###################### detect from Image #######################

def detect_from_image(imgName):

    IMAGE_PATH = os.path.join(paths['IMAGE_PATH'], 'test', imgName)

    img = cv2.imread(IMAGE_PATH)
    image_np = np.array(img)

    input_tensor = tf.convert_to_tensor(np.expand_dims(image_np, 0), dtype=tf.float32)
    detections = detect_fn(input_tensor)


    num_detections = int(detections.pop('num_detections'))
    detections = {key: value[0, :num_detections].numpy()
                for key, value in detections.items()}
    detections['num_detections'] = num_detections

    # detection_classes should be ints.
    detections['detection_classes'] = detections['detection_classes'].astype(np.int64)

    label_id_offset = 1
    image_np_with_detections = image_np.copy()

    viz_utils.visualize_boxes_and_labels_on_image_array(
                image_np_with_detections,
                detections['detection_boxes'],
                detections['detection_classes']+label_id_offset,
                detections['detection_scores'],
                category_index,
                use_normalized_coordinates=True,
                max_boxes_to_draw=5,
                min_score_thresh=.8,
                agnostic_mode=False)

    # croded the detected part
    detection_threshold = 0.7
    image = image_np_with_detections
    scores = list(filter(lambda x: x > detection_threshold, detections['detection_scores']))
    boxes = detections['detection_boxes'][:len(scores)]
    width = image.shape[1]
    height = image.shape[0]

    for idx, box in enumerate(boxes):
        roi = box*[height, width, height, width]
        region = image[int(roi[0]):int(roi[2]), int(roi[1]):int(roi[3])]
        
    # print(detections['detection_scores'][0])
    # cv2.imshow("region", region)
    # cv2.imwrite("region.jpg", region)

    # Exctract text
    pytesseract.pytesseract.tesseract_cmd='C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
    license = pytesseract.image_to_string(region, config='-c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ --psm 8 --oem 3')
    print('Text detected: {}'.format(license))
    
    # cv2.imshow('after',cv2.cvtColor(image_np_with_detections, cv2.COLOR_BGR2RGB))
    # cv2.imshow('after',(image_np_with_detections))
    # cv2.waitKey(0)
    cv2.destroyAllWindows()
    return license

########################### detect from webcam ####################
def detect_from_webcam():

    cap = cv2.VideoCapture(0)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # calc blur oercentage function

    def calculate_blur(frame):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        laplacian = cv2.Laplacian(gray, cv2.CV_64F).var()
        return laplacian

    min_blur = 0  # Adjust this value based on your camera and image quality
    max_blur = 1000  # Adjust this value based on your camera and image quality

    def blur_percentage(blur_value, min_blur, max_blur):
        return np.clip((blur_value - min_blur) / (max_blur - min_blur) * 100, 0, 100)


    while cap.isOpened(): 
        ret, frame = cap.read()
        image_np = np.array(frame)
        
        input_tensor = tf.convert_to_tensor(np.expand_dims(image_np, 0), dtype=tf.float32)
        detections = detect_fn(input_tensor)
        
        num_detections = int(detections.pop('num_detections'))
        detections = {key: value[0, :num_detections].numpy()
                    for key, value in detections.items()}
        detections['num_detections'] = num_detections

        # detection_classes should be ints.
        detections['detection_classes'] = detections['detection_classes'].astype(np.int64)

        label_id_offset = 1
        image_np_with_detections = image_np.copy()

        viz_utils.visualize_boxes_and_labels_on_image_array(
                    image_np_with_detections,
                    detections['detection_boxes'],
                    detections['detection_classes']+label_id_offset,
                    detections['detection_scores'],
                    category_index,
                    use_normalized_coordinates=True,
                    max_boxes_to_draw=5,
                    min_score_thresh=.8,
                    agnostic_mode=False)

        cv2.imshow('object detection',  cv2.resize(image_np_with_detections, (800, 600)))

        blur_value = calculate_blur(frame)
        percentage = blur_percentage(blur_value, min_blur, max_blur)

        # new code 
        if(detections['detection_scores'][0]*100 > 70):
            detection_threshold = 0.7
            image = image_np_with_detections
            scores = list(filter(lambda x: x > detection_threshold, detections['detection_scores']))
            boxes = detections['detection_boxes'][:len(scores)]
            width = image.shape[1]
            height = image.shape[0]
            for idx, box in enumerate(boxes):
                roi = box*[height, width, height, width]
                region = image[int(roi[0]):int(roi[2]), int(roi[1]):int(roi[3])]
            cv2.imwrite('detected_image.jpg',region)
            cap.release()
            cv2.destroyAllWindows()
            break
        
        if cv2.waitKey(10) & 0xFF == ord('q'):
            cap.release()
            cv2.destroyAllWindows()
            break

    print('wait')
    time.sleep(2)
    pytesseract.pytesseract.tesseract_cmd='C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
    license = pytesseract.image_to_string(region, config='-c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ --psm 8 --oem 3')
    print('Text detected: {}'.format(license))
    return license

# convert date
def convert_to_hours(delta):
    total_seconds = delta.total_seconds()
    hours = str(int(total_seconds // 3600)).zfill(2)
    minutes = str(int((total_seconds % 3600) // 60)).zfill(2)
    seconds = str(int(total_seconds % 60)).zfill(2)
    return f"{hours}:{minutes}:{seconds}"

########################### Create Flask App ##################

from flask import Flask, jsonify,after_this_request,request
from flask_cors import CORS, cross_origin
import mysql.connector
import datetime

# Connect to DATABASE
mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  database="garage"
)

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/cars', methods = ['GET', 'POST'])
def getCars():
    @after_this_request
    def add_header(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response
    if request.method == 'GET':
        mycursor = mydb.cursor()
        mycursor.execute("SELECT * FROM cars ORDER BY in_time")
        myresult = mycursor.fetchall()
        mydb.commit()
        print('sayed get')
        return jsonify(myresult)
    
@app.route('/history', methods = ['GET', 'POST'])
def getHistory():
    @after_this_request
    def add_header(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response
    if request.method == 'GET':
        mycursor = mydb.cursor()
        mycursor.execute("SELECT * FROM carsData")
        myresult = mycursor.fetchall()
        mydb.commit()
        print('get history')
        return jsonify(myresult)


# Insert car from img
@app.route('/img', methods = ['POST'])
@cross_origin()
def imgFunc():
    @after_this_request
    def add_header(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response
    request_data = request.data.decode('UTF-8')
    request_data= eval(request_data)
    imgName = request_data['imgName']
    license = detect_from_image(imgName)

    # insert to table cars
    if(license):
        mycursor = mydb.cursor()
        in_time = datetime.datetime.now()
        in_time = in_time.strftime('%m-%d-%Y %H:%M:%S')
        sql = "INSERT INTO cars (license, in_time) VALUES (%s, %s)"
        val = (license, in_time)
        mycursor.execute(sql, val)
        mydb.commit()
        print(mycursor.rowcount, "record inserted.")
        return jsonify({'license': license})
    else:
        return jsonify({'message': "no"})

# # Insert car from cam
@app.route('/cam', methods = ['GET'])
@cross_origin()
def camFunc():
    @after_this_request
    def add_header(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response
    license = detect_from_webcam()
    print(license)
    mycursor = mydb.cursor()
    in_time = datetime.datetime.now()
    in_time = in_time.strftime('%m-%d-%Y %H:%M:%S')
    sql = "INSERT INTO cars (license, in_time) VALUES (%s, %s)"
    val = (license, in_time)
    mycursor.execute(sql, val)
    mydb.commit()
    print(mycursor.rowcount, "record inserted.")
    return jsonify({'license': license})


# checkout
@app.route('/checkout/<id>', methods = ['GET'])
@cross_origin()
def checkoutCar(id):
    @after_this_request
    def add_header(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response
    if(request.method == 'GET'):
        mycursor = mydb.cursor()
        mycursor.execute(f"SELECT * FROM cars WHERE id = {id}")
        myresult = mycursor.fetchall()
        mydb.commit()
        out_time = datetime.datetime.now()
        out_time = out_time.strftime('%m-%d-%Y %H:%M:%S')
        myresult.append(out_time)
        print(mycursor.rowcount, "record selected.")
        return jsonify(myresult)

# delete car
@app.route('/delete/<id>', methods = ['GET', 'POST'])
@cross_origin()
def deleteCar(id):
    @after_this_request
    def add_header(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response

    # request data
    request_data = request.data.decode('UTF-8')
    request_data= eval(request_data)
    license = request_data['license']
    in_time = request_data['in_time']
    in_time = datetime.datetime.strptime(in_time,'%m-%d-%Y %H:%M:%S')
    out_time = datetime.datetime.now()
    amount_of_time = convert_to_hours(out_time - in_time).split(":")
    price = float(amount_of_time[0])*0.5 + (float(amount_of_time[1])/60)*0.5
    out_time = out_time.strftime('%m-%d-%Y %H:%M:%S')
    in_time = in_time.strftime("%m-%d-%Y %H:%M:%S")
    # sql commands
    mycursor = mydb.cursor()
    mycursor.execute(f"DELETE FROM cars WHERE id = {id}")
    sql = (f"INSERT INTO carsData (license, in_time , out_time, price) VALUES (%s, %s, %s, %s)")
    val = (license, in_time, out_time, price)
    mycursor.execute(sql, val)
    mydb.commit()
    # print(mycursor.rowcount, "record(s) deleted")
    print('deleted and added to history')
    return jsonify({"message":'Car Deleted'})

# update
@app.route('/update/<id>', methods = ['GET', 'POST'])
@cross_origin()
def updateCar(id):
    @after_this_request
    def add_header(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response
    if(request.method == 'GET'):
        mycursor = mydb.cursor()
        mycursor.execute(f"SELECT * FROM cars WHERE id = {id}")
        myresult = mycursor.fetchall()
        mydb.commit()
        print(mycursor.rowcount, "record selected.")
        return jsonify(myresult)
    if(request.method == 'POST'):
        mycursor = mydb.cursor()
        request_data = request.data.decode('UTF-8')
        request_data= eval(request_data)
        license = request_data['licence']
        time = request_data['time']
        mycursor.execute(f"UPDATE cars set license = '{license}' , in_time = '{time}' WHERE id = {id}")
        mydb.commit()
        return jsonify({"messege": "car updated"})

if __name__ == "__main__":
    app.run()


# config='-c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ --psm 8 --oem 3'

# @app.route('/delete/<id>', methods = ['GET'])
# @cross_origin()
# def deleteCar(id):
#     @after_this_request
#     def add_header(response):
#         response.headers['Access-Control-Allow-Origin'] = '*'
#         return response
#     mycursor = mydb.cursor()
#     mycursor.execute(f"SELECT * FROM cars WHERE id = {id}")
#     myresult = mycursor.fetchall()
#     mycursor.execute(f"DELETE FROM cars WHERE id = {id}")
#     mydb.commit()
#     out_time = datetime.datetime.now()
#     out_time = out_time.strftime('%m-%d-%Y %H:%M:%S')
#     myresult.append(out_time)
#     print(mycursor.rowcount, "record deleted.")
#     print(myresult)
#     return jsonify(myresult)