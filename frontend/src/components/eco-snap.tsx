'use client'

import { useState, useRef } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Leaf, BarChart2, Book, User } from 'lucide-react'

export function EcoSnapComponent() {
  const [activeTab, setActiveTab] = useState("home")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [recognitionResult, setRecognitionResult] = useState<string | null>(null) // Store backend result
  const videoRef = useRef<HTMLVideoElement>(null)

  // Function to start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing the camera", err)
    }
  }

  // Function to capture the photo
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0)
      const imageDataUrl = canvas.toDataURL('image/jpeg')
      setCapturedImage(imageDataUrl)

      // Send the captured image to the backend for recognition
      recognizeImage(imageDataUrl)
    }
  }

  // Function to send image data to the backend for analysis
  const recognizeImage = async (imageDataUrl: string) => {
    try {
      const response = await fetch('/api/recognize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageDataUrl,  // Send Base64 image
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to recognize image')
      }

      const data = await response.json()
      setRecognitionResult(data.result) // Set recognition result from backend
    } catch (error) {
      console.error('Error recognizing image:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-green-100 p-4 md:p-8">
      <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-green-600 rounded-lg flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-green-800">EcoSnap</CardTitle>
          </div>
          <CardDescription className="text-green-700">Snap, Check, Recycle!</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="home"><BarChart2 className="w-5 h-5 mr-2" />Dashboard</TabsTrigger>
              <TabsTrigger value="snap"><Camera className="w-5 h-5 mr-2" />Snap</TabsTrigger>
              <TabsTrigger value="guidelines"><Book className="w-5 h-5 mr-2" />Guidelines</TabsTrigger>
              <TabsTrigger value="profile"><User className="w-5 h-5 mr-2" />Profile</TabsTrigger>
            </TabsList>
            <TabsContent value="home">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-green-800">Your Recycling Dashboard</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-green-50">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Camera className="w-5 h-5 mr-2 text-green-600" />
                        Items Scanned
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-green-600">42</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Leaf className="w-5 h-5 mr-2 text-green-600" />
                        CO2 Savings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-green-600">15 kg</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart2 className="w-5 h-5 mr-2 text-green-600" />
                        EcoCoins
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-green-600">350</p>
                    </CardContent>
                  </Card>
                </div>
                <Card className="bg-green-50">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Leaf className="w-4 h-4 mr-2 text-green-600" />
                        <span>Plastic bottle recycled</span>
                      </li>
                      <li className="flex items-center">
                        <Leaf className="w-4 h-4 mr-2 text-green-600" />
                        <span>Glass jar recycled</span>
                      </li>
                      <li className="flex items-center">
                        <Leaf className="w-4 h-4 mr-2 text-green-600" />
                        <span>Cardboard box recycled</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="snap">
              <div className="space-y-4">
                {!capturedImage ? (
                  <>
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    </div>
                    <div className="flex justify-center space-x-4">
                      <Button onClick={startCamera} className="bg-green-600 hover:bg-green-700">
                        <Camera className="w-5 h-5 mr-2" />Start Camera
                      </Button>
                      <Button onClick={capturePhoto} className="bg-green-600 hover:bg-green-700">
                        Capture Photo
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <img src={capturedImage} alt="Captured item" className="w-full rounded-lg" />
                    <p className="text-center text-lg font-semibold text-green-800">
                      {recognitionResult ? `Recognition Result: ${recognitionResult}` : 'Analyzing recyclability...'}
                    </p>
                    <Button onClick={() => setCapturedImage(null)} className="w-full bg-green-600 hover:bg-green-700">
                      Capture New Photo
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="guidelines">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-green-800">Recycling Guidelines</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Leaf className="w-5 h-5 mr-2 text-green-600" />
                    <span>Rinse containers before recycling</span>
                  </li>
                  <li className="flex items-center">
                    <Leaf className="w-5 h-5 mr-2 text-green-600" />
                    <span>Remove caps and lids from bottles</span>
                  </li>
                  <li className="flex items-center">
                    <Leaf className="w-5 h-5 mr-2 text-green-600" />
                    <span>Flatten cardboard boxes</span>
                  </li>
                  <li className="flex items-center">
                    <Leaf className="w-5 h-5 mr-2 text-green-600" />
                    <span>Do not bag recyclables</span>
                  </li>
                  <li className="flex items-center">
                    <Leaf className="w-5 h-5 mr-2 text-green-600" />
                    <span>Check local guidelines for specific items</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="profile">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-green-800">Your Profile</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-green-200 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-green-600" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">John Doe</p>
                    <p className="text-sm text-green-600">Recycling Champion</p>
                  </div>
                </div>
                <Card className="bg-green-50">
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Leaf className="w-5 h-5 mr-2 text-green-600" />
                        <span>100 Items Recycled</span>
                      </li>
                      <li className="flex items-center">
                        <Leaf className="w-5 h-5 mr-2 text-green-600" />
                        <span>50 kg CO2 Saved</span>
                      </li>
                      <li className="flex items-center">
                        <Leaf className="w-5 h-5 mr-2 text-green-600" />
                        <span>Eco Warrior Badge</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <p className="text-center text-green-700">Keep up the great work in your recycling journey!</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}



// 'use client'

// import { useState, useRef } from 'react'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Camera, Leaf, BarChart2, Book, User } from 'lucide-react'

// export function EcoSnapComponent() {
//   const [activeTab, setActiveTab] = useState("home")
//   const [capturedImage, setCapturedImage] = useState<string | null>(null)
//   const videoRef = useRef<HTMLVideoElement>(null)

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true })
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream
//       }
//     } catch (err) {
//       console.error("Error accessing the camera", err)
//     }
//   }

//   const capturePhoto = () => {
//     if (videoRef.current) {
//       const canvas = document.createElement('canvas')
//       canvas.width = videoRef.current.videoWidth
//       canvas.height = videoRef.current.videoHeight
//       canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0)
//       const imageDataUrl = canvas.toDataURL('image/jpeg')
//       setCapturedImage(imageDataUrl)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-400 to-green-100 p-4 md:p-8">
//       <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm">
//         <CardHeader className="flex flex-row items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <div className="relative w-10 h-10">
//               <div className="absolute inset-0 bg-green-600 rounded-lg flex items-center justify-center">
//                 <Camera className="w-6 h-6 text-white" />
//               </div>
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <Leaf className="w-4 h-4 text-white" />
//               </div>
//             </div>
//             <CardTitle className="text-2xl font-bold text-green-800">EcoSnap</CardTitle>
//           </div>
//           <CardDescription className="text-green-700">Snap, Check, Recycle!</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {/* <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full"> */}
//           <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} className="w-full">
//             <TabsList className="grid w-full grid-cols-4 mb-4">
//               <TabsTrigger value="home"><BarChart2 className="w-5 h-5 mr-2" />Dashboard</TabsTrigger>
//               <TabsTrigger value="snap"><Camera className="w-5 h-5 mr-2" />Snap</TabsTrigger>
//               <TabsTrigger value="guidelines"><Book className="w-5 h-5 mr-2" />Guidelines</TabsTrigger>
//               <TabsTrigger value="profile"><User className="w-5 h-5 mr-2" />Profile</TabsTrigger>
//             </TabsList>
//             <TabsContent value="home">
//               <div className="space-y-4">
//                 <h3 className="text-xl font-semibold text-green-800">Your Recycling Dashboard</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <Card className="bg-green-50">
//                     <CardHeader>
//                       <CardTitle className="flex items-center">
//                         <Camera className="w-5 h-5 mr-2 text-green-600" />
//                         Items Scanned
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="text-3xl font-bold text-green-600">42</p>
//                     </CardContent>
//                   </Card>
//                   <Card className="bg-green-50">
//                     <CardHeader>
//                       <CardTitle className="flex items-center">
//                         <Leaf className="w-5 h-5 mr-2 text-green-600" />
//                         CO2 Savings
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="text-3xl font-bold text-green-600">15 kg</p>
//                     </CardContent>
//                   </Card>
//                   <Card className="bg-green-50">
//                     <CardHeader>
//                       <CardTitle className="flex items-center">
//                         <BarChart2 className="w-5 h-5 mr-2 text-green-600" />
//                         Eco Points
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="text-3xl font-bold text-green-600">350</p>
//                     </CardContent>
//                   </Card>
//                 </div>
//                 <Card className="bg-green-50">
//                   <CardHeader>
//                     <CardTitle>Recent Activity</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <ul className="space-y-2">
//                       <li className="flex items-center">
//                         <Leaf className="w-4 h-4 mr-2 text-green-600" />
//                         <span>Plastic bottle recycled</span>
//                       </li>
//                       <li className="flex items-center">
//                         <Leaf className="w-4 h-4 mr-2 text-green-600" />
//                         <span>Glass jar recycled</span>
//                       </li>
//                       <li className="flex items-center">
//                         <Leaf className="w-4 h-4 mr-2 text-green-600" />
//                         <span>Cardboard box recycled</span>
//                       </li>
//                     </ul>
//                   </CardContent>
//                 </Card>
//               </div>
//             </TabsContent>
//             <TabsContent value="snap">
//               <div className="space-y-4">
//                 {!capturedImage ? (
//                   <>
//                     <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
//                       <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
//                     </div>
//                     <div className="flex justify-center space-x-4">
//                       <Button onClick={startCamera} className="bg-green-600 hover:bg-green-700">
//                         <Camera className="w-5 h-5 mr-2" />Start Camera
//                       </Button>
//                       <Button onClick={capturePhoto} className="bg-green-600 hover:bg-green-700">
//                         Capture Photo
//                       </Button>
//                     </div>
//                   </>
//                 ) : (
//                   <div className="space-y-4">
//                     <img src={capturedImage} alt="Captured item" className="w-full rounded-lg" />
//                     <p className="text-center text-lg font-semibold text-green-800">
//                       Analyzing recyclability...
//                     </p>
//                     <Button onClick={() => setCapturedImage(null)} className="w-full bg-green-600 hover:bg-green-700">
//                       Capture New Photo
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </TabsContent>
//             <TabsContent value="guidelines">
//               <div className="space-y-4">
//                 <h3 className="text-xl font-semibold text-green-800">Recycling Guidelines</h3>
//                 <ul className="space-y-2">
//                   <li className="flex items-center">
//                     <Leaf className="w-5 h-5 mr-2 text-green-600" />
//                     <span>Rinse containers before recycling</span>
//                   </li>
//                   <li className="flex items-center">
//                     <Leaf className="w-5 h-5 mr-2 text-green-600" />
//                     <span>Remove caps and lids from bottles</span>
//                   </li>
//                   <li className="flex items-center">
//                     <Leaf className="w-5 h-5 mr-2 text-green-600" />
//                     <span>Flatten cardboard boxes</span>
//                   </li>
//                   <li className="flex items-center">
//                     <Leaf className="w-5 h-5 mr-2 text-green-600" />
//                     <span>Don't bag recyclables</span>
//                   </li>
//                   <li className="flex items-center">
//                     <Leaf className="w-5 h-5 mr-2 text-green-600" />
//                     <span>Check local guidelines for specific items</span>
//                   </li>
//                 </ul>
//               </div>
//             </TabsContent>
//             <TabsContent value="profile">
//               <div className="space-y-4">
//                 <h3 className="text-xl font-semibold text-green-800">Your Profile</h3>
//                 <div className="flex items-center space-x-4">
//                   <div className="w-20 h-20 bg-green-200 rounded-full flex items-center justify-center">
//                     <User className="w-10 h-10 text-green-600" />
//                   </div>
//                   <div>
//                     <p className="text-lg font-semibold">John Doe</p>
//                     <p className="text-sm text-green-600">Recycling Champion</p>
//                   </div>
//                 </div>
//                 <Card className="bg-green-50">
//                   <CardHeader>
//                     <CardTitle>Achievements</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <ul className="space-y-2">
//                       <li className="flex items-center">
//                         <Leaf className="w-5 h-5 mr-2 text-green-600" />
//                         <span>100 Items Recycled</span>
//                       </li>
//                       <li className="flex items-center">
//                         <Leaf className="w-5 h-5 mr-2 text-green-600" />
//                         <span>50 kg CO2 Saved</span>
//                       </li>
//                       <li className="flex items-center">
//                         <Leaf className="w-5 h-5 mr-2 text-green-600" />
//                         <span>Eco Warrior Badge</span>
//                       </li>
//                     </ul>
//                   </CardContent>
//                 </Card>
//                 <p className="text-center text-green-700">Keep up the great work in your recycling journey!</p>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }