'use client'

import { useState, useRef } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Camera, Leaf, BarChart2, Book, User } from 'lucide-react'

export function EcoSnapComponent() {
  const [activeTab, setActiveTab] = useState("home")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [recognitionResult, setRecognitionResult] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // List of all 50 states
  const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ]
  const [selectedState, setSelectedState] = useState("California")

  // Recycling info mapping for each state
  const stateRecyclingInfo: Record<string, string> = {
    Alabama: "In Alabama, recycling programs vary by city. Typically, curbside recycling is available in larger cities. Check with your local waste management for accepted materials.",
    Alaska: "Alaska’s recycling services can be limited in rural areas, though urban centers often offer curbside or drop-off recycling. Verify with local authorities.",
    Arizona: "Arizona offers recycling services in major cities, with guidelines to separate paper, plastics, and metals. Some areas may require drop-off at recycling centers.",
    Arkansas: "Recycling in Arkansas varies by municipality. Ensure recyclables are clean and sorted according to local regulations.",
    California: "California is a leader in recycling initiatives with mandatory recycling programs. Residents are encouraged to separate waste and follow detailed local guidelines.",
    Colorado: "Colorado’s recycling guidelines encourage residents to sort recyclables and compost organic waste. Check local collection schedules for specifics.",
    Connecticut: "Connecticut offers curbside recycling in most communities with clear guidelines on sorting recyclables. Refer to local regulations for more details.",
    Delaware: "In Delaware, recycling services are provided by local governments. Rinse containers and separate recyclables as instructed by local programs.",
    Florida: "Florida provides robust recycling programs in urban areas. Guidelines include rinsing containers and separating glass, plastics, and metals.",
    Georgia: "Georgia’s recycling guidelines vary by county. Most programs require recyclables to be sorted and cleaned before pickup.",
    Hawaii: "Hawaii’s recycling efforts focus on reducing waste. Local guidelines require separation of recyclables and sometimes even compostable waste.",
    Idaho: "Idaho’s recycling programs are managed locally. Ensure recyclables are clean and check with local waste management for specific instructions.",
    Illinois: "Illinois offers comprehensive recycling services in major cities with guidelines for sorting plastics, paper, and metals. Local rules may vary.",
    Indiana: "Many communities in Indiana provide curbside recycling. Guidelines typically require cleaning recyclables and proper material separation.",
    Iowa: "Iowa offers recycling programs that vary by community. Follow local guidelines to ensure recyclables are sorted and cleaned properly.",
    Kansas: "Kansas recycling guidelines depend on your municipality. Generally, make sure recyclables are clean and follow any local drop-off instructions.",
    Kentucky: "Kentucky provides recycling services in urban and some rural areas. Guidelines include separating paper, plastics, and metals.",
    Louisiana: "In Louisiana, recycling programs are available in larger cities. Ensure items are rinsed and sorted according to local regulations.",
    Maine: "Maine offers recycling services that may include composting and paper recycling. Follow local guidelines for proper sorting.",
    Maryland: "Maryland’s recycling guidelines emphasize clean and sorted recyclables. Check with local authorities for pickup schedules and accepted materials.",
    Massachusetts: "Massachusetts has strong recycling programs with detailed guidelines. Residents are encouraged to reduce contamination by proper sorting.",
    Michigan: "Michigan offers recycling in many communities with specific guidelines for plastics, paper, and metals. Confirm details with your local recycling center.",
    Minnesota: "Minnesota’s well-established recycling programs recommend rinsing containers and sorting recyclables to reduce waste contamination.",
    Mississippi: "In Mississippi, recycling services may be limited. Urban areas often have curbside recycling, while rural areas may rely on drop-off centers.",
    Missouri: "Missouri’s recycling programs vary by region. Guidelines include cleaning recyclables and following local rules on material separation.",
    Montana: "Recycling options in Montana can be limited in rural areas, but urban centers typically offer drop-off recycling services.",
    Nebraska: "Nebraska recycling guidelines depend on your location. Ensure recyclables are clean and follow the local requirements for sorting.",
    Nevada: "Nevada offers recycling services, especially in larger cities. Guidelines include cleaning items and proper separation of recyclables.",
    "New Hampshire": "New Hampshire provides recycling programs with clear instructions on sorting recyclables and reducing waste contamination.",
    "New Jersey": "New Jersey offers robust recycling services in many communities. Residents should rinse containers and separate recyclables as instructed.",
    "New Mexico": "Recycling programs in New Mexico vary by municipality. Follow local guidelines to ensure proper cleaning and sorting of recyclables.",
    "New York": "New York has extensive recycling initiatives, especially in urban areas. Guidelines include strict sorting rules and measures to prevent contamination.",
    "North Carolina": "North Carolina’s recycling guidelines encourage residents to sort recyclables. Many areas offer curbside pickup with specific instructions.",
    "North Dakota": "North Dakota offers recycling in select communities. Residents should check with local waste management for guidelines on cleaning and sorting.",
    Ohio: "Ohio’s recycling guidelines vary by city. Most programs require rinsing containers and separating recyclables into designated categories.",
    Oklahoma: "In Oklahoma, recycling services are available in many urban areas. Follow local guidelines to ensure recyclables are properly cleaned and sorted.",
    Oregon: "Oregon is known for progressive recycling initiatives. Residents are encouraged to reduce waste by following detailed recycling guidelines.",
    Pennsylvania: "Pennsylvania offers recycling programs across many communities. Guidelines generally include sorting, cleaning, and proper disposal of recyclables.",
    "Rhode Island": "Rhode Island emphasizes waste reduction and proper sorting of recyclables. Check with local authorities for detailed recycling instructions.",
    "South Carolina": "In South Carolina, recycling programs vary by region. Guidelines typically require cleaning recyclables and proper material separation.",
    "South Dakota": "South Dakota offers recycling services in select areas. Residents should follow local guidelines for cleaning and sorting recyclables.",
    Tennessee: "Tennessee provides recycling services in urban areas with guidelines to rinse, clean, and separate recyclables effectively.",
    Texas: "Texas has diverse recycling programs. Guidelines vary by municipality, but generally include cleaning and sorting recyclables before pickup.",
    Utah: "Utah’s recycling initiatives emphasize sustainability. Follow local guidelines to ensure recyclables are separated and cleaned appropriately.",
    Vermont: "Vermont encourages recycling and composting. Residents should check local programs for detailed instructions on sorting and reducing waste.",
    Virginia: "Virginia offers recycling services in many communities. Guidelines include sorting, cleaning, and reducing contamination in recyclables.",
    Washington: "Washington has comprehensive recycling programs with clear guidelines. Residents are encouraged to separate recyclables and reduce waste.",
    "West Virginia": "Recycling services in West Virginia vary by locality. Residents should consult local guidelines for proper cleaning and material separation.",
    Wisconsin: "Wisconsin offers robust recycling initiatives, especially in urban areas. Guidelines include rinsing containers and sorting recyclables properly.",
    Wyoming: "In Wyoming, recycling programs may be more limited. Check with your local municipality for recycling guidelines and available services."
  }

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
        body: JSON.stringify({ image: imageDataUrl }),
      })

      if (!response.ok) {
        throw new Error('Failed to recognize image')
      }
      
      const data = await response.json()
      setRecognitionResult(data.result)
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
              <TabsTrigger value="home">
                <BarChart2 className="w-5 h-5 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="snap">
                <Camera className="w-5 h-5 mr-2" />
                Snap
              </TabsTrigger>
              <TabsTrigger value="guidelines">
                <Book className="w-5 h-5 mr-2" />
                Guidelines
              </TabsTrigger>
              <TabsTrigger value="profile">
                <User className="w-5 h-5 mr-2" />
                Profile
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
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

            {/* Snap Tab */}
            <TabsContent value="snap">
              <div className="space-y-4">
                {!capturedImage ? (
                  <>
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-center space-x-4">
                      <Button
                        onClick={startCamera}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Camera className="w-5 h-5 mr-2" />
                        Start Camera
                      </Button>
                      <Button
                        onClick={capturePhoto}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Capture Photo
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <img
                      src={capturedImage}
                      alt="Captured item"
                      className="w-full rounded-lg"
                    />
                    <p className="text-center text-lg font-semibold text-green-800">
                      {recognitionResult
                        ? `Recognition Result: ${recognitionResult}`
                        : 'Analyzing recyclability...'}
                    </p>
                    <Button
                      onClick={() => setCapturedImage(null)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Capture New Photo
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Guidelines Tab with State Dropdown */}
            <TabsContent value="guidelines">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-green-800">Recycling Guidelines</h3>
                <ul className="list-disc space-y-2 pl-4">
                  <li>Rinse containers to remove food residue.</li>
                  <li>Remove caps and lids from bottles.</li>
                  <li>Flatten cardboard boxes before placing in the bin.</li>
                  <li>Do not bag your recyclables; place them loose in the bin.</li>
                  <li>Avoid recycling items contaminated with food or grease.</li>
                </ul>
                <Card className="bg-green-50">
                  <CardHeader>
                    <CardTitle>Local Recycling Info</CardTitle>
                    <CardDescription>Select your state to view local guidelines.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-green-700">
                      {stateRecyclingInfo[selectedState]}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50">
                  <CardHeader>
                    <CardTitle>Additional Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc space-y-2 pl-4">
                      <li>
                        <a
                          href="https://www.epa.gov/recycle"
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          EPA Recycling Guidelines
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://earth911.com/"
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          Earth911
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://recyclenation.com/"
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          Recycle Nation
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Profile Tab */}
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