import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json()

    // Forward the image data to the FastAPI backend
    const fastApiResponse = await fetch('http://127.0.0.1:8000/upload-image/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image }), // Send the image data in JSON format
    })

    if (!fastApiResponse.ok) {
      throw new Error('Error communicating with FastAPI backend')
    }

    const data = await fastApiResponse.json()

    // Return the result back to the frontend
    return NextResponse.json({ result: data.result })
  } catch (error) {
    console.error('Error in /api/recognize:', error)
    return NextResponse.json({ error: 'Error processing image' }, { status: 500 })
  }
}
