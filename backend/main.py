from pydantic import BaseModel
import base64
from fastapi import FastAPI
from fastapi.responses import JSONResponse
import openai
# Initialize FastAPI
app = FastAPI()
openai.api_key = "sk-NWvQ7hhuPPJTIKiqLjASJzVs9K_IeHs4ro96a4gZcQT3BlbkFJ_egnlLTpTOmdIEoiWsS6W506m3iRYjB3lSuGG_Rd8A"
# Function to send image to GPT-4o (already correct)
def send_image_to_gpt4o(base64_image):
    try:
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": """Is the object in this image recyclable? If so, classify it.
                          Also, don't mention asking for any text input or anything, you're an IMAGE RECOGNITION BOT ONLY. 
                         DO NOT mention the brand or any information even slightly irrelevant to the recyclability. 
                         Foucs mainly on being CONCISE AND TO THE POINT. 
                         Don't ask someone to check local guidelines or refer to any other source. 
                         Be the only info endpoint. 
                         MAIN THING KEEP IT CONCISE."""},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            },
                        },
                    ],
                }
            ],
            max_tokens=100,
        )
        return response.choices[0].message.content
    except Exception as e:
        return str(e)

# Pydantic model to receive the Base64-encoded image string
class ImageData(BaseModel):
    image: str

# FastAPI route to accept the Base64 image
@app.post("/upload-image/")
async def upload_image(image_data: ImageData):
    try:
        # Extract the actual Base64 string (without the prefix "data:image/jpeg;base64,")
        base64_image = image_data.image.split(",")[1] if "," in image_data.image else image_data.image
        
        # Decode the Base64 image (if needed elsewhere in byte format)
        image_data_bytes = base64.b64decode(base64_image)

        # Send the image to GPT-4o for processing
        gpt4o_response = send_image_to_gpt4o(base64_image)

        return JSONResponse(content={"result": gpt4o_response})
    
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

#                        IF AND ONLY IF the category is very uncommon or unusual like e-waste, give a concise yet useful description of how to recycle it. 

# import os
# import base64
# import openai
# from fastapi import FastAPI, File, UploadFile
# from fastapi.responses import JSONResponse

# # Initialize FastAPI
# app = FastAPI()

# # Load the OpenAI API key from the environment or directly (be sure to set your API key)
# openai.api_key = os.getenv("OPENAI_API_KEY", "your-openai-api-key-here")


# # Function to encode image to Base64 format
# def encode_image_to_base64(image_data):
#     return base64.b64encode(image_data).decode('utf-8')

# # GPT-4o interaction function
# def send_image_to_gpt4o(base64_image):
#     try:
#         response = openai.chat.completions.create(
#             model="gpt-4o-mini",
#             messages=[
#                 {
#                     "role": "user",
#                     "content": [
#                         {"type": "text", "text": "Is the object in this image recyclable? If so, classify it into what type of recyclable object it is, such as food waste, plastic, paper waste, etc. Be simple and explain it usefully for the average person if they want to know where/how to recycle it. BE VERY USE FRIENDLY, SIMPLE, AND KEEPT IT 1 SENTENCE MAX."},
#                         {
#                             "type": "image_url",
#                             "image_url": {
#                                 "url": f"data:image/jpeg;base64,{base64_image}"
#                             },
#                         },
#                     ],
#                 }
#             ],
#             max_tokens=300,
#         )
#         return response.choices[0].message.content
#     except Exception as e:
#         return str(e)

# # FastAPI route to accept the image from the frontend
# @app.post("/upload-image/")
# async def upload_image(image_data: ImageData):
#     try:
#         # Extract the Base64 image data (without the prefix)
#         base64_image = image_data.image.split(",")[1] if "," in image_data.image else image_data.image
#         image_data_bytes = base64.b64decode(base64_image)

#         # Send Base64 image to GPT-4o for processing
#         gpt4o_response = send_image_to_gpt4o(base64_image)

#         return JSONResponse(content={"result": gpt4o_response})

#     except Exception as e:
#         return JSONResponse(status_code=500, content={"error": str(e)})

# # --- Testing purposes only ---
# # Use this function for testing if you want to load the image from a local file.
# # Comment this out when using the file upload feature from the frontend.

# @app.get("/test-local-image/")
# def test_local_image():
#     try:
#         # Load the image from a local file (e.g., "test_image.jpg")
#         with open("/Users/ameya/Documents/codingProjects/EcoSnap/backend/plasticBottle.jpeg", "rb") as image_file:
#             image_data = image_file.read()

#         base64_image = encode_image_to_base64(image_data)

#         # Send the image to GPT-4o for processing
#         gpt4o_response = send_image_to_gpt4o(base64_image)

#         return JSONResponse(content={"result": gpt4o_response})
#     except Exception as e:
#         return JSONResponse(status_code=500, content={"error": str(e)})

