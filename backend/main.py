import os
import base64
import openai
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse

# Initialize FastAPI
app = FastAPI()

# Load the OpenAI API key from the environment or directly (be sure to set your API key)
openai.api_key = os.getenv("OPENAI_API_KEY", "your-openai-api-key-here")

# Function to encode image to Base64 format
def encode_image_to_base64(image_data):
    return base64.b64encode(image_data).decode('utf-8')

# GPT-4o interaction function
def send_image_to_gpt4o(base64_image):
    try:
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Is the object in this image recyclable? If so, classify it into what type of recyclable object it is, such as food waste, plastic, paper waste, etc. Be simple and explain it usefully for the average person if they want to know where/how to recycle it. BE VERY USE FRIENDLY, SIMPLE, AND KEEPT IT 1 SENTENCE MAX."},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            },
                        },
                    ],
                }
            ],
            max_tokens=300,
        )
        return response.choices[0].message.content
    except Exception as e:
        return str(e)

# FastAPI route to accept the image from the frontend
@app.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Read the uploaded file and convert to Base64
        image_data = await file.read()
        base64_image = encode_image_to_base64(image_data)

        # Send Base64 image to GPT-4o for processing
        gpt4o_response = send_image_to_gpt4o(base64_image)

        return JSONResponse(content={"result": gpt4o_response})

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


# --- Testing purposes only ---
# Use this function for testing if you want to load the image from a local file.
# Comment this out when using the file upload feature from the frontend.

@app.get("/test-local-image/")
def test_local_image():
    try:
        # Load the image from a local file (e.g., "test_image.jpg")
        with open("/Users/ameya/Documents/codingProjects/EcoSnap/backend/plasticBottle.jpeg", "rb") as image_file:
            image_data = image_file.read()

        base64_image = encode_image_to_base64(image_data)

        # Send the image to GPT-4o for processing
        gpt4o_response = send_image_to_gpt4o(base64_image)

        return JSONResponse(content={"result": gpt4o_response})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

